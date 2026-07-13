// src/hooks/useRagApi.js
"use client";

import { useCallback, useState } from "react";
import { postJson, postFormData } from "@/utils/api";
import { API_ROUTES } from "@/utils/constants";

export default function useRagApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const query = useCallback(async (text, context = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      return await postJson(API_ROUTES.query, { query: text, context });
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const analyzeImage = useCallback(async (file) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("image", file);
      return await postFormData(API_ROUTES.analyze, formData);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return {
    query,
    analyzeImage,
    isLoading,
    isAnalyzing,
    error,
    clearError: () => setError(null),
  };
}
