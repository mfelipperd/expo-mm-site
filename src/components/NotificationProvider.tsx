"use client";

import { useNotifications } from "@/hooks/useNotifications";

export default function NotificationProvider({ children }: { children: React.ReactNode }) {
  useNotifications();
  return <>{children}</>;
}
