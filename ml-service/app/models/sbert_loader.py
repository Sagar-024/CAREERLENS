import os
from sentence_transformers import SentenceTransformer

# Global model instance
sbert_model = None

def load_sbert():
    """
    Initialize and load the global SBERT model.
    Downloads it from HuggingFace if not available locally.
    """
    global sbert_model
    if sbert_model is None:
        model_name = "all-MiniLM-L6-v2"  # 90MB vs 438MB, fast and accurate
        sbert_model = SentenceTransformer(model_name)
    return sbert_model

def get_sbert_model():
    """Returns the loaded SBERT model instance."""
    if sbert_model is None:
        return load_sbert()
    return sbert_model
