from fastapi import APIRouter
from services.agent_logic import agent

router = APIRouter(prefix="/recommend", tags=["recommendation"])

@router.get("/{product_id}")
async def recommend(product_id: int, city: str = None):
    recommendation = agent.get_buying_recommendation(product_id, city)
    return recommendation
