// src/components/layout/Header.js
"use client";

import { useEffect, useRef, useState } from "react";
import Modal from "@/components/ui/Modal";
import {
  THEME_STORAGE_KEY,
  ENSEMBLE_INFO,
  MEDICAL_DISCLAIMER,
} from "@/utils/constants";

function resolveTheme(pref) {
  if (pref === "light" || pref === "dark") return pref;
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
}

const SunIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
    <path
      d="M12 2V4M12 20V22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M2 12H4M20 12H22M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const MoonIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SystemIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="2"
      y="4"
      width="20"
      height="14"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M8 21H16M12 18V21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default function Header({ onMenuToggle, sidebarOpen }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [themePref, setThemePref] = useState("system");
  const [resolvedTheme, setResolvedTheme] = useState("light");
  const profileRef = useRef(null);

  useEffect(() => {
    let pref = "system";
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === "light" || stored === "dark") pref = stored;
    } catch {
      // storage unavailable
    }
    setThemePref(pref);
    setResolvedTheme(
      document.documentElement.dataset.theme || resolveTheme(pref),
    );
  }, []);

  useEffect(() => {
    if (!isProfileOpen) return undefined;
    const handleOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setIsProfileOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isProfileOpen]);

  const applyTheme = (pref) => {
    const resolved = resolveTheme(pref);
    document.documentElement.dataset.theme = resolved;
    setThemePref(pref);
    setResolvedTheme(resolved);
    try {
      if (pref === "system") localStorage.removeItem(THEME_STORAGE_KEY);
      else localStorage.setItem(THEME_STORAGE_KEY, pref);
    } catch {
      // storage unavailable
    }
  };

  const toggleTheme = () =>
    applyTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <header className="header">
      <div className="header-left">
        <button
          className="menu-toggle"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
          aria-expanded={sidebarOpen}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 12H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M3 6H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M3 18H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="logo">
          <div className="logo-icon">
            <svg
              width="24"
              height="24"
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
          <h1>OrthoInsight</h1>
          <span className="beta-tag">Beta</span>
        </div>
      </div>

      <div className="header-center">
        <span className="mode-indicator">
          <span className="mode-dot" aria-hidden="true" />
          MURA Ensemble · {ENSEMBLE_INFO.models} models ·{" "}
          {(ENSEMBLE_INFO.accuracy * 100).toFixed(1)}% val acc
        </span>
      </div>

      <div className="header-right">
        <button
          className="header-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
          title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
        >
          {resolvedTheme === "dark" ? SunIcon : MoonIcon}
        </button>

        <button className="header-btn" aria-label="Notifications">
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="notif-dot" aria-hidden="true" />
        </button>

        <div className="user-profile" ref={profileRef}>
          <button
            className="profile-btn"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            aria-label="User profile"
            aria-expanded={isProfileOpen}
          >
            <div className="avatar">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>

          {isProfileOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <strong>Guest Clinician</strong>
                <span>Research preview</span>
              </div>
              <div className="dropdown-divider" />
              <button
                className="dropdown-item"
                onClick={() => {
                  setIsProfileOpen(false);
                  setSettingsOpen(true);
                }}
              >
                Settings
              </button>
              <button
                className="dropdown-item"
                onClick={() => setIsProfileOpen(false)}
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Settings"
      >
        <div className="settings-section">
          <h4>Appearance</h4>
          <div className="theme-options">
            {[
              { id: "light", label: "Light", icon: SunIcon },
              { id: "dark", label: "Dark", icon: MoonIcon },
              { id: "system", label: "System", icon: SystemIcon },
            ].map((option) => (
              <button
                key={option.id}
                className={`theme-option ${themePref === option.id ? "active" : ""}`.trim()}
                onClick={() => applyTheme(option.id)}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <div className="settings-section">
          <h4>About</h4>
          <p>
            OrthoInsight pairs a retrieval-augmented research assistant with a{" "}
            {ENSEMBLE_INFO.models}-model deep-learning ensemble trained on{" "}
            {ENSEMBLE_INFO.dataset} for musculoskeletal X-ray abnormality
            detection ({(ENSEMBLE_INFO.accuracy * 100).toFixed(2)}% validation
            accuracy).
          </p>
        </div>
        <div className="settings-section">
          <h4>Disclaimer</h4>
          <p>{MEDICAL_DISCLAIMER}</p>
        </div>
      </Modal>
    </header>
  );
}
