"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  variant?: "pink" | "cyan" | "orange";
  onClick?: () => void;
}

export default function CTASection({
  title = "QUER EXPOR SEUS PRODUTOS?",
  subtitle = "Garanta seu lugar na maior vitrine de negócios do Norte brasileiro.",
  buttonText = "RESERVE SEU STAND AGORA",
  variant = "orange",
  onClick,
}: CTASectionProps) {
  const variants = {
    pink: "bg-brand-pink shadow-[0_0_30px_rgba(233,30,99,0.4)]",
    cyan: "bg-brand-cyan shadow-[0_0_30px_rgba(0,188,212,0.4)]",
    orange: "bg-brand-orange shadow-[0_0_30px_rgba(255,112,67,0.4)]",
  };

  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-dark border-2 border-white/10 rounded-[3rem] p-8 md:p-20 text-center relative overflow-hidden"
        >
          {/* Decorative glows */}
          <div className={`absolute -top-24 -left-24 w-64 h-64 rounded-full blur-[100px] opacity-20 ${variants[variant].split(' ')[0]}`} />
          <div className={`absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-[100px] opacity-20 ${variants[variant].split(' ')[0]}`} />

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-6 tracking-tighter">
              {title}
            </h2>
            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              {subtitle}
            </p>
            <button
              onClick={onClick}
              className={`${variants[variant]} text-white px-10 py-5 rounded-full font-black text-lg inline-flex items-center gap-3 transition-all transform hover:scale-105 hover:brightness-110 active:scale-95`}
            >
              {buttonText}
              <ArrowRight size={24} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
