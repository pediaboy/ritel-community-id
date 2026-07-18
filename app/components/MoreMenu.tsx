"use client";
import { useEffect, useRef, useState } from "react";

function DotsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="5" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="19" r="2" />
    </svg>
  );
}

export type MoreMenuItem = {
  id: string;
  label: string;
  onSelect: () => void;
  active?: boolean;
};

/**
 * "Titik 3" dropdown menu trigger — replaces horizontal tab bars / nav lists.
 * Click the three-dot button to reveal a scrollable list of items.
 */
export default function MoreMenu({
  items,
  className = "",
  align = "right",
}: {
  items: MoreMenuItem[];
  className?: string;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        aria-label="Menu"
        className="more-menu-trigger"
        onClick={() => setOpen((v) => !v)}
      >
        <DotsIcon />
      </button>

      {open && (
        <div
          className="more-menu-panel"
          style={align === "left" ? { right: "auto", left: 0 } : undefined}
        >
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`more-menu-item ${item.active ? "active" : ""}`}
              onClick={() => {
                item.onSelect();
                setOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
