"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface ClientImage {
  id?: string;
  imageUrl?: string;
  url?: string;
  logoUrl?: string;
  clientName?: string;
  name?: string;
}

interface LogosCarouselProps {
  title?: string;
  subtitle?: string;
  direction?: "left" | "right";
  speed?: number;
}

function resolveImageUrl(item: ClientImage): string | null {
  return item.imageUrl ?? item.logoUrl ?? item.url ?? null;
}

function resolveName(item: ClientImage): string {
  return item.clientName ?? item.name ?? "Expositor";
}

export default function LogosCarousel({
  title = "EXPOSITORES CONFIRMADOS",
  subtitle = "Marcas que estarão presentes na feira",
  direction = "left",
  speed = 40,
}: LogosCarouselProps) {
  const [logos, setLogos] = useState<ClientImage[]>([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!apiUrl) {
      setLoading(false);
      return;
    }

    fetch(`${apiUrl}/finance/clients/images`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("[LogosCarousel] API response:", data);
        const items: ClientImage[] = Array.isArray(data) ? data : (data.data ?? []);
        console.log("[LogosCarousel] items parsed:", items.length, "first item keys:", items[0] ? Object.keys(items[0]) : "none");
        const filtered = items.filter((item) => resolveImageUrl(item));
        console.log("[LogosCarousel] filtered (with image):", filtered.length);
        setLogos(filtered);
      })
      .catch((err) => {
        console.error("[LogosCarousel] fetch error:", err);
      })
      .finally(() => setLoading(false));
  }, [apiUrl]);

  if (loading || logos.length === 0) return null;

  const doubled = [...logos, ...logos];
  const animationName = direction === "left" ? "scroll-logos-left" : "scroll-logos-right";
  const duration = Math.max(20, logos.length * (speed / 10));

  return (
    <section className="py-16 bg-brand-blue relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-brand-cyan font-bold tracking-[0.2em] uppercase text-sm mb-3"
        >
          {subtitle}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-black text-white"
        >
          {title}
        </motion.h2>
      </div>

      <div className="relative group">
        <div className="pointer-events-none absolute left-0 top-0 h-full w-28 bg-gradient-to-r from-brand-blue to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-28 bg-gradient-to-l from-brand-blue to-transparent z-10" />

        <div className="overflow-hidden">
          <div
            className="flex gap-6 will-change-transform group-hover:[animation-play-state:paused]"
            style={{
              animation: `${animationName} ${duration}s linear infinite`,
              width: "max-content",
            }}
          >
            {doubled.map((logo, i) => {
              const imgUrl = resolveImageUrl(logo);
              const name = resolveName(logo);
              return (
                <div
                  key={`${logo.id ?? i}-${i}`}
                  className="flex-shrink-0 w-36 h-20 bg-white rounded-xl flex items-center justify-center p-3 opacity-70 hover:opacity-100 transition-opacity duration-300"
                  title={name}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgUrl!}
                    alt={name}
                    className="max-w-full max-h-full object-contain"
                    loading="lazy"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
