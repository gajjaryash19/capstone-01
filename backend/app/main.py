from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.core.config import settings
from backend.app.core.logging import configure_logging, get_logger
from backend.app.core.exceptions import handle_unhandled_exception

configure_logging()
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Application startup: %s", settings.app_name)
    yield


app = FastAPI(
    title=settings.app_name,
    description=settings.app_description,
    version=settings.app_version,
    lifespan=lifespan,
)

app.add_exception_handler(Exception, handle_unhandled_exception)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    logger.info("Root endpoint accessed")
    return {"message": f"{settings.app_name} is running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/api/v1/system")
def system_info():
    return {
        "app_name": settings.app_name,
        "version": settings.app_version,
        "status": "healthy",
    }
