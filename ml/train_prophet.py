import pandas as pd
from prophet import Prophet
import pickle
import os
import sys

# Add backend to path to import data_loader
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))
from services.data_loader import load_price_history

def train_and_save_prophet():
    print("Loading price history...")
    df = load_price_history()
    
    if df.empty:
        print("No data found for training.")
        return

    # Results storage
    models = {}

    # We train a model for each product + seller combination
    groups = df.groupby(['product_id', 'seller'])
    
    for (product_id, seller), group in groups:
        if len(group) < 2:
            print(f"Skipping Product {product_id} from {seller}: not enough data points.")
            continue
            
        print(f"Training Prophet model for Product {product_id} from {seller}...")
        
        # Prepare data for Prophet: needs 'ds' (date) and 'y' (value) columns
        prophet_df = group[['date', 'price']].rename(columns={'date': 'ds', 'price': 'y'})
        
        # Initialize and fit model
        model = Prophet(daily_seasonality=True, weekly_seasonality=True, yearly_seasonality=False)
        model.fit(prophet_df)
        
        # Store model
        models[f"{product_id}_{seller}"] = model

    # Save all models to disk
    model_path = os.path.join(os.path.dirname(__file__), "..", "backend", "models", "prophet_models.pkl")
    with open(model_path, 'wb') as f:
        pickle.dump(models, f)
    
    print(f"Prophet models saved to {model_path}")

if __name__ == "__main__":
    train_and_save_prophet()
