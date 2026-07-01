"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X } from "lucide-react";

type CityChoice = "manaus" | "belem" | "outros";

interface RegionSelectorSheetProps {
  show: boolean;
  onSelect: (choice: CityChoice) => void;
}

export default function RegionSelectorSheet({ show, onSelect }: RegionSelectorSheetProps) {
  const [visible, setVisible] = useState(false);

  // Delayed appearance so it doesn't flash on load
  useEffect(() => {
    if (!show) { setVisible(false); return; }
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, [show]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed z-50 inset-x-4 top-20 md:inset-x-auto md:top-auto md:bottom-6 md:right-6 md:w-72"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35 }}
        >
          <div className="bg-[#0a1628] border border-white/10 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[10px] font-bold tracking-widest text-brand-cyan uppercase mb-1">
                  Expo MultiMix
                </p>
                <h3 className="font-black leading-tight text-base flex items-center gap-2">
                  <MapPin size={16} className="text-brand-cyan shrink-0" />
                  De onde você é?
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onSelect("outros")}
                className="text-gray-500 hover:text-white transition-colors mt-0.5 shrink-0"
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <button
                type="button"
                onClick={() => onSelect("belem")}
                className="flex flex-col items-center gap-1 p-4 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 hover:bg-brand-cyan/20 transition-all"
              >
                <span className="font-black text-xs text-brand-cyan">BELÉM</span>
              </button>
              <button
                type="button"
                onClick={() => onSelect("manaus")}
                className="flex flex-col items-center gap-1 p-4 rounded-xl bg-brand-pink/10 border border-brand-pink/20 hover:bg-brand-pink/20 transition-all"
              >
                <span className="font-black text-xs text-brand-pink">MANAUS</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => onSelect("outros")}
              className="w-full text-center text-[11px] text-gray-500 hover:text-gray-300 transition-colors"
            >
              Sou de outra região
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
