"use client";

import { useCallback, useEffect, useState } from "react";
import type { Messaging } from "firebase/messaging";
import { registerPushToken } from "@/lib/pushApi";

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

interface UseNotificationsOptions {
  /** Listen for foreground push messages (tab open) while mounted. */
  listen?: boolean;
}

export function useNotifications(_options?: UseNotificationsOptions) {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "default"
  );

  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window) || !("serviceWorker" in navigator) || !VAPID_KEY) {
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result !== "granted") return;

      const { messaging } = await import("@/lib/firebase");
      if (!messaging) return;

      const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      const { getToken } = await import("firebase/messaging");
      const token = await getToken(messaging as Messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration,
      });
      if (token) await registerPushToken(token);
    } catch (err) {
      console.error("Failed to enable push notifications:", err);
    }
  }, []);

  useEffect(() => {
    if (!_options?.listen || typeof window === "undefined") return;

    let unsubscribe: (() => void) | undefined;
    (async () => {
      const { messaging } = await import("@/lib/firebase");
      if (!messaging) return;
      const { onMessage } = await import("firebase/messaging");
      unsubscribe = onMessage(messaging as Messaging, (payload) => {
        console.info("Foreground push received:", payload);
      });
    })();

    return () => unsubscribe?.();
  }, [_options?.listen]);

  return { requestPermission, permission };
}
