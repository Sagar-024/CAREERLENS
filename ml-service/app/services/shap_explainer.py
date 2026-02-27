from typing import Dict, List

def generate_explanations(match_results: Dict[str, float], missing_skills: List[str]) -> Dict[str, float]:
    """
    Generate mock SHAP-like explanations for the score.
    In a real ML pipeline, this would use the shap library to explain 
    a trained classifier's prediction based on the features (skills).
    
    Args:
        match_results (Dict[str, float]): Matched skills and similarity.
        missing_skills (List[str]): Missing JD skills.
        
    Returns:
        Dict[str, float]: Skill name mapped to impact percentage (+ve or -ve).
    """
    explanations = {}
    
    # Positive impacts from strong matches
    for skill, score in match_results.items():
        # Higher score = higher positive impact
        impact = round((score * 10) + 5, 1)  # Mock calculation
        explanations[skill] = impact
        
    # Negative impacts from missing skills
    for skill in missing_skills:
        # Crucial skills (mocked randomly here) might have higher negative impact
        impact = round(-8.5, 1)  # Mock negative calculation
        explanations[f"Missing: {skill}"] = impact
        
    # Sort by absolute impact to find top influencers
    sorted_exp = dict(sorted(explanations.items(), key=lambda item: abs(item[1]), reverse=True))
    
    # Return top 10 factors
    return dict(list(sorted_exp.items())[:10])
