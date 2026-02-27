from typing import Tuple, Dict, List

def calculate_score(
    match_results: Dict[str, float],
    total_jd_skills: int = 0
) -> Tuple[float, str]:
    """
    Calculate readiness score based on how many JD skills were matched.
    
    The score is the ratio of matched skills to total JD skills,
    weighted by the quality (similarity) of each match.
    
    Args:
        match_results: Mapping of matched JD skill → similarity score (0-1).
        total_jd_skills: Total number of skills extracted from the JD.
        
    Returns:
        float: Percentage readiness score (0-100).
        str: Descriptive label.
    """
    if not match_results or total_jd_skills <= 0:
        return 0.0, "Not a Match"
    
    # Sum of weighted similarity scores for matched skills
    weighted_match_sum = sum(match_results.values())
    
    # Score = (sum of match qualities) / (total JD skills) * 100
    # This penalizes both missing skills AND low-quality matches
    final_score = (weighted_match_sum / total_jd_skills) * 100
    
    # Clamp to 0-100
    final_score = max(0.0, min(100.0, final_score))
    
    # Generate readiness label
    if final_score >= 80:
        label = "Highly Ready"
    elif final_score >= 60:
        label = "Moderately Ready"
    elif final_score >= 40:
        label = "Needs Improvement"
    else:
        label = "Not a Match"
        
    return round(final_score, 1), label
