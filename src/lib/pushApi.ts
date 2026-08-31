const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

/**
 * Registers a Web Push subscription with the backend so an admin campaign can later reach
 * this visitor. Uses the native Push API subscription shape (endpoint + p256dh/auth keys) —
 * no third-party push provider involved.
 */
export async function registerPushSubscription(subscription: PushSubscriptionJSON): Promise<void> {
  if (!API_BASE || !subscription.endpoint || !subscription.keys) return;
  try {
    const res = await fetch(`${API_BASE}/push/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        keys: subscription.keys,
      }),
    });
    if (!res.ok) {
      console.warn("Push subscribe endpoint rejected the subscription:", res.status);
    }
  } catch (err) {
    console.warn("Failed to register push subscription:", err);
  }
}
