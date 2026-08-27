import os
from pathlib import Path
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
ENV_PATH = BACKEND_DIR / ".env"


class Settings(BaseSettings):
    # App
    PROJECT_NAME: str = "IEEE SSIT SSN Student Branch API"
    ENVIRONMENT: str = "development"
    PORT: int = 8000
    
    # Database
    SUPABASE_DATABASE_URL: str = ""
    DATABASE_URL: str = ""
    
    # Supabase Storage & REST
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    SUPABASE_BUCKET: str = "ieee-ssit-assets"
    
    # CORS
    ALLOWED_ORIGINS: Union[str, List[str]] = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"
    
    # Firebase
    FIREBASE_PROJECT_ID: str = ""
    FIREBASE_CREDENTIALS_PATH: str = ""

    # Official SSN domain
    OFFICIAL_EMAIL_DOMAIN: str = "ssn.edu.in"
    OFFICIAL_CHAPTER_EMAIL: str = "ieeessitsb@ssn.edu.in"

    model_config = SettingsConfigDict(
        env_file=(str(ENV_PATH), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def cors_origins(self) -> List[str]:
        if isinstance(self.ALLOWED_ORIGINS, list):
            return self.ALLOWED_ORIGINS
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

    @property
    def sqlalchemy_database_url(self) -> str:
        url = self.SUPABASE_DATABASE_URL or self.DATABASE_URL or os.environ.get("DATABASE_URL", "")
        if not url:
            return "sqlite:///./test.db"
        # Ensure postgresql:// is supported by SQLAlchemy
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        return url


settings = Settings()
