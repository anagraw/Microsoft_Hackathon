from flask import Flask, request, render_template
import numpy as np
import pandas as pd
from model import load_model

app = Flask(__name__)

# Load the trained model
model = load_model('knn_model.pkl')

# Load the feature names from the training data, excluding the 'prognosis' and 'Unnamed: 133' columns
train_data = pd.read_csv('DDetect/Training.csv')
feature_names = train_data.columns.drop(['prognosis', 'Unnamed: 133']).tolist()

# Route for the home page
@app.route('/')
def home():
    return render_template('DD_index.html', symptoms=feature_names)

# Route for predicting the disease
@app.route('/predict', methods=['POST'])
def predict():
    # Get the input symptoms from the form
    symptoms = [x.strip() for x in request.form.values()]
    
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
    
    # Render the prediction result on the web page
    return render_template('DD_index.html', symptoms=feature_names, prediction_text='Predicted Disease: {}'.format(prediction[0]))

if __name__ == "__main__":
    app.run(debug=True)
