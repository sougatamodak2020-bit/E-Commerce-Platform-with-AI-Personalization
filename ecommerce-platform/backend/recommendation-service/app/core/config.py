from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    DATABASE_URL: str = \"postgresql://ecommerce_user:ecommerce_pass_2024@localhost:5432/ecommerce_db\"
    REDIS_URL: str = \"redis://:redis_pass_2024@localhost:6379\"
    
    OPENAI_API_KEY: Optional[str] = None
    PINECONE_API_KEY: Optional[str] = None
    PINECONE_ENVIRONMENT: Optional[str] = None
    
    EMBEDDING_MODEL: str = \"sentence-transformers/all-MiniLM-L6-v2\"
    LLM_MODEL: str = \"gpt-3.5-turbo\"
    
    class Config:
        env_file = \".env\"

settings = Settings()
