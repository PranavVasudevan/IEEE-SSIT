from typing import Optional
from pydantic import BaseModel, ConfigDict
import datetime


class GalleryPhotoBase(BaseModel):
    url: str
    alt: Optional[str] = None
    label: str
    caption: Optional[str] = None
    event_name: Optional[str] = None
    category: Optional[str] = "Workshop"
    date: Optional[str] = None
    featured: Optional[bool] = False
    order: Optional[int] = 1


class GalleryPhotoCreate(GalleryPhotoBase):
    pass


class GalleryPhotoUpdate(BaseModel):
    url: Optional[str] = None
    alt: Optional[str] = None
    label: Optional[str] = None
    caption: Optional[str] = None
    event_name: Optional[str] = None
    category: Optional[str] = None
    date: Optional[str] = None
    featured: Optional[bool] = None
    order: Optional[int] = None


class GalleryPhotoResponse(GalleryPhotoBase):
    id: str
    created_at: Optional[datetime.datetime] = None
    updated_at: Optional[datetime.datetime] = None

    model_config = ConfigDict(from_attributes=True)
