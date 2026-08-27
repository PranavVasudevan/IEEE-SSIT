import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import NewsletterSubscriber
from app.schemas.newsletter import (
    NewsletterSubscribeRequest,
    NewsletterSubscriberResponse,
)
from app.core.security import get_current_admin

router = APIRouter(prefix="/api/newsletter", tags=["Newsletter"])


@router.post("/subscribe", response_model=NewsletterSubscriberResponse, status_code=status.HTTP_201_CREATED)
def subscribe_newsletter(
    req: NewsletterSubscribeRequest,
    db: Session = Depends(get_db),
):
    email = req.email.strip().lower()
    existing = db.query(NewsletterSubscriber).filter(NewsletterSubscriber.email == email).first()
    if existing:
        return existing

    sub_id = f"sub-{uuid.uuid4().hex[:8]}"
    subscriber = NewsletterSubscriber(id=sub_id, email=email)
    db.add(subscriber)
    db.commit()
    db.refresh(subscriber)
    return subscriber


@router.get("/subscribers", response_model=List[NewsletterSubscriberResponse])
def get_subscribers(
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    return db.query(NewsletterSubscriber).order_by(NewsletterSubscriber.created_at.desc()).all()


@router.delete("/subscribers/{id}", status_code=status.HTTP_200_OK)
def delete_subscriber(
    id: str,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    sub = db.query(NewsletterSubscriber).filter(NewsletterSubscriber.id == id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subscriber not found")

    db.delete(sub)
    db.commit()
    return {"message": "Subscriber removed", "id": id}
