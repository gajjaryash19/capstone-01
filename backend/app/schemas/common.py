from datetime import datetime, timezone

from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str


class SystemResponse(BaseModel):
    app_name: str
    version: str
    status: str


class ErrorResponse(BaseModel):
    detail: str


class APIResponse(BaseModel):
    success: bool
    message: str
    timestamp: datetime

    @classmethod
    def create(cls, message: str) -> "APIResponse":
        return cls(
            success=True,
            message=message,
            timestamp=datetime.now(timezone.utc),
        )