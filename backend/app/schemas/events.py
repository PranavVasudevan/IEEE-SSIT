from typing import Optional
from pydantic import BaseModel, ConfigDict
import datetime


class EventBase(BaseModel):
    title: str
    category: str = "Workshop"
    date: str
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    time: Optional[str] = None
    location: str = "SSN College of Engineering"
    mode: str = "In-Person"
    description: str
    image: Optional[str] = None
    register_url: Optional[str] = None
    external_url: Optional[str] = None
    speaker: Optional[str] = None
    speaker_role: Optional[str] = None
    deadline: Optional[str] = None
    featured: Optional[bool] = False
    status: Optional[str] = "upcoming"
    published: Optional[bool] = True


class EventCreate(EventBase):
    pass


class EventUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    date: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    time: Optional[str] = None
    location: Optional[str] = None
    mode: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    register_url: Optional[str] = None
    external_url: Optional[str] = None
    speaker: Optional[str] = None
    speaker_role: Optional[str] = None
    deadline: Optional[str] = None
    featured: Optional[bool] = None
    status: Optional[str] = None
    published: Optional[bool] = None


class EventResponse(EventBase):
    id: str
    created_at: Optional[datetime.datetime] = None
    updated_at: Optional[datetime.datetime] = None

    model_config = ConfigDict(from_attributes=True)
