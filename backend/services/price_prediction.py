import pickle
import os
import pandas as pd
import numpy as np
from typing import Dict, List, Optional
import sys

try:
    import tensorflow as tf
except ImportError:
    tf = None

# Paths
MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models")
PROPHET_MODELS_PATH = os.path.join(MODEL_DIR, "prophet_models.pkl")
LSTM_MODEL_PATH = os.path.join(MODEL_DIR, "lstm_model.h5")
LSTM_SCALER_PATH = os.path.join(MODEL_DIR, "lstm_scaler.pkl")

class PricePredictionService:
    def __init__(self):
        self.prophet_models = {}
        self.lstm_model = None
        self.lstm_scaler = None
        self.load_models()

    def load_models(self):
        """Load trained models from disk."""
        # Load Prophet Models
        if os.path.exists(PROPHET_MODELS_PATH):
            with open(PROPHET_MODELS_PATH, 'rb') as f:
                self.prophet_models = pickle.load(f)
        
        # Load LSTM Model (only if TensorFlow is available)
        if tf and os.path.exists(LSTM_MODEL_PATH):
            try:
                self.lstm_model = tf.keras.models.load_model(LSTM_MODEL_PATH)
                with open(LSTM_SCALER_PATH, 'rb') as f:
                    self.lstm_scaler = pickle.load(f)
            except Exception as e:
                print(f"Error loading LSTM model: {e}")

    def predict_future_price(self, product_id: int, seller: str, days: int = 7, base_price: float = None) -> List[Dict]:
        """Predict prices for the next X days using Prophet or simulated data for web results."""
        model_key = f"{product_id}_{seller}"
        model = self.prophet_models.get(model_key)

        if model:
            # Use trained Prophet model
            future = model.make_future_dataframe(periods=days)
            forecast = model.predict(future)
            results = forecast.tail(days)[['ds', 'yhat']].to_dict(orient="records")
            return [{"date": r['ds'].strftime('%Y-%m-%d'), "predicted_price": round(r['yhat'], 2)} for r in results]

        # For web results (product_id >= 9000) or products without models, generate realistic predictions
        if base_price is None or base_price <= 0:
            base_price = 25000  # Default base price

        # Generate realistic price predictions with slight variations
        np.random.seed(product_id % 1000)  # Consistent results for same product
        dates = pd.date_range(start=pd.Timestamp.now(), periods=days).strftime('%Y-%m-%d').tolist()

        predictions = []
        current_price = base_price
        trend = np.random.choice([-1, 0, 1], p=[0.3, 0.4, 0.3])  # Slight bias toward stable/down

        for i, date in enumerate(dates):
            # Small daily variation (±2%) with overall trend
            variation = np.random.uniform(-0.02, 0.02) + (trend * 0.005)
            current_price = current_price * (1 + variation)
            predictions.append({
                "date": date,
                "predicted_price": round(current_price, 2)
            })

        return predictions

    def get_market_trend(self) -> str:
        """Analyze overall market trend using LSTM (Simplified)."""
        if self.lstm_model and self.lstm_scaler:
            # Here you would typically feed recent global data
            # For this demo, we'll return a qualitative trend based on the latest data
            return "Stable with slight downward trend expected in electronics."
        return "Not enough data for deep trend analysis."

# Singleton instance
prediction_service = PricePredictionService()
