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
        <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-4 md:flex items-center justify-between gap-4">
          <div className="flex-1 text-sm text-gray-600 mb-4 md:mb-0">
            <p className="font-medium text-gray-900 mb-1">Privacidade e Notificações</p>
            <p>
              Utilizamos cookies para melhorar sua experiência. Ao aceitar, você também concorda em receber
              notificações sobre as feiras e novidades.
            </p>
          </div>
          <div className="flex items-center gap-3 whitespace-nowrap">
            <button
              onClick={handleDecline}
              className="text-sm text-gray-500 hover:text-gray-800 px-4 py-2 transition-colors"
            >
              Agora não
            </button>
            <button
              onClick={handleAccept}
              className="text-sm bg-black text-white px-6 py-2.5 rounded-xl hover:bg-gray-800 transition-colors font-medium shadow-lg shadow-black/10"
            >
              Aceitar e Continuar
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
