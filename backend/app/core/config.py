from typing import Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "GuardRail"
    DATABASE_URL: str = "postgresql://guardrail_user:guardrail_password@localhost:5432/guardrail_db"
    SECRET_KEY: str = "guardrail_super_secret_signing_key_change_me_in_production_13579"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    
    # Environment URLs
    FRONTEND_URL: str = "http://localhost:3000"
    
    # Resend
    RESEND_API_KEY: Optional[str] = None
    SENDER_EMAIL: str = "onboarding@resend.dev"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True
        extra = "ignore"

settings = Settings()
