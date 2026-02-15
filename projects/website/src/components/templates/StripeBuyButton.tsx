import React, { useEffect, useRef } from 'react';

interface StripeBuyButtonProps {
  buyButtonId: string;
  publishableKey: string;
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
          __html: `<stripe-buy-button buy-button-id="${buyButtonId}" publishable-key="${publishableKey}"></stripe-buy-button>`,
        }}
      />
    </div>
  );
};

export default StripeBuyButton;
