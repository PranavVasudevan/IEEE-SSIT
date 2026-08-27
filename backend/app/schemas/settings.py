from typing import Any, Dict, Optional
from pydantic import BaseModel, ConfigDict
import datetime


class SettingUpdateRequest(BaseModel):
    value: Dict[str, Any]


class SettingResponse(BaseModel):
    key: str
    value: Dict[str, Any]
    updated_at: Optional[datetime.datetime] = None

    model_config = ConfigDict(from_attributes=True)
