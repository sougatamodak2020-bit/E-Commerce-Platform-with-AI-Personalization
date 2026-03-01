from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

app = FastAPI(
    title="AI Recommendation Service",
    description="AI-powered personalization engine for e-commerce",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class RecommendationRequest(BaseModel):
    user_id: str
    limit: Optional[int] = 10

class ProductRecommendation(BaseModel):
    product_id: str
    name: str
    score: float
    price: float
    image_url: str

class SearchRequest(BaseModel):
    query: str
    limit: int = 20

class ChatRequest(BaseModel):
    message: str
    conversation_id: str

# Endpoints
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "recommendation-service"}

@app.post("/api/recommendations/personalized", response_model=List[ProductRecommendation])
async def get_personalized_recommendations(request: RecommendationRequest):
    """Get AI-powered personalized product recommendations"""
    # Placeholder recommendations (in production, connect to database and ML model)
    recommendations = [
        ProductRecommendation(
            product_id="prod-1",
            name="Premium Wireless Headphones",
            score=0.95,
            price=199.99,
            image_url="/images/headphones.jpg"
        ),
        ProductRecommendation(
            product_id="prod-2",
            name="Smart Watch Series 5",
            score=0.89,
            price=299.99,
            image_url="/images/smartwatch.jpg"
        ),
        ProductRecommendation(
            product_id="prod-3",
            name="Portable Bluetooth Speaker",
            score=0.87,
            price=79.99,
            image_url="/images/speaker.jpg"
        ),
    ]
    return recommendations[:request.limit]

@app.get("/api/recommendations/similar/{product_id}", response_model=List[ProductRecommendation])
async def get_similar_products(product_id: str, limit: int = 10):
    """Get products similar to a given product"""
    return []

@app.get("/api/recommendations/trending", response_model=List[ProductRecommendation])
async def get_trending_products(limit: int = 10):
    """Get currently trending products"""
    return []

@app.post("/api/search/semantic")
async def semantic_search(request: SearchRequest):
    """Semantic product search"""
    return {"results": [], "total": 0}

@app.post("/api/chatbot/chat")
async def chat_with_assistant(request: ChatRequest):
    """AI-powered shopping assistant"""
    responses = {
        "hi": "Hello! Welcome to Elite E-Commerce! How can I help you find the perfect product today?",
        "help": "I can help you find products, answer questions, and provide recommendations. What are you looking for?",
        "headphones": "We have amazing wireless headphones! Would you like to see our premium collection?",
    }
    
    message_lower = request.message.lower()
    response = responses.get(message_lower, "I'm here to help! Could you tell me more about what you're looking for?")
    
    return {"response": response, "conversation_id": request.conversation_id}

@app.post("/api/fraud/check")
async def check_fraud(order_data: dict):
    """AI-based fraud detection for orders"""
    # Simple rule-based fraud detection (in production, use ML model)
    amount = order_data.get("amount", 0)
    
    if amount > 5000:
        fraud_score = 0.7
        risk_level = "HIGH"
        approved = False
    elif amount > 1000:
        fraud_score = 0.3
        risk_level = "MEDIUM"
        approved = True
    else:
        fraud_score = 0.05
        risk_level = "LOW"
        approved = True
    
    return {
        "fraud_score": fraud_score,
        "risk_level": risk_level,
        "approved": approved
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8086, reload=True)
