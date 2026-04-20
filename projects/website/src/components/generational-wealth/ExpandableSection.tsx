import React, { useState } from "react";

interface ExpandableSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const ExpandableSection = ({
  title,
  children,
  defaultOpen = false,
}: ExpandableSectionProps) => {
  const [open, setOpen] = useState(defaultOpen);

  const toggle = () => setOpen((prev) => !prev);

  return (
    <div className="gw-expandable">
      <div
        className="gw-expandable__header"
        onClick={toggle}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") toggle();
        }}
      >
        <span className="gw-expandable__title">{title}</span>
        <i
          className={`fa-sharp fa-solid fa-chevron-down gw-expandable__chevron${
            open ? " gw-expandable__chevron--open" : ""
          }`}
        />
      </div>
      <div className={`gw-expandable__body${open ? " gw-expandable__body--open" : ""}`}>
        <div className="gw-expandable__content">{children}</div>
      </div>
    </div>
  );
};

export default ExpandableSection;
