// src/components/results/ResultsPanel.js
"use client";

import { useState } from "react";
import SourceCitation from "./SourceCitation";

function ConfidenceRing({ value }) {
  const radius = 19;
  const circumference = 2 * Math.PI * radius;
  const level = value >= 0.85 ? "high" : value >= 0.65 ? "medium" : "low";

  return (
    <div
      className="confidence-ring"
      title={`Answer confidence: ${(value * 100).toFixed(0)}%`}
    >
      <svg width="46" height="46" viewBox="0 0 46 46">
        <circle className="ring-track" cx="23" cy="23" r={radius} />
        <circle
          className={`ring-fill ${level}`}
          cx="23"
          cy="23"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - value)}
        />
      </svg>
      <span className="confidence-value">{(value * 100).toFixed(0)}%</span>
    </div>
  );
}

export default function ResultsPanel({ results, isLoading }) {
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return (
      <div className="results-panel" aria-busy="true">
        <div className="loading-label">
          <span className="spinner" aria-hidden="true" />
          Analyzing orthopedic research…
        </div>
        <div className="skeleton-panel">
          <div className="sk-line w40" />
          <div className="sk-block" />
          <div className="sk-line w60" />
          <div className="sk-line w100" />
          <div className="sk-line w80" />
        </div>
      </div>
    );
  }

  if (!results) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(results.answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="results-panel" aria-live="polite">
      <div className="results-header">
        <div className="results-title">
          <div className="results-title-icon">
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 21H15M12 3C8.68629 3 6 5.68629 6 9C6 11.2208 7.2066 13.1599 9 14.1973V16C9 16.5523 9.44772 17 10 17H14C14.5523 17 15 16.5523 15 16V14.1973C16.7934 13.1599 18 11.2208 18 9C18 5.68629 15.3137 3 12 3Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3>Research Findings</h3>
        </div>
        <div className="results-actions">
          <button
            className={`copy-btn ${copied ? "copied" : ""}`.trim()}
            onClick={handleCopy}
          >
            {copied ? (
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 6L9 17L4 12"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="9"
                  y="9"
                  width="13"
                  height="13"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            )}
            {copied ? "Copied" : "Copy"}
          </button>
          <ConfidenceRing value={results.confidence} />
        </div>
      </div>

      <div className="answer-section">
        <div className="answer-content">
          <p>{results.answer}</p>
        </div>
      </div>

      {results.sources?.length > 0 && (
        <div className="sources-section">
          <h4>
            Supporting Research
            <span className="sources-count">{results.sources.length}</span>
          </h4>
          <div className="sources-list">
            {results.sources.map((source, index) => (
              <SourceCitation
                key={source.id}
                source={source}
                index={index + 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
