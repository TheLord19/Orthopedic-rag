// src/app/page.js
"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import ChatInterface from "@/components/chat/ChatInterface";
import ResultsPanel from "@/components/results/ResultsPanel";
import VisualData from "@/components/results/VisualData";
import useRagApi from "@/hooks/useRagApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import {
  DEFAULT_SUGGESTED_QUESTIONS,
  HISTORY_STORAGE_KEY,
} from "@/utils/constants";

export default function Home() {
  const [queryResults, setQueryResults] = useState(null);
  const [imageResult, setImageResult] = useState(null);
  const [chatHistory, setChatHistory] = useLocalStorage(
    HISTORY_STORAGE_KEY,
    [],
  );
  const [activeChatId, setActiveChatId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);
  const { query, analyzeImage, isLoading, isAnalyzing, error, clearError } =
    useRagApi();

  const handleSearch = async (searchQuery, context = {}) => {
    try {
      const results = await query(searchQuery, context);
      setQueryResults(results);

      const entry = {
        id: Date.now(),
        query: searchQuery,
        response: results,
        timestamp: new Date().toISOString(),
      };
      setChatHistory((prev) => [entry, ...prev].slice(0, 50));
      setActiveChatId(entry.id);
    } catch {
      // error state is surfaced by the useRagApi hook
    }
  };

  const handleAnalyzeImage = async (file) => {
    const previewUrl = URL.createObjectURL(file);
    try {
      const result = await analyzeImage(file);
      setImageResult((prev) => {
        if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl);
        return { ...result, previewUrl, fileName: file.name };
      });
    } catch {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleNewChat = () => {
    setQueryResults(null);
    setImageResult((prev) => {
      if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl);
      return null;
    });
    setActiveChatId(null);
    clearError();
    setSessionKey((k) => k + 1);
    setSidebarOpen(false);
  };

  const handleSelectChat = (chat) => {
    setQueryResults(chat.response);
    setActiveChatId(chat.id);
    setSidebarOpen(false);
  };

  const handleDeleteChat = (chatId) => {
    setChatHistory((prev) => prev.filter((chat) => chat.id !== chatId));
    if (chatId === activeChatId) {
      setQueryResults(null);
      setActiveChatId(null);
    }
  };

  const hasResults = Boolean(
    queryResults || imageResult || isLoading || isAnalyzing,
  );

  return (
    <main className="main-content">
      <Header
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />

      <div className="content-wrapper">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          chatHistory={chatHistory}
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
          onNewChat={handleNewChat}
        />

        <div className="main-panel">
          <div
            className={`workspace ${hasResults ? "has-results" : ""}`.trim()}
          >
            <div className="chat-column">
              {error && (
                <div className="error-banner" role="alert">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M12 8V12M12 16H12.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <p>{error}</p>
                  <button className="copy-btn" onClick={clearError}>
                    Dismiss
                  </button>
                </div>
              )}

              <ChatInterface
                key={sessionKey}
                onSearch={handleSearch}
                onAnalyzeImage={handleAnalyzeImage}
                isLoading={isLoading}
                isAnalyzing={isAnalyzing}
                suggestedQuestions={
                  queryResults?.suggestedQuestions ||
                  DEFAULT_SUGGESTED_QUESTIONS
                }
                latestResults={queryResults}
              />
            </div>

            {hasResults && (
              <div className="results-column">
                {(imageResult || isAnalyzing) && (
                  <VisualData
                    analysis={imageResult}
                    isAnalyzing={isAnalyzing}
                  />
                )}
                {(queryResults || isLoading) && (
                  <ResultsPanel results={queryResults} isLoading={isLoading} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
