import numpy as np
import pprint
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict, Tuple

from app.models.sbert_loader import get_sbert_model

SIMILARITY_THRESHOLD = 0.75

def match_skills(resume_skills: set, jd_skills: set) -> Dict[str, float]:
    """
    Match resume skills to JD skills using SBERT semantic embeddings and cosine similarity.
    
    Returns:
        Dict[str, float]: Mapping of matched JD skill to similarity score (0-1).
    """
    model = get_sbert_model()
    
    if not jd_skills or not resume_skills:
        return {}
        
    jd_skills_list = list(jd_skills)
    resume_skills_list = list(resume_skills)
    
    try:
        # Encode skills
        jd_embeddings = model.encode(jd_skills_list)
        resume_embeddings = model.encode(resume_skills_list)
        
        # Calculate cosine similarity matrix
        similarity_matrix = cosine_similarity(jd_embeddings, resume_embeddings)
        
        match_results = {}
        
        # For each JD skill, find the best matching resume skill
        for i, jd_skill in enumerate(jd_skills_list):
            best_match_idx = np.argmax(similarity_matrix[i])
            best_score = float(similarity_matrix[i][best_match_idx])
            
            # If the best score exceeds our semantic threshold, it's a match
            if best_score >= SIMILARITY_THRESHOLD:
                match_results[jd_skill] = best_score
                
        return match_results
        
    except Exception as e:
        print(f"Error in semantic matching: {str(e)}")
        # Fallback to exact string matching if SBERT fails
        match_results = {}
        resume_lower = [s.lower() for s in resume_skills]
        for skill in jd_skills:
            if skill.lower() in resume_lower:
                match_results[skill] = 1.0
        return match_results
