from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from app.api import health, analyze
from app.models.sbert_loader import load_sbert
from app.models.word2vec_loader import load_word2vec
from app.services.skill_extractor import init_spacy

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="CareerLens AI - ML Service",
    description="Backend ML service for resume analysis, skill extraction, and scoring.",
    version="1.0.0"
)

# Configure CORS
origins = os.getenv("ALLOW_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global startup event to load models in memory
@app.on_event("startup")
async def startup_event():
    print("Initializing ML Models...")
    load_sbert()
    load_word2vec()
    init_spacy()
    print("All models loaded successfully.")

# Include routers
app.include_router(health.router, prefix="/api/v1", tags=["health"])
app.include_router(analyze.router, prefix="/api/v1", tags=["analysis"])

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
