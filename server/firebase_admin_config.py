# firebase_admin_config.py
import firebase_admin
from firebase_admin import credentials, firestore

# Use a service account
cred = credentials.Certificate('/Users/masterpixel/Documents/Microsoft_Hackathon-main/server/serviceacc_key.json')
firebase_admin.initialize_app(cred, {
    'projectId': 'ms-hack-e0b6b',
})
db = firestore.client()
