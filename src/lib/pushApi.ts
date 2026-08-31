const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

/**
 * Registers an FCM push token with the backend so an admin campaign can later reach this visitor.
 *
 * NOTE: `POST /push/subscribe` does not exist on the backend yet (confirmed against the live
 * OpenAPI spec on 2026-08-31). This call fails silently until that endpoint is implemented —
 * it must not throw or otherwise disrupt the page.
 */
export async function registerPushToken(token: string): Promise<void> {
  if (!API_BASE) return;
  try {
    const res = await fetch(`${API_BASE}/push/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    if (!res.ok) {
      console.warn("Push subscribe endpoint not available yet:", res.status);
    }
  } catch (err) {
    console.warn("Failed to register push token:", err);
  }
}
