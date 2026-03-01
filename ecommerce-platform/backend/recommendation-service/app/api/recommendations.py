from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.services.recommendation_service import recommendation_service

router = APIRouter()

class RecommendationRequest(BaseModel):
    user_id: str
    limit: Optional[int] = 10
    context: Optional[str] = None

class RecommendationResponse(BaseModel):
    product_id: str
    name: str
    score: float
    price: float
    image_url: str

@router.post(\"/personalized\", response_model=List[RecommendationResponse])
async def get_personalized_recommendations(request: RecommendationRequest):
    \"\"\"Get AI-powered personalized product recommendations\"\"\"
    try:
        recommendations = await recommendation_service.get_personalized_recommendations(
            user_id=request.user_id,
            limit=request.limit
        )
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get(\"/similar/{product_id}\", response_model=List[RecommendationResponse])
async def get_similar_products(product_id: str, limit: int = 10):
    \"\"\"Get products similar to a given product\"\"\"
    # Implementation
    return []

@router.get(\"/trending\", response_model=List[RecommendationResponse])
async def get_trending_products(limit: int = 10):
    \"\"\"Get currently trending products\"\"\"
    return []
