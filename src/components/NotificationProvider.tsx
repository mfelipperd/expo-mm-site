"use client";

import { useNotifications } from "@/hooks/useNotifications";
import ConsentBanner from "@/components/ConsentBanner";

export default function NotificationProvider({ children }: { children: React.ReactNode }) {
  useNotifications(); // Keeps listening for messages
  return (
    <>
      {children}
      <ConsentBanner />
    </>
  );
}
