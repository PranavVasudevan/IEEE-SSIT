from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import ChapterSetting
from app.schemas.settings import SettingUpdateRequest, SettingResponse
from app.core.security import get_current_admin
from app.services.audit import log_activity

router = APIRouter(prefix="/api/settings", tags=["Settings"])


@router.get("/{key}", response_model=SettingResponse)
def get_setting(key: str, db: Session = Depends(get_db)):
    setting = db.query(ChapterSetting).filter(ChapterSetting.key == key).first()
    if not setting:
        raise HTTPException(status_code=404, detail=f"Setting '{key}' not found")
    return setting


@router.put("/{key}", response_model=SettingResponse)
def update_setting(
    key: str,
    req: SettingUpdateRequest,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    setting = db.query(ChapterSetting).filter(ChapterSetting.key == key).first()
    if not setting:
        setting = ChapterSetting(key=key, value=req.value)
        db.add(setting)
    else:
        setting.value = req.value

    db.commit()
    db.refresh(setting)

    log_activity(
        db,
        action="Updated Settings",
        category="settings",
        target_title=key,
        admin_email=admin["email"],
    )
    return setting
