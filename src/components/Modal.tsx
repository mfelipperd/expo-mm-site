"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-0 md:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-blue/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full h-full md:h-auto md:max-h-[90vh] md:max-w-lg glass-dark border-0 md:border md:border-white/10 rounded-none md:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header / Fixed Actions */}
            <div className="flex-none p-6 md:p-8 md:pb-0 flex justify-end absolute top-0 right-0 z-50 w-full pointer-events-none">
                <button
                  onClick={onClose}
                  className="pointer-events-auto bg-black/20 hover:bg-black/40 text-gray-400 hover:text-white p-2 rounded-full transition-colors backdrop-blur-sm"
                >
                  <X size={24} />
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-12 pt-12 md:pt-12 custom-scrollbar">
                {title && (
                <h3 className="text-2xl md:text-3xl font-black mb-8 pr-8 leading-tight">
                    {title}
                </h3>
                )}

                <div className="relative z-10">{children}</div>
            </div>
          </motion.div>


        </div>
      )}
    </AnimatePresence>
  );
}
