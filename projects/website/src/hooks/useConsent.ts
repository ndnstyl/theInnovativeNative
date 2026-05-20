import { useState, useEffect, useCallback } from 'react';

type ConsentStatus = 'pending' | 'accepted' | 'declined';

const CONSENT_KEY = 'tin_analytics_consent';

export function useConsent() {
  const [consent, setConsent] = useState<ConsentStatus>('pending');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === 'accepted' || stored === 'declined') {
      setConsent(stored);
    }
  }, []);

  const accept = useCallback(() => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setConsent('accepted');
  }, []);

  const decline = useCallback(() => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setConsent('declined');
  }, []);

  return { consent, accept, decline };
}
