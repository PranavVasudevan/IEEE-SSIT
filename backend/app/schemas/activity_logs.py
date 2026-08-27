from typing import Optional
from pydantic import BaseModel, ConfigDict
import datetime


class ActivityLogCreate(BaseModel):
    action: str
    category: str
    target_title: Optional[str] = None
    details: Optional[str] = None


class ActivityLogResponse(BaseModel):
    id: str
    action: str
    category: str
    target_title: Optional[str] = None
    admin_email: str
    timestamp_str: Optional[str] = None
    details: Optional[str] = None
    created_at: Optional[datetime.datetime] = None

    model_config = ConfigDict(from_attributes=True)
