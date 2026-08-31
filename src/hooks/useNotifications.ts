"use client";

import { useCallback, useEffect, useState } from "react";
import { registerPushSubscription } from "@/lib/pushApi";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

// applicationServerKey must be a Uint8Array, but env vars are strings — this is the
// standard base64url -> Uint8Array conversion documented for the Push API.
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const output = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    output[i] = rawData.charCodeAt(i);
  }
  return output;
}

interface UseNotificationsOptions {
  listen?: boolean;
}

export function useNotifications(_options?: UseNotificationsOptions) {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "default"
  );

  const canUsePush =
    typeof window !== "undefined" &&
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    !!VAPID_PUBLIC_KEY;

  // Registers (or re-registers) this browser's subscription with the backend.
  // Idempotent: getSubscription() returns the existing one if there is one,
  // and the backend dedupes by endpoint — safe to call on every mount.
  const subscribeAndRegister = useCallback(async () => {
    if (!canUsePush) return;
    const registration = await navigator.serviceWorker.register("/sw-push.js");
    const existing = await registration.pushManager.getSubscription();
    const subscription =
      existing ??
      (await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY as string),
      }));

    await registerPushSubscription(subscription.toJSON());
  }, [canUsePush]);

  const requestPermission = useCallback(async () => {
    if (!canUsePush) return;

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result !== "granted") return;

      await subscribeAndRegister();
    } catch (err) {
      console.error("Failed to enable push notifications:", err);
    }
  }, [canUsePush, subscribeAndRegister]);

  // Self-heal: the privacy banner that triggers requestPermission() only ever
  // shows once per browser (gated by its own localStorage flag), so a visitor
  // who already granted Notification permission in an earlier visit — e.g.
  // before a bug fix or env var landed — would never get a second chance to
  // subscribe. If the browser already says "granted", make sure the backend
  // actually has this subscription on every load, without asking again.
  useEffect(() => {
    if (!canUsePush || Notification.permission !== "granted") return;
    subscribeAndRegister().catch((err) =>
      console.error("Failed to re-sync push subscription:", err)
    );
  }, [canUsePush, subscribeAndRegister]);

  return { requestPermission, permission };
}
