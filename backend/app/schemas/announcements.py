from typing import Optional
from pydantic import BaseModel, ConfigDict
import datetime


class AnnouncementBase(BaseModel):
    text: str
    cta_text: Optional[str] = None
    cta_url: Optional[str] = None
    priority: Optional[str] = "normal"
    status: Optional[str] = "active"
    start_date: Optional[str] = None
    expiry_date: Optional[str] = None
    active: Optional[bool] = True


class AnnouncementCreate(AnnouncementBase):
    pass


class AnnouncementUpdate(BaseModel):
    text: Optional[str] = None
    cta_text: Optional[str] = None
    cta_url: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    start_date: Optional[str] = None
    expiry_date: Optional[str] = None
    active: Optional[bool] = None


class AnnouncementResponse(AnnouncementBase):
    id: str
    created_at: Optional[datetime.datetime] = None
    updated_at: Optional[datetime.datetime] = None

    model_config = ConfigDict(from_attributes=True)
