// src/components/chat/InputArea.js
"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { formatFileSize } from "@/utils/formatters";

export default function InputArea({
  onSendMessage,
  onAnalyzeImage,
  inputMethod,
  isLoading,
  isAnalyzing,
  suggestedQuestions,
}) {
  const [message, setMessage] = useState("");
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setVoiceSupported(
      !!(window.SpeechRecognition || window.webkitSpeechRecognition),
    );
    return () => recognitionRef.current?.abort?.();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const toggleListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (listening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ");
      setMessage(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  };

  const selectImage = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAnalyze = () => {
    if (!imageFile || isAnalyzing) return;
    onAnalyzeImage(imageFile);
    clearImage();
  };

  const showChips = suggestedQuestions.length > 0 && inputMethod !== "image";

  return (
    <div className="input-area">
      {showChips && (
        <div className="suggested-questions">
          <p>Suggested questions</p>
          <div className="question-chips">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                className="question-chip"
                onClick={() => onSendMessage(question)}
                disabled={isLoading}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {inputMethod === "image" ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="visually-hidden"
            onChange={(e) => selectImage(e.target.files?.[0])}
            aria-label="Upload X-ray image"
          />

          {!imageFile ? (
            <div
              className={`image-dropzone ${dragOver ? "drag-over" : ""}`.trim()}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                selectImage(e.dataTransfer.files?.[0]);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
            >
              <div className="dropzone-icon">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17 8L12 3L7 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 3V15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="dropzone-text">
                <strong>
                  Drop a musculoskeletal X-ray here, or click to browse
                </strong>
                <span>
                  PNG or JPEG · analyzed by the 17-model MURA ensemble
                </span>
              </div>
            </div>
          ) : (
            <div className="image-preview-row">
              <img
                src={imagePreview}
                alt="Selected X-ray preview"
                className="image-thumb"
              />
              <div className="image-file-meta">
                <p className="image-file-name">{imageFile.name}</p>
                <span className="image-file-size">
                  {formatFileSize(imageFile.size)}
                </span>
              </div>
              <div className="analyze-actions">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearImage}
                  disabled={isAnalyzing}
                >
                  Remove
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAnalyze}
                  loading={isAnalyzing}
                >
                  Analyze X-ray
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="message-form">
          <div className="input-container">
            {inputMethod === "voice" && (
              <button
                type="button"
                className={`input-mode-btn ${listening ? "listening" : ""}`.trim()}
                onClick={toggleListening}
                disabled={!voiceSupported}
                aria-label={listening ? "Stop dictation" : "Start dictation"}
                title={
                  voiceSupported
                    ? "Dictate your question"
                    : "Voice input is not supported in this browser"
                }
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C11.2044 2 10.4413 2.31607 9.87868 2.87868C9.31607 3.44129 9 4.20435 9 5V12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12V5C15 4.20435 14.6839 3.44129 14.1213 2.87868C13.5587 2.31607 12.7956 2 12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19 10V12C19 13.8565 18.2625 15.637 16.9497 16.9497C15.637 18.2625 13.8565 19 12 19C10.1435 19 8.36301 18.2625 7.05025 16.9497C5.7375 15.637 5 13.8565 5 12V10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 19V22"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                inputMethod === "voice"
                  ? listening
                    ? "Listening…"
                    : "Tap the mic and speak, or type your question…"
                  : "Ask about orthopedic conditions, treatments, or research…"
              }
              disabled={isLoading}
              className="message-input"
              aria-label="Message"
            />
            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className="send-button"
              aria-label="Send message"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 2L11 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 2L15 22L11 13L2 9L22 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          {inputMethod === "voice" && (
            <p
              className={`voice-hint ${listening ? "listening-hint" : ""}`.trim()}
            >
              {!voiceSupported
                ? "Voice input is not supported in this browser — Chrome or Edge recommended."
                : listening
                  ? "Listening… tap the mic again to stop."
                  : "Tap the mic to dictate your question."}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
