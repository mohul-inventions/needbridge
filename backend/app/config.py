import os

class Settings:
    PROJECT_NAME: str = "NEEDBRIDGE"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "needbridge-super-secret-jwt-key-2026-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./needbridge.db")
    
    PAYPAL_MODE: str = os.getenv("PAYPAL_MODE", "sandbox")
    PAYPAL_CLIENT_ID: str = os.getenv("PAYPAL_CLIENT_ID", "sb-client-id-demo-mode")
    PAYPAL_CLIENT_SECRET: str = os.getenv("PAYPAL_CLIENT_SECRET", "sb-secret-key-demo-mode")
    PAYPAL_WEBHOOK_ID: str = os.getenv("PAYPAL_WEBHOOK_ID", "webhook-id-mock-verified")
    
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8000",
        "*"
    ]

settings = Settings()
