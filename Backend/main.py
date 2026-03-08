from fastapi import FastAPI, BackgroundTasks, HTTPException, Form, UploadFile, File
from contextlib import asynccontextmanager
import spacy
from sentence_transformers import SentenceTransformer
import uvicorn
import asyncer
import os
import requests
import asyncio

# =============================================================================
# THE SINGLETON STATE
# =============================================================================
ml_models = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Booting up CareerLens AI Engine...")
    print("📦 Loading NLP Models into RAM (This happens exactly ONCE)...")
    
    # 1. Load spaCy
    ml_models["spacy_nlp"] = spacy.load("en_core_web_lg")
    
    # 2. Load SBERT
    ml_models["sbert"] = SentenceTransformer('all-MiniLM-L6-v2')
    
    print("✅ Models loaded successfully. Server is ready to accept traffic.")
    yield
    print("🛑 Shutting down. Clearing memory...")
    ml_models.clear()

app = FastAPI(title="CareerLens AI Engine", version="3.0", lifespan=lifespan)

# =============================================================================
# THE ASYNC WORKER
# =============================================================================
async def run_ml_pipeline_async(job_id: str, user_id: str, jd_text: str, file_bytes: bytes):
    print(f"[JOB {job_id}] Processing in background...")
    import fitz  # PyMuPDF
    from sentence_transformers import util
    import time

    start_time = time.time()
    try:
        nlp = ml_models["spacy_nlp"]
        sbert_model = ml_models["sbert"]
        
        # 1. Extract Text from PDF Bytes
        print(f"[JOB {job_id}] Extracting text from PDF...")
        resume_text = ""
        with fitz.open(stream=file_bytes, filetype="pdf") as doc:
            for page in doc:
                resume_text += page.get_text()
        
        # 2. Extract Entities (Basic Skills Extraction using spaCy)
        print(f"[JOB {job_id}] Running NER...")
        resume_doc = nlp(resume_text)
        jd_doc = nlp(jd_text)
        
        # Extract keywords (focusing on specific entity types for technical terms/orgs/etc)
        jd_keywords_set = set(ent.text for ent in jd_doc.ents if ent.label_ in ["ORG", "PRODUCT", "WORK_OF_ART", "GPE"])
        resume_keywords_set = set(ent.text for ent in resume_doc.ents)
        
        # Calculate case-insensitive missing and matched
        jd_lower_map = {k.lower(): k for k in jd_keywords_set}
        res_lower_map = {k.lower(): k for k in resume_keywords_set}
        
        matched_keys = set(jd_lower_map.keys()).intersection(set(res_lower_map.keys()))
        missing_keys = set(jd_lower_map.keys()).difference(set(res_lower_map.keys()))
        
        matched_skills = [jd_lower_map[k] for k in matched_keys]
        missing_skills = [jd_lower_map[k] for k in missing_keys]
        
        # Limit to top 15 for payload size and visual clarity
        matched_skills = matched_skills[:15]
        missing_skills = missing_skills[:15]
        jd_skills = list(jd_keywords_set)[:20]
        resume_skills = list(resume_keywords_set)[:20]

        # 3. SBERT Similarity Math (The real semantic match)
        print(f"[JOB {job_id}] Calculating SBERT Vector Similarity...")
        embeddings = sbert_model.encode([resume_text, jd_text], convert_to_tensor=True)
        cosine_sim = util.cos_sim(embeddings[0], embeddings[1])
        final_score = int(cosine_sim.item() * 100)
        
        # Ensure score is somewhat realistic and bounded
        final_score = max(0, min(100, final_score))
        
        # Determine Readiness Label
        if final_score >= 80:
            readiness_label = "A"
        elif final_score >= 60:
            readiness_label = "B"
        elif final_score >= 40:
            readiness_label = "C"
        else:
            readiness_label = "F"

        # 4. Generate SHAP-like explanations (Mocking additive breakdown for the UI based on actual extracted skills)
        print(f"[JOB {job_id}] Generating Explainer Data...")
        explanations = {}
        # Create positive impact for matched skills
        for i, skill in enumerate(matched_skills[:4]):
            explanations[skill] = round(3.0 + (5.0 / (i+1)), 1)
        
        # Create negative impact for missing skills
        for i, skill in enumerate(missing_skills[:3]):
            explanations[skill] = -round(2.0 + (4.0 / (i+1)), 1)
            
        # Add a baseline semantic match factor
        explanations["Baseline Semantic Overlap"] = round((final_score * 0.4), 1)

        # 5. Course Recommendations (Mocking based on top missing skill)
        courses = []
        if missing_skills:
            top_missing = missing_skills[0]
            courses.append({
                "title": f"Mastering {top_missing} for Professionals",
                "platform": "Coursera",
                "link": f"https://coursera.org/search?query={top_missing}",
                "skill": top_missing
            })
        if len(missing_skills) > 1:
            second_missing = missing_skills[1]
            courses.append({
                "title": f"Complete {second_missing} Bootcamp",
                "platform": "Udemy",
                "link": f"https://udemy.com/courses/search/?q={second_missing}",
                "skill": second_missing
            })

        processing_time = round(time.time() - start_time, 2)

        # 6. Dynamic Payload Construction
        result = {
            "job_id": job_id,
            "status": "COMPLETED",
            "data": {
                "final_score": final_score,
                "readiness_label": readiness_label,
                "matched_skills": matched_skills,
                "missing_skills": missing_skills,
                "jd_skills": jd_skills,
                "resume_skills": resume_skills,
                "explanations": explanations,
                "courses": courses,
                "metadata": {"processing_time_sec": processing_time}
            }
        }
        
        print(f"[JOB {job_id}] ✅ Math complete (Score: {final_score}%). Firing webhook to Next.js...")
        
        webhook_url = os.getenv("NEXTJS_WEBHOOK_URL", "http://localhost:3000/api/webhooks/ml-complete")
        secret = os.getenv("ML_WEBHOOK_SECRET", "super-secret-dev-key")
        import httpx
        
        # Using httpx for async webhook firing 
        async with httpx.AsyncClient() as client:
            await client.post(
                webhook_url,
                json=result,
                headers={"x-webhook-secret": secret}
            )
        
    except Exception as e:
        print(f"[JOB {job_id}] ❌ FAILED: {str(e)}")
        webhook_url = os.getenv("NEXTJS_WEBHOOK_URL", "http://localhost:3000/api/webhooks/ml-complete")
        secret = os.getenv("ML_WEBHOOK_SECRET", "super-secret-dev-key")
        import requests
        requests.post(webhook_url, json={"job_id": job_id, "status": "FAILED", "error": str(e)}, headers={"x-webhook-secret": secret})

# =============================================================================
# THE GATEKEEPER ENDPOINT
# =============================================================================
@app.post("/api/v1/analyze")
async def start_analysis(
    background_tasks: BackgroundTasks,
    job_id: str = Form(...),
    user_id: str = Form(...),
    jd_text: str = Form(...),
    resume: UploadFile = File(...)
):
    if len(jd_text.strip()) < 50:
        raise HTTPException(status_code=400, detail="Text too short.")

    file_bytes = await resume.read()

    # Push to background
    background_tasks.add_task(
        run_ml_pipeline_async, 
        job_id=job_id, 
        user_id=user_id,
        jd_text=jd_text,
        file_bytes=file_bytes
    )
    
    return {"status": "PROCESSING", "job_id": job_id}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)