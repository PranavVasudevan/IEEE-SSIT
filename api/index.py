import os
import sys

# Add the backend directory to Python sys.path so app modules import cleanly
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.abspath(os.path.join(current_dir, "..", "backend"))

if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Import the FastAPI application instance for Vercel Python Runtime
from app.main import app

# Automatically sync remote database schema & canonical team data on cold start
try:
    from seed import seed_database
    seed_database()
except Exception as e:
    import logging
    logging.getLogger("uvicorn.error").warning(f"Vercel auto-seed sync check: {e}")
