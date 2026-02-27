import os
from gensim.models import Word2Vec

word2vec_model = None

def load_word2vec():
    """
    Load custom trained Word2Vec model for domain specific technical skills.
    In MVP this is optional, SBERT handles primary semantic matching.
    """
    global word2vec_model
    model_path = os.path.join(os.getenv("MODEL_DIR", "./data/models"), "custom_word2vec.model")
    
    if os.path.exists(model_path):
        try:
            word2vec_model = Word2Vec.load(model_path)
            print("Custom Word2Vec model loaded.")
        except Exception as e:
            print(f"Error loading custom Word2Vec: {e}")
    else:
        print("No custom Word2Vec model found. Using SBERT only.")
        
def get_word2vec_model():
    return word2vec_model
