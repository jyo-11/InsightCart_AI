from fastapi import APIRouter
from services.data_loader import search_products

router = APIRouter(prefix="/search", tags=["search"])

@router.get("/")
async def search(q: str = ""):
    results = search_products(q)
    return {"query": q, "results": results}
