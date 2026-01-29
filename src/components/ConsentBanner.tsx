"use client";

import { useState, useEffect } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { AnimatePresence, motion } from "framer-motion";

export default function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const { requestPermission } = useNotifications({ listen: false });

  useEffect(() => {
    // Check if user has already consented
    const consented = localStorage.getItem("app_consent");
    if (!consented) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = async () => {
    localStorage.setItem("app_consent", "true");
    setShowBanner(false);
    
    // Request notification permission on accept
    await requestPermission();
  };

  const handleDecline = () => {
    localStorage.setItem("app_consent", "false");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4"
      >
        <div className="max-w-4xl mx-auto glass-dark rounded-2xl p-6 md:flex items-center justify-between gap-6 shadow-2xl border border-white/10">
          <div className="flex-1 text-sm text-gray-300 mb-4 md:mb-0">
            <p className="font-bold text-white text-lg mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse"></span>
              Privacidade e Notificações
            </p>
            <p className="leading-relaxed text-gray-400">
              Utilizamos cookies para melhorar sua experiência. Ao aceitar, você também concorda em receber
              notificações exclusivas sobre as feiras e novidades.
            </p>
          </div>
          <div className="flex items-center gap-3 whitespace-nowrap">
            <button
              onClick={handleDecline}
              className="text-sm text-gray-400 hover:text-white px-4 py-3 transition-colors font-medium"
            >
              Agora não
            </button>
            <button
              onClick={handleAccept}
              className="text-sm bg-brand-pink text-white px-8 py-3 rounded-xl hover:bg-brand-pink/80 transition-all font-bold shadow-[0_0_15px_rgba(233,30,99,0.3)] hover:scale-105"
            >
              Aceitar e Continuar
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
