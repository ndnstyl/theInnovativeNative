import React, { useState, useRef, useEffect } from "react";
import glossaryData from "@/data/gw-glossary.json";
import Link from "next/link";

interface GlossaryTerm {
  term: string;
  full: string;
  definition: string;
  pages: string[];
}

interface GlossaryData {
  terms: GlossaryTerm[];
}

const glossary = (glossaryData as GlossaryData).terms;

function findTerm(text: string): GlossaryTerm | undefined {
  const normalized = text.trim().toLowerCase();
  return glossary.find((t) => t.term.toLowerCase() === normalized);
}

interface TooltipTermProps {
  children: React.ReactNode;
}

const TooltipTerm = ({ children }: TooltipTermProps) => {
  const text = typeof children === "string" ? children : String(children);
  const entry = findTerm(text);

  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!visible) return;
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setVisible(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [visible]);

  if (!entry) {
    return <>{children}</>;
  }

  return (
    <span
      ref={ref}
      className="gw-tooltip"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onClick={() => setVisible((v) => !v)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setVisible((v) => !v);
      }}
    >
      {children}
      {visible && (
        <span
          className={`gw-tooltip__popover gw-tooltip__popover--visible`}
          role="tooltip"
        >
          <div className="gw-tooltip__term">{entry.term}</div>
          <div className="gw-tooltip__full-name">{entry.full}</div>
          <div className="gw-tooltip__definition">{entry.definition}</div>
          <Link href="/generational-wealth/glossary" className="gw-tooltip__link">
            See full glossary &rarr;
          </Link>
        </span>
      )}
    </span>
  );
};

export { TooltipTerm as T };
export default TooltipTerm;
