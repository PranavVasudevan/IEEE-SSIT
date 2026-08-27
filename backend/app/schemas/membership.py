from typing import Optional
from pydantic import BaseModel, ConfigDict
import datetime


class MembershipApplicationCreate(BaseModel):
    name: str
    register_number: str
    email: str
    phone: str
    department: str
    year: str
    ieee_membership_number: Optional[str] = None
    vertical_choice_1: Optional[str] = None
    why_suitable_1: Optional[str] = None
    vertical_choice_2: Optional[str] = None
    why_suitable_2: Optional[str] = None
    vertical_choice_3: Optional[str] = None
    why_suitable_3: Optional[str] = None
    past_experience: Optional[str] = None
    how_you_support: Optional[str] = None
    proof_file_url: Optional[str] = None


class MembershipApplicationStatusUpdate(BaseModel):
    status: str


class MembershipApplicationResponse(MembershipApplicationCreate):
    id: str
    status: str
    created_at: Optional[datetime.datetime] = None
    updated_at: Optional[datetime.datetime] = None

    model_config = ConfigDict(from_attributes=True)
