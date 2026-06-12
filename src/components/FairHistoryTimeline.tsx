"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

interface Edition {
  year: number;
  edition: string;
  cities: string[];
  description: string;
  accentColor: string;
  dotClass: string;
  current?: boolean;
}

const EDITIONS: Edition[] = [
  {
    year: 2022,
    edition: "1ª EDIÇÃO",
    cities: ["Manaus"],
    description: "O início. A Expo MultiMix conecta indústrias nacionais diretamente com lojistas da Amazônia pela primeira vez.",
    accentColor: "border-l-brand-pink",
    dotClass: "bg-brand-pink/50",
  },
  {
    year: 2023,
    edition: "2ª EDIÇÃO",
    cities: ["Manaus", "Belém"],
    description: "Expansão histórica para o Pará. Duas capitais, o dobro de negócios e a consolidação do maior B2B do Norte.",
    accentColor: "border-l-brand-orange",
    dotClass: "bg-brand-orange/50",
  },
  {
    year: 2024,
    edition: "3ª EDIÇÃO",
    cities: ["Manaus", "Belém"],
    description: "Crescimento recorde. Mais de 100 marcas nacionais presentes e o maior volume de negócios da região.",
    accentColor: "border-l-brand-cyan",
    dotClass: "bg-brand-cyan/50",
  },
  {
    year: 2025,
    edition: "4ª EDIÇÃO",
    cities: ["Manaus", "Belém"],
    description: "A maior edição até então — recorde de público e de expositores nas duas capitais do Norte.",
    accentColor: "border-l-brand-pink",
    dotClass: "bg-brand-pink/50",
  },
  {
    year: 2026,
    edition: "5ª EDIÇÃO",
    cities: ["Manaus", "Belém"],
    description: "A edição que vai quebrar todos os recordes. Belém em agosto. Faça parte desta história.",
    accentColor: "border-l-brand-cyan",
    dotClass: "bg-brand-cyan",
    current: true,
  },
];

export default function FairHistoryTimeline() {
  return (
    <section className="py-24 bg-[#020c18] relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-brand-blue/30 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-cyan/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-cyan font-bold tracking-[0.2em] uppercase text-sm mb-4"
          >
            Uma trajetória de crescimento
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
          <div className="h-1 w-20 bg-brand-cyan mx-auto rounded-full" />
        </div>

        {/* Scrollable timeline container */}
        <div className="overflow-x-auto -mx-6 px-6 pb-4">
          <div className="min-w-[860px] md:min-w-0">

            {/* Cards row */}
            <div className="grid grid-cols-5 gap-3 mb-8">
              {EDITIONS.map((ed, i) => (
                <motion.div
                  key={ed.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className={`relative flex flex-col p-5 rounded-2xl border-l-4 ${ed.accentColor} ${
                    ed.current
                      ? "bg-white/5 border border-brand-cyan/20 shadow-[0_0_30px_rgba(34,211,238,0.12)]"
                      : "glass border border-white/5"
                  }`}
                >
                  {ed.current && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-cyan text-brand-blue text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap">
                      EDIÇÃO ATUAL
                    </span>
                  )}

                  <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-1">
                    {ed.edition}
                  </p>
                  <p className={`text-5xl font-black mb-3 leading-none ${ed.current ? "text-white/30" : "text-white/10"}`}>
                    {ed.year}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {ed.cities.map((city) => (
                      <span
                        key={city}
                        className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide bg-white/5 rounded-full px-2 py-0.5 text-gray-400"
                      >
                        <MapPin size={8} />
                        {city}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed flex-1">{ed.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Timeline — dots + line */}
            <div className="grid grid-cols-5 relative">
              {/* Connecting line spanning from center of col-1 to center of col-5 */}
              <div className="absolute top-[8px] left-[10%] right-[10%] h-px bg-white/10" />

              {EDITIONS.map((ed, i) => (
                <div key={ed.year} className="flex flex-col items-center gap-2 relative z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 + 0.3, type: "spring", stiffness: 300 }}
                    className={`w-4 h-4 rounded-full flex-none ${ed.dotClass} ${
                      ed.current
                        ? "shadow-[0_0_14px_rgba(34,211,238,0.8)] ring-2 ring-brand-cyan/40 ring-offset-2 ring-offset-[#020c18]"
                        : ""
                    }`}
                  />
                  <p className={`text-[11px] font-bold ${ed.current ? "text-brand-cyan" : "text-gray-600"}`}>
                    {ed.year}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
