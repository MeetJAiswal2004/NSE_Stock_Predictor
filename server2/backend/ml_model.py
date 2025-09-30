# server2/backend/ml_model.py (Corrected version with all imports)

import yfinance as yf
import pandas as pd
import numpy as np
import difflib
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_absolute_error
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM, Dropout
from datetime import datetime, timedelta
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import io
import base64

COMPANY_DICT = None

def load_nse_data():
    global COMPANY_DICT
    if COMPANY_DICT is not None:
        return
    try:
        print("--> Attempting to download fresh NSE company list from the internet...")
        url = "https://archives.nseindia.com/content/equities/EQUITY_L.csv"
        storage_options = {'User-Agent': 'Mozilla/5.0'}
        df = pd.read_csv(url, storage_options=storage_options)
        print("--> Fresh list downloaded successfully.")
    except Exception as e:
        print(f"⚠️ Internet download failed. This is expected on Colab. Using local backup file.")
        try:
            df = pd.read_csv("EQUITY_L.csv") 
            print("--> Local backup list loaded successfully.")
        except FileNotFoundError:
            print("❌ CRITICAL ERROR: Local backup file 'EQUITY_L.csv' not found! Please upload it.")
            COMPANY_DICT = {}
            return
            
    df["NAME OF COMPANY"] = df["NAME OF COMPANY"].str.strip().str.upper()
    df["SYMBOL"] = df["SYMBOL"].str.strip().str.upper()
    COMPANY_DICT = dict(zip(df["NAME OF COMPANY"], df["SYMBOL"]))
    print("--> Caching complete.")

def get_stock_info(stock_name):
    stock_name = stock_name.strip().upper()
    if not COMPANY_DICT:
        raise Exception("Company list is not available.")
    matches = difflib.get_close_matches(stock_name, COMPANY_DICT.keys(), n=1, cutoff=0.4)
    if not matches:
        raise Exception("Company not found in NSE stock list")
    matched_name = matches[0]
    symbol = COMPANY_DICT[matched_name] + ".NS"
    stock = yf.Ticker(symbol)
    hist = stock.history(period="1d")
    latest_price = hist["Close"].iloc[-1] if not hist.empty else None
    stock_info = { "name": matched_name.title(), "symbol": symbol, "sector": stock.info.get("sector", "N/A"), "website": stock.info.get("website", "N/A"), "latest_price": float(latest_price) if latest_price else None, "previous_close": stock.info.get("previousClose"), "day_high": stock.info.get("dayHigh"), "day_low": stock.info.get("dayLow"), "fifty_two_week_high": stock.info.get("fiftyTwoWeekHigh"), "fifty_two_week_low": stock.info.get("fiftyTwoWeekLow"), }
    return stock_info, symbol

def fetch_data(symbol):
    print(f"--> Fetching 3 years of data for {symbol}...")
    start_date = (datetime.today() - timedelta(days=3 * 365)).strftime('%Y-%m-%d')
    df = yf.download(symbol, start=start_date, progress=False)[['Close', 'Volume']]
    print(f"--> Data fetched. Calculating features...")
    df['SMA'] = df['Close'].rolling(window=14).mean()
    df['EMA'] = df['Close'].ewm(span=14, adjust=False).mean()
    df['RSI'] = compute_rsi(df['Close'], 14)
    exp12 = df['Close'].ewm(span=12, adjust=False).mean()
    exp26 = df['Close'].ewm(span=26, adjust=False).mean()
    macd = exp12 - exp26
    signal = macd.ewm(span=9, adjust=False).mean()
    df['MACD'] = macd - signal
    obv = (np.sign(df['Close'].diff()) * df['Volume']).fillna(0).cumsum()
    df['OBV'] = obv
    df['BB_Width'] = df['Close'].rolling(window=20).std() * 4 / df['Close'].rolling(window=20).mean()
    df.dropna(inplace=True)
    print("--> Feature calculation complete.")
    return df

def compute_rsi(series, period=14):
    delta = series.diff()
    gain = delta.where(delta > 0, 0)
    loss = -delta.where(delta < 0, 0)
    avg_gain = gain.rolling(window=period).mean()
    avg_loss = loss.rolling(window=period).mean()
    rs = avg_gain / avg_loss
    return 100 - (100 / (1 + rs))

def train_and_predict(df):
    if len(df) < 120:
        raise Exception("Not enough data for a reliable prediction.")
    features = ['Close', 'Volume', 'SMA', 'EMA', 'RSI', 'MACD', 'OBV', 'BB_Width']
    data = df[features].values
    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(data)
    X, y = [], []
    for i in range(60, len(scaled_data)):
        X.append(scaled_data[i - 60:i])
        y.append(scaled_data[i][0])
    X, y = np.array(X), np.array(y)
    split = int(0.85 * len(X))
    X_train, X_test, y_train, y_test = X[:split], X[split:], y[:split], y[split:]
    X_test_start_index = 60 + split

    model = Sequential([ LSTM(128, return_sequences=True, input_shape=(X.shape[1], X.shape[2])), Dropout(0.2), LSTM(128), Dropout(0.2), Dense(1) ])
    model.compile(optimizer='adam', loss='mean_squared_error')
    
    print("--> Starting model training on GPU...")
    model.fit(X_train, y_train, epochs=30, batch_size=32, verbose=0)
    print("--> Model training finished. Predicting values...")

    predicted = model.predict(X_test)
    mae = mean_absolute_error(y_test, predicted)
    accuracy = max(0, 100 - (mae * 100))

    last_60_days = scaled_data[-60:]
    input_data = np.array([last_60_days])
    next_day_scaled_pred = model.predict(input_data)[0][0]
    
    dummy_array_pred = np.zeros((1, len(features)))
    dummy_array_pred[0, 0] = next_day_scaled_pred
    next_day_price = scaler.inverse_transform(dummy_array_pred)[0, 0]

    actual_prices = scaler.inverse_transform(np.pad(y_test.reshape(-1, 1), ((0, 0), (0, len(features)-1)), 'constant'))[:, 0]
    predicted_prices = scaler.inverse_transform(np.pad(predicted.reshape(-1, 1), ((0, 0), (0, len(features)-1)), 'constant'))[:, 0]
    
    test_dates = df.index[X_test_start_index:X_test_start_index + len(actual_prices)]
    test_df = pd.DataFrame({'Date': test_dates, 'Actual': actual_prices, 'Predicted': predicted_prices})
    test_df.set_index('Date', inplace=True)
    
    plots = {}
    for label, days in {"1W": 7, "1M": 30, "3M": 90, "6M": 180}.items():
        cutoff = test_df.index[-1] - pd.Timedelta(days=days)
        range_df = test_df[test_df.index > cutoff]
        plots[label] = { "dates": [d.strftime('%Y-%m-%d') for d in range_df.index], "actual": range_df['Actual'].round(2).tolist(), "predicted": range_df['Predicted'].round(2).tolist() }
    
    print("--> Prediction complete.")
    return float(df['Close'].iloc[-1]), float(round(next_day_price, 2)), float(round(accuracy, 2)), plots