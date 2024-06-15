import firebase_admin
from firebase_admin import credentials, firestore

# Path to your service account key file
service_account_path = '/Users/masterpixel/Documents/Microsoft_Hackathon-main/server/serviceacc_key.json'

# Initialize Firebase Admin with the service account
cred = credentials.Certificate(service_account_path)
firebase_admin.initialize_app(cred, {
    'projectId': 'ms-hack-e0b6b',
})

db = firestore.client()

try:
    doc_ref = db.collection('test3').document('test_doc')
    doc_ref.set({'test_field': 'test_value'})
    print('Firestore test document created successfully.')
except Exception as e:
    print(f'Error creating Firestore test document: {e}')
