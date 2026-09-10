import { trackEvent } from "@/lib/analytics";

// Único contato de WhatsApp do site — Emmelly, comercial.
const WHATSAPP_NUMBER = "5591986357418";

export function buildWhatsAppLink(message?: string): string {
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${WHATSAPP_NUMBER}${text}`;
}

function isIOSDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const isAppleMobile = /iPad|iPhone|iPod/.test(ua);
  // iPadOS 13+ reports as a desktop Mac in the UA string but exposes multi-touch, unlike a real Mac.
  const isIPadOS13Plus = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return isAppleMobile || isIPadOS13Plus;
}

function isSafariBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return /safari/i.test(ua) && !/crios|fxios|edgios|opios|chrome|android/i.test(ua);
}

export function isIOSSafari(): boolean {
  return isIOSDevice() && isSafariBrowser();
}

/**
 * iOS Safari unreliably handles window.open("_blank") for external app links like wa.me —
 * it can silently no-op instead of prompting to open WhatsApp. Navigating the current tab
 * is what reliably triggers that prompt there, so iOS Safari gets a same-tab redirect while
 * every other browser opens WhatsApp in a new tab.
 */
export function openWhatsApp(message?: string): void {
  // Never send the message body: it can carry PII typed into forms (name, company).
  trackEvent("whatsapp_click");
  const link = buildWhatsAppLink(message);
  if (isIOSSafari()) {
    window.location.href = link;
  } else {
    window.open(link, "_blank", "noopener,noreferrer");
  }
}
