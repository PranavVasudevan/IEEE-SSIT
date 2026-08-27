import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import ContactInquiry
from app.schemas.contact import (
    ContactInquiryCreate,
    ContactInquiryStatusUpdate,
    ContactInquiryResponse,
)
from app.core.security import get_current_admin
from app.services.audit import log_activity

router = APIRouter(prefix="/api/contact", tags=["Contact"])


@router.post("", response_model=ContactInquiryResponse, status_code=status.HTTP_201_CREATED)
def submit_contact_inquiry(
    inquiry_in: ContactInquiryCreate,
    db: Session = Depends(get_db),
):
    inquiry_id = f"sub-{uuid.uuid4().hex[:8]}"
    new_inquiry = ContactInquiry(
        id=inquiry_id,
        name=inquiry_in.name,
        email=inquiry_in.email,
        department=inquiry_in.department,
        year=inquiry_in.year,
        inquiry_type=inquiry_in.type or "general",
        interest=inquiry_in.interest,
        ieee_member=inquiry_in.ieee_member,
        ssit_member=inquiry_in.ssit_member,
        message=inquiry_in.message,
        status="new",
    )
    db.add(new_inquiry)
    db.commit()
    db.refresh(new_inquiry)
    return new_inquiry


@router.get("/inquiries", response_model=List[ContactInquiryResponse])
def get_contact_inquiries(
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    inquiries = db.query(ContactInquiry).order_by(ContactInquiry.created_at.desc()).all()
    return inquiries


@router.put("/inquiries/{id}/status", response_model=ContactInquiryResponse)
def update_inquiry_status(
    id: str,
    status_update: ContactInquiryStatusUpdate,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    inquiry = db.query(ContactInquiry).filter(ContactInquiry.id == id).first()
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")

    inquiry.status = status_update.status
    db.commit()
    db.refresh(inquiry)

    log_activity(
        db,
        action="Updated Inquiry Status",
        category="inquiries",
        target_title=inquiry.name,
        admin_email=admin["email"],
        details=f"Status set to: {status_update.status}",
    )
    return inquiry


@router.delete("/inquiries/{id}", status_code=status.HTTP_200_OK)
def delete_inquiry(
    id: str,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    inquiry = db.query(ContactInquiry).filter(ContactInquiry.id == id).first()
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")

    name = inquiry.name
    db.delete(inquiry)
    db.commit()

    log_activity(
        db,
        action="Deleted Inquiry",
        category="inquiries",
        target_title=name,
        admin_email=admin["email"],
    )
    return {"message": "Inquiry deleted successfully", "id": id}
