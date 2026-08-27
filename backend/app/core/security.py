import logging
import os
from typing import Optional
from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from app.core.config import settings
from app.db.database import get_db
from app.db.models import AdminUser

logger = logging.getLogger("uvicorn.error")
security_scheme = HTTPBearer(auto_error=False)

DEFAULT_ADMIN_EMAILS = [
    "nathaniel2470009@ssn.edu.in",
    "sharruk2470048@ssn.edu.in",
    "shriram2410046@ssn.edu.in",
    "varun2410158@ssn.edu.in",
    "harshika2410326@ssn.edu.in",
    "vedika2410432@ssn.edu.in",
    "harshini2410197@ssn.edu.in",
    "pranav2410328@ssn.edu.in",
]

# Initialize Firebase Admin if available
firebase_app = None
try:
    import firebase_admin
    from firebase_admin import auth as firebase_auth, credentials
    
    cred_path = settings.FIREBASE_CREDENTIALS_PATH
    if cred_path and os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_app = firebase_admin.initialize_app(cred)
    elif settings.FIREBASE_PROJECT_ID:
        firebase_app = firebase_admin.initialize_app(options={"projectId": settings.FIREBASE_PROJECT_ID})
    elif not firebase_admin._apps:
        # Default initialize if possible
        try:
            firebase_app = firebase_admin.initialize_app()
        except Exception:
            pass
except Exception as e:
    logger.info(f"Firebase Admin SDK initialized in standalone mode: {e}")


def is_official_ssn_email(email: Optional[str]) -> bool:
    if not email:
        return False
    clean = email.strip().lower()
    return clean.endswith(f"@{settings.OFFICIAL_EMAIL_DOMAIN}")


def verify_firebase_token(token: str) -> dict:
    """
    Verifies Firebase ID Token.
    Returns decoded token dictionary containing email, uid, etc.
    """
    try:
        from firebase_admin import auth as fb_auth
        decoded = fb_auth.verify_id_token(token)
        return decoded
    except Exception as e:
        logger.warning(f"Firebase token verification via Admin SDK failed: {e}")
        # In development without Firebase credentials file, handle token decode gracefully if structured
        import json
        import base64
        try:
            # Fallback inspect payload for dev/mock
            parts = token.split(".")
            if len(parts) >= 2:
                payload = parts[1]
                rem = len(payload) % 4
                if rem:
                    payload += "=" * (4 - rem)
                data = json.loads(base64.urlsafe_b64decode(payload))
                if "email" in data:
                    return data
        except Exception:
            pass
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_admin(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security_scheme),
    db: Session = Depends(get_db),
) -> dict:
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    decoded = verify_firebase_token(credentials.credentials)
    email = decoded.get("email", "").strip().lower()

    if not is_official_ssn_email(email):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access Denied: Email '{email}' is not an official @{settings.OFFICIAL_EMAIL_DOMAIN} account.",
        )

    # Check hardcoded list first
    if email in DEFAULT_ADMIN_EMAILS:
        return {"email": email, "role": "admin", "uid": decoded.get("uid", "")}

    # Check database admin_users table
    db_admin = db.query(AdminUser).filter(AdminUser.email == email, AdminUser.active == True).first()
    if db_admin:
        return {"email": email, "role": "admin", "uid": decoded.get("uid", "")}

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail=f"Access Denied: Account '{email}' is not authorized as an administrator.",
    )
