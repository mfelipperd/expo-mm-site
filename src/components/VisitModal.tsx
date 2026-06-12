"use client";

import { useState, useEffect } from "react";
import { MapPin, ArrowRight, Clock } from "lucide-react";
import { fetchFairs, type FairListItem } from "@/lib/fairsApi";

interface VisitModalContentProps {
  detectedCity?: 'manaus' | 'belem' | null;
}

const KNOWN_CITIES = [
  { slug: "manaus", label: "MANAUS", color: "text-brand-pink", bg: "bg-brand-pink/10", link: "/manaus" },
  { slug: "belem",  label: "BELÉM",  color: "text-brand-cyan",  bg: "bg-brand-cyan/10",  link: "/belem"  },
];

function isFairActive(fair: FairListItem): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(fair.endDate + "T23:59:59") >= today;
}

function normCity(city: string): string {
  return city.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export default function VisitModalContent({ detectedCity }: VisitModalContentProps) {
  const [activeSlugs, setActiveSlugs] = useState<Set<string>>(new Set(["belem"]));

  useEffect(() => {
    fetchFairs().then((fairs) => {
      const active = fairs.filter(isFairActive);
      const slugs = new Set(
        active.map((f) => {
          const norm = normCity(f.city);
          return KNOWN_CITIES.find((c) => norm.includes(c.slug))?.slug ?? norm;
        })
      );
      if (slugs.size) setActiveSlugs(slugs);
    });
  }, []);

  // If the detected city is already past, show all options so the user can pick an active one
  const detectedIsActive = detectedCity ? activeSlugs.has(detectedCity) : false;
  const citiesToShow = detectedIsActive
    ? KNOWN_CITIES.filter((c) => c.slug === detectedCity)
    : KNOWN_CITIES;

  return (
    <div className="space-y-4">
      <p className="text-gray-400 mb-6">
        Selecione a edição da feira que deseja visitar para acessar o formulário de inscrição.
      </p>

      {citiesToShow.map((city) => {
        const isActive = activeSlugs.has(city.slug);

        if (isActive) {
          return (
            <a
              key={city.slug}
              href={city.link}
              className="group p-6 rounded-2xl glass hover:bg-white/10 border border-white/5 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${city.bg} ${city.color}`}>
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Edição</p>
                  <h4 className="text-xl font-black tracking-tight">{city.label}</h4>
                </div>
              </div>
              <ArrowRight className="text-gray-600 group-hover:text-white transition-colors" />
            </a>
          );
        }

        return (
          <div
            key={city.slug}
            className="p-6 rounded-2xl border border-white/5 bg-white/2 flex items-center justify-between opacity-60 cursor-not-allowed select-none"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${city.bg} ${city.color} opacity-50`}>
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Edição</p>
                <h4 className="text-xl font-black tracking-tight">{city.label}</h4>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-1">
                  <Clock size={10} /> Próxima edição em breve
                </span>
              </div>
            </div>
            <div className="text-[10px] font-bold uppercase text-gray-600 border border-white/10 rounded-full px-3 py-1">
              Encerrada
            </div>
          </div>
        );
      })}
    </div>
  );
}
