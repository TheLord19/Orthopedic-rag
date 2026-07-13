// src/components/ui/Tabs.js
"use client";

export default function Tabs({
  items,
  activeId,
  onChange,
  ariaLabel = "Tabs",
}) {
  return (
    <div className="segmented" role="tablist" aria-label={ariaLabel}>
      {items.map((item) => (
        <button
          key={item.id}
          role="tab"
          aria-selected={activeId === item.id}
          className={`segmented-tab ${activeId === item.id ? "active" : ""}`.trim()}
          onClick={() => onChange(item.id)}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );
}
