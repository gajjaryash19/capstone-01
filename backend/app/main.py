from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.core.config import settings
from backend.app.core.logging import configure_logging, get_logger
from backend.app.core.exceptions import handle_unhandled_exception
from backend.app.api.routes.health import router as health_router
from backend.app.api.router import api_router

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

app.include_router(api_router, prefix="/api/v1")

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

<<<<<<< HEAD

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
=======
app.include_router(health_router)
>>>>>>> 18b234ce9e85a5a8a9a3c89894d51ed2746c8050
