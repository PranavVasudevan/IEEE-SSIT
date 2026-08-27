from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.database import get_db

router = APIRouter(tags=["Health"])


@router.get("/health", status_code=status.HTTP_200_OK)
def health_check():
    return {
        "status": "healthy",
        "service": "IEEE SSIT SSN Student Branch Backend",
        "version": "1.0.0"
    }


@router.get("/health/db", status_code=status.HTTP_200_OK)
def db_health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {
            "status": "connected",
            "database": "PostgreSQL",
            "message": "Database connection verified successfully."
        }
    except Exception as e:
        return {
            "status": "error",
            "database": "PostgreSQL",
            "error": str(e)
        }
