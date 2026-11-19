from fastapi import APIRouter

from backend.app.core.config import settings
from backend.app.schemas.common import SystemResponse

router = APIRouter(tags=["System"])


@router.get("/system", response_model=SystemResponse)
def system_info():
    return SystemResponse(
        app_name=settings.app_name,
        version=settings.app_version,
        status="running",
    )