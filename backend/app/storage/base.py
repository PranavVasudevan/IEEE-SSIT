from abc import ABC, abstractmethod
from typing import Optional, BinaryIO


class StorageProvider(ABC):
    @abstractmethod
    def upload_file(
        self,
        file_data: bytes,
        destination_path: str,
        content_type: Optional[str] = None
    ) -> str:
        """
        Uploads file data to the given destination path.
        Returns the public URL or accessible path to the uploaded file.
        """
        pass

    @abstractmethod
    def delete_file(self, file_path: str) -> bool:
        """
        Deletes the file at file_path.
        """
        pass

    @abstractmethod
    def get_public_url(self, file_path: str) -> str:
        """
        Returns the publicly accessible URL for the given path.
        """
        pass
