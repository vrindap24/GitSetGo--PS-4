import firebase_admin
from firebase_admin import credentials, firestore
import traceback

def diagnostic():
    path = "./firebase-credentials.json"
    print(f"Attempting to load: {path}")
    try:
        cred = credentials.Certificate(path)
        firebase_admin.initialize_app(cred)
        _db = firestore.client()
        print("Successfully initialized Firebase!")
    except Exception as e:
        print("\n--- ERROR ---")
        print(e)
        print("\n--- TRACEBACK ---")
        traceback.print_exc()

if __name__ == "__main__":
    diagnostic()
