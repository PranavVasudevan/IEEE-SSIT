from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict
import datetime


class ContactInquiryCreate(BaseModel):
    name: str
    email: str
    department: Optional[str] = None
    year: Optional[str] = None
    type: Optional[str] = "general"
    interest: Optional[str] = None
    ieee_member: Optional[str] = None
    ssit_member: Optional[str] = None
    message: str


class ContactInquiryStatusUpdate(BaseModel):
    status: str


class ContactInquiryResponse(BaseModel):
    id: str
    name: str
    email: str
    department: Optional[str] = None
    year: Optional[str] = None
    inquiry_type: Optional[str] = "general"
    interest: Optional[str] = None
    ieee_member: Optional[str] = None
    ssit_member: Optional[str] = None
    message: str
    status: str
    created_at: Optional[datetime.datetime] = None
    updated_at: Optional[datetime.datetime] = None

    model_config = ConfigDict(from_attributes=True)
