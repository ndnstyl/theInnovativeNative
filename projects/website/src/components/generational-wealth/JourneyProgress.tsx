import React, { useState, useEffect } from "react";

interface ProgressStep {
  key: string;
  label: string;
  href: string;
}

const STEPS: ProgressStep[] = [
  { key: "eqip", label: "EQIP", href: "/generational-wealth/eqip" },
  { key: "financing", label: "Money", href: "/generational-wealth/financing" },
  { key: "due-diligence", label: "Due Diligence", href: "/generational-wealth/due-diligence" },
  { key: "contacts", label: "Contacts", href: "/generational-wealth/contacts" },
  { key: "timeline", label: "Timeline", href: "/generational-wealth/timeline" },
  { key: "glossary", label: "Glossary", href: "/generational-wealth/glossary" },
  { key: "dashboard", label: "Dashboard", href: "/generational-wealth" },
];

const JourneyProgress = () => {
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const v = new Set<string>();
    STEPS.forEach((step) => {
      const lsKey = `gw_progress_${step.key}`;
      if (localStorage.getItem(lsKey) === "1") {
        v.add(step.key);
      }
    });

    // Mark current page as visited
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      STEPS.forEach((step) => {
        if (path === step.href || path.startsWith(step.href + "/")) {
          const lsKey = `gw_progress_${step.key}`;
          localStorage.setItem(lsKey, "1");
          v.add(step.key);
        }
      });
    }

    setVisited(v);
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const visitedCount = visited.size;

  return (
    <div className="gw-progress">
      <p className="gw-progress__label">
        <span>{visitedCount}</span> of {STEPS.length} sections visited
      </p>
      <div className="gw-progress__steps">
        {STEPS.map((step) => {
          const isVisited = visited.has(step.key);
          return (
            <div
              key={step.key}
              className={`gw-progress__step${isVisited ? " gw-progress__step--visited" : ""}`}
            >
              <div className="gw-progress__dot">
                {isVisited ? (
                  <i className="fa-sharp fa-solid fa-check" style={{ fontSize: "0.6rem" }} />
                ) : null}
              </div>
              <span className="gw-progress__step-label">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JourneyProgress;
