# server1/auth_app.py (Corrected)

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from pyngrok import ngrok
from pymongo import MongoClient
from passlib.context import CryptContext
from datetime import datetime
from config import NGROK_AUTH_TOKEN, NGROK_STATIC_DOMAIN_AUTH, MONGO_URI, DB_NAME

app = Flask(__name__)
CORS(app)

# --- Password Hashing ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- Database Setup ---
try:
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    users_collection = db.users
    print("✅ SERVER 1 (Auth): MongoDB connected successfully.")
except Exception as e:
    print(f"❌ SERVER 1 (Auth): Could not connect to MongoDB: {e}")
    exit()

# --- Authentication Routes ---
@app.route('/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    if users_collection.find_one({"username": username}):
        return jsonify({"error": "Username already exists"}), 409
    
    hashed_password = pwd_context.hash(password)
    
    new_user_document = {
        "username": username,
        "password": hashed_password,
        "terms_accepted": False,
        "signup_date": datetime.utcnow()
    }
    users_collection.insert_one(new_user_document)
    
    return jsonify({"message": "Account created successfully!"}), 201

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    user = users_collection.find_one({"username": username})
    
    if user and pwd_context.verify(password, user['password']):
        return jsonify({
            "message": "Login successful!",
            "terms_accepted": user.get("terms_accepted", False)
        }), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401

@app.route('/auth/accept_terms', methods=['POST', 'OPTIONS'])
def accept_terms():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200
        
    data = request.get_json()
    username = data.get('username')

    if not username:
        return jsonify({"error": "Username is required"}), 400

    result = users_collection.update_one(
        {"username": username},
        {"$set": {"terms_accepted": True}}
    )

    if result.matched_count:
        return jsonify({"message": "Terms accepted successfully"}), 200
    else:
        return jsonify({"error": "User not found"}), 404
# --- Server Startup ---
if __name__ == '__main__':
    if NGROK_AUTH_TOKEN and NGROK_STATIC_DOMAIN_AUTH:
        ngrok.set_auth_token(NGROK_AUTH_TOKEN)
        public_url = ngrok.connect(5000, domain=NGROK_STATIC_DOMAIN_AUTH)
        print("======================================================")
        print("✅ SERVER 1 (Auth) is live!")
        print(f"🔗 Auth URL: {public_url}")
        print("======================================================")
    else:
        print("⚠️ WARNING: NGROK Auth Token or Domain not set.")
    app.run(host='0.0.0.0', port=5000)

