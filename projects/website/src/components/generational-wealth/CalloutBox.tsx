import React from "react";

type CalloutType = "family-note" | "pro-tip" | "heads-up" | "the-law";

const DEFAULT_TITLES: Record<CalloutType, string> = {
  "family-note": "Family Note",
  "pro-tip": "Pro Tip",
  "heads-up": "Heads Up",
  "the-law": "The Law",
};

interface CalloutBoxProps {
  type: CalloutType;
  title?: string;
  children: React.ReactNode;
}

const CalloutBox = ({ type, title, children }: CalloutBoxProps) => {
  const displayTitle = title ?? DEFAULT_TITLES[type];

  return (
    <div className={`gw-callout gw-callout--${type}`}>
      {displayTitle && (
        <div className="gw-callout__title">{displayTitle}</div>
      )}
      <div className="gw-callout__body">{children}</div>
    </div>
  );
};

export default CalloutBox;
