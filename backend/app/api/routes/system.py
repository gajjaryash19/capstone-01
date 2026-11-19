from fastapi import APIRouter

from backend.app.core.config import settings

router = APIRouter(tags=["System"])

@router.get("/system")
def system_info():
    return {
        "app_name": settings.app_name,
        "version": settings.app_version,
        "status": "running",
    }
