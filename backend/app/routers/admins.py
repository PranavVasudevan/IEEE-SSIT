import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import AdminUser
from app.schemas.admins import AdminAddRequest, AdminUserResponse
from app.core.security import get_current_admin, is_official_ssn_email, DEFAULT_ADMIN_EMAILS
from app.services.audit import log_activity

router = APIRouter(prefix="/api/admins", tags=["Admins"])


@router.get("", response_model=List[AdminUserResponse])
def get_admins(
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    db_admins = db.query(AdminUser).filter(AdminUser.active == True).all()
    emails_in_db = {a.email for a in db_admins}

    # Ensure all core admins are represented
    results = list(db_admins)
    for core_email in DEFAULT_ADMIN_EMAILS:
        if core_email not in emails_in_db:
            results.append(
                AdminUserResponse(
                    id=f"core-{core_email}",
                    email=core_email,
                    added_by="Core System Config",
                    active=True,
                )
            )
    return results


@router.post("", response_model=AdminUserResponse, status_code=status.HTTP_201_CREATED)
def add_admin(
    req: AdminAddRequest,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    email = req.email.strip().lower()
    if not is_official_ssn_email(email):
        raise HTTPException(
            status_code=400,
            detail="Only official @ssn.edu.in email accounts can be added as administrators."
        )

    existing = db.query(AdminUser).filter(AdminUser.email == email).first()
    if existing:
        if not existing.active:
            existing.active = True
            existing.added_by = admin["email"]
            db.commit()
            db.refresh(existing)
        return existing

    new_admin = AdminUser(
        id=f"admin-{uuid.uuid4().hex[:8]}",
        email=email,
        added_by=admin["email"],
        active=True,
    )
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)

    log_activity(
        db,
        action="Added Administrator",
        category="admins",
        target_title=email,
        admin_email=admin["email"],
    )
    return new_admin


@router.delete("/{email}", status_code=status.HTTP_200_OK)
def remove_admin(
    email: str,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    clean_email = email.strip().lower()
    if clean_email in DEFAULT_ADMIN_EMAILS:
        raise HTTPException(
            status_code=400,
            detail="Cannot remove core lead administrator account."
        )

    target = db.query(AdminUser).filter(AdminUser.email == clean_email).first()
    if not target:
        raise HTTPException(status_code=404, detail="Admin account not found")

    target.active = False
    db.commit()

    log_activity(
        db,
        action="Removed Administrator",
        category="admins",
        target_title=clean_email,
        admin_email=admin["email"],
    )
    return {"message": "Admin removed successfully", "email": clean_email}
