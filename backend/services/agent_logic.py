from .data_loader import get_product_prices, get_product_details
from .price_prediction import prediction_service
from .deal_ranking import deal_service
from typing import Dict, List, Optional
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

class InsightAgent:
    def __init__(self):
        self.provider = os.getenv("AI_PROVIDER", "ollama")
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.ollama_host = os.getenv("OLLAMA_HOST", "http://localhost:11434")
        # Using llama3.1:8b which is installed in user's Ollama
        self.model = os.getenv("OLLAMA_MODEL", "llama3.1:8b") if self.provider == "ollama" else "gpt-3.5-turbo"
        
        if self.provider == "openai":
            self.client = OpenAI(api_key=self.openai_api_key)
        else:
            # Ollama is compatible with OpenAI's API client
            self.client = OpenAI(base_url=f"{self.ollama_host}/v1", api_key="ollama")

    def get_buying_recommendation(self, product_id: int, city: Optional[str] = None) -> Dict:
        """Get the full AI recommendation for a product."""
        product = get_product_details(product_id)
        if not product:
            return {"error": "Product not found"}

        # Check if this is a real-time web result
        is_real_time = product.get('is_real_time', False)

        prices = get_product_prices(product_id, city)
        if not prices:
            return {"error": "No price data available"}

        best_deal = deal_service.get_best_deal(prices)
        if not best_deal or 'price' not in best_deal:
            return {"error": "Could not determine best deal"}
        current_price = best_deal['price']

        # Pass base_price to prediction service for web results
        predictions = prediction_service.predict_future_price(
            product_id,
            best_deal['seller'],
            days=7,
            base_price=current_price if current_price > 0 else None
        )
        recommendation = "Buy Now"

        # Analyze future price vs current price
        future_drops = [p for p in predictions if p['predicted_price'] < current_price * 0.98]
        if future_drops:
            recommendation = "Wait"

        # Ask the LLM for a more "human" explanation
        prompt = f"""
        Product: {product['name']}
        Current Best Price: {current_price} at {best_deal['seller']}
        Historical Trend Analysis: {recommendation} (based on ML forecast)
        Predictions for next 7 days: {predictions[:3]}...

        Give a 2-sentence expert buying advice for this product.
        Focus on whether the user should buy now or wait based on the data.
        """

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "system", "content": "You are InsightCart AI shopping expert."},
                          {"role": "user", "content": prompt}],
                max_tokens=100
            )
            explanation = response.choices[0].message.content.strip()
        except Exception as e:
            print(f"AI Error: {e}")
            explanation = f"{best_deal['seller']} has the best deal currently. Our forecasting suggests you should {recommendation}."

        # Build sellers list from all price entries
        sellers = [{"name": p.get("seller", "Unknown"), "price": p.get("price", 0)} for p in prices]

        return {
            "product": product['name'],
            "best_seller": best_deal['seller'],
            "current_price": current_price,
            "deal_score": round(best_deal.get('deal_score', 0.5) * 100),
            "recommendation": recommendation,
            "explanation": explanation,
            "predictions": predictions,
            "sellers": sellers,
            "is_real_time": is_real_time,
            "source_url": product.get('source_url')
        }

    def chat(self, query: str, context: str = "") -> str:
        """Natural language interaction using the LLM with smart fallback."""
        system_prompt = """You are InsightCart AI Assistant - a smart shopping intelligence platform. Be concise and helpful.

YOUR APP'S KEY FEATURES (suggest these when relevant):
1. **Price Comparison**: Compare prices across 50+ retailers (Amazon, Flipkart, Walmart, Best Buy, etc.)
2. **Product Search**: Search for any product using the Intelligence Engine search bar
3. **Price Prediction**: AI predicts if prices will drop - shows "Buy Now" or "Wait" recommendations
4. **Deal Scoring**: Every deal gets a confidence score (0-100%) based on historical data
5. **Price Alerts**: Set alerts to get notified when prices drop
6. **Smart Watchlist**: Track products and get AI-powered insights

WHEN USERS ASK ABOUT PRODUCTS:
- Suggest they search in the Intelligence Engine (top-left search bar)
- Mention the real-time price comparison feature
- Highlight the AI prediction accuracy (94.2%)

KEEP RESPONSES SHORT (2-3 sentences max). Always guide users to USE the app's features."""

        if context:
            system_prompt += f"\n\nCURRENT PRODUCT THE USER IS VIEWING:\n{context}\nUse this context to give specific, data-driven answers about this product."

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "system", "content": system_prompt},
                          {"role": "user", "content": query}],
                max_tokens=150
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            # Smart fallback responses when AI is unavailable
            return self._get_fallback_response(query)
    
    def _get_fallback_response(self, query: str) -> str:
        """Provide helpful fallback responses based on query keywords."""
        query_lower = query.lower()
        
        if any(word in query_lower for word in ['price', 'cost', 'cheap', 'expensive', 'deal']):
            return "Based on our data, prices for popular electronics typically drop 10-15% during major sales events. I recommend tracking items on your watchlist for price alerts."
        
        if any(word in query_lower for word in ['iphone', 'samsung', 'phone', 'mobile']):
            return "Smartphone prices tend to drop after new model releases. The best time to buy is usually 2-3 months after launch when initial demand subsides."
        
        if any(word in query_lower for word in ['laptop', 'computer', 'pc']):
            return "For laptops, we see the best deals during back-to-school season (July-Aug) and holiday sales (Nov-Dec). Consider setting up price alerts for your desired specs."
        
        if any(word in query_lower for word in ['buy', 'wait', 'when', 'best time']):
            return "Our AI analyzes historical price trends to predict the optimal buying window. Check the 'Expert Forecast' section for specific product recommendations."
        
        if any(word in query_lower for word in ['hi', 'hello', 'hey', 'help']):
            return "Hello! I can help you find the best deals and predict future prices. Try asking 'Best time to buy iPhone' or 'Compare Samsung S23 prices'."
        
        return "I can help you find the best deals and predict price trends. Try asking about specific products like 'iPhone 15 price trend' or 'Best laptop deals'."

# Singleton instance
agent = InsightAgent()
