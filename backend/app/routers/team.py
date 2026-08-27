import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import TeamMember
from app.schemas.team import (
    TeamMemberCreate,
    TeamMemberUpdate,
    TeamMemberResponse,
    TeamReorderRequest,
)
from app.core.security import get_current_admin
from app.services.audit import log_activity
from app.storage.supabase_storage import get_storage_service

router = APIRouter(prefix="/api/team", tags=["Team"])


@router.get("", response_model=List[TeamMemberResponse])
def get_team_members(db: Session = Depends(get_db)):
    members = db.query(TeamMember).order_by(TeamMember.order.asc(), TeamMember.created_at.asc()).all()
    return members


@router.get("/{id}", response_model=TeamMemberResponse)
def get_team_member(id: str, db: Session = Depends(get_db)):
    member = db.query(TeamMember).filter(TeamMember.id == id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")
    return member


@router.post("", response_model=TeamMemberResponse, status_code=status.HTTP_201_CREATED)
def create_team_member(
    member_in: TeamMemberCreate,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    member_data = member_in.model_dump()
    if not member_data.get("id"):
        member_data["id"] = f"team-{uuid.uuid4().hex[:8]}"

    new_member = TeamMember(**member_data)
    db.add(new_member)
    db.commit()
    db.refresh(new_member)

    log_activity(
        db,
        action="Added Team Member",
        category="team",
        target_title=f"{new_member.name} ({new_member.role})",
        admin_email=admin["email"],
        details=f"Team Type: {new_member.team_type}, Year: {new_member.year}",
    )
    return new_member


@router.post("/reorder", status_code=status.HTTP_200_OK)
@router.put("/reorder", status_code=status.HTTP_200_OK)
def reorder_team_members(
    reorder_in: TeamReorderRequest,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    for item in reorder_in.items:
        db.query(TeamMember).filter(TeamMember.id == item.id).update({"order": item.order})
    db.commit()

    log_activity(
        db,
        action="Reordered Team Members",
        category="team",
        target_title="Team Directory",
        admin_email=admin["email"],
        details=f"Updated order for {len(reorder_in.items)} members",
    )
    return {"message": "Team order updated successfully"}




@router.put("/{id}", response_model=TeamMemberResponse)
def update_team_member(
    id: str,
    member_update: TeamMemberUpdate,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    member = db.query(TeamMember).filter(TeamMember.id == id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")

    update_data = member_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(member, field, value)

    db.commit()
    db.refresh(member)

    log_activity(
        db,
        action="Updated Team Member",
        category="team",
        target_title=f"{member.name} ({member.role})",
        admin_email=admin["email"],
        details=f"Updated fields: {list(update_data.keys())}",
    )
    return member


@router.delete("/{id}", status_code=status.HTTP_200_OK)
def delete_team_member(
    id: str,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    member = db.query(TeamMember).filter(TeamMember.id == id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")

    title = f"{member.name} ({member.role})"
    db.delete(member)
    db.commit()

    log_activity(
        db,
        action="Removed Team Member",
        category="team",
        target_title=title,
        admin_email=admin["email"],
    )
    return {"message": "Team member deleted successfully", "id": id}


@router.post("/{id}/photo", response_model=TeamMemberResponse)
async def upload_team_member_photo(
    id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    member = db.query(TeamMember).filter(TeamMember.id == id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")

    storage = get_storage_service()
    content = await file.read()
    filename = f"{id}_{file.filename}"
    storage_path = f"team/{filename}"

    public_url = storage.upload_file(content, storage_path, file.content_type)
    member.photo = public_url
    db.commit()
    db.refresh(member)

    log_activity(
        db,
        action="Updated Team Member Photo",
        category="team",
        target_title=f"{member.name} ({member.role})",
        admin_email=admin["email"],
    )
    return member
