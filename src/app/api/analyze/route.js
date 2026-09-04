// src/app/api/analyze/route.js
// X-ray analysis endpoint — proxies to the Python backend's MURA ensemble.
// There is no local/hardcoded fallback: if the backend isn't configured,
// isn't reachable, or hasn't been given the exported ONNX weights yet, we
// return an honest error instead of a fabricated prediction.

const BACKEND = process.env.NEXT_PUBLIC_API_BASE || "";

export async function POST(request) {
  let formData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json(
      { error: 'Expected multipart/form-data with an "image" field' },
      { status: 400 },
    );
  }

  const file = formData.get("image");
  if (!file || typeof file === "string") {
    return Response.json({ error: 'Missing "image" file' }, { status: 400 });
  }
  if (file.type && !file.type.startsWith("image/")) {
    return Response.json(
      { error: "Only image uploads are supported" },
      { status: 415 },
    );
  }

  if (!BACKEND) {
    return Response.json(
      {
        error:
          "No inference backend is configured. Set NEXT_PUBLIC_API_BASE to a " +
          "running instance of backend/server.py (see README) — there is no " +
          "simulated fallback for this endpoint.",
      },
      { status: 503 },
    );
  }

  try {
    const backendForm = new FormData();
    backendForm.append("image", file, file.name);
    const resp = await fetch(`${BACKEND}/api/analyze`, {
      method: "POST",
      body: backendForm,
      signal: AbortSignal.timeout(60000),
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
          "Could not reach the analysis backend at " +
          `${BACKEND}. Make sure backend/server.py is running (uvicorn server:app --port 8000).`,
      },
      { status: 502 },
    );
  }
}
