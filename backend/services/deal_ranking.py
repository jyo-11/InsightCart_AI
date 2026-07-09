import pickle
import os
import pandas as pd
from typing import Dict, List, Optional
import sys

# Paths
MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models")
DEAL_RANKER_PATH = os.path.join(MODEL_DIR, "deal_ranker.pkl")

class DealRankingService:
    def __init__(self):
        self.model = None
        self.load_model()

    def load_model(self):
        """Load trained deal ranker model."""
        if os.path.exists(DEAL_RANKER_PATH):
            with open(DEAL_RANKER_PATH, 'rb') as f:
                self.model = pickle.load(f)

    def calculate_deal_score(self, price: float, demand: str, stock: int) -> float:
        """Calculate a deal score (0 to 1) for a product."""
        if not self.model:
            # Fallback heuristic if model isn't trained yet
            return 0.5
        
        # Prepare features
        demand_map = {"low": 1, "medium": 2, "high": 3, "very high": 4}
        demand_score = demand_map.get(demand.lower(), 2)
        
        X = pd.DataFrame([[price, demand_score, stock]], columns=['price', 'demand_score', 'stock'])
        score = self.model.predict(X)[0]
        return round(float(score), 2)

    def get_best_deal(self, products_with_prices: List[Dict]) -> Dict:
        """From a list of prices from different sellers, pick the best one."""
        if not products_with_prices:
            return {}
            
        for item in products_with_prices:
            item['deal_score'] = self.calculate_deal_score(
                item['price'], 
                item.get('demand', 'medium'), 
                item.get('stock', 10)
            )
            
        # Sort by deal score descending
        sorted_deals = sorted(products_with_prices, key=lambda x: x['deal_score'], reverse=True)
        return sorted_deals[0]

# Singleton instance
deal_service = DealRankingService()
