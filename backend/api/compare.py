from fastapi import APIRouter
from services.data_loader import get_product_prices

router = APIRouter(prefix="/compare", tags=["compare"])

@router.get("/{product_id}")
async def compare(product_id: int, city: str = None):
    prices = get_product_prices(product_id, city)
    return {"product_id": product_id, "city": city, "prices": prices}
