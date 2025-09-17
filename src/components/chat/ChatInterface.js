// src/components/chat/ChatInterface.js
'use client';

import { useState } from 'react';
import InputArea from './InputArea';
import MessageList from './MessageList';

export default function ChatInterface({ onSearch, isLoading, suggestedQuestions }) {
  const [messages, setMessages] = useState([]);
  const [inputMethod, setInputMethod] = useState('text');

  const handleSendMessage = (message, context = {}) => {
    const newMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString(),
      context
    };
    
    setMessages(prev => [...prev, newMessage]);
    onSearch(message, context);
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <div className="welcome-message">
          <h2>Orthopedic Research Assistant</h2>
          <p>Ask about procedures, conditions, research, or clinical guidelines</p>
        </div>
        
        <div className="input-method-tabs">
          <button 
            className={`tab ${inputMethod === 'text' ? 'active' : ''}`}
            onClick={() => setInputMethod('text')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 14H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 3H14V9H21V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Text
          </button>
          <button 
            className={`tab ${inputMethod === 'voice' ? 'active' : ''}`}
            onClick={() => setInputMethod('voice')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C11.2044 2 10.4413 2.31607 9.87868 2.87868C9.31607 3.44129 9 4.20435 9 5V12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12V5C15 4.20435 14.6839 3.44129 14.1213 2.87868C13.5587 2.31607 12.7956 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 10V12C19 13.8565 18.2625 15.637 16.9497 16.9497C15.637 18.2625 13.8565 19 12 19C10.1435 19 8.36301 18.2625 7.05025 16.9497C6.7375 16.637 6.46296 16.2948 6.22868 15.928" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 12C6 11.2044 5.68393 10.4413 5.12132 9.87868C4.55871 9.31607 3.79565 9 3 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 9C20.2044 9 19.4413 9.31607 18.8787 9.87868C18.3161 10.4413 18 11.2044 18 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 19V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Voice
          </button>
          <button 
            className={`tab ${inputMethod === 'image' ? 'active' : ''}`}
            onClick={() => setInputMethod('image')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 16L8 12L12 16L16 10L20 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 20H20C21.1046 20 22 19.1046 22 18V6C22 4.89543 21.1046 4 20 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
            </svg>
            Image
          </button>
        </div>
      </div>

      <MessageList messages={messages} isLoading={isLoading} />

      <InputArea 
        onSendMessage={handleSendMessage}
        inputMethod={inputMethod}
        isLoading={isLoading}
        suggestedQuestions={suggestedQuestions}
      />
    </div>
  );
}