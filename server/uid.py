import firebase_admin
from firebase_admin import credentials, auth

# Initialize the Firebase Admin SDK
cred = credentials.Certificate('/Users/masterpixel/Documents/Microsoft_Hackathon-main/server/serviceacc_key.json')
firebase_admin.initialize_app(cred, {
    'projectId': 'ms-hack-e0b6b',
})
# Get the most recently signed-in user
def get_latest_signed_in_user():
    try:
        # Iterate through all users
        users = auth.list_users().iterate_all()
        latest_user = None

        for user in users:
            if not latest_user or user.user_metadata.last_sign_in_timestamp > latest_user.user_metadata.last_sign_in_timestamp:
                latest_user = user

        if latest_user:
            print('Most recently signed-in user UID:', latest_user.uid)
        else:
            print('No users found.')
    except Exception as e:
        print('Error getting users:', e)

if __name__ == '__main__':
    get_latest_signed_in_user()
