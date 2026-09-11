"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Modal from "@/components/Modal";
import ExhibitorBypassModalContent from "@/components/ExhibitorBypassModal";
import VisitModalContent from "@/components/VisitModal";
import WhatsAppFloating from "@/components/WhatsAppFloating";
import { openWhatsApp as sendWhatsAppMessage } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";
import { useState, useRef, useEffect } from "react";
import {
  CheckCircle2, TrendingUp, Users, Package, ArrowRight, Rocket,
  Calendar, MapPin, Zap, Star, Clock, Building2, Store,
  ChevronRight, AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  fetchFairs, fetchFair, formatFairDates, formatFairLocation, formatStandDimensions, buildMapEmbedUrl,
  type StandOption, type FairListItem, type FairDetail,
} from "@/lib/fairsApi";
import LogosCarousel from "@/components/LogosCarousel";
import FairHistoryTimeline from "@/components/FairHistoryTimeline";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import AnimatedNumber from "@/components/AnimatedNumber";

/* ─── helpers ─────────────────────────────────────────────────── */

const STAND_IMAGES: Record<string, string> = {
  "2x3": "/assets/Stand-2-3.jpeg",
  "3x3": "/assets/stand-3-3.jpeg",
};

function getStandImage(dimensions: string): string {
  const key = Object.keys(STAND_IMAGES).find((k) => dimensions.toLowerCase().includes(k));
  return key ? STAND_IMAGES[key] : "/assets/Stand-2-3.jpeg";
}

function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

type StandOptionWithMeta = StandOption & { durationDays: number | null; fairId: string };

const INSTALLMENTS = 12;
const INSTALLMENT_INTEREST_RATE = 0.1; // juros do parcelamento no cartão — Pix à vista é o valor real, sem essa taxa

const CITY_META: Record<string, { color: string; borderColor: string; state: string; slug: string; icon: string }> = {
  manaus:  { color: "text-brand-pink",  borderColor: "border-brand-pink",  state: "Amazonas", slug: "manaus", icon: "🏙️" },
  manaos:  { color: "text-brand-pink",  borderColor: "border-brand-pink",  state: "Amazonas", slug: "manaus", icon: "🏙️" },
  belém:   { color: "text-brand-cyan",  borderColor: "border-brand-cyan",  state: "Pará",     slug: "belem",  icon: "⚓" },
  belem:   { color: "text-brand-cyan",  borderColor: "border-brand-cyan",  state: "Pará",     slug: "belem",  icon: "⚓" },
};

// Estimativa de comércio varejista ativo em Manaus (fonte: base de CNPJs ativos, CNAE G-47) — arredondado, não é dado da API da feira.
const MANAUS_LOJISTAS_ESTIMATE = 46000;

function normCity(city: string) {
  return city.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function getCityMeta(city: string) {
  const key = normCity(city);
  return CITY_META[key] ?? { color: "text-brand-orange", borderColor: "border-brand-orange", state: "", slug: key, icon: "📍" };
}

function isFairActive(fair: FairListItem) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return new Date(fair.endDate + "T23:59:59") >= today;
}

function isFairHappening(fair: FairListItem) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return new Date(fair.startDate + "T00:00:00") <= today && new Date(fair.endDate + "T23:59:59") >= today;
}

/* ─── main component ──────────────────────────────────────────── */

export default function QueroExporContent() {
  const [activeModal, setActiveModal] = useState<"none" | "bypass" | "visit">("none");
  const [standOptions, setStandOptions] = useState<StandOptionWithMeta[]>([]);
  const [allFairs, setAllFairs] = useState<FairListItem[]>([]);
  const [activeFairs, setActiveFairs] = useState<FairListItem[]>([]);
  const [fairDetails, setFairDetails] = useState<Record<string, FairDetail>>({});

  const openWhatsApp = (filter?: string) => {
    trackEvent("cta_click", { label: filter === "Comercial" ? "reservar_stand_whatsapp" : "fale_conosco" });
    const message = filter === "Comercial"
      ? "Olá! Tenho interesse em saber mais sobre vendas e stands na Expo MultiMix."
      : "Olá! Gostaria de falar com a equipe da Expo MultiMix.";
    sendWhatsAppMessage(message);
  };
  const closeModal = () => setActiveModal("none");
  const scrollToStands = () => document.getElementById("modelos-stands")?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("target") === "stands") setTimeout(scrollToStands, 600);
  }, []);

  useEffect(() => {
    fetchFairs().then(async (fairs) => {
      const sorted = [...fairs]
        .filter((f) => f.status === "upcoming" || f.status === "ongoing")
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      setAllFairs(sorted);

      const active = sorted.filter(isFairActive);
      setActiveFairs(active);

      // Fetch full detail (address, map, stand options) only for active fairs
      const details = await Promise.all(active.map((f) => fetchFair(f.id)));

      const detailsById: Record<string, FairDetail> = {};
      details.forEach((detail, i) => {
        if (detail) detailsById[active[i].id] = detail;
      });
      setFairDetails(detailsById);

      const seen = new Set<string>();
      const combined: StandOptionWithMeta[] = [];
      for (const detail of details) {
        for (const stand of detail?.standOptions ?? []) {
          const key = formatStandDimensions(stand);
          if (!seen.has(key) && detail) {
            seen.add(key);
            combined.push({ ...stand, durationDays: detail.durationDays ?? null, fairId: detail.id });
          }
        }
      }
      if (combined.length > 0) setStandOptions(combined);
    });
  }, []);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const hasMultipleActiveFairs = activeFairs.length >= 2;
  const calendarYearsLabel = [
    ...new Set(allFairs.map((f) => new Date(f.startDate + "T12:00:00").getFullYear())),
  ].join(" / ");

  const pricedStands = standOptions.filter((s) => s.totalPrice > 0);
  const cheapestStand = pricedStands.length > 0
    ? pricedStands.reduce((min, s) => (s.totalPrice < min.totalPrice ? s : min))
    : null;

  return (
    <main className="min-h-screen bg-brand-blue selection:bg-brand-cyan/30 selection:text-white">
      <Navbar
        onVisitClick={() => setActiveModal("visit")}
        onExposeClick={scrollToStands}
        onContactClick={() => openWhatsApp()}
        exposeButtonText="RESERVE SEU STAND"
      />

      {/* ── Hero ───────────────────────────────────────────── */}
      <section ref={heroRef} className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/assets/fachada-manaus-2.jpeg" alt="Expo MultiMix" fill className="object-cover opacity-60" />
          <div className="absolute inset-0 bg-linear-to-b from-brand-blue/70 via-brand-blue/60 to-brand-blue" />
        </div>
        <motion.div
          style={{ y }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-linear-to-b from-brand-orange/10 to-transparent blur-[120px] pointer-events-none z-0"
        />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-brand-orange font-bold tracking-[0.2em] uppercase text-sm mb-4 flex items-center justify-center gap-2"
          >
            <span className="h-px w-8 bg-brand-orange" /> Para indústrias e importadoras <span className="h-px w-8 bg-brand-orange" />
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-tight"
          >
            APRESENTE SUA MARCA NA <br />
            <span className="text-brand-orange">MAIOR VITRINE</span> DO NORTE
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto mb-10"
          >
            Conecte sua indústria diretamente com milhares de lojistas qualificados — sem atravessadores, sem voo para São Paulo, com retorno garantido em 3 dias.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <button
              type="button"
              onClick={scrollToStands}
              className="bg-brand-orange text-white px-8 py-4 md:px-10 md:py-5 rounded-full font-black text-base md:text-lg shadow-2xl hover:scale-105 transition-transform inline-flex items-center justify-center gap-3"
            >
              VER MODELOS DE STAND <ArrowRight size={20} />
            </button>
            <button
              type="button"
              onClick={() => openWhatsApp("Comercial")}
              className="glass hover:bg-white/10 text-white px-8 py-4 md:px-10 md:py-5 rounded-full font-black text-base md:text-lg transition-all inline-flex items-center justify-center gap-3"
            >
              FALAR COM CONSULTOR
            </button>
          </motion.div>

          {cheapestStand && (
            <motion.button
              type="button"
              onClick={scrollToStands}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 inline-flex flex-wrap items-center justify-center gap-1.5 text-center text-sm text-gray-300 hover:text-white transition-colors"
            >
              Stands a partir de <span className="text-brand-orange font-black">{formatPrice(cheapestStand.totalPrice)}</span> à vista no Pix
              <ChevronRight size={14} />
            </motion.button>
          )}
        </div>
      </section>

      {/* ── Stats bar ──────────────────────────────────────── */}
      <section className="py-12 bg-black/30 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { animatedValue: 1000, prefix: "+", label: "Lojistas por edição", color: "text-brand-cyan" },
              { animatedValue: 70,   prefix: "+", label: "Marcas expositoras",  color: "text-brand-pink" },
              { value: "3 dias",                  label: "De pura negociação",  color: "text-brand-orange" },
              { value: "2",                       label: "Capitais do Norte",   color: "text-brand-cyan" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <p className={`text-3xl md:text-4xl font-black ${stat.color}`}>
                  {stat.animatedValue != null
                    ? <AnimatedNumber value={stat.animatedValue} prefix={stat.prefix} />
                    : stat.value}
                </p>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Modelos de stands ──────────────────────────────── */}
      <section id="modelos-stands" className="py-20 bg-brand-blue/30 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-brand-orange font-bold tracking-widest text-sm uppercase">Escolha o seu modelo</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-2">MODELOS DISPONÍVEIS</h2>
            <p className="text-gray-400 mt-3 max-w-xl mx-auto text-sm">
              Preços e disponibilidade referentes às edições com vagas abertas. Sujeito a alteração sem aviso.
            </p>
          </div>

          {standOptions.length > 0 ? (
            <div className={`grid gap-8 max-w-4xl mx-auto ${standOptions.length === 1 ? "max-w-md" : "md:grid-cols-2"}`}>
              {standOptions.map((stand, i) => {
                const has3x3 = standOptions.some((s) => formatStandDimensions(s).toLowerCase().includes("3x3"));
                const isHighlighted = has3x3
                  ? formatStandDimensions(stand).toLowerCase().includes("3x3")
                  : i === standOptions.length - 1;
                return (
                  <Link
                    key={stand.id || i}
                    href={`/reservar-stand/${stand.fairId}`}
                    onClick={() => trackEvent("cta_click", { label: "reservar_stand_mapa" })}
                    className={`relative flex flex-col rounded-3xl border transition-all group ${
                      isHighlighted
                        ? "glass-card border-brand-orange/50 shadow-[0_0_40px_rgba(255,130,0,0.15)] hover:shadow-[0_0_50px_rgba(255,130,0,0.25)] p-5 md:p-8"
                        : "glass border-white/10 hover:border-brand-orange/30 hover:bg-white/5 p-5 md:p-8"
                    }`}
                  >
                    {isHighlighted && (
                      <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-orange text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full whitespace-nowrap">
                        ⭐ Mais escolhido
                      </span>
                    )}

                    <div className="aspect-video bg-white/5 rounded-2xl mb-5 relative overflow-hidden">
                      <Image
                        src={getStandImage(formatStandDimensions(stand))}
                        alt={stand.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {stand.quantity > 0 && (
                        <span className="absolute top-3 right-3 flex items-center gap-1 bg-slate-900/80 backdrop-blur text-brand-orange text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-brand-orange/30">
                          <Clock size={12} /> {stand.quantity} disponíveis
                        </span>
                      )}
                    </div>

                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h3 className="text-2xl font-black text-white leading-tight">{stand.name.toUpperCase()}</h3>
                      {stand.area > 0 && (
                        <span className="shrink-0 text-xs font-bold text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/20 rounded-full px-3 py-1 mt-1">
                          {stand.area}m²
                        </span>
                      )}
                    </div>
                    {stand.description && (
                      <p className="text-gray-400 mb-3 text-sm">{stand.description}</p>
                    )}

                    <p className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
                      <CheckCircle2 size={14} className="text-brand-cyan shrink-0" />
                      Montagem, iluminação, tomada e carpete inclusos
                    </p>

                    {stand.totalPrice > 0 && (() => {
                      const installmentTotal = stand.totalPrice * (1 + INSTALLMENT_INTEREST_RATE);
                      const installmentValue = installmentTotal / INSTALLMENTS;
                      const pixDiscountPct = Math.round(INSTALLMENT_INTEREST_RATE * 100);
                      return (
                        <div className="mb-6 space-y-2.5 flex-1">
                          {stand.anchorPrice != null && stand.anchorPrice > stand.totalPrice && (
                            <span className="text-gray-500 line-through text-xs">De {formatPrice(stand.anchorPrice)}</span>
                          )}

                          <div>
                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">
                              Parcelado em até {INSTALLMENTS}x
                            </p>
                            <p className="text-brand-orange font-black text-3xl leading-none">
                              {formatPrice(installmentValue)}
                              <span className="text-sm font-bold text-gray-400">/mês</span>
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                              Valor cheio {formatPrice(installmentTotal)}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2.5">
                            <span className="shrink-0 text-green-400 text-[10px] font-black uppercase tracking-wide bg-green-500/20 rounded-full px-2 py-1">
                              {pixDiscountPct}% OFF
                            </span>
                            <span className="text-gray-200 text-sm font-bold">
                              {formatPrice(stand.totalPrice)} <span className="text-gray-400 font-medium">à vista no Pix</span>
                            </span>
                          </div>

                          {stand.durationDays && stand.durationDays > 0 && (
                            <p className="text-[11px] text-gray-500 px-1">
                              Equivale a {formatPrice(stand.totalPrice / stand.durationDays)}/dia de exposição no Pix
                            </p>
                          )}
                        </div>
                      );
                    })()}

                    <div
                      className={`w-full font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wide pointer-events-none ${
                        isHighlighted
                          ? "bg-brand-orange text-white group-hover:scale-105 shadow-lg shadow-brand-orange/20"
                          : "bg-white/5 group-hover:bg-brand-orange group-hover:text-white text-brand-orange border border-brand-orange/30 group-hover:border-brand-orange"
                      }`}
                    >
                      QUERO ESTE STAND <ArrowRight size={18} />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            /* Fallback */
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <StandFallbackCard
                img="/assets/Stand-2-3.jpeg" name="STAND STANDARD 2x3m"
                desc="Ideal para apresentação focada de produtos e ativação de marca." area="6"
                highlighted={false} onBuy={() => openWhatsApp("Comercial")}
              />
              <StandFallbackCard
                img="/assets/stand-3-3.jpeg" name="STAND STANDARD 3x3m"
                desc="Mais espaço para linha completa de produtos e equipe de atendimento." area="9"
                highlighted={true} onBuy={() => openWhatsApp("Comercial")}
              />
            </div>
          )}

          <p className="text-center text-xs text-gray-600 mt-10">
            * Preços e disponibilidade sujeitos a confirmação pela equipe comercial.
          </p>
        </div>
      </section>

      {/* ── Calendar (dinâmico via API) ─────────────────────── */}
      <section className="pt-20 pb-12 bg-brand-blue">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="text-brand-cyan font-bold tracking-widest text-sm uppercase">
            Calendário {calendarYearsLabel || new Date().getFullYear()}
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white mt-2">
            {activeFairs.length > 0 ? "RESERVE SEU STAND" : "NOSSAS EDIÇÕES"}
          </h2>
          {activeFairs.length > 0 && (
            <p className="text-gray-400 mt-2">
              {activeFairs.length === 1
                ? "Últimas vagas disponíveis — garanta sua posição no pavilhão."
                : "Escolha uma ou duas edições para maximizar sua presença na região."}
            </p>
          )}
        </div>
      </section>

      {allFairs.length === 0 ? (
        /* Fallback enquanto carrega */
        <div className="max-w-6xl mx-auto px-6 space-y-8 pb-12">
          <FallbackFairCard
            city="MANAUS" state="Amazonas" date="09, 10 e 11 de Junho" location="Centro de Convenções Vasco Vasques"
            color="text-brand-pink" borderColor="border-brand-pink" active={false}
            onContact={() => openWhatsApp("Comercial")}
          />
          <FallbackFairCard
            city="BELÉM" state="Pará" date="18, 19 e 20 de Agosto" location="Estação das Docas — Pavilhão de Feiras"
            color="text-brand-cyan" borderColor="border-brand-cyan" active={true}
            onContact={() => openWhatsApp("Comercial")}
          />
        </div>
      ) : (
        <>
          {allFairs.map((fair) => {
            const meta = getCityMeta(fair.city);
            const active = isFairActive(fair);
            const happening = isFairHappening(fair);
            const detail = fairDetails[fair.id];
            const mapUrl = detail ? buildMapEmbedUrl(detail.coordinates, detail.address?.venue, fair.city) : "";
            const isManaus = normCity(fair.city).startsWith("mana");
            return (
              <motion.section
                key={fair.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`relative border-t-4 border-b border-b-white/5 transition-all group ${meta.borderColor} ${
                  active ? "bg-black/10" : "bg-white/2 opacity-70"
                }`}
              >
                <div className="relative max-w-6xl mx-auto px-6 py-14 md:py-16">
                  {happening && (
                    <span className="absolute top-6 right-6 z-10 inline-flex items-center gap-1.5 bg-green-500/15 border border-green-500/30 text-green-400 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Em andamento
                    </span>
                  )}
                  {!active && (
                    <span className="absolute top-6 right-6 z-10 text-[10px] font-bold uppercase text-gray-600 border border-white/10 rounded-full px-3 py-1">
                      Encerrada
                    </span>
                  )}

                  <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                    {/* Info */}
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform text-xl shrink-0`}>
                          {meta.icon}
                        </div>
                        <div>
                          <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${meta.color} bg-white/5`}>
                            {meta.state}
                          </span>
                          <h3 className="text-3xl md:text-4xl font-black text-white mt-1">{fair.city.toUpperCase()}</h3>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-gray-300">
                          <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center ${meta.color}`}>
                            <Calendar size={16} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-500 uppercase">Data</p>
                            <p className="font-bold text-white">{formatFairDates(fair.startDate, fair.endDate)}</p>
                          </div>
                        </div>
                        {fair.city && (
                          <div className="flex items-center gap-3 text-gray-300">
                            <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center ${meta.color}`}>
                              <MapPin size={16} />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase">Local</p>
                              <p className="font-bold text-white">
                                {detail?.address ? formatFairLocation(detail.address) : `${fair.city} — ${fair.state}`}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {(fair.expectedVisitors || fair.expectedExhibitors || (fair.standsAvailable ?? 0) > 0) && (
                        <div className="grid grid-cols-3 gap-2 mb-6">
                          {!!fair.expectedVisitors && (
                            <div className="text-center bg-white/5 rounded-xl py-3">
                              <Users size={16} className={`mx-auto mb-1 ${meta.color}`} />
                              <p className="text-lg font-black text-white leading-none">
                                <AnimatedNumber value={fair.expectedVisitors} suffix="+" />
                              </p>
                              <p className="text-[9px] text-gray-500 uppercase font-bold mt-1 leading-tight">Visitantes</p>
                            </div>
                          )}
                          {!!fair.expectedExhibitors && (
                            <div className="text-center bg-white/5 rounded-xl py-3">
                              <Building2 size={16} className={`mx-auto mb-1 ${meta.color}`} />
                              <p className="text-lg font-black text-white leading-none">
                                <AnimatedNumber value={fair.expectedExhibitors} suffix="+" />
                              </p>
                              <p className="text-[9px] text-gray-500 uppercase font-bold mt-1 leading-tight">Expositores</p>
                            </div>
                          )}
                          {!!fair.standsAvailable && (
                            <div className="text-center bg-white/5 rounded-xl py-3">
                              <Store size={16} className={`mx-auto mb-1 ${meta.color}`} />
                              <p className="text-lg font-black text-white leading-none">
                                <AnimatedNumber value={fair.standsAvailable} />
                              </p>
                              <p className="text-[9px] text-gray-500 uppercase font-bold mt-1 leading-tight">Stands livres</p>
                            </div>
                          )}
                        </div>
                      )}

                      {isManaus && (
                        <div className="flex items-center gap-3 bg-brand-pink/10 border border-brand-pink/20 rounded-xl px-4 py-3">
                          <TrendingUp className="text-brand-pink shrink-0" size={20} />
                          <p className="text-xs text-gray-300 leading-snug">
                            <span className="text-white font-black">
                              <AnimatedNumber value={Math.round(MANAUS_LOJISTAS_ESTIMATE / 1000)} prefix="+" suffix=" mil lojistas" />
                            </span>{" "}
                            ativos no varejo de Manaus (estimativa) — seu público em potencial na região.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Mapa */}
                    {mapUrl && (
                      <div className="relative rounded-2xl overflow-hidden border border-white/10 min-h-55 h-full">
                        <iframe
                          src={mapUrl}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-500"
                        />
                        <span className="absolute top-3 left-3 max-w-[calc(100%-1.5rem)] truncate block bg-slate-900/85 backdrop-blur text-white text-[10px] font-black uppercase tracking-wide px-3 py-1.5 rounded-full border border-white/10 pointer-events-none">
                          📍 {detail?.address?.venue || fair.city}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {active ? (
                  <button
                    type="button"
                    onClick={scrollToStands}
                    className={`w-full py-5 md:py-6 font-black text-sm md:text-base uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                      happening
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-brand-orange text-white hover:bg-brand-orange/90"
                    }`}
                  >
                    {happening ? "VAGAS ABERTAS — VER STANDS" : "RESERVAR STAND NESTA EDIÇÃO"} <ArrowRight size={18} />
                  </button>
                ) : (
                  <p className="text-center text-xs text-gray-600 font-bold uppercase tracking-widest py-4 border-t border-white/5">
                    Próxima edição em breve
                  </p>
                )}
              </motion.section>
            );
          })}
        </>
      )}

      {/* Kit 2 cidades — aparece apenas quando há 2+ feiras ativas */}
      {hasMultipleActiveFairs && (
        <section className="py-12 bg-brand-blue border-b border-white/5">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 md:p-8 rounded-3xl bg-linear-to-r from-brand-pink/10 to-brand-cyan/10 border border-white/10 flex flex-col md:flex-row items-center gap-6"
            >
              <div className="flex-1">
                <span className="text-brand-orange text-xs font-black uppercase tracking-widest">Oferta exclusiva</span>
                <h3 className="text-2xl font-black text-white mt-1">KIT 2 EDIÇÕES — MÁXIMA EXPOSIÇÃO</h3>
                <p className="text-gray-400 text-sm mt-2">
                  Reserve stands nas duas capitais e apresente sua marca para o dobro de lojistas. Condições especiais para quem fecha as duas edições juntas.
                </p>
              </div>
              <button
                type="button"
                onClick={() => openWhatsApp("Comercial")}
                className="flex-none bg-white/10 hover:bg-brand-orange text-white font-black px-8 py-4 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap"
              >
                CONSULTAR COMBO <ArrowRight size={18} />
              </button>
            </motion.div>
          </div>
        </section>
      )}

      <LogosCarousel title="QUEM JÁ EXPÕE COM A GENTE" subtitle="Marcas presentes nas edições anteriores" direction="left" />

      {/* ── Por que expor? ─────────────────────────────────── */}
      <section className="py-24 bg-black/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-black mb-8">
                POR QUE EXPOR <br className="md:hidden" />
                NA <span className="text-brand-orange">EXPO MULTIMIX?</span>
              </h2>
              <div className="space-y-6">
                {[
                  {
                    title: "Público 100% Qualificado",
                    desc: "Somente lojistas com CNPJ entram. Cada pessoa que visita seu stand é um comprador real, com poder de decisão e dinheiro na mão.",
                    icon: <Users className="text-brand-cyan" />,
                  },
                  {
                    title: "ROI em 3 Dias",
                    desc: "Expositores relatam fechar pedidos que superam o investimento no stand ainda durante os dias de feira — com clientes recorrentes por meses.",
                    icon: <TrendingUp className="text-brand-pink" />,
                  },
                  {
                    title: "Zero Burocracia",
                    desc: "Stand montado, iluminado e identificado. Você chega com os produtos, faz o atendimento e fecha os pedidos. Nós cuidamos do resto.",
                    icon: <Package className="text-brand-orange" />,
                  },
                  {
                    title: "Mercado Virgem",
                    desc: "O Norte é o mercado mais subatendido do Brasil. Lojistas pagam mais caro por falta de opções — seu stand aqui vale mais do que em qualquer feira do Sul.",
                    icon: <Star className="text-brand-cyan" />,
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-6 rounded-2xl glass hover:bg-white/5 transition-all">
                    <div className="p-3 bg-white/5 rounded-xl h-fit">{item.icon}</div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative h-full">
              <div className="h-full aspect-square md:aspect-auto glass rounded-3xl border border-white/10 flex items-center justify-center p-12 text-center overflow-hidden relative group">
                <div className="absolute inset-0 z-0">
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-[url('/assets/fachada-belem-emm.jpeg')] bg-cover bg-center opacity-40 mix-blend-overlay transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[url('/assets/fachada-manaus-emm.jpeg')] bg-cover bg-center opacity-40 mix-blend-overlay transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-brand-blue/80 backdrop-blur-[2px]" />
                </div>
                <div className="absolute inset-0 bg-linear-to-br from-brand-orange/20 via-transparent to-brand-pink/20 z-0 pointer-events-none" />
                <div className="relative z-10">
                  <div className="mb-8 relative">
                    <div className="absolute inset-0 bg-brand-orange/20 blur-xl rounded-full" />
                    <Rocket size={64} className="text-brand-orange mx-auto relative z-10" />
                  </div>
                  <h3 className="text-3xl font-black mb-4 text-white">+15 ANOS DE MERCADO</h3>
                  <p className="text-gray-200 text-base leading-relaxed">
                    "A maior concentração de compradores B2B da Região Norte — em um único pavilhão, por 3 dias."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tudo incluso — reforço do "Zero Burocracia" acima */}
          <div className="mt-20 pt-16 border-t border-white/10 text-center">
            <p className="text-brand-cyan font-bold tracking-widest text-sm uppercase mb-3">Sem surpresas</p>
            <h3 className="text-2xl md:text-3xl font-black mb-8">TUDO INCLUSO NO STAND</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-left max-w-4xl mx-auto">
              {[
                "Estrutura completa com prateleiras, mesa e cadeiras",
                "Iluminação embutida",
                "Identificação visual da marca",
                "Piso acarpetado",
                "Ponto de energia 110v/220v",
                "Segurança e limpeza inclusas",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-300 p-3 rounded-xl glass">
                  <CheckCircle2 className="text-brand-cyan shrink-0" size={20} />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOMO section ───────────────────────────────────── */}
      <section className="py-16 bg-brand-orange/5 border-y border-brand-orange/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <AlertTriangle className="text-brand-orange mx-auto mb-4" size={36} />
          <h2 className="text-2xl md:text-4xl font-black text-white mb-4">
            ENQUANTO VOCÊ ANALISA, SEU CONCORRENTE ESTÁ CONFIRMANDO O STAND DELE
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            As vagas são limitadas por tamanho de pavilhão. Quando lotam, lotam — e a fila de espera não garante posição.
            Expositores das edições anteriores têm prioridade de renovação.
          </p>
          <button
            type="button"
            onClick={() => openWhatsApp("Comercial")}
            className="w-full sm:w-auto bg-brand-orange text-white px-8 py-5 rounded-full font-black text-base md:text-lg hover:scale-105 transition-transform shadow-lg shadow-brand-orange/20 inline-flex items-center justify-center gap-3"
          >
            VERIFICAR DISPONIBILIDADE AGORA <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* ── Urgência ───────────────────────────────────────── */}
      {activeFairs.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 mb-2">
          <div className="bg-brand-orange/10 border border-brand-orange/30 rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center gap-3 justify-between">
            <div className="flex items-center gap-3">
              <Zap className="text-brand-orange shrink-0" size={20} />
              <p className="text-sm font-black text-white uppercase tracking-wide">
                Vagas limitadas — {activeFairs.map(f => f.city).join(" e ")} {new Date(activeFairs[0].startDate).getFullYear()}
              </p>
            </div>
            <button
              type="button"
              onClick={() => openWhatsApp("Comercial")}
              className="flex-none text-brand-orange text-xs font-black uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1"
            >
              Consultar vagas <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      <LogosCarousel title="FAÇA PARTE DESSE TIME" subtitle="Expositores confirmados 2026" direction="right" />

      <FairHistoryTimeline />

      {/* ── CTA final ──────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-orange" />
        <div className="absolute inset-0 bg-linear-to-br from-brand-orange via-brand-orange to-brand-pink/60" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <p className="text-white/60 font-bold tracking-[0.2em] uppercase text-sm mb-4">Vagas limitadas</p>
          <h2 className="text-4xl md:text-6xl font-black mb-6 text-white leading-tight">
            GARANTA SEU LUGAR <br /> ANTES QUE ACABE
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            A lista de interessados cresce toda semana. Fale agora com nossa equipe e escolha sua localização no pavilhão antes que outra marca ocupe seu espaço.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => openWhatsApp("Comercial")}
              className="bg-white text-brand-orange px-8 py-5 md:px-12 md:py-6 rounded-full font-black text-base md:text-xl shadow-2xl hover:scale-105 transition-transform inline-flex items-center justify-center gap-3"
            >
              FALAR COM CONSULTOR <ArrowRight size={20} />
            </button>
            <button
              type="button"
              onClick={scrollToStands}
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-5 md:px-12 md:py-6 rounded-full font-black text-base md:text-xl transition-all inline-flex items-center justify-center gap-3 border border-white/20"
            >
              VER MODELOS
            </button>
          </div>
        </div>
      </section>

      <Footer onWhatsAppClick={() => openWhatsApp()} />
      <WhatsAppFloating onClick={() => openWhatsApp()} />

      {/* Mobile sticky CTA */}
      <StickyMobileCTA
        onLeftClick={scrollToStands}
        onRightClick={() => openWhatsApp("Comercial")}
        leftLabel="VER STANDS"
        rightLabel="CONSULTOR"
        leftColor="bg-brand-orange shadow-[0_0_24px_rgba(251,146,60,0.25)]"
        rightColor="bg-white/10 border border-white/20"
      />

      <Modal isOpen={activeModal === "bypass"} onClose={closeModal} title="QUALIFICAÇÃO DE EXPOSITOR">
        <ExhibitorBypassModalContent onConfirmExpositor={() => openWhatsApp()} onSelectLojista={() => setActiveModal("visit")} />
      </Modal>
      <Modal isOpen={activeModal === "visit"} onClose={closeModal} title="QUERO VISITAR">
        <VisitModalContent />
      </Modal>
    </main>
  );
}

/* ─── Fair card fallback (sem API) ───────────────────────────── */
function FallbackFairCard({
  city, state, date, location, color, borderColor, active, onContact,
}: {
  city: string; state: string; date: string; location: string;
  color: string; borderColor: string; active: boolean; onContact: () => void;
}) {
  return (
    <div className={`relative p-5 md:p-8 rounded-3xl border-l-4 ${borderColor} ${active ? "glass hover:bg-white/5" : "bg-white/2 opacity-60"} transition-all group`}>
      {!active && (
        <span className="absolute top-4 right-4 text-[10px] font-bold uppercase text-gray-600 border border-white/10 rounded-full px-3 py-1">Encerrada</span>
      )}
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${color} bg-white/5`}>{state}</span>
          <h3 className="text-3xl font-black text-white mt-2">{city}</h3>
        </div>
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Rocket className={color} size={24} />
        </div>
      </div>
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-gray-300">
          <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center ${color}`}><Calendar size={16} /></div>
          <div><p className="text-xs font-bold text-gray-500 uppercase">Data</p><p className="font-bold text-white">{date}</p></div>
        </div>
        <div className="flex items-center gap-3 text-gray-300">
          <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center ${color}`}><MapPin size={16} /></div>
          <div><p className="text-xs font-bold text-gray-500 uppercase">Local</p><p className="font-bold text-white">{location}</p></div>
        </div>
      </div>
      {active ? (
        <button type="button" onClick={onContact} className="w-full py-3 rounded-xl font-black text-sm uppercase tracking-wide transition-all flex items-center justify-center gap-2 bg-brand-orange/10 border border-brand-orange/30 text-brand-orange hover:bg-brand-orange hover:text-white">
          RESERVAR STAND NESTA EDIÇÃO <ChevronRight size={16} />
        </button>
      ) : (
        <p className="text-center text-xs text-gray-600 font-bold uppercase tracking-widest pt-2">Próxima edição em breve</p>
      )}
    </div>
  );
}

/* ─── Stand card fallback ─────────────────────────────────────── */
function StandFallbackCard({
  img, name, desc, area, highlighted, onBuy,
}: { img: string; name: string; desc: string; area: string; highlighted: boolean; onBuy: () => void }) {
  return (
    <button
      type="button"
      onClick={onBuy}
      className={`relative flex flex-col text-left rounded-3xl border transition-all group p-5 md:p-8 ${highlighted ? "glass-card border-brand-orange/50 shadow-[0_0_40px_rgba(255,130,0,0.15)] hover:shadow-[0_0_50px_rgba(255,130,0,0.25)]" : "glass border-white/10 hover:border-brand-orange/30 hover:bg-white/5"}`}
    >
      {highlighted && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-orange text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full whitespace-nowrap">
          ⭐ Mais escolhido
        </span>
      )}
      <div className="aspect-video bg-white/5 rounded-2xl mb-6 relative overflow-hidden">
        <Image src={img} alt={name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
      </div>
      <h3 className="text-2xl font-black text-white mb-2">{name}</h3>
      <p className="text-gray-400 mb-6 text-sm">{desc}</p>
      <ul className="space-y-2 mb-8 flex-1">
        <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle2 size={16} className="text-brand-cyan shrink-0" /> {area}m² de área total</li>
        <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle2 size={16} className="text-brand-cyan shrink-0" /> Montagem e estrutura completa</li>
        <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle2 size={16} className="text-brand-cyan shrink-0" /> Iluminação, tomada e carpete</li>
      </ul>
      <div
        className={`w-full font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wide ${highlighted ? "bg-brand-orange text-white group-hover:scale-105 shadow-lg shadow-brand-orange/20" : "bg-white/5 group-hover:bg-brand-orange group-hover:text-white text-brand-orange border border-brand-orange/30"}`}
      >
        QUERO ESTE STAND <ArrowRight size={18} />
      </div>
    </button>
  );
}

