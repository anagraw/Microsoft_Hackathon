from flask import Flask, request, jsonify, render_template, send_from_directory , url_for
from werkzeug.utils import secure_filename
import os
import torch
import torch.nn as nn
from PIL import Image
from torchvision import transforms
from flask_cors import CORS
import numpy as np
from keras._tf_keras.keras.models import load_model
from keras._tf_keras.keras.preprocessing.image import img_to_array, load_img
from sklearn.preprocessing import LabelEncoder
import pandas as pd
from io import BytesIO
from sklearn.model_selection import GridSearchCV
from sklearn.neighbors import KNeighborsClassifier
import joblib
import firebase_admin
from firebase_admin import credentials, firestore, auth

service_account_path = '/Users/masterpixel/Documents/Microsoft_Hackathon-main/server/serviceacc_key.json'

try:
    # Iterate through all users
    users = auth.list_users().iterate_all()
    latest_user = None

    for user in users:
        if not latest_user or user.user_metadata.last_sign_in_timestamp > latest_user.user_metadata.last_sign_in_timestamp:
            latest_user = user

    if latest_user:
        lat_u= latest_user.uid
        print('Most recently signed-in user UID:', latest_user.uid)
    else:
        lat_u=""
        print('No users found.')
except Exception as e:
    print('Error getting users:', e)

# Initialize Firebase Admin with the service account
cred = credentials.Certificate(service_account_path)
firebase_admin.initialize_app(cred, {
    'projectId': 'ms-hack-e0b6b',
})

db = firestore.client()

# Initialize the Flask application
app = Flask(__name__)
cors = CORS(app, origins=['http://localhost:5173'])

####XRAY####

@app.route('/api/xray', methods=['POST'])
def xray_scan():
    UPLOAD_FOLDER = 'uploads'
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

    # Load the trained model
    model = nn.Sequential(
        nn.Conv2d(1, 16, kernel_size=3, stride=1, padding=1),
        nn.ReLU(),
        nn.MaxPool2d(kernel_size=2, stride=2),
        nn.Conv2d(16, 32, kernel_size=3, stride=1, padding=1),
        nn.ReLU(),
        nn.MaxPool2d(kernel_size=2, stride=2), 
        nn.Flatten(),
        nn.Linear(32 * 56 * 56, 512),
        nn.ReLU(),
        nn.Linear(512, 17)
    )
    model.load_state_dict(torch.load('model_xr.pth'))
    model.eval()

    # Define the image transformation
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.5], std=[0.5])
    ])

    # Class mapping
    class_to_int = {'abscess': 0, 'ards': 1, 'atelectasis': 2, 'atherosclerosis of the aorta': 3,
                'cardiomegaly': 4, 'emphysema': 5, 'fracture': 6, 'hydropneumothorax': 7,
                'hydrothorax': 8, 'pneumonia': 9, 'pneumosclerosis': 10,
                'post-inflammatory changes': 11, 'post-traumatic ribs deformation': 12, 'sarcoidosis': 13,
                'scoliosis': 14, 'tuberculosis': 15, 'venous congestion': 16}
    int_to_class = {v: k for k, v in class_to_int.items()}

    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})
    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        image = Image.open(filepath).convert('L')
        image = transform(image)
        image = image.unsqueeze(0)  # Add batch dimension
        
        with torch.no_grad():
            outputs = model(image)
            _, predicted = torch.max(outputs.data, 1)
            predicted_class = int_to_class[predicted.item()]
        
        try:
            doc_ref = db.collection(lat_u).document('X-Ray')
            doc_ref.set({'X-Ray': predicted_class})
            print('Firestore test document created successfully.')
        except Exception as e:
            print(f'Error creating Firestore test document: {e}')
        
        return jsonify({'predicted_class': predicted_class})


####PRESCRIPTION####

@app.route('/api/scan', methods=['POST'])
def pres_scan():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    try:
    # Iterate through all users
        users = auth.list_users().iterate_all()
        latest_user = None

        for user in users:
            if not latest_user or user.user_metadata.last_sign_in_timestamp > latest_user.user_metadata.last_sign_in_timestamp:
                latest_user = user

        if latest_user:
            lat_u= latest_user.uid
            print('Most recently signed-in user UID:', latest_user.uid)
        else:
            lat_u=""
            print('No users found.')
    except Exception as e:
        print('Error getting users:', e)

    if file:
        image = Image.open(BytesIO(file.read()))
        predicted_class_name = predict_image(image)
        try:
            doc_ref = db.collection(lat_u).document('Prescription')
            doc_ref.set({'Prescription': predicted_class_name})
            print('Firestore test document created successfully.')
        except Exception as e:
            print(f'Error creating Firestore test document: {e}')
        return jsonify({'predicted_class': predicted_class_name})
def predict_image(image):
    # Load the trained model
    model = load_model('prescription_model.h5')

    # Load the label encoder
    test_label_file = "testing_labels.csv"
    test_labels_df = pd.read_csv(test_label_file)
    test_labels = test_labels_df['MEDICINE_NAME']
    label_encoder = LabelEncoder()
    label_encoder.fit(test_labels)
    # label_encoder.fit(test_labels)
    image = image.convert('RGB')
    # Resize and preprocess the image
    img = image.resize((64, 64))
    img = img_to_array(img)
    img = np.array(img, dtype="float") / 255.0  
    img = np.expand_dims(img, axis=0)

    # Predict the class probabilities
    predictions = model.predict(img)

    # Get the predicted class
    predicted_class = np.argmax(predictions, axis=1)[0]

    # Decode the predicted class
    predicted_class_name = label_encoder.inverse_transform([predicted_class])[0]

    return predicted_class_name


####DISEASE DETECTION####
#'DDetect/Testing.csv
train_data = pd.read_csv('Testing.csv')
feature_names = train_data.columns.drop(['prognosis']).tolist()

@app.route('/api/features')
def features():
    # Replace with your actual feature names
    return jsonify(feature_names)

@app.route('/api/predict', methods=['POST'])
def predict():
    #Load the model
    model = joblib.load('knn_model.pkl')

    # Load the feature names from the training data, excluding the 'prognosis' and 'Unnamed: 133' columns
    data = request.get_json()
    symptoms = data.get('symptoms', [])
    
    # Initialize input features to zero with the correct length (132 features)
    input_features = np.zeros(len(feature_names))
    
    # Set the input features based on symptoms
    for symptom in symptoms:
        if symptom in feature_names:
            input_features[feature_names.index(symptom)] = 1
    
    # Ensure input_features is reshaped correctly
    input_features = input_features.reshape(1, -1)
    
    # Debugging: Print the shape of the input_features to ensure it's correct
    print(f"Input features shape: {input_features.shape}")
    # Predict the disease
    prediction = model.predict(input_features)


    try:
    # Iterate through all users
        users = auth.list_users().iterate_all()
        latest_user = None

        for user in users:
            if not latest_user or user.user_metadata.last_sign_in_timestamp > latest_user.user_metadata.last_sign_in_timestamp:
                latest_user = user

        if latest_user:
            lat_u= latest_user.uid
            print('Most recently signed-in user UID:', latest_user.uid)
        else:
            lat_u=""
            print('No users found.')
    except Exception as e:
        print('Error getting users:', e)

    #trying out the firebase db
    try:
        doc_ref = db.collection(lat_u).document('Disease')
        doc_ref.set({'Disease Detected': prediction[0]})
        print('Firestore test document created successfully.')
    except Exception as e:
        print(f'Error creating Firestore test document: {e}')
    
    
    
    var1 = 0;
    # Return the prediction result as JSON
    return jsonify({'prediction': prediction[0]})

    


if __name__ == '__main__':
    app.run(debug=True)