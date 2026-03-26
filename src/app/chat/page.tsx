"use client";

import ChatContainer from "@/components/ChatContainer";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ChatPage() {
  const router = useRouter();

  // Handle back button specifically if needed, 
  // though ChatContainer's onClose already handles it
  const handleClose = () => {
    router.back();
  };

  return (
    <main className="fixed inset-0 z-100 bg-brand-blue overflow-hidden touch-none">
      <ChatContainer onClose={handleClose} isFullPage={true} />
    </main>
  );
}
