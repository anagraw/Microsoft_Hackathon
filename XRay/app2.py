from flask import Flask, request, jsonify, render_template
from werkzeug.utils import secure_filename
import os
import torch
import torch.nn as nn
from PIL import Image
from torchvision import transforms

# Initialize the Flask application
app = Flask(__name__)

# Define a path for saving uploaded files
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
model.load_state_dict(torch.load('model.pth'))
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

# Route for handling the upload and prediction
@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        # Check if the post request has the file part
        if 'file' not in request.files:
            return 'No file part'
        file = request.files['file']
        if file.filename == '':
            return 'No selected file'
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
            
            return jsonify({'predicted_class': predicted_class})
    
    return '''
    <!doctype html>
    <title>Upload an X-ray Image</title>
    <h1>Upload an X-ray Image for Disease Prediction</h1>
    <form method=post enctype=multipart/form-data>
      <input type=file name=file>
      <input type=submit value=Upload>
    </form>
    '''

if __name__ == '__main__':
    app.run(debug=True)
