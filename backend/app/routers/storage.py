import uuid
import re
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query, status
from app.schemas.storage import FileUploadResponse
from app.core.security import get_current_admin
from app.storage.supabase_storage import get_storage_service
from app.core.config import settings

router = APIRouter(prefix="/api/storage", tags=["Storage"])


def sanitize_filename(name: str) -> str:
    name = re.sub(r"[^\w\.-]", "_", name)
    return name


@router.post("/upload", response_model=FileUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_asset(
    file: UploadFile = File(...),
    folder: str = Query("general", pattern="^(team|gallery|events|branding|applications|general)$"),
    admin: dict = Depends(get_current_admin),
):
    try:
        content = await file.read()
        if len(content) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File size exceeds maximum 10MB limit.")

        safe_name = sanitize_filename(file.filename or "upload.png")
        unique_name = f"{uuid.uuid4().hex[:8]}_{safe_name}"
        destination_path = f"{folder}/{unique_name}"

        storage = get_storage_service()
        public_url = storage.upload_file(
            file_data=content,
            destination_path=destination_path,
            content_type=file.content_type,
        )

        return FileUploadResponse(
            url=public_url,
            path=destination_path,
            filename=unique_name,
            bucket=settings.SUPABASE_BUCKET,
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload asset: {str(e)}")
