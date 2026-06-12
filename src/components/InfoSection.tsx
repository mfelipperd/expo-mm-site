"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Clock } from "lucide-react";
import { fetchFairs, formatFairDates, type FairListItem } from "@/lib/fairsApi";

interface InfoSectionProps {
  detectedCity?: 'manaus' | 'belem' | null;
  onEventClick?: (slug: string) => void;
}

interface EventCard {
  city: string;
  date: string;
  time: string;
  location: string;
  color: string;
  slug: string;
}

const FALLBACK_EVENTS: EventCard[] = [
  {
    city: "BELÉM",
    date: "18 a 20 de Agosto de 2026",
    time: "13h - 21h",
    location: "Pavilhão de Feiras da Estação das Docas",
    color: "border-brand-cyan",
    slug: "belem",
  },
];

const CITY_DEFAULTS: Record<string, { time: string; location: string; color: string; slug: string }> = {
  manaus: { time: "13h - 20h", location: "Centro de Convenções Vasco Vasques", color: "border-brand-pink", slug: "manaus" },
  belem: { time: "13h - 21h", location: "Pavilhão de Feiras da Estação das Docas", color: "border-brand-cyan", slug: "belem" },
  belém: { time: "13h - 21h", location: "Pavilhão de Feiras da Estação das Docas", color: "border-brand-cyan", slug: "belem" },
};

function fairToEventCard(fair: FairListItem): EventCard {
  const key = fair.city.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const defaults = CITY_DEFAULTS[key] ?? CITY_DEFAULTS[fair.city.toLowerCase()] ?? {
    time: "",
    location: `${fair.city}, ${fair.state}`,
    color: "border-brand-cyan",
    slug: key,
  };
  return {
    city: fair.city.toUpperCase(),
    date: formatFairDates(fair.startDate, fair.endDate) || fair.city,
    time: defaults.time,
    location: defaults.location,
    color: defaults.color,
    slug: defaults.slug,
  };
}

export default function InfoSection({ detectedCity, onEventClick }: InfoSectionProps) {
  const [events, setEvents] = useState<EventCard[]>(FALLBACK_EVENTS);

  useEffect(() => {
    fetchFairs().then((fairs) => {
      if (!fairs.length) return;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const active = fairs.filter((f) => new Date(f.endDate + "T23:59:59") >= today);
      if (!active.length) return;
      const sorted = [...active].sort((a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
      setEvents(sorted.map(fairToEventCard));
    });
  }, []);

  return (
    <section className="py-24 relative overflow-hidden bg-brand-blue">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black mb-4"
          >
            NOSSOS <span className="text-brand-cyan">EVENTOS</span>
          </motion.h2>
          <div className="h-1 w-20 bg-brand-pink mx-auto rounded-full"></div>
        </div>

        <div className={`grid gap-8 ${events.length === 1 ? "max-w-2xl mx-auto w-full" : "md:grid-cols-2"}`}>
          {events.map((event, index) => (
            <motion.div
              key={event.city}
              initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`glass-card p-6 md:p-10 rounded-2xl border-l-8 ${event.color}`}
            >
              <h3 className="text-3xl md:text-4xl font-black mb-6 md:mb-8 tracking-tighter">
                {event.city}
              </h3>

              <div className="space-y-6">
                <div className="flex items-center gap-4 text-gray-300">
                  <div className="p-3 bg-brand-white/5 rounded-xl text-brand-cyan">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className="text-sm uppercase font-bold text-gray-500">Data</p>
                    <p className="text-lg font-semibold text-white">{event.date}</p>
                  </div>
                </div>

                {event.time && (
                  <div className="flex items-center gap-4 text-gray-300">
                    <div className="p-3 bg-brand-white/5 rounded-xl text-brand-pink">
                      <Clock size={24} />
                    </div>
                    <div>
                      <p className="text-sm uppercase font-bold text-gray-500">Horário</p>
                      <p className="text-lg font-semibold text-white">{event.time}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 text-gray-300">
                  <div className="p-3 bg-brand-white/5 rounded-xl text-brand-orange">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-sm uppercase font-bold text-gray-500">Local</p>
                    <p className="text-lg font-semibold text-white">{event.location}</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 w-full">
                <button
                  type="button"
                  onClick={() => onEventClick?.(event.slug)}
                  className="w-full py-4 glass hover:bg-white/10 rounded-xl font-bold transition-all"
                >
                  VER MAIS DETALHES
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
