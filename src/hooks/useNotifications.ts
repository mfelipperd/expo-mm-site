// Firebase Messaging removed. Push notifications via backend webhook — see docs/backend-public-api-requirements.md.
// This hook is a no-op stub kept for compatibility.

export function useNotifications(_options?: { listen?: boolean }) {
  const requestPermission = async () => {
    // No-op: push notifications not yet implemented via the new API.
    // Will be re-enabled after the backend delivers the webhook endpoint.
    console.info("Push notifications pending backend implementation.");
  };

  return { requestPermission, permission: "default" as NotificationPermission };
}
