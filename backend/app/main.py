import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.db.database import Base, engine
from app.routers import (
    health,
    team,
    events,
    gallery,
    announcements,
    contact,
    membership,
    newsletter,
    settings as settings_router,
    admins,
    activity_logs,
    storage,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("uvicorn.error")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing database tables...")
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables verified/created successfully.")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")
    yield
    logger.info("Shutting down IEEE SSIT backend service.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="FastAPI Backend for IEEE SSIT SSN Student Branch Portal & CMS",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration
origins = settings.cors_origins
# Ensure localhost:5173 / localhost:3000 are present for dev
for default_origin in ["http://localhost:5173", "http://localhost:8443", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:8443", "http://localhost:8000"]:
    if default_origin not in origins:
        origins.append(default_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error on {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred."},
    )


# Include Routers
app.include_router(health.router)
app.include_router(health.router, prefix="/api")
app.include_router(team.router)
app.include_router(events.router)
app.include_router(gallery.router)
app.include_router(announcements.router)
app.include_router(contact.router)
app.include_router(membership.router)
app.include_router(newsletter.router)
app.include_router(settings_router.router)
app.include_router(admins.router)
app.include_router(activity_logs.router)
app.include_router(storage.router)


@app.get("/")
def root():
    return {
        "message": "IEEE SSIT SSN Student Branch API is running.",
        "docs": "/docs",
        "health": "/health",
    }
