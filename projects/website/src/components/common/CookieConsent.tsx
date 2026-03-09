import React from 'react';
import { useConsent } from '@/hooks/useConsent';

const CookieConsent: React.FC = () => {
  const { consent, accept, decline } = useConsent();

  if (consent !== 'pending') return null;

  return (
    <div className="cookie-consent">
      <div className="cookie-consent__content">
        <p>
          We use cookies and analytics to improve your experience. This includes
          Google Analytics and Meta Pixel for measuring site performance.
        </p>
        <div className="cookie-consent__actions">
          <button className="cookie-consent__accept" onClick={accept}>
            Accept
          </button>
          <button className="cookie-consent__decline" onClick={decline}>
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
