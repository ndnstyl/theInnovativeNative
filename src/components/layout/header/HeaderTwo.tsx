import React from "react";
import Link from "next/link";

const HeaderTwo = () => {
  const openCalendly = () => {
    if (typeof window !== 'undefined' && (window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({
        url: 'https://calendly.com/mike-buildmytribe/ai-discovery-call'
      });
    }
  };

  return (
    <header className="header">
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          zIndex: 1000,
          padding: '20px 30px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '10px',
        }}
      >
        <Link
          href="/"
          className="btn btn--secondary"
          style={{ fontSize: '14px', padding: '10px 20px' }}
        >
          Home
        </Link>
        <button
          onClick={openCalendly}
          className="btn btn--secondary"
          style={{ fontSize: '14px', padding: '10px 20px' }}
        >
          Book Discovery Call
        </button>
      </div>
    </header>
  );
};

export default HeaderTwo;
