import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '../lib/monitoring/analytics';
import { ConsentManager } from '../lib/security/consent';

export function useAnalytics() {
  const location = useLocation();

  useEffect(() => {
    const consent = ConsentManager.getConsent();
    if (consent.analytics) {
      analytics.page(location.pathname);
    }
  }, [location]);

  const track = (event: string, properties?: Record<string, any>) => {
    const consent = ConsentManager.getConsent();
    if (consent.analytics) {
      analytics.track(event, properties);
    }
  };

  return { track };
}