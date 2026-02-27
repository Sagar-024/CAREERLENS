from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional, Dict, Any

from app.services import (
    pdf_parser,
    skill_extractor,
    semantic_matcher,
    score_calculator,
    gap_analyzer,
    shap_explainer,
    course_recommender
)

router = APIRouter()

@router.post("/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    jd_text: str = Form(...),
    user_id: Optional[str] = Form(None)
):
    try:
        # 1. Parse PDF
        if not resume.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are supported")
            
        pdf_content = await resume.read()
        resume_text = pdf_parser.extract_text(pdf_content)
        
        # 2. Extract Skills
        resume_skills = skill_extractor.extract_skills(resume_text)
        jd_skills = skill_extractor.extract_skills(jd_text)
        
        # 3. Semantic Match
        match_results = semantic_matcher.match_skills(resume_skills, jd_skills)
        
        # 4. Calculate Score
        final_score, readiness_label = score_calculator.calculate_score(match_results)
        
        # 5. Gap Analysis
        missing_skills = gap_analyzer.identify_gaps(jd_skills, match_results)
        
        # 6. SHAP Explanations
        explanations = shap_explainer.generate_explanations(match_results, missing_skills)
        
        # 7. Course Recommendations
        courses = course_recommender.recommend_courses(missing_skills)
        
        # Prepare response
        return {
            "status": "success",
            "final_score": final_score,
            "readiness_label": readiness_label,
            "resume_skills": resume_skills,
            "jd_skills": jd_skills,
            "matched_skills": list(match_results.keys()),
            "missing_skills": missing_skills,
            "explanations": explanations,
            "courses": courses,
            "metadata": {
                "user_id": user_id,
                "resume_char_count": len(resume_text),
                "jd_char_count": len(jd_text)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
