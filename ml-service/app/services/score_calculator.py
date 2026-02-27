from typing import Tuple, Dict

def calculate_score(match_results: Dict[str, float]) -> Tuple[float, str]:
    """
    Calculate readiness score based on semantic match results.
    
    Returns:
        float: True percentage readiness match.
        str: Descriptive label.
    """
    if not match_results:
        return 0.0, "Not a Match"
        
    avg_score = sum(match_results.values()) / len(match_results)
    final_score = avg_score * 100
    
    # Generate readiness label based on calculated score
    if final_score >= 80:
        label = "Highly Ready"
    elif final_score >= 60:
        label = "Moderately Ready"
    else:
        label = "Needs Preparation"
        
    return round(final_score, 1), label
