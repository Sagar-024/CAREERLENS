from typing import Dict, List, Set

def identify_gaps(jd_skills: List[str], match_results: Dict[str, float]) -> List[str]:
    """
    Identify skills required by JD but missing from the resume.
    
    Args:
        jd_skills (List[str]): All skills extracted from Job Description.
        match_results (Dict[str, float]): Skills that met the semantic threshold.
        
    Returns:
        List[str]: List of missing skills.
    """
    matched_set = set(match_results.keys())
    jd_set = set(jd_skills)
    
    # Simple set difference
    missing = jd_set - matched_set
    
    return sorted(list(missing))
