"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Building2 } from "lucide-react";
import type { UserType } from "@/hooks/useFairRouting";

interface WhoAreYouSheetProps {
  show: boolean;
  onSelect: (type: UserType) => void;
  onDismiss: () => void;
}

export default function WhoAreYouSheet({ show, onSelect, onDismiss }: WhoAreYouSheetProps) {
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
        <>
          {/* ── Mobile: bottom sheet ───────────────────────────── */}
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 md:hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
          >
            <div className="bg-[#0a1628] border-t border-white/10 rounded-t-3xl px-6 pt-4 pb-10 shadow-2xl">
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />
              <SheetContent onSelect={onSelect} onDismiss={onDismiss} />
            </div>
          </motion.div>

          {/* Mobile backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onDismiss}
          />

          {/* ── Desktop: floating card ─────────────────────────── */}
          <motion.div
            className="fixed bottom-6 right-6 z-50 hidden md:block w-72"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.35 }}
          >
            <div className="bg-[#0a1628] border border-white/10 rounded-2xl p-5 shadow-2xl">
              <SheetContent onSelect={onSelect} onDismiss={onDismiss} compact />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SheetContent({
  onSelect,
  onDismiss,
  compact = false,
}: {
  onSelect: (type: UserType) => void;
  onDismiss: () => void;
  compact?: boolean;
}) {
  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[10px] font-bold tracking-widest text-brand-cyan uppercase mb-1">
            Expo MultiMix
          </p>
          <h3 className={`font-black leading-tight ${compact ? "text-base" : "text-xl"}`}>
            Como você vai participar?
          </h3>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="text-gray-500 hover:text-white transition-colors mt-0.5 shrink-0"
          aria-label="Fechar"
        >
          <X size={18} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onSelect("lojista")}
          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-brand-pink/10 border border-brand-pink/20 hover:bg-brand-pink/20 transition-all group"
        >
          <ShoppingBag
            size={compact ? 20 : 26}
            className="text-brand-pink group-hover:scale-110 transition-transform"
          />
          <span className="font-black text-xs text-brand-pink">SOU LOJISTA</span>
          {!compact && (
            <span className="text-[10px] text-gray-500 text-center leading-tight">
              Quero visitar e comprar
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onSelect("expositor")}
          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 hover:bg-brand-cyan/20 transition-all group"
        >
          <Building2
            size={compact ? 20 : 26}
            className="text-brand-cyan group-hover:scale-110 transition-transform"
          />
          <span className="font-black text-xs text-brand-cyan">SOU EXPOSITOR</span>
          {!compact && (
            <span className="text-[10px] text-gray-500 text-center leading-tight">
              Quero expor minha marca
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
