import React, { useEffect, useRef } from 'react';

interface StripeBuyButtonProps {
  buyButtonId: string;
  publishableKey: string;
}

/** Escape HTML special characters to prevent attribute injection */
function escapeAttr(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const StripeBuyButton = ({ buyButtonId, publishableKey }: StripeBuyButtonProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const existingScript = document.querySelector('script[src="https://js.stripe.com/v3/buy-button.js"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/buy-button.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div ref={containerRef} className="stripe-buy-button-wrapper">
      <div
        dangerouslySetInnerHTML={{
          __html: `<stripe-buy-button buy-button-id="${escapeAttr(buyButtonId)}" publishable-key="${escapeAttr(publishableKey)}"></stripe-buy-button>`,
        }}
      />
    </div>
  );
};

export default StripeBuyButton;
