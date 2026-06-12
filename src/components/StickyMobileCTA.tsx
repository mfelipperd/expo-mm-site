"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StickyMobileCTAProps {
  onVisitClick: () => void;
  onExposeClick: () => void;
}

export default function StickyMobileCTA({ onVisitClick, onExposeClick }: StickyMobileCTAProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 280);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-0 inset-x-0 z-40 md:hidden"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 260 }}
        >
          <div
            className="bg-brand-blue/95 backdrop-blur-md border-t border-white/10 px-4 pt-3"
            style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
          >
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={onVisitClick}
                className="bg-brand-pink text-white py-4 rounded-2xl font-black text-sm active:scale-95 transition-transform shadow-[0_0_24px_rgba(233,30,99,0.25)]"
              >
                SOU LOJISTA
              </button>
              <button
                type="button"
                onClick={onExposeClick}
                className="bg-brand-orange text-white py-4 rounded-2xl font-black text-sm active:scale-95 transition-transform shadow-[0_0_24px_rgba(251,146,60,0.25)]"
              >
                SOU EXPOSITOR
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
