# CareerLens AI: Asynchronous Semantic Resume Engine

![Next.js 14](https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![SBERT](https://img.shields.io/badge/SBERT-Sentence_Transformers-blue?style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

CareerLens AI bridges the gap between raw talent and job requirements by deploying dense vector analysis to evaluate candidate alignment. It translates unstructured resume data and job descriptions into high-dimensional semantic spaces, evaluating contextual fit far beyond the capabilities of traditional keyword extraction.

## 1. The Problem vs. The Solution

**The Problem: Boolean Fragility**
Legacy Applicant Tracking Systems (ATS) and mainstream resume parsers (like Jobscan) operate predominantly on Boolean keyword matching algorithms, such as Term Frequency-Inverse Document Frequency (TF-IDF). This mechanism is inherently brittle: a highly qualified candidate whose resume features "React Developer" or "Node.js Architect" will fundamentally fail against a job description rigidly requesting "Frontend Engineering" or "Backend System Design", yielding false negatives that restrict talent acquisition at scale.

**The Solution: Vector Space Semantics**
CareerLens AI replaces lexical string manipulation with true semantic understanding. Leveraging a pre-trained Bi-Encoder (`all-MiniLM-L6-v2`), the system maps raw textual input—both the parsed resume and the target job description—into a continuous 384-dimensional vector space. Rather than counting string occurrences, we evaluate the semantic alignment by computing the spatial distance between these multi-dimensional representations.

**The Math: Cosine Similarity**
To derive an objective alignment score, the engine computes the Cosine Similarity between the normalized document vectors $\mathbf{A}$ (Resume) and $\mathbf{B}$ (Job Description). This equation mathematically bounds the semantic alignment, providing a deterministic similarity metric:

$$
\text{Similarity}(A, B) = \frac{A \cdot B}{\|A\| \|B\|}
$$

## 2. System Architecture: The 6-Stage Async Pipeline

The application operates on a decoupled microservice architecture, segregating the Next.js App Router presentation layer from the compute-intensive Python FastAPI worker.

**The 6-Stage Pipeline:**

1. **Ingestion**: The client transmits binary PDF payloads and plain-text job descriptions to the Next.js API via `multipart/form-data`.
2. **State Initialization**: The Next.js edge runtime registers a `PENDING` job state via Prisma ORM and immediately returns a `202 Accepted` HTTP response to unblock the client thread.
3. **Async Handoff**: The frontend server delegates the computational payload to the localized FastAPI machine learning worker via a non-blocking internal request.
4. **Extraction & NER**: The Python worker utilizes `PyMuPDF` to rip the binary PDF text streams in under 20ms. The extracted text is subsequently pushed into a `spaCy` Named Entity Recognition (NER) pipeline to isolate targeted technical entities.
5. **Vectorization**: An in-memory, instantiated SBERT model pre-processes the isolated texts, calculating precise cosine similarity metrics across the derived tensors.
6. **Webhook Resolution**: The FastAPI microservice initiates a secure, authenticated `POST` request back to the Next.js webhook. The PostgreSQL database, via Prisma, atomically updates the job state to `COMPLETED`, allowing the ongoing UI polling mechanisms to organically resolve and render the analysis payload.

## 3. Upcoming Roadmap: Explainable AI (XAI)

To increase systemic transparency and diagnostic utility, future iterations will focus on advancing Explainable AI (XAI) integrations:

- **SHAP-Style Feature Importance**: Providing a localized, granular breakdown detailing precisely which phrases, domains, or technical skills most aggressively influenced the aggregate similarity score.
- **Dynamic Category Weighting**: Implementing algorithmic flexibility to penalize or reward specific feature categories (e.g., Hard vs. Soft skills) dynamically, based on inferred seniority thresholds.
- **Persistent Context**: Migrating transient job description contexts into persistent PostgreSQL storage, enabling the programmatic re-evaluation of entire candidate pools against shifting role requirements.

## 4. Local Development Setup

To initialize the distributed environment locally, configure both microservices sequentially.

### Python ML Backend (FastAPI Worker)

```bash
# Initialize and activate the isolated virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install core dependencies
pip install -r requirements.txt

# Download the required spaCy English language model
python -m spacy download en_core_web_lg

# Boot the uvicorn ASGI server
uvicorn main:app --reload --port 8000
```

### Next.js Client Application

Open a discrete terminal instance, then execute:

```bash
# Install Node dependencies
npm install

# Push the local development schema to PostgreSQL and generate the Prisma Client
npx prisma db push
npx prisma generate

# Initialize the Next.js development server
npm run dev
```
