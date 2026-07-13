// src/utils/api.js
import { REQUEST_TIMEOUT_MS } from "./constants";

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let response;
  try {
    response = await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err.name === "AbortError")
      throw new ApiError("The request timed out. Please try again.");
    throw new ApiError(
      "Could not reach the OrthoInsight service. Check your connection and try again.",
    );
  } finally {
    clearTimeout(timer);
  }
  if (!response.ok) {
    let detail = "";
    try {
      const body = await response.json();
      detail = body.error || body.detail || "";
    } catch {}
    throw new ApiError(
      detail || `Request failed (${response.status})`,
      response.status,
    );
  }
  return response.json();
}

export function postJson(url, payload) {
  return request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function postFormData(url, formData) {
  return request(url, { method: "POST", body: formData });
}
