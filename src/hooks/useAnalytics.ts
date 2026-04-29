import { useCallback } from 'react';

export function useAnalytics(lang: string, darkMode: boolean) {
  const trackEvent = useCallback((action: string, details: any = {}) => {
    const payload = {
      action,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      lang,
      theme: darkMode ? 'dark' : 'light',
      ...details
    };
    console.log("[Analytics Tracked]", payload);
  }, [lang, darkMode]);

  return trackEvent;
}
