// src/components/results/VisualData.js
"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";

export default function VisualData({ analysis, isAnalyzing }) {
  const [zoomOpen, setZoomOpen] = useState(false);

  if (isAnalyzing) {
    return (
      <div className="visual-data" aria-busy="true">
        <div className="loading-label">
          <span className="spinner" aria-hidden="true" />
          Running the 17-model MURA ensemble…
        </div>
        <div className="skeleton-panel">
          <div className="sk-block" />
          <div className="sk-line w60" />
          <div className="sk-line w80" />
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const isAbnormal = analysis.prediction === "ABNORMAL";
  const verdictClass = isAbnormal ? "abnormal" : "normal";
  const confidencePct = Math.round(analysis.confidence * 100);

  return (
    <div className="visual-data">
      <div className="vd-header">
        <div className="results-title-icon">
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 16L8 12L12 16L16 10L20 14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 20H20C21.1046 20 22 19.1046 22 18V6C22 4.89543 21.1046 4 20 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3>X-ray Analysis</h3>
      </div>

      <div className="vd-grid">
        {analysis.previewUrl && (
          <div
            className="vd-image-wrap"
            onClick={() => setZoomOpen(true)}
            role="button"
            tabIndex={0}
            aria-label="Enlarge X-ray"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setZoomOpen(true);
              }
            }}
          >
            <img
              src={analysis.previewUrl}
              alt={`X-ray: ${analysis.fileName || "uploaded image"}`}
            />
          </div>
        )}

        <div className="vd-details">
          <span className={`vd-verdict-pill ${verdictClass}`}>
            {isAbnormal ? (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 9V13M12 17H12.01M10.29 3.86L1.82 18C1.64537 18.3024 1.55296 18.6453 1.55199 18.9945C1.55101 19.3437 1.6415 19.6871 1.81442 19.9905C1.98734 20.2939 2.23672 20.5467 2.53773 20.7238C2.83875 20.9009 3.18058 20.9962 3.53 21H20.47C20.8194 20.9962 21.1613 20.9009 21.4623 20.7238C21.7633 20.5467 22.0127 20.2939 22.1856 19.9905C22.3585 19.6871 22.449 19.3437 22.448 18.9945C22.447 18.6453 22.3546 18.3024 22.18 18L13.71 3.86C13.5317 3.56611 13.2807 3.32312 12.9812 3.15448C12.6817 2.98585 12.3437 2.89725 12 2.89725C11.6563 2.89725 11.3183 2.98585 11.0188 3.15448C10.7193 3.32312 10.4683 3.56611 10.29 3.86Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 4L12 14.01L9 11.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {analysis.prediction}
          </span>

          <div className="vd-conf-row">
            <div className="vd-conf-label">
              <span>Ensemble confidence</span>
              <strong>{confidencePct}%</strong>
            </div>
            <div className="conf-track">
              <div
                className={`conf-fill ${verdictClass}`}
                style={{ width: `${confidencePct}%` }}
              />
            </div>
          </div>

          <p className="vd-votes">
            <strong>
              {analysis.votes_abnormal}/{analysis.total_models}
            </strong>{" "}
            models voted abnormal
          </p>

          <p className="vd-note">
            Prediction from the MURA ensemble (EfficientNet-B6 + DenseNet169 +
            EfficientNet-B4). Grad-CAM heatmaps become available once the
            inference backend is connected.
          </p>
        </div>
      </div>

      <Modal
        isOpen={zoomOpen}
        onClose={() => setZoomOpen(false)}
        title={analysis.fileName || "X-ray"}
        wide
      >
        {analysis.previewUrl && (
          <img
            src={analysis.previewUrl}
            alt={`X-ray: ${analysis.fileName || "uploaded image"}`}
            style={{ width: "100%", borderRadius: "12px" }}
          />
        )}
      </Modal>
    </div>
  );
}
