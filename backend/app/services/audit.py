import datetime
from sqlalchemy.orm import Session
from app.db.models import ActivityLog


def log_activity(
    db: Session,
    action: str,
    category: str,
    target_title: str = "",
    admin_email: str = "System Admin",
    details: str = "",
):
    try:
        now = datetime.datetime.utcnow()
        timestamp_str = f"{now.strftime('%Y-%m-%d %H:%M')}"
        log_entry = ActivityLog(
            action=action,
            category=category,
            target_title=target_title,
            admin_email=admin_email,
            timestamp_str=timestamp_str,
            details=details,
            created_at=now,
        )
        db.add(log_entry)
        db.commit()
    except Exception as e:
        db.rollback()
