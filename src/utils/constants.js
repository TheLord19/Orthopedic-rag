// src/utils/constants.js

export const APP_NAME = "OrthoInsight";

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

export const API_ROUTES = {
  query: `${API_BASE}/api/query`,
  analyze: `${API_BASE}/api/analyze`,
};

export const REQUEST_TIMEOUT_MS = 30000;

export const THEME_STORAGE_KEY = "oi-theme";
export const HISTORY_STORAGE_KEY = "oi-chat-history";

export const DEFAULT_SUGGESTED_QUESTIONS = [
  "What is the most effective treatment for ACL tears?",
  "How are rotator cuff injuries diagnosed and managed?",
  "What do current guidelines say about distal radius fractures?",
];

export const ENSEMBLE_INFO = {
  models: 17,
  accuracy: 0.9033,
  dataset: "Stanford MURA v1.1",
};

export const MEDICAL_DISCLAIMER =
  "OrthoInsight is a research prototype. Its output is not medical advice and must not replace evaluation by a qualified clinician.";
