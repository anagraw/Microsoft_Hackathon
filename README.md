# Microsoft_Hackathon
Healthcare Diagnosis Chatbot

## <ins>Problem Statement</ins> <br />

Build a chatbot capable of diagnosing common medical conditions based on user symptoms input. Utilize machine learning models trained on medical data to provide accurate suggestions and recommendations for further action.

## <ins>About the Web-app and its Features</ins> <br />
Our Healthcare Diagnosis Chatbot has 3 main features:

### Disease Diagnosis
Select up to 5 symptoms from a list of 43 using our drag-and-drop interface. Our KNN model predicts potential diseases based on your inputs. 
Note: This prediction is based on user-provided data and should not replace professional medical advice. Always consult a healthcare provider for an accurate diagnosis.

### Chest X-Ray Scan 
Based on the chest X-Ray uploaded by the user, one of the 14 diseases 
(abscess,
yards,
atelectasis,
atherosclerosis of the aorta,
cardiomegaly,
emphysema,
fracture, 
hydropneumothorax,
hydrothorax,
pneumonia,
pneumosclerosis,
post-inflammatory changes,
post-traumatic ribs deformation,
sarcoidosis,
scoliosis,
tuberculosis,
venous congestion) 
is predicted. This is achieved using a 3-layer CNN Architecture. 
Note: This prediction is based on user-provided data and should not replace professional medical advice. Always consult a healthcare provider for an accurate diagnosis.

### Prescription Scan 
Lastly, we also provide a handwriting-to-text option for the user, where the user enters the picture of a hand-written image containing medicine names
and generates a text corresponding to the handwritten image. Enabling better legibility. 


## <ins>Built Using</ins> <br />

* [![React][React.js]][React-url]
* [![Bootstrap][Bootstrap.com]][Bootstrap-url]
* [![tailwind][tailwind.cs]][React-url]
* [![firebase][firebase.db]][firebase-url]
* [![Flask][Flask.c]][Flask-url]
* [![Python][Python.p]][Python-url]




[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[tailwind.cs]: https://img.shields.io/badge/tailwindcss-0F172A?&logo=tailwindcss
[tailwind-url]: https://tailwindcss.com/
[firebase.db]: https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black
[firebase-url]: https://firebase.google.com/
[Flask.c]: https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white
[Flask-url]: https://flask.palletsprojects.com/en/3.0.x/
[Python.p]: https://img.shields.io/badge/Python-14354C?style=for-the-badge&logo=python&logoColor=white
[Python-url]: https://www.python.org/

<!-- GETTING STARTED -->
## <ins>Getting Started</ins> <br />

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites
It is expected to have: 
1. The latest Python Version (Python 3.12 used by us)
2. Internet Connection 
### Installation
Below are the installation steps 

1. Clone the repo
   ```sh
   git clone https://github.com/anagraw/Microsoft_Hackathon.git
   ```

#### Client Directory
2. Redirect to the client directory
   ```sh
   cd .\client\
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
#### Server Directory 
4. Redirect to the server directory
   ```sh
   cd .\server\
   ```
5. Install the package/library requirements
   ```sh
   pip install -r requirements.txt
   ```



### Running 

Below are the steps to run the web-app
Both the client and server should be running parallelly 
#### Client Directory
  ```sh
   npm run dev
   ```
#### Server Directory 

 ```sh
   python main.py
   ```

#### Model Input Files Required for Running
Examples of files that can be used as input for testing Chest X-ray scans and Prescription scan are available in the test folder 

## <ins>Video Demo of the Web-App</ins> <br /> 
[![Video Thumbnail](https://img.youtube.com/vi/jLJHFSrbpQ4/0.jpg)](https://youtu.be/jLJHFSrbpQ4)

