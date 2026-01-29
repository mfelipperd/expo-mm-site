"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface HeroProps {
  onVisitClick: () => void;
  onExposeClick: () => void;
}

export default function Hero({ onVisitClick, onExposeClick }: HeroProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background with Overlay */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <Image
          src="/assets/hero-bg.jpg"
          alt="Feira Expo MultiMix"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-brand-blue/80 via-brand-blue/40 to-brand-blue" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-brand-cyan font-bold tracking-widest mb-4 flex items-center justify-center gap-4"
        >
          <span className="h-px w-8 bg-brand-cyan block"></span>
          MANAUS 09-11 JUN | BELÉM 18-20 AGO
          <span className="h-px w-8 bg-brand-cyan block"></span>
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-tight"
        >
          A MAIOR FEIRA <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-pink to-brand-orange">
            MULTISSETORIAL
          </span>{" "}
          <br />
          DO <span className="text-brand-white">NORTE</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-lg md:text-xl text-gray-300 mb-8 md:mb-10 max-w-2xl mx-auto"
        >
          Exclusiva para lojistas e empreendedores. O ponto de encontro ideal para renovar estoques e fortalecer parcerias.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col md:flex-row gap-4 justify-center"
        >
          <button 
            onClick={onVisitClick}
            className="bg-brand-pink hover:bg-brand-pink/90 text-white px-8 py-4 rounded-full font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(233,30,99,0.3)]"
          >
            QUERO VISITAR
          </button>
          <button 
            onClick={onExposeClick}
            className="glass hover:bg-white/10 text-white px-8 py-4 rounded-full font-bold transition-all hover:scale-105"
          >
            SER UM EXPOSITOR
          </button>
        </motion.div>
      </div>

      {/* Floating Elements (Decorative) */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-brand-pink/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-cyan/10 rounded-full blur-3xl animate-pulse delay-1000" />
    </section>
  );
}
