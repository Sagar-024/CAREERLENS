import spacy
from typing import List, Set

nlp = None

def init_spacy():
    global nlp
    if nlp is None:
        try:
            nlp = spacy.load("en_core_web_sm")
        except OSError:
            import subprocess
            subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"])
            nlp = spacy.load("en_core_web_sm")

def extract_skills(text: str) -> List[str]:
    """
    Extract skills from text using spaCy NER and matching.
    In a production system, this would use a custom trained model 
    or a dedicated skill matcher like an updated EntityRuler.
    """
    if nlp is None:
        init_spacy()
        
    doc = nlp(text)
    
    # Simple extraction strategy:
    # 1. Look for specific noun chunks that might be skills
    # 2. In reality, you'd match against a predefined taxonomy
    
    skills = set()
    
    # Add proper nouns and common technical acronyms
    for ent in doc.ents:
        if ent.label_ in ["ORG", "PRODUCT", "WORK_OF_ART"]:
            skills.add(ent.text.lower().strip())
            
    # Add noun chunks as potential skills (filtered)
    for chunk in doc.noun_chunks:
        text = chunk.text.lower().strip()
        # Very basic filtering to avoid obvious non-skills
        if len(text.split()) <= 3 and len(text) > 2:
            # We'd ideally check this against a known taxonomy
            skills.add(text)
            
    # For MVP, we'll return a cleaned list. 
    # Real implementation would cross-reference with skills_taxonomy.json
    return sorted(list(skills))
