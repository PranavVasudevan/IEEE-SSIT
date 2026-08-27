from typing import Optional, List
from pydantic import BaseModel, ConfigDict
import datetime


class TeamMemberBase(BaseModel):
    name: str
    role: str
    team_type: str = "Office Bearers"
    department: Optional[str] = None
    year: str
    email: Optional[str] = None
    chapter: Optional[str] = "SSIT_2026"
    quote: Optional[str] = None
    photo: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    bio: Optional[str] = None
    order: Optional[int] = 10
    active: Optional[bool] = True


class TeamMemberCreate(TeamMemberBase):
    pass


class TeamMemberUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    team_type: Optional[str] = None
    department: Optional[str] = None
    year: Optional[str] = None
    email: Optional[str] = None
    chapter: Optional[str] = None
    quote: Optional[str] = None
    photo: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    bio: Optional[str] = None
    order: Optional[int] = None
    active: Optional[bool] = None


class TeamMemberResponse(TeamMemberBase):
    id: str
    created_at: Optional[datetime.datetime] = None
    updated_at: Optional[datetime.datetime] = None

    model_config = ConfigDict(from_attributes=True)


class TeamReorderItem(BaseModel):
    id: str
    order: int


class TeamReorderRequest(BaseModel):
    items: List[TeamReorderItem]
