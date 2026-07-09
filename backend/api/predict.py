from fastapi import APIRouter
from services.price_prediction import prediction_service

router = APIRouter(prefix="/predict", tags=["prediction"])

@router.get("/{product_id}")
async def predict(product_id: int, seller: str, days: int = 7):
    forecast = prediction_service.predict_future_price(product_id, seller, days)
    return {"product_id": product_id, "seller": seller, "forecast": forecast}
