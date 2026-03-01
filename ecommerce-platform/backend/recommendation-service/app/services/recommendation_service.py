import numpy as np
from typing import List, Dict
from sentence_transformers import SentenceTransformer
import redis
import json
from app.core.config import settings

class RecommendationService:
    def __init__(self):
        self.model = SentenceTransformer(settings.EMBEDDING_MODEL)
        self.redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
    
    async def get_personalized_recommendations(
        self, 
        user_id: str, 
        limit: int = 10
    ) -> List[Dict]:
        \"\"\"Generate personalized product recommendations using collaborative filtering + embeddings\"\"\"
        
        # Check cache first
        cache_key = f\"recommendations:user:{user_id}\"
        cached = self.redis_client.get(cache_key)
        if cached:
            return json.loads(cached)
        
        # Get user interaction history
        user_interactions = await self._get_user_interactions(user_id)
        
        if not user_interactions:
            # New user - return trending products
            return await self._get_trending_products(limit)
        
        # Generate user profile embedding
        user_embedding = self._create_user_embedding(user_interactions)
        
        # Find similar products
        recommendations = await self._find_similar_products(user_embedding, limit)
        
        # Cache for 1 hour
        self.redis_client.setex(cache_key, 3600, json.dumps(recommendations))
        
        return recommendations
    
    def _create_user_embedding(self, interactions: List[Dict]) -> np.ndarray:
        \"\"\"Create user profile embedding from interaction history\"\"\"
        product_embeddings = []
        weights = []
        
        for interaction in interactions:
            # Weight different interaction types
            weight_map = {
                \"PURCHASE\": 5.0,
                \"ADD_TO_CART\": 3.0,
                \"VIEW\": 1.0,
                \"SEARCH\": 2.0
            }
            weight = weight_map.get(interaction['type'], 1.0)
            
            embedding = self._get_product_embedding(interaction['product_id'])
            product_embeddings.append(embedding)
            weights.append(weight)
        
        # Weighted average
        weights = np.array(weights)
        embeddings = np.array(product_embeddings)
        user_embedding = np.average(embeddings, axis=0, weights=weights)
        
        return user_embedding
    
    async def _find_similar_products(
        self, 
        query_embedding: np.ndarray, 
        limit: int
    ) -> List[Dict]:
        \"\"\"Find products similar to query embedding using cosine similarity\"\"\"
        # In production, use Pinecone vector database for fast similarity search
        # For now, demonstrate with placeholder
        
        similar_products = [
            {
                \"product_id\": \"uuid-1\",
                \"name\": \"Premium Wireless Headphones\",
                \"score\": 0.95,
                \"price\": 199.99,
                \"image_url\": \"/images/headphones.jpg\"
            },
            {
                \"product_id\": \"uuid-2\",
                \"name\": \"Smart Watch Series 5\",
                \"score\": 0.89,
                \"price\": 299.99,
                \"image_url\": \"/images/smartwatch.jpg\"
            }
        ]
        
        return similar_products[:limit]
    
    async def _get_trending_products(self, limit: int) -> List[Dict]:
        \"\"\"Get currently trending products\"\"\"
        # Query database for top-selling products
        return []
    
    async def _get_user_interactions(self, user_id: str) -> List[Dict]:
        \"\"\"Fetch user interaction history from database\"\"\"
        # Query PostgreSQL user_interactions table
        return []
    
    def _get_product_embedding(self, product_id: str) -> np.ndarray:
        \"\"\"Get or generate product embedding\"\"\"
        # In production, retrieve from database or Pinecone
        return np.random.rand(384)  # Placeholder

recommendation_service = RecommendationService()
