import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Event
from app.schemas.events import (
    EventCreate,
    EventUpdate,
    EventResponse,
)
from app.core.security import get_current_admin
from app.services.audit import log_activity

router = APIRouter(prefix="/api/events", tags=["Events"])


@router.get("", response_model=List[EventResponse])
def get_events(db: Session = Depends(get_db)):
    events = db.query(Event).order_by(Event.created_at.desc()).all()
    return events


@router.get("/{id}", response_model=EventResponse)
def get_event(id: str, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@router.post("", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
def create_event(
    event_in: EventCreate,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    event_data = event_in.model_dump()
    if not event_data.get("id"):
        event_data["id"] = f"ev-{uuid.uuid4().hex[:8]}"

    new_event = Event(**event_data)
    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    log_activity(
        db,
        action="Created Event",
        category="events",
        target_title=new_event.title,
        admin_email=admin["email"],
        details=f"Category: {new_event.category}, Mode: {new_event.mode}, Date: {new_event.date}",
    )
    return new_event


@router.put("/{id}", response_model=EventResponse)
def update_event(
    id: str,
    event_update: EventUpdate,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    event = db.query(Event).filter(Event.id == id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    update_data = event_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(event, field, value)

    db.commit()
    db.refresh(event)

    log_activity(
        db,
        action="Updated Event",
        category="events",
        target_title=event.title,
        admin_email=admin["email"],
        details=f"Updated: {list(update_data.keys())}",
    )
    return event


@router.delete("/{id}", status_code=status.HTTP_200_OK)
def delete_event(
    id: str,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    event = db.query(Event).filter(Event.id == id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    title = event.title
    db.delete(event)
    db.commit()

    log_activity(
        db,
        action="Deleted Event",
        category="events",
        target_title=title,
        admin_email=admin["email"],
    )
    return {"message": "Event deleted successfully", "id": id}


@router.post("/{id}/duplicate", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
def duplicate_event(
    id: str,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    event = db.query(Event).filter(Event.id == id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    cloned_id = f"ev-{uuid.uuid4().hex[:8]}"
    cloned_event = Event(
        id=cloned_id,
        title=f"{event.title} (Copy)",
        category=event.category,
        date=event.date,
        start_time=event.start_time,
        end_time=event.end_time,
        time=event.time,
        location=event.location,
        mode=event.mode,
        description=event.description,
        image=event.image,
        register_url=event.register_url,
        external_url=event.external_url,
        speaker=event.speaker,
        speaker_role=event.speaker_role,
        deadline=event.deadline,
        featured=False,
        status="upcoming",
        published=True,
    )
    db.add(cloned_event)
    db.commit()
    db.refresh(cloned_event)

    log_activity(
        db,
        action="Duplicated Event",
        category="events",
        target_title=cloned_event.title,
        admin_email=admin["email"],
    )
    return cloned_event
