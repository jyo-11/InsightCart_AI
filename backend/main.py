from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

# Create App
app = FastAPI(title="InsightCart AI API", description="AI-powered price comparison & buying-decision platform")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root Endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to InsightCart AI API", "status": "online"}

# Import API Routers
from api import search, compare, predict, recommend, chat

# Include Routers
app.include_router(search.router)
app.include_router(compare.router)
app.include_router(predict.router)
app.include_router(recommend.router)
app.include_router(chat.router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
