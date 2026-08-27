import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Announcement
from app.schemas.announcements import (
    AnnouncementCreate,
    AnnouncementUpdate,
    AnnouncementResponse,
)
from app.core.security import get_current_admin
from app.services.audit import log_activity

router = APIRouter(prefix="/api/announcements", tags=["Announcements"])


@router.get("", response_model=List[AnnouncementResponse])
def get_announcements(db: Session = Depends(get_db)):
    announcements = db.query(Announcement).order_by(Announcement.created_at.desc()).all()
    return announcements


@router.post("", response_model=AnnouncementResponse, status_code=status.HTTP_201_CREATED)
def create_announcement(
    ann_in: AnnouncementCreate,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    ann_data = ann_in.model_dump()
    if not ann_data.get("id"):
        ann_data["id"] = f"ann-{uuid.uuid4().hex[:8]}"

    new_ann = Announcement(**ann_data)
    db.add(new_ann)
    db.commit()
    db.refresh(new_ann)

    log_activity(
        db,
        action="Published Announcement",
        category="announcements",
        target_title=new_ann.text[:40] + "...",
        admin_email=admin["email"],
    )
    return new_ann


@router.put("/{id}", response_model=AnnouncementResponse)
def update_announcement(
    id: str,
    ann_update: AnnouncementUpdate,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    ann = db.query(Announcement).filter(Announcement.id == id).first()
    if not ann:
        raise HTTPException(status_code=404, detail="Announcement not found")

    update_data = ann_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(ann, field, value)

    db.commit()
    db.refresh(ann)

    log_activity(
        db,
        action="Updated Announcement",
        category="announcements",
        target_title=ann.text[:40] + "...",
        admin_email=admin["email"],
    )
    return ann


@router.delete("/{id}", status_code=status.HTTP_200_OK)
def delete_announcement(
    id: str,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    ann = db.query(Announcement).filter(Announcement.id == id).first()
    if not ann:
        raise HTTPException(status_code=404, detail="Announcement not found")

    title = ann.text[:40] + "..."
    db.delete(ann)
    db.commit()

    log_activity(
        db,
        action="Deleted Announcement",
        category="announcements",
        target_title=title,
        admin_email=admin["email"],
    )
    return {"message": "Announcement deleted successfully", "id": id}
