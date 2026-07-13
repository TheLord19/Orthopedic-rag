// src/components/chat/ChatInterface.js
"use client";

import { useEffect, useRef, useState } from "react";
import InputArea from "./InputArea";
import MessageList from "./MessageList";
import Tabs from "@/components/ui/Tabs";
import { truncate } from "@/utils/formatters";

const INPUT_TABS = [
  {
    id: "text",
    label: "Text",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 7V4H20V7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 4V20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 20H15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "voice",
    label: "Voice",
    icon: (
      <svg
        width="16"
        height="16"
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
    ),
  },
  {
    id: "image",
    label: "X-ray",
    icon: (
      <svg
        width="16"
        height="16"
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
        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
];

export default function ChatInterface({
  onSearch,
  onAnalyzeImage,
  isLoading,
  isAnalyzing,
  suggestedQuestions,
  latestResults,
}) {
  const [messages, setMessages] = useState([]);
  const [inputMethod, setInputMethod] = useState("text");
  const lastResultRef = useRef(null);

  const handleSendMessage = (message, context = {}) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "user",
        content: message,
        timestamp: new Date().toISOString(),
        context,
      },
    ]);
    onSearch(message, context);
  };

  const handleAnalyzeImage = (file) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "user",
        content: `Uploaded X-ray for analysis: ${file.name}`,
        timestamp: new Date().toISOString(),
      },
    ]);
    onAnalyzeImage(file);
  };

  useEffect(() => {
    if (!latestResults || latestResults === lastResultRef.current) return;
    lastResultRef.current = latestResults;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        type: "ai",
        content: `${truncate(latestResults.answer, 240)} — full findings and sources are in the research panel.`,
        timestamp: new Date().toISOString(),
      },
    ]);
  }, [latestResults]);

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <div className="welcome-message">
          <div className="welcome-icon">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2>Orthopedic Research Assistant</h2>
          <p>
            Ask about procedures, conditions and guidelines — or upload an X-ray
            for AI analysis
          </p>
        </div>

        <Tabs
          items={INPUT_TABS}
          activeId={inputMethod}
          onChange={setInputMethod}
          ariaLabel="Input method"
        />
      </div>

      <MessageList messages={messages} isLoading={isLoading || isAnalyzing} />

      <InputArea
        onSendMessage={handleSendMessage}
        onAnalyzeImage={handleAnalyzeImage}
        inputMethod={inputMethod}
        isLoading={isLoading}
        isAnalyzing={isAnalyzing}
        suggestedQuestions={suggestedQuestions}
      />
    </div>
  );
}
