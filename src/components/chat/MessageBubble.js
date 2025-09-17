// src/components/chat/MessageBubble.js
export default function MessageBubble({ message }) {
  return (
    <div className={`message-bubble ${message.type === 'user' ? 'user-message' : 'ai-message'}`}>
      <div className="message-content">
        <p>{message.content}</p>
      </div>
      <div className="message-time">
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
}