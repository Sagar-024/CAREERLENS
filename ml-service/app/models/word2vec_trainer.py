import os
from gensim.models import Word2Vec

def train_custom_embeddings():
    """
    Train custom technical skill embeddings on a corpus of 
    tech-specific job descriptions or resumes.
    This script is intended to be run offline.
    """
    
    # Mock data - in reality this would be millions of sentences
    # from technical documentation, JDs, StackOverflow, etc.
    sentences = [
        ["machine", "learning", "python", "tensorflow", "pytorch"],
        ["react", "javascript", "typescript", "frontend", "ui"],
        ["docker", "kubernetes", "aws", "cloud", "deployment"],
        ["sql", "python", "pandas", "data", "analysis"],
        ["system", "design", "agile", "leadership", "management"],
    ]
    
    print("Training custom Word2Vec model...")
    model = Word2Vec(sentences, vector_size=100, window=5, min_count=1, workers=4)
    
    model_dir = os.path.join(os.path.dirname(__file__), '../../data/models')
    os.makedirs(model_dir, exist_ok=True)
    
    model_path = os.path.join(model_dir, 'custom_word2vec.model')
    model.save(model_path)
    
    print(f"Model saved to {model_path}")
    
    # Test it
    print("\nVocabulary:", list(model.wv.key_to_index.keys())[:10])
    try:
        sims = model.wv.most_similar('python', topn=3)
        print("Most similar to 'python':", sims)
    except Exception as e:
        print("Error getting similarities:", e)

if __name__ == "__main__":
    train_custom_embeddings()
