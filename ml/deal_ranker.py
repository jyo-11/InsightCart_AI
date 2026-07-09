import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import pickle
import os
import sys

# Add backend to path to import data_loader
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))
from services.data_loader import load_price_history

def train_and_save_deal_ranker():
    print("Loading price history for Deal Ranker...")
    df = load_price_history()
    
    if df.empty:
        print("No data found for training.")
        return

    df['max_price'] = df.groupby('product_id')['price'].transform('max')
    df['deal_score'] = 1 - (df['price'] / df['max_price'])
    
    demand_map = {"low": 1, "medium": 2, "high": 3, "very high": 4}
    df['demand_score'] = df['demand'].map(demand_map).fillna(2)
    
    X = df[['price', 'demand_score', 'stock']]
    y = df['deal_score']
    
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    model_dir = os.path.join(os.path.dirname(__file__), "..", "backend", "models")
    if not os.path.exists(model_dir):
        os.makedirs(model_dir)
        
    model_path = os.path.join(model_dir, "deal_ranker.pkl")
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
        
    print(f"Deal Ranker model saved to {model_path}")

if __name__ == "__main__":
    train_and_save_deal_ranker()
