"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";

interface HeroProps {
  onVisitClick: () => void;
  onExposeClick: () => void;
  detectedCity?: "manaus" | "belem" | null;
}

interface LogoItem {
  id?: string;
  imageUrl?: string;
  url?: string;
  logoUrl?: string;
  clientName?: string;
  name?: string;
}

function resolveLogoUrl(item: LogoItem): string | null {
  return item.imageUrl ?? item.logoUrl ?? item.url ?? null;
}

function resolveName(item: LogoItem): string {
  return item.clientName ?? item.name ?? "Marca";
}

const SLIDE_DURATION = 5000;
const TOTAL_SLIDES = 3;

export default function Hero({ onVisitClick, onExposeClick, detectedCity }: HeroProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [logos, setLogos] = useState<LogoItem[]>([]);
  const [progress, setProgress] = useState(0);

  // Fetch logos for the grid slide
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return;
    fetch(`${apiUrl}/finance/clients/images`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        const items: LogoItem[] = Array.isArray(data) ? data : (data.data ?? []);
        setLogos(items.filter(resolveLogoUrl).slice(0, 16));
      })
      .catch(() => {});
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % TOTAL_SLIDES);
    setProgress(0);
  }, []);

  // Auto-advance + progress bar
  useEffect(() => {
    if (paused) return;
    setProgress(0);
    const start = Date.now();
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(tick);
        next();
      }
    }, 50);
    return () => clearInterval(tick);
  }, [current, paused, next]);

  const dateLine =
    detectedCity === "manaus"
      ? "MANAUS · 09-11 JUNHO"
      : detectedCity === "belem"
      ? "BELÉM · 18-20 AGOSTO"
      : "MANAUS 09-11 JUN · BELÉM 18-20 AGO";

  return (
    <section
      ref={ref}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Parallax background */}
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

      {/* Decorative blobs */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-brand-pink/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-cyan/10 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none" />

      {/* Slide content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center">
        {/* Date label */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-brand-cyan font-bold tracking-widest mb-6 flex items-center justify-center gap-4 text-sm"
        >
          <span className="h-px w-8 bg-brand-cyan block" />
          {dateLine}
          <span className="h-px w-8 bg-brand-cyan block" />
        </motion.p>

        {/* Carousel area */}
        <div className="min-h-[320px] md:min-h-[360px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {current === 0 && (
              <SlideUrgency key="slide-0" onVisitClick={onVisitClick} onExposeClick={onExposeClick} />
            )}
            {current === 1 && (
              <SlideLogos key="slide-1" logos={logos} onVisitClick={onVisitClick} />
            )}
            {current === 2 && (
              <SlideDirectFactory key="slide-2" onVisitClick={onVisitClick} onExposeClick={onExposeClick} />
            )}
          </AnimatePresence>
        </div>

        {/* Dot indicators + progress */}
        <div className="flex items-center justify-center gap-3 mt-8">
          {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { setCurrent(i); setProgress(0); }}
              aria-label={`Ir para slide ${i + 1}`}
              className={`relative h-1.5 rounded-full overflow-hidden transition-all duration-300 focus:outline-none bg-white/20 ${i === current ? "w-12" : "w-4"}`}
            >
              {i === current && (
                <motion.span
                  className="absolute inset-y-0 left-0 bg-brand-cyan rounded-full"
                  style={{ width: `${progress}%` }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Slide 1 — Urgência ─────────────────────────────────────── */
function SlideUrgency({ onVisitClick, onExposeClick }: { onVisitClick: () => void; onExposeClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-tight">
        UMA VEZ POR ANO, <br />
        OS FORNECEDORES <br />
        <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-pink to-brand-orange">
          CHEGAM ATÉ VOCÊ
        </span>
      </h1>
      <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
        Negocie direto com quem fabrica. Preços de fábrica, prazos imbatíveis e condições exclusivas — sem precisar pegar avião para São Paulo.
      </p>
      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <button
          type="button"
          onClick={onVisitClick}
          className="bg-brand-pink hover:bg-brand-pink/90 text-white px-8 py-4 rounded-full font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(233,30,99,0.3)]"
        >
          QUERO VISITAR
        </button>
        <button
          type="button"
          onClick={onExposeClick}
          className="glass hover:bg-white/10 text-white px-8 py-4 rounded-full font-bold transition-all hover:scale-105"
        >
          SER UM EXPOSITOR
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Slide 2 — Grid de logos ────────────────────────────────── */
function SlideLogos({ logos, onVisitClick }: { logos: LogoItem[]; onVisitClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <p className="text-brand-cyan font-bold tracking-[0.2em] uppercase text-sm mb-2">
        Presenças confirmadas
      </p>
      <h2 className="text-3xl md:text-5xl font-black mb-8 text-white">
        QUEM ESTARÁ <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-cyan to-blue-400">NA FEIRA</span>
      </h2>

      {logos.length > 0 ? (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 md:gap-3 mb-8">
          {logos.map((logo, i) => {
            const src = resolveLogoUrl(logo);
            const name = resolveName(logo);
            return (
              <motion.div
                key={logo.id ?? i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03, duration: 0.3 }}
                className="bg-white rounded-xl flex items-center justify-center p-2 aspect-square opacity-80 hover:opacity-100 transition-opacity"
                title={name}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src!}
                  alt={name}
                  className="max-w-full max-h-full object-contain"
                  loading="lazy"
                />
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="h-32 flex items-center justify-center text-gray-500 text-sm mb-8">
          Carregando marcas...
        </div>
      )}

      <button
        type="button"
        onClick={onVisitClick}
        className="bg-brand-pink hover:bg-brand-pink/90 text-white px-8 py-4 rounded-full font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(233,30,99,0.3)]"
      >
        GARANTIR MEU ACESSO
      </button>
    </motion.div>
  );
}

/* ─── Slide 3 — Compra direta ────────────────────────────────── */
function SlideDirectFactory({ onVisitClick, onExposeClick }: { onVisitClick: () => void; onExposeClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-tight">
        COMPRE DIRETO. <br />
        PAGUE PREÇO <br />
        <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-cyan to-blue-400">
          DE FÁBRICA.
        </span>
      </h1>
      <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
        Sem atravessadores. Negocie condições exclusivas diretamente com gerentes e diretores — descontos que só existem durante os dias da feira.
      </p>
      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <button
          type="button"
          onClick={onVisitClick}
          className="bg-brand-cyan hover:bg-brand-cyan/90 text-brand-blue px-8 py-4 rounded-full font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(34,211,238,0.3)]"
        >
          QUERO ESSES PREÇOS
        </button>
        <button
          type="button"
          onClick={onExposeClick}
          className="glass hover:bg-white/10 text-white px-8 py-4 rounded-full font-bold transition-all hover:scale-105"
        >
          SER UM EXPOSITOR
        </button>
      </div>
    </motion.div>
  );
}
