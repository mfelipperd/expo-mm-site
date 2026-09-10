type EventParams = Record<string, string | number>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: string, params?: EventParams): void {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params);
}
