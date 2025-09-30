# server2/predict_app.py

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from pyngrok import ngrok
from ml_model import load_nse_data, get_stock_info, fetch_data, train_and_predict
from config import NGROK_AUTH_TOKEN, NGROK_STATIC_DOMAIN_PREDICT

app = Flask(__name__)
CORS(app)

print("🚀 SERVER 2 (Prediction): Initializing...")
load_nse_data()
# --- API Endpoint ---
@app.route('/api/predict', methods=['POST'])
def predict_stock():
    data = request.get_json()
    if not data or 'company' not in data:
        return jsonify({"error": "Company name not provided"}), 400
    
    company_name = data['company']
    print(f"\n🚀 Received prediction request for: {company_name}")
    
    try:
        stock_info, symbol = get_stock_info(company_name)
        df = fetch_data(symbol)
        current_price, predicted_price, accuracy, plots = train_and_predict(df)
        
        response_data = {
            "stock_info": stock_info,
            "current_price": current_price,
            "predicted_price": predicted_price,
            "accuracy": accuracy,
            "plots": plots
        }
        
        print(f"✅ Prediction successful for {company_name}")
        return jsonify(response_data)
        
    except Exception as e:
        print(f"❌ Error during prediction: {e}")
        return jsonify({"error": str(e)}), 500

# --- Server Startup ---
if __name__ == '__main__':
    if NGROK_AUTH_TOKEN and NGROK_STATIC_DOMAIN_PREDICT:
        ngrok.set_auth_token(NGROK_AUTH_TOKEN)
        public_url = ngrok.connect(5001, domain=NGROK_STATIC_DOMAIN_PREDICT) 
        
        print("======================================================")
        print("✅ SERVER 2 (Prediction) is live!")
        print(f"🔗 Predict URL: {public_url}")
        print("======================================================")
    else:
        print("⚠️ WARNING: NGROK Auth Token or Domain for Prediction Server not set.")
    app.run(host='0.0.0.0', port=5001)