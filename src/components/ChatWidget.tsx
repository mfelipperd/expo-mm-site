"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useRouter, usePathname } from "next/navigation";
import ChatContainer from "./ChatContainer";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isAIEnabled = process.env.NEXT_PUBLIC_ENABLE_AI_CHAT !== "false";

  // Hide widget on the dedicated chat page
  if (pathname === "/chat") return null;

  const handleToggle = () => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
    
    if (isMobile) {
      router.push("/chat");
    } else {
      setIsOpen(!isOpen);
    }
  };

  const closeChat = () => setIsOpen(false);

  useEffect(() => {
    const handleOpenChat = () => {
      if (window.innerWidth < 1024) {
        router.push("/chat");
      } else {
        setIsOpen(true);
      }
    };
    window.addEventListener("open-chat", handleOpenChat);
    return () => window.removeEventListener("open-chat", handleOpenChat);
  }, [router]);

  return (
    <>
      <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-90 flex flex-col items-end gap-3 sm:gap-4">
        <AnimatePresence>
          {isHovered && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="hidden sm:block bg-brand-blue/80 backdrop-blur-md border border-brand-cyan/30 text-brand-cyan text-xs font-bold py-2 px-4 rounded-full shadow-lg pointer-events-none mb-1 mr-2"
            >
              Falar com Atendente
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-brand-blue flex-col overflow-hidden fixed bottom-24 right-8 z-100 w-[400px] h-[600px] rounded-2xl shadow-2xl border border-white/10 hidden lg:flex"
            >
              <ChatContainer onClose={closeChat} isFullPage={false} />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleToggle}
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300",
            isOpen && "bg-white/10 text-white backdrop-blur-md",
            !isOpen && (
              !isAIEnabled 
                ? "bg-[#25D366] text-white"
                : "bg-brand-blue border-2 border-brand-cyan text-brand-cyan"
            )
          )}
          aria-label={isAIEnabled ? "Falar conosco" : "WhatsApp"}
        >
          {isOpen ? <X size={32} /> : <MessageSquare size={32} />}
          {(!isOpen && isAIEnabled) && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-pink opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-pink"></span>
            </span>
          )}
        </motion.button>
      </div>
    </>
  );
}
