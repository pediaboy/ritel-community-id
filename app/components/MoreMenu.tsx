"use client";
import { useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";

export type MoreMenuItem = {
  id: string;
  label: string;
  onSelect: () => void;
  active?: boolean;
  icon?: React.ReactNode;
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
        <MoreVertical size={18} strokeWidth={2.4} />
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
              {item.icon && (
                <span style={{ display: "inline-flex", alignItems: "center", marginRight: 9, opacity: item.active ? 1 : 0.6 }}>
                  {item.icon}
                </span>
              )}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
