from typing import Optional
from pydantic import BaseModel, ConfigDict
import datetime


class AdminAddRequest(BaseModel):
    email: str


class AdminUserResponse(BaseModel):
    id: str
    email: str
    added_by: Optional[str] = "System Lead"
    active: bool = True
    created_at: Optional[datetime.datetime] = None

    model_config = ConfigDict(from_attributes=True)
