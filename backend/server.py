"""
OrthoInsight Backend Server
===========================
FastAPI server providing the RAG + X-ray analysis endpoints consumed
by the Next.js frontend.

Start:
    cd backend
    pip install -r requirements.txt
    uvicorn server:app --host 0.0.0.0 --port 8000

The frontend reads NEXT_PUBLIC_API_BASE to decide where to send requests.
For local development set it to http://localhost:8000 in .env.local.
"""

from __future__ import annotations

import os
import tempfile
from contextlib import asynccontextmanager

from ensemble import predict as ensemble_predict
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag_pipeline import run_rag


# ---------------------------------------------------------------------------
# Lifespan — eagerly load the embedding model at startup
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Warm the embedding model so the first query is fast
    try:
        from rag_pipeline import _get_embedder

        _get_embedder()
        print("✓  Embedding model loaded")
    except Exception as exc:
        print(f"⚠  Embedding model not available: {exc}")

    # Check for ONNX models
    onnx_dir = os.path.join(os.path.dirname(__file__), "onnx_models")
    if os.path.isdir(onnx_dir) and any(
        f.endswith(".onnx") for f in os.listdir(onnx_dir)
    ):
        print(f"✓  ONNX models detected in {onnx_dir}")
    else:
        print(
            "⚠  No ONNX models found in "
            f"{onnx_dir} — /api/analyze will return 503 until they are "
            "exported and copied in. See README for instructions."
        )
    yield


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(
    title="OrthoInsight API",
    description="RAG + MURA ensemble backend for the OrthoInsight frontend",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Request schemas
# ---------------------------------------------------------------------------
class QueryRequest(BaseModel):
    query: str


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/api/query")
async def query_endpoint(body: QueryRequest):
    """RAG endpoint — searches PubMed and returns grounded evidence."""
    if not body.query.strip():
        raise HTTPException(status_code=400, detail="Missing 'query' field")
    return await run_rag(body.query.strip())


@app.post("/api/analyze")
async def analyze_endpoint(image: UploadFile = File(...)):
    """X-ray analysis endpoint — runs the MURA ensemble."""
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=415, detail="Only image uploads are supported")

    # Save to a temp file so the ensemble module can read it
    suffix = os.path.splitext(image.filename or "upload.png")[1] or ".png"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(await image.read())
        tmp_path = tmp.name

    try:
        result = ensemble_predict(tmp_path)
        result["file"] = image.filename or result["file"]
        return result
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    finally:
        os.unlink(tmp_path)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
