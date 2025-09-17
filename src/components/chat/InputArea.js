// src/components/chat/InputArea.js
'use client';

import { useState } from 'react';

export default function InputArea({ onSendMessage, isLoading, suggestedQuestions }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="input-area">
      {suggestedQuestions.length > 0 && (
        <div className="suggested-questions">
          <p>Suggested questions:</p>
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
      
      <form onSubmit={handleSubmit} className="message-form">
        <div className="input-container">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about orthopedic conditions, treatments, or research..."
            disabled={isLoading}
            className="message-input"
          />
          <button 
            type="submit" 
            disabled={!message.trim() || isLoading}
            className="send-button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}