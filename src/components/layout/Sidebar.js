// src/components/layout/Sidebar.js
"use client";

import { formatRelativeTime, truncate } from "@/utils/formatters";

const ChatIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.4183 16.9706 20 12 20C10.4605 20 9.01151 19.6565 7.74467 19.0511L3 20L4.39499 16.28C3.51156 15.0423 3 13.5743 3 12C3 7.58172 7.02944 4 12 4C16.9706 4 21 7.58172 21 12Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Sidebar({
  isOpen,
  onClose,
  chatHistory,
  activeChatId,
  onSelectChat,
  onDeleteChat,
  onNewChat,
}) {
  return (
    <>
      {isOpen && (
        <button
          className="sidebar-backdrop"
          onClick={onClose}
          aria-label="Close menu"
        />
      )}

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`.trim()}>
        <div className="sidebar-header">
          <button className="new-chat-btn" onClick={onNewChat}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 5V19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M5 12H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            New Chat
          </button>
          <h2>Chat History</h2>
        </div>

        <div className="sidebar-content">
          {chatHistory.length === 0 ? (
            <div className="empty-state">
              <svg
                width="44"
                height="44"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.4183 16.9706 20 12 20C10.4605 20 9.01151 19.6565 7.74467 19.0511L3 20L4.39499 16.28C3.51156 15.0423 3 13.5743 3 12C3 7.58172 7.02944 4 12 4C16.9706 4 21 7.58172 21 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p>No chat history yet</p>
              <span>Start a conversation to see it here</span>
            </div>
          ) : (
            <div className="chat-list">
              {chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  className={`chat-item ${chat.id === activeChatId ? "active" : ""}`.trim()}
                  onClick={() => onSelectChat(chat)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectChat(chat);
                    }
                  }}
                >
                  <div className="chat-icon">{ChatIcon}</div>
                  <div className="chat-preview">
                    <p className="chat-query">{truncate(chat.query, 48)}</p>
                    <span className="chat-time">
                      {formatRelativeTime(chat.timestamp)}
                    </span>
                  </div>
                  <button
                    className="chat-delete"
                    aria-label="Delete chat"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chat.id);
                    }}
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 6H21M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6M19 6V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sidebar-footer">
          <div className="resource-links">
            <h3>Orthopedic Resources</h3>
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/?term=orthopedics"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-link"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 6.253C13.184 5.477 14.768 5 16.5 5C19.538 5 22 7.462 22 10.5C22 12.971 20.213 15 17.5 15C16.937 15 16.392 14.883 15.911 14.68C15.396 15.518 14.219 16 12.5 16C10.781 16 9.604 15.518 9.089 14.68C8.608 14.883 8.063 15 7.5 15C4.787 15 3 12.971 3 10.5C3 7.462 5.462 5 8.5 5C10.232 5 11.816 5.477 13 6.253Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Research Papers
            </a>
            <a
              href="https://www.aaos.org/quality/quality-programs/clinical-practice-guidelines/"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-link"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 2V8H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 13H8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 17H8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Clinical Guidelines
            </a>
            <a
              href="https://radiopaedia.org/articles/musculoskeletal-curriculum"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-link"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 19V13C9 11.8954 8.10457 11 7 11H5C3.89543 11 3 11.8954 3 13V19C3 20.1046 3.89543 21 5 21H7C8.10457 21 9 20.1046 9 19Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15 19V15C15 13.8954 14.1046 13 13 13H11C9.89543 13 9 13.8954 9 15V19C9 20.1046 9.89543 21 11 21H13C14.1046 21 15 20.1046 15 19Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 19V12C21 10.8954 20.1046 10 19 10H17C15.8954 10 15 10.8954 15 12V19C15 20.1046 15.8954 21 17 21H19C20.1046 21 21 20.1046 21 19Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Anatomy Atlas
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
