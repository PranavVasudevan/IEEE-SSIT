import logging
import httpx
from typing import Optional
from app.core.config import settings
from app.storage.base import StorageProvider

logger = logging.getLogger("uvicorn.error")


class SupabaseStorageProvider(StorageProvider):
    def __init__(self):
        self.supabase_url = settings.SUPABASE_URL.rstrip("/")
        self.service_role_key = settings.SUPABASE_SERVICE_ROLE_KEY
        self.bucket = settings.SUPABASE_BUCKET

    def upload_file(
        self,
        file_data: bytes,
        destination_path: str,
        content_type: Optional[str] = None
    ) -> str:
        clean_path = destination_path.lstrip("/")
        endpoint = f"{self.supabase_url}/storage/v1/object/{self.bucket}/{clean_path}"
        
        headers = {
            "Authorization": f"Bearer {self.service_role_key}",
            "apikey": self.service_role_key,
            "Content-Type": content_type or "application/octet-stream",
            "x-upsert": "true",
        }
        
        try:
            with httpx.Client(timeout=30.0) as client:
                response = client.post(endpoint, content=file_data, headers=headers)
                if response.status_code not in (200, 201):
                    logger.error(f"Supabase storage upload error: {response.status_code} - {response.text}")
                    # If bucket doesn't exist, attempt to auto-create or log clear message
                    if "Bucket not found" in response.text:
                        self._create_bucket_if_missing()
                        # Retry upload once
                        response = client.post(endpoint, content=file_data, headers=headers)
                        response.raise_for_status()
                    else:
                        response.raise_for_status()
            
            return self.get_public_url(clean_path)
        except Exception as e:
            logger.error(f"Failed to upload to Supabase Storage: {e}")
            raise

    def delete_file(self, file_path: str) -> bool:
        clean_path = file_path.lstrip("/")
        # If full URL was passed, extract relative bucket path
        if self.supabase_url in clean_path:
            prefix = f"{self.supabase_url}/storage/v1/object/public/{self.bucket}/"
            if clean_path.startswith(prefix):
                clean_path = clean_path[len(prefix):]

        endpoint = f"{self.supabase_url}/storage/v1/object/{self.bucket}/{clean_path}"
        headers = {
            "Authorization": f"Bearer {self.service_role_key}",
            "apikey": self.service_role_key,
        }
        try:
            with httpx.Client(timeout=15.0) as client:
                res = client.delete(endpoint, headers=headers)
                return res.status_code in (200, 204)
        except Exception as e:
            logger.warn(f"Failed to delete file from Supabase Storage: {e}")
            return False

    def get_public_url(self, file_path: str) -> str:
        clean_path = file_path.lstrip("/")
        if clean_path.startswith("http://") or clean_path.startswith("https://"):
            return clean_path
        return f"{self.supabase_url}/storage/v1/object/public/{self.bucket}/{clean_path}"

    def _create_bucket_if_missing(self):
        endpoint = f"{self.supabase_url}/storage/v1/bucket"
        headers = {
            "Authorization": f"Bearer {self.service_role_key}",
            "apikey": self.service_role_key,
            "Content-Type": "application/json",
        }
        payload = {
            "id": self.bucket,
            "name": self.bucket,
            "public": True,
        }
        try:
            with httpx.Client(timeout=15.0) as client:
                res = client.post(endpoint, json=payload, headers=headers)
                logger.info(f"Auto-created bucket '{self.bucket}': {res.status_code}")
        except Exception as e:
            logger.warn(f"Bucket auto-creation attempt: {e}")


def get_storage_service() -> StorageProvider:
    return SupabaseStorageProvider()
