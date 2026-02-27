import json
import os
from typing import List, Dict

def load_courses() -> List[Dict]:
    """Load mock course catalog."""
    course_file = os.path.join(os.path.dirname(__file__), '../../data/course_mapping.json')
    try:
        with open(course_file, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        # Fallback catalog
        return [
            {
                "skill": "machine learning",
                "title": "Machine Learning Specialization",
                "platform": "Coursera",
                "link": "https://coursera.org",
                "level": "Intermediate",
                "duration": "4 weeks"
            },
            {
                "skill": "python",
                "title": "100 Days of Code: Complete Python Bootcamp",
                "platform": "Udemy",
                "link": "https://udemy.com",
                "level": "Beginner",
                "duration": "100 days"
            },
             {
                "skill": "docker",
                "title": "Docker for Absolute Beginners",
                "platform": "Coursera",
                "link": "https://coursera.org",
                "level": "Beginner",
                "duration": "2 weeks"
            },
            {
                "skill": "aws",
                "title": "AWS Certified Solutions Architect",
                "platform": "A Cloud Guru",
                "link": "https://acloudguru.com",
                "level": "Advanced",
                "duration": "8 weeks"
            }
        ]

def recommend_courses(missing_skills: List[str]) -> List[Dict]:
    """
    Recommend courses based on missing skills.
    Args:
        missing_skills (List[str]): Extracted gap skills.
        
    Returns:
        List[Dict]: Top 3 recommended courses.
    """
    catalog = load_courses()
    recommendations = []
    
    # Very loose matching for mock purposes
    for skill in missing_skills:
        skill_lower = skill.lower()
        for course in catalog:
            if course["skill"].lower() in skill_lower or skill_lower in course["skill"].lower():
                recommendations.append(course)
                # Just one course per missing skill for simplicity
                break
                
        # Limit to 3 total recommendations
        if len(recommendations) >= 3:
            break
            
    return recommendations
