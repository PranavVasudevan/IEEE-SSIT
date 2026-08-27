from pydantic import BaseModel, EmailStr, ConfigDict
import datetime
from typing import Optional


class NewsletterSubscribeRequest(BaseModel):
    email: str


class NewsletterSubscriberResponse(BaseModel):
    id: str
    email: str
    created_at: Optional[datetime.datetime] = None

    model_config = ConfigDict(from_attributes=True)
