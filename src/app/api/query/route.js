// src/app/api/query/route.js
// RAG endpoint — proxies to the Python backend (real PubMed retrieval +
// embedding-based synthesis). There is no local/hardcoded fallback: if the
// backend isn't configured or isn't reachable, we say so honestly instead
// of returning a fabricated answer.

const BACKEND = process.env.NEXT_PUBLIC_API_BASE || "";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const query = (body?.query || "").trim();
  if (!query) {
    return Response.json({ error: 'Missing "query" field' }, { status: 400 });
  }

  if (!BACKEND) {
    return Response.json(
      {
        error:
          "No RAG backend is configured. Set NEXT_PUBLIC_API_BASE to a running " +
          "instance of backend/server.py (see README) — there is no simulated " +
          "fallback for this endpoint.",
      },
      { status: 503 },
    );
  }

  try {
    const resp = await fetch(`${BACKEND}/api/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
      signal: AbortSignal.timeout(30000),
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      return Response.json(
        { error: data?.detail || data?.error || "Backend returned an error" },
        { status: resp.status },
      );
    }
    return Response.json(data);
  } catch {
    return Response.json(
      {
        error:
          "Could not reach the RAG backend at " +
          `${BACKEND}. Make sure backend/server.py is running (uvicorn server:app --port 8000).`,
      },
      { status: 502 },
    );
  }
}
