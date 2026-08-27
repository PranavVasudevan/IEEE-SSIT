from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import ActivityLog
from app.schemas.activity_logs import ActivityLogResponse
from app.core.security import get_current_admin

router = APIRouter(prefix="/api/activity-logs", tags=["Activity Logs"])


@router.get("", response_model=List[ActivityLogResponse])
def get_activity_logs(
    limit: int = 50,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    logs = db.query(ActivityLog).order_by(ActivityLog.created_at.desc()).limit(limit).all()
    return logs
