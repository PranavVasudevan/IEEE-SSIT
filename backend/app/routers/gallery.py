import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import GalleryPhoto
from app.schemas.gallery import (
    GalleryPhotoCreate,
    GalleryPhotoUpdate,
    GalleryPhotoResponse,
)
from app.core.security import get_current_admin
from app.services.audit import log_activity

router = APIRouter(prefix="/api/gallery", tags=["Gallery"])


@router.get("", response_model=List[GalleryPhotoResponse])
def get_gallery_photos(db: Session = Depends(get_db)):
    photos = db.query(GalleryPhoto).order_by(GalleryPhoto.order.asc(), GalleryPhoto.created_at.desc()).all()
    return photos


@router.post("", response_model=GalleryPhotoResponse, status_code=status.HTTP_201_CREATED)
def create_gallery_photo(
    photo_in: GalleryPhotoCreate,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    photo_data = photo_in.model_dump()
    if not photo_data.get("id"):
        photo_data["id"] = f"gal-{uuid.uuid4().hex[:8]}"

    new_photo = GalleryPhoto(**photo_data)
    db.add(new_photo)
    db.commit()
    db.refresh(new_photo)

    log_activity(
        db,
        action="Added Gallery Photo",
        category="gallery",
        target_title=new_photo.label,
        admin_email=admin["email"],
        details=f"Category: {new_photo.category}",
    )
    return new_photo


@router.put("/{id}", response_model=GalleryPhotoResponse)
def update_gallery_photo(
    id: str,
    photo_update: GalleryPhotoUpdate,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    photo = db.query(GalleryPhoto).filter(GalleryPhoto.id == id).first()
    if not photo:
        raise HTTPException(status_code=404, detail="Gallery photo not found")

    update_data = photo_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(photo, field, value)

    db.commit()
    db.refresh(photo)

    log_activity(
        db,
        action="Updated Gallery Photo",
        category="gallery",
        target_title=photo.label,
        admin_email=admin["email"],
    )
    return photo


@router.delete("/{id}", status_code=status.HTTP_200_OK)
def delete_gallery_photo(
    id: str,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    photo = db.query(GalleryPhoto).filter(GalleryPhoto.id == id).first()
    if not photo:
        raise HTTPException(status_code=404, detail="Gallery photo not found")

    label = photo.label
    db.delete(photo)
    db.commit()

    log_activity(
        db,
        action="Deleted Gallery Photo",
        category="gallery",
        target_title=label,
        admin_email=admin["email"],
    )
    return {"message": "Gallery photo deleted successfully", "id": id}
