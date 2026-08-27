import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import MembershipApplication
from app.schemas.membership import (
    MembershipApplicationCreate,
    MembershipApplicationStatusUpdate,
    MembershipApplicationResponse,
)
from app.core.security import get_current_admin
from app.services.audit import log_activity

router = APIRouter(prefix="/api/membership", tags=["Membership"])


@router.post("/apply", response_model=MembershipApplicationResponse, status_code=status.HTTP_201_CREATED)
def apply_membership(
    app_in: MembershipApplicationCreate,
    db: Session = Depends(get_db),
):
    app_id = f"app-{uuid.uuid4().hex[:8]}"
    new_app = MembershipApplication(
        id=app_id,
        name=app_in.name,
        register_number=app_in.register_number,
        email=app_in.email,
        phone=app_in.phone,
        department=app_in.department,
        year=app_in.year,
        ieee_membership_number=app_in.ieee_membership_number,
        vertical_choice_1=app_in.vertical_choice_1,
        why_suitable_1=app_in.why_suitable_1,
        vertical_choice_2=app_in.vertical_choice_2,
        why_suitable_2=app_in.why_suitable_2,
        vertical_choice_3=app_in.vertical_choice_3,
        why_suitable_3=app_in.why_suitable_3,
        past_experience=app_in.past_experience,
        how_you_support=app_in.how_you_support,
        proof_file_url=app_in.proof_file_url,
        status="new",
    )
    db.add(new_app)
    db.commit()
    db.refresh(new_app)
    return new_app


@router.get("/applications", response_model=List[MembershipApplicationResponse])
def get_membership_applications(
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    applications = db.query(MembershipApplication).order_by(MembershipApplication.created_at.desc()).all()
    return applications


@router.put("/applications/{id}/status", response_model=MembershipApplicationResponse)
def update_application_status(
    id: str,
    status_update: MembershipApplicationStatusUpdate,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    application = db.query(MembershipApplication).filter(MembershipApplication.id == id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    application.status = status_update.status
    db.commit()
    db.refresh(application)

    log_activity(
        db,
        action="Updated Application Status",
        category="applications",
        target_title=f"{application.name} ({application.department})",
        admin_email=admin["email"],
        details=f"Status set to: {status_update.status}",
    )
    return application


@router.delete("/applications/{id}", status_code=status.HTTP_200_OK)
def delete_application(
    id: str,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    application = db.query(MembershipApplication).filter(MembershipApplication.id == id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    name = application.name
    db.delete(application)
    db.commit()

    log_activity(
        db,
        action="Deleted Application",
        category="applications",
        target_title=name,
        admin_email=admin["email"],
    )
    return {"message": "Application deleted successfully", "id": id}
