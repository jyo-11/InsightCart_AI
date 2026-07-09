import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from sklearn.preprocessing import MinMaxScaler
import os
import sys

# Add backend to path to import data_loader
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))
from services.data_loader import load_price_history

def train_and_save_lstm():
    print("Loading price history for LSTM...")
    df = load_price_history()
    
    if df.empty:
        print("No data found for training.")
        return

    # For LSTM, we'll use price, demand, and stock
    demand_map = {"low": 1, "medium": 2, "high": 3, "very high": 4}
    df['demand_score'] = df['demand'].map(demand_map).fillna(2)
    
    features = df[['price', 'demand_score', 'stock']].values
    
    # Scale data
    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(features)
    
    X, y = [], []
    look_back = 1 
    
    for i in range(len(scaled_data) - look_back):
        X.append(scaled_data[i:i+look_back])
        y.append(scaled_data[i+look_back, 0]) 
        
    X, y = np.array(X), np.array(y)
    
    model = Sequential([
        LSTM(units=50, return_sequences=True, input_shape=(X.shape[1], X.shape[2])),
        Dropout(0.2),
        LSTM(units=50),
        Dropout(0.2),
        Dense(units=1)
    ])
    
    model.compile(optimizer='adam', loss='mean_squared_error')
    
    print("Training LSTM...")
    model.fit(X, y, epochs=10, batch_size=32, verbose=0)
    
    model_dir = os.path.join(os.path.dirname(__file__), "..", "backend", "models")
    if not os.path.exists(model_dir):
        os.makedirs(model_dir)
        
    model.save(os.path.join(model_dir, "lstm_model.h5"))
    
    import pickle
    with open(os.path.join(model_dir, "lstm_scaler.pkl"), 'wb') as f:
        pickle.dump(scaler, f)
        
    print(f"LSTM model and scaler saved to {model_dir}")

if __name__ == "__main__":
    train_and_save_lstm()
