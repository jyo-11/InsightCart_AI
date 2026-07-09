from fastapi import APIRouter
from pydantic import BaseModel
from services.agent_logic import agent

router = APIRouter(prefix="/chat", tags=["chat"])

class ChatRequest(BaseModel):
    message: str
    context: str = ""

@router.post("/")
async def chat(request: ChatRequest):
    response = agent.chat(request.message, request.context)
    return {"response": response}
