from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
async def health_check():
    return {
        "status": "online",
        "service": "CareerLens ML Engine",
        "models_loaded": True
    }
