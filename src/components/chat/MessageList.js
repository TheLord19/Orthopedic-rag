// src/components/chat/MessageList.js
import MessageBubble from './MessageBubble';

export default function MessageList({ messages, isLoading }) {
  return (
    <div className="message-list">
      {messages.length === 0 ? (
        <div className="empty-chat">
          <div className="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.4183 16.9706 20 12 20C10.4605 20 9.01151 19.6565 7.74467 19.0511L3 20L4.39499 16.28C3.51156 15.0423 3 13.5743 3 12C3 7.58172 7.02944 4 12 4C16.9706 4 21 7.58172 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3>Welcome to OrthoInsight</h3>
          <p>Ask me anything about orthopedic conditions, treatments, or research.</p>
        </div>
      ) : (
        <div className="messages-container">
          {messages.map(message => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="thinking-bubble">
              <div className="thinking-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p>Researching orthopedic knowledge base...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}