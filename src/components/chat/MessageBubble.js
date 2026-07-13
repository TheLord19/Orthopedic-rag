// src/components/chat/MessageBubble.js
import { formatTime } from "@/utils/formatters";

const AiAvatar = (
  <div className="msg-avatar ai-avatar" aria-hidden="true">
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L2 7L12 12L22 7L12 2Z"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 12L12 17L22 12"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

const UserAvatar = (
  <div className="msg-avatar user-avatar" aria-hidden="true">
    You
  </div>
);

export default function MessageBubble({ message }) {
  const isUser = message.type === "user";
  return (
    <div className={`message-row ${isUser ? "user" : "ai"}`}>
      {isUser ? UserAvatar : AiAvatar}
      <div
        className={`message-bubble ${isUser ? "user-message" : "ai-message"}`}
      >
        <div className="message-content">
          <p>{message.content}</p>
        </div>
        <div className="message-time">{formatTime(message.timestamp)}</div>
      </div>
    </div>
  );
}
