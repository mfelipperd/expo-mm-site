"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { fetchFairs, type FairListItem } from "@/lib/fairsApi";

const ACCENT_CYCLE = [
  { border: "border-l-brand-pink",   dot: "bg-brand-pink/50"   },
  { border: "border-l-brand-orange", dot: "bg-brand-orange/50" },
  { border: "border-l-brand-cyan",   dot: "bg-brand-cyan/50"   },
];

function isFairActive(fair: FairListItem): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(fair.endDate + "T23:59:59") >= today;
}

export default function FairHistoryTimeline() {
  const [fairs, setFairs] = useState<FairListItem[]>([]);

  useEffect(() => {
    fetchFairs().then((data) => {
      const sorted = [...data].sort(
        (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
      setFairs(sorted);
    });
  }, []);

  if (fairs.length === 0) return null;

  const n = fairs.length;
  // Center of first col = 50/n %, same for right side
  const lineOffset = `${50 / n}%`;

  return (
    <section className="py-24 bg-[#020c18] relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-brand-blue/30 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-cyan/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-cyan font-bold tracking-[0.2em] uppercase text-sm mb-4"
          >
            17ª edição em Belém · 3ª edição em Manaus
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-black mb-4"
          >
            NOSSAS <span className="text-brand-pink">EDIÇÕES</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-gray-400 max-w-xl mx-auto text-sm mb-6"
          >
            Consolidada como a maior feira B2B da Região Norte, a Expo MultiMix conecta indústrias e importadoras nacionais diretamente com os lojistas do Pará e Amazonas há décadas.
          </motion.p>
          <div className="h-1 w-20 bg-brand-cyan mx-auto rounded-full" />
        </div>

        <div className="overflow-x-auto -mx-6 px-6 pb-4">
          <div style={{ minWidth: `${Math.max(n * 180, 400)}px` }}>

            {/* Cards row */}
            <div
              className="grid gap-3 mb-8"
              style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
            >
              {fairs.map((fair, i) => {
                const active = isFairActive(fair);
                const accent = ACCENT_CYCLE[i % ACCENT_CYCLE.length];
                const year = new Date(fair.startDate + "T12:00:00").getFullYear();
                return (
                  <motion.div
                    key={fair.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    className={`relative flex flex-col p-5 rounded-2xl border-l-4 ${accent.border} ${
                      active
                        ? "bg-white/5 border border-brand-cyan/20 shadow-[0_0_30px_rgba(34,211,238,0.12)]"
                        : "glass border border-white/5"
                    }`}
                  >
                    {active && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-cyan text-brand-blue text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap">
                        EDIÇÃO ATUAL
                      </span>
                    )}

                    {fair.edition && (
                      <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-1">
                        {fair.edition}
                      </p>
                    )}

                    <p className={`text-5xl font-black mb-3 leading-none ${active ? "text-white/30" : "text-white/10"}`}>
                      {year}
                    </p>

                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide bg-white/5 rounded-full px-2 py-0.5 text-gray-400 mb-3 self-start">
                      <MapPin size={8} />
                      {fair.city}
                    </span>

                    {(fair.expectedVisitors > 0 || fair.expectedExhibitors > 0) && (
                      <div className="flex gap-3 mt-auto pt-3 border-t border-white/5">
                        {fair.expectedVisitors > 0 && (
                          <div>
                            <p className="text-xs font-black text-white/60">{fair.expectedVisitors.toLocaleString("pt-BR")}+</p>
                            <p className="text-[9px] text-gray-600 uppercase">visitantes</p>
                          </div>
                        )}
                        {fair.expectedExhibitors > 0 && (
                          <div>
                            <p className="text-xs font-black text-white/60">{fair.expectedExhibitors}+</p>
                            <p className="text-[9px] text-gray-600 uppercase">expositores</p>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Timeline — dots + connecting line */}
            <div
              className="grid relative"
              style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
            >
              <div
                className="absolute top-[8px] h-px bg-white/10"
                style={{ left: lineOffset, right: lineOffset }}
              />
              {fairs.map((fair, i) => {
                const active = isFairActive(fair);
                const accent = ACCENT_CYCLE[i % ACCENT_CYCLE.length];
                return (
                  <div key={fair.id} className="flex flex-col items-center gap-2 relative z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 + 0.3, type: "spring", stiffness: 300 }}
                      className={`w-4 h-4 rounded-full flex-none ${
                        active
                          ? "bg-brand-cyan! shadow-[0_0_14px_rgba(34,211,238,0.8)] ring-2 ring-brand-cyan/40 ring-offset-2 ring-offset-[#020c18]"
                          : accent.dot
                      }`}
                    />
                    <p className={`text-[11px] font-bold ${active ? "text-brand-cyan" : "text-gray-600"}`}>
                      {new Date(fair.startDate + "T12:00:00").getFullYear()}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
