"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import type { FairListItem } from "@/lib/fairsApi";
import type { PageMode } from "@/hooks/useFairRouting";

interface HeroProps {
  onVisitClick: () => void;
  onExposeClick: () => void;
  detectedCity?: "manaus" | "belem" | null;
  mode?: PageMode;
  activeFairs?: FairListItem[];
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

const PT_MONTHS_SHORT = ["JAN","FEV","MAR","ABR","MAI","JUN","JUL","AGO","SET","OUT","NOV","DEZ"];

function formatFairLine(fair: FairListItem): string {
  const start = new Date(fair.startDate + "T12:00:00");
  const end = new Date(fair.endDate + "T12:00:00");
  return `${fair.city.toUpperCase()} · ${start.getDate()}-${end.getDate()} ${PT_MONTHS_SHORT[start.getMonth()]}`;
}

export default function Hero({
  onVisitClick,
  onExposeClick,
  detectedCity,
  mode = "generalist",
  activeFairs = [],
}: HeroProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [logos, setLogos] = useState<LogoItem[]>([]);
  const [progress, setProgress] = useState(0);

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

  useEffect(() => {
    if (paused) return;
    setProgress(0);
    const start = Date.now();
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100) { clearInterval(tick); next(); }
    }, 50);
    return () => clearInterval(tick);
  }, [current, paused, next]);

  const detectedFair = activeFairs.find((f) =>
    f.city.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").includes(detectedCity ?? "")
  );

  const dateLine =
    activeFairs.length === 0
      ? "BELÉM · 18-20 AGO"
      : detectedCity && detectedFair
      ? formatFairLine(detectedFair)
      : activeFairs.map(formatFairLine).join(" · ");

  const isExhibitor = mode === "exhibitor";

  return (
    <section
      ref={ref}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
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

      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-brand-pink/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-cyan/10 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center">
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

        <div className="min-h-[320px] md:min-h-[360px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {current === 0 && (
              isExhibitor
                ? <SlideExhibitorPitch key="s0-exp" onExposeClick={onExposeClick} activeFairs={activeFairs} />
                : <SlideVisitorUrgency key="s0-vis" onVisitClick={onVisitClick} onExposeClick={onExposeClick} />
            )}
            {current === 1 && (
              <SlideLogos
                key="s1"
                logos={logos}
                onVisitClick={onVisitClick}
                onExposeClick={onExposeClick}
                isExhibitor={isExhibitor}
              />
            )}
            {current === 2 && (
              isExhibitor
                ? <SlideExhibitorStats key="s2-exp" onExposeClick={onExposeClick} activeFairs={activeFairs} />
                : <SlideDirectFactory key="s2-vis" onVisitClick={onVisitClick} onExposeClick={onExposeClick} />
            )}
          </AnimatePresence>
        </div>

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

/* ─── Visitor slides ─────────────────────────────────────────── */

function SlideVisitorUrgency({
  onVisitClick,
  onExposeClick,
}: {
  onVisitClick: () => void;
  onExposeClick: () => void;
}) {
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

function SlideDirectFactory({
  onVisitClick,
  onExposeClick,
}: {
  onVisitClick: () => void;
  onExposeClick: () => void;
}) {
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

/* ─── Exhibitor slides ───────────────────────────────────────── */

function SlideExhibitorPitch({
  onExposeClick,
  activeFairs,
}: {
  onExposeClick: () => void;
  activeFairs: FairListItem[];
}) {
  const cities = activeFairs.map((f) => f.city).join(" e ") || "Belém";
  const totalVisitors = activeFairs.reduce((s, f) => s + (f.expectedVisitors || 0), 0);
  const visitorsLabel = totalVisitors > 0 ? `+${totalVisitors.toLocaleString("pt-BR")}` : "+15.000";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-tight">
        APRESENTE SUA MARCA <br />
        PARA {visitorsLabel} <br />
        <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-orange to-brand-pink">
          LOJISTAS DA REGIÃO
        </span>
      </h1>
      <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
        A Expo MultiMix conecta indústrias e importadoras diretamente com os lojistas de {cities}. Ocupe seu espaço antes que os concorrentes o façam.
      </p>
      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <button
          type="button"
          onClick={onExposeClick}
          className="bg-brand-orange hover:bg-brand-orange/90 text-white px-8 py-4 rounded-full font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(251,146,60,0.3)]"
        >
          QUERO MEU STAND
        </button>
        <button
          type="button"
          onClick={onExposeClick}
          className="glass hover:bg-white/10 text-white px-8 py-4 rounded-full font-bold transition-all hover:scale-105"
        >
          VER OPÇÕES DE STAND
        </button>
      </div>
    </motion.div>
  );
}

function SlideExhibitorStats({
  onExposeClick,
  activeFairs,
}: {
  onExposeClick: () => void;
  activeFairs: FairListItem[];
}) {
  const totalVisitors = activeFairs.reduce((s, f) => s + (f.expectedVisitors || 0), 0);
  const totalExhibitors = activeFairs.reduce((s, f) => s + (f.expectedExhibitors || 0), 0);

  const stats = [
    { value: totalVisitors > 0 ? `+${totalVisitors.toLocaleString("pt-BR")}` : "+15.000", label: "Lojistas esperados" },
    { value: totalExhibitors > 0 ? `+${totalExhibitors}` : "+150",  label: "Expositores por edição" },
    { value: activeFairs.length > 0 ? `${activeFairs.length}` : "2", label: activeFairs.length === 1 ? "Capital do Norte" : "Capitais do Norte" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-tight">
        NÚMEROS QUE <br />
        TRANSFORMAM <br />
        <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-cyan to-blue-400">
          NEGÓCIOS.
        </span>
      </h1>
      <div className="flex justify-center gap-8 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-3xl md:text-4xl font-black text-brand-cyan">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onExposeClick}
        className="bg-brand-cyan hover:bg-brand-cyan/90 text-brand-blue px-8 py-4 rounded-full font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(34,211,238,0.3)]"
      >
        RESERVAR MEU STAND AGORA
      </button>
    </motion.div>
  );
}

/* ─── Shared: logos grid ─────────────────────────────────────── */

function SlideLogos({
  logos,
  onVisitClick,
  onExposeClick,
  isExhibitor,
}: {
  logos: LogoItem[];
  onVisitClick: () => void;
  onExposeClick: () => void;
  isExhibitor: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <p className="text-brand-cyan font-bold tracking-[0.2em] uppercase text-sm mb-2">
        {isExhibitor ? "Sua concorrência já está aqui" : "Presenças confirmadas"}
      </p>
      <h2 className="text-3xl md:text-5xl font-black mb-8 text-white">
        {isExhibitor ? (
          <>SEU ESPAÇO AINDA <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-orange to-brand-pink">ESTÁ DISPONÍVEL</span></>
        ) : (
          <>QUEM ESTARÁ <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-cyan to-blue-400">NA FEIRA</span></>
        )}
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

      {isExhibitor ? (
        <button
          type="button"
          onClick={onExposeClick}
          className="bg-brand-orange hover:bg-brand-orange/90 text-white px-8 py-4 rounded-full font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(251,146,60,0.3)]"
        >
          GARANTIR MEU STAND
        </button>
      ) : (
        <button
          type="button"
          onClick={onVisitClick}
          className="bg-brand-pink hover:bg-brand-pink/90 text-white px-8 py-4 rounded-full font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(233,30,99,0.3)]"
        >
          GARANTIR MEU ACESSO
        </button>
      )}
    </motion.div>
  );
}
