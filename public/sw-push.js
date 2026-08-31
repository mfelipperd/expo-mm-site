// Web Push service worker — no third-party SDK, just the native Push API.

self.addEventListener("push", (event) => {
  let data = { title: "Expo MultiMix", body: "" };
  try {
    if (event.data) data = event.data.json();
  } catch {
    data.body = event.data ? event.data.text() : "";
  }

  const url = data.url || "https://www.expomultimix.com.br";

  event.waitUntil(
    self.registration.showNotification(data.title || "Expo MultiMix", {
      body: data.body || "",
      icon: "/assets/logo EMM_Prancheta 1.png",
      data: { url },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "https://www.expomultimix.com.br";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && "focus" in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
