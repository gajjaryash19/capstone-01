from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.core.config import settings
from backend.app.core.logging import configure_logging, get_logger

from backend.app.core.exceptions import handle_unhandled_exception

configure_logging()
logger = get_logger(__name__)

app = FastAPI(
    title=settings.app_name,
    description=settings.app_description,
    version=settings.app_version,
)

app.add_exception_handler(Exception, handle_unhandled_exception)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    logger.info("Application startup: %s", settings.app_name)


@app.get("/")
def root():
    logger.info("Root endpoint accessed")
    return {"message": f"{settings.app_name} is running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}