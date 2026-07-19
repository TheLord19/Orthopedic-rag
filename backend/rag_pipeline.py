"""
RAG Pipeline
============
Real retrieval-augmented generation using PubMed as the evidence corpus.

Flow:
  1. Query PubMed via the free E-utilities API
  2. Fetch abstracts for the top-N results
  3. Embed abstracts with a local SentenceTransformer model
  4. Retrieve the most relevant chunks via FAISS cosine similarity
  5. Generate a structured answer from the retrieved evidence

No API keys are required — PubMed is open-access and the embedding model
runs locally.  For a stronger generative step, set the OPENAI_API_KEY
environment variable to use GPT-4o-mini; otherwise a template-based
synthesis is used.
"""

from __future__ import annotations

import os
import re
import time
from typing import List, Tuple
from urllib.parse import quote

import httpx
import numpy as np
from sentence_transformers import SentenceTransformer

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
PUBMED_SEARCH_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
PUBMED_FETCH_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi"
MAX_RESULTS = 20
TOP_K_CHUNKS = 3
CHUNK_SIZE = 400  # characters per chunk
EMBED_MODEL_NAME = "all-MiniLM-L6-v2"

# Lazy-loaded singletons
_embedder: SentenceTransformer | None = None
_embed_dim: int | None = None


def _get_embedder() -> Tuple[SentenceTransformer, int]:
    global _embedder, _embed_dim
    if _embedder is None:
        _embedder = SentenceTransformer(EMBED_MODEL_NAME)
        _embed_dim = _embedder.get_sentence_embedding_dimension()
    return _embedder, _embed_dim


# ---------------------------------------------------------------------------
# PubMed API helpers (E-utilities — no key required)
# ---------------------------------------------------------------------------
async def _search_pubmed(query: str, max_results: int = MAX_RESULTS) -> List[str]:
    """Return a list of PubMed IDs (PMIDs) matching the query."""
    params = {
        "db": "pubmed",
        "term": query,
        "retmax": max_results,
        "retmode": "json",
        "sort": "relevance",
    }
    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.get(PUBMED_SEARCH_URL, params=params)
        resp.raise_for_status()
        data = resp.json()
    return data.get("esearchresult", {}).get("idlist", [])


async def _fetch_abstracts(pmids: List[str]) -> List[dict]:
    """Fetch title + abstract + metadata for a list of PMIDs."""
    if not pmids:
        return []

    params = {
        "db": "pubmed",
        "id": ",".join(pmids),
        "retmode": "xml",
        "rettype": "abstract",
    }
    async with httpx.AsyncClient(timeout=20.0) as client:
        resp = await client.get(PUBMED_FETCH_URL, params=params)
        resp.raise_for_status()

    # Python's xml.etree is bundled; parse the MEDLINE XML
    import xml.etree.ElementTree as ET

    root = ET.fromstring(resp.text)
    articles = []
    for article_elem in root.findall(".//PubmedArticle"):
        title_elem = article_elem.find(".//ArticleTitle")
        title = "".join(title_elem.itertext()) if title_elem is not None else "Untitled"

        abstract_elem = article_elem.find(".//AbstractText")
        abstract = ""
        if abstract_elem is not None:
            abstract = " ".join(
                t.strip() for t in abstract_elem.itertext() if t.strip()
            )

        # Author list
        authors = []
        for auth in article_elem.findall(".//Author"):
            last = auth.findtext("LastName", "")
            fore = auth.findtext("ForeName", "")
            if last:
                authors.append(f"{last} {fore}".strip())

        # Journal info
        journal_elem = article_elem.find(".//Journal/Title")
        journal = journal_elem.text if journal_elem is not None else "Unknown Journal"
        year_elem = article_elem.find(".//PubDate/Year")
        year = year_elem.text if year_elem is not None else ""

        pmid_elem = article_elem.find(".//PMID")
        pmid = pmid_elem.text if pmid_elem is not None else ""

        articles.append(
            {
                "pmid": pmid,
                "title": title,
                "authors": ", ".join(authors[:5]),
                "journal": journal,
                "year": year,
                "abstract": abstract,
                "url": f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/",
            }
        )
    return articles


# ---------------------------------------------------------------------------
# Chunking & embedding
# ---------------------------------------------------------------------------
def _chunk_text(text: str, size: int = CHUNK_SIZE) -> List[str]:
    """Split text into ~size-character chunks at sentence boundaries."""
    sentences = re.split(r"(?<=[.!?])\s+", text)
    chunks = []
    current = ""
    for sent in sentences:
        if len(current) + len(sent) <= size:
            current += (" " if current else "") + sent
        else:
            if current:
                chunks.append(current.strip())
            current = sent
    if current:
        chunks.append(current.strip())
    return chunks


def _retrieve_top_chunks(
    query: str, articles: List[dict], top_k: int = TOP_K_CHUNKS
) -> List[dict]:
    """Embed query + chunks, return top_k most relevant chunks via cosine sim."""
    if not articles:
        return []

    embedder, dim = _get_embedder()

    # Build chunk list with metadata
    chunk_data: List[dict] = []
    all_texts = [query]
    for art in articles:
        for chunk in _chunk_text(art["abstract"]):
            if len(chunk.strip()) < 50:
                continue
            chunk_data.append({**art, "chunk": chunk})
            all_texts.append(chunk)

    if not chunk_data:
        return []

    # Embed all at once
    embeddings = embedder.encode(all_texts, normalize_embeddings=True)
    query_vec = embeddings[0]
    chunk_vecs = embeddings[1:]

    # Cosine similarity (already normalised, so dot product)
    scores = np.dot(chunk_vecs, query_vec)
    top_indices = np.argsort(scores)[::-1][:top_k]

    results = []
    for idx in top_indices:
        results.append({**chunk_data[idx], "relevance": float(scores[idx])})
    return results


# ---------------------------------------------------------------------------
# Answer generation
# ---------------------------------------------------------------------------
def _template_synthesis(query: str, chunks: List[dict]) -> str:
    """Template-based answer that stitches together real evidence excerpts."""
    if not chunks:
        return (
            f'I searched PubMed for "{query}" but could not retrieve enough '
            "evidence to produce a grounded answer. This may be due to the query "
            "being too narrow — try rephrasing or broadening your question."
        )

    lines = [
        f"Here is what the medical literature says about **{query}**:\n",
    ]
    for i, ch in enumerate(chunks, 1):
        title = ch.get("title", "Untitled")
        authors = ch.get("authors", "")
        journal = ch.get("journal", "")
        year = ch.get("year", "")
        lines.append(f"**Source {i}:** *{title}* — {authors} ({journal}, {year})")
        lines.append(f"> {ch['chunk'].strip()}\n")

    lines.append(
        "---\n"
        "⚠️ *This synthesis was generated from real PubMed abstracts "
        "using local retrieval. It is not a substitute for clinical judgment. "
        "Always verify against the full paper.*"
    )
    return "\n".join(lines)


async def _llm_synthesis(query: str, chunks: List[dict]) -> str:
    """Use OpenAI GPT-4o-mini if key is available; otherwise template."""
    api_key = os.environ.get("OPENAI_API_KEY", "")
    if not api_key:
        return _template_synthesis(query, chunks)

    context = "\n\n".join(
        f"[{i + 1}] {ch.get('title', '')} ({ch.get('journal', '')}, {ch.get('year', '')}): {ch.get('chunk', '')}"
        for i, ch in enumerate(chunks)
    )

    prompt = (
        "You are an evidence-based orthopedic research assistant. "
        "Answer the following clinical question using ONLY the provided "
        "PubMed excerpts. Cite sources by their number [1], [2], etc. "
        "If the excerpts do not contain enough information to answer, "
        "say so clearly. Never invent facts or citations.\n\n"
        f"QUESTION: {query}\n\nEXCERPTS:\n{context}\n\nANSWER:"
    )

    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": "gpt-4o-mini",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.3,
                "max_tokens": 800,
            },
        )
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"]


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------
async def run_rag(query: str) -> dict:
    """
    Execute the full RAG pipeline and return the standard response schema
    expected by the OrthoInsight frontend.
    """
    start = time.time()

    # 1. Search PubMed
    pmids = await _search_pubmed(query)
    if not pmids:
        return {
            "answer": (
                f'No PubMed results were found for "{query}". '
                "Try broadening your search or using different terminology."
            ),
            "sources": [],
            "confidence": 0.0,
            "suggestedQuestions": [],
            "engine": "pubmed-rag",
        }

    # 2. Fetch abstracts
    articles = await _fetch_abstracts(pmids[:MAX_RESULTS])

    # 3. Retrieve top chunks
    top_chunks = _retrieve_top_chunks(query, articles)

    # 4. Generate answer
    answer = await _llm_synthesis(query, top_chunks)

    # 5. Build source citations for frontend
    seen = set()
    sources = []
    for ch in top_chunks:
        pmid = ch.get("pmid", "")
        if pmid and pmid not in seen:
            seen.add(pmid)
            sources.append(
                {
                    "id": pmid,
                    "title": ch.get("title", "Untitled"),
                    "authors": ch.get("authors", ""),
                    "journal": ch.get("journal", "Unknown"),
                    "year": ch.get("year", ""),
                    "url": ch.get("url", "#"),
                    "relevance": round(ch.get("relevance", 0.7), 2),
                    "excerpt": ch["chunk"][:300],
                }
            )

    elapsed = round(time.time() - start, 1)
    return {
        "answer": answer,
        "sources": sources[:5],
        "confidence": round(min(0.95, 0.6 + len(sources) * 0.1), 2),
        "suggestedQuestions": [],
        "engine": "pubmed-rag",
        "latency_s": elapsed,
    }
