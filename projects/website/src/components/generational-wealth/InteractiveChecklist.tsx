import React, { useState, useEffect } from "react";

interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
}

interface InteractiveChecklistProps {
  pageKey: string;
  items: ChecklistItem[];
}

function getKey(pageKey: string, id: string) {
  return `gw_checklist_${pageKey}_${id}`;
}

const InteractiveChecklist = ({ pageKey, items }: InteractiveChecklistProps) => {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial: Record<string, boolean> = {};
    items.forEach((item) => {
      initial[item.id] = localStorage.getItem(getKey(pageKey, item.id)) === "true";
    });
    setChecked(initial);
    setMounted(true);
  }, [pageKey, items]);

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem(getKey(pageKey, id), String(next[id]));
      return next;
    });
  };

  const completedCount = Object.values(checked).filter(Boolean).length;

  if (!mounted) return null;

  return (
    <div className="gw-checklist">
      <p className="gw-checklist__progress">
        <span>{completedCount}</span> of {items.length} completed
      </p>
      {items.map((item) => (
        <div
          key={item.id}
          className={`gw-checklist__item${checked[item.id] ? " gw-checklist__item--checked" : ""}`}
          onClick={() => toggle(item.id)}
          role="checkbox"
          aria-checked={checked[item.id] ?? false}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") toggle(item.id);
          }}
        >
          <div
            className={`gw-checklist__checkbox${
              checked[item.id] ? " gw-checklist__checkbox--checked" : ""
            }`}
          />
          <div className="gw-checklist__text">
            <span className="gw-checklist__label">{item.label}</span>
            {item.description && (
              <span className="gw-checklist__description">{item.description}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default InteractiveChecklist;
