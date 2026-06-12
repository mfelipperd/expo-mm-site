"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { ExhibitorBrand } from "@/lib/fairsApi";
import type { ClientImageDto } from "@/lib/adminApi";

interface ExhibitorsSectionProps {
  fairId?: string;
  apiExhibitors?: ExhibitorBrand[];
}

export default function ExhibitorsSection({ fairId, apiExhibitors }: ExhibitorsSectionProps) {
  const [images, setImages] = useState<ClientImageDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
    const url = fairId
      ? `${API_BASE}/finance/clients/images?fairId=${fairId}`
      : `${API_BASE}/finance/clients/images`;

    fetch(url)
      .then((r) => (r.ok ? r.json() : []))
      .then((data: ClientImageDto[]) => {
        setImages(Array.isArray(data) ? data : []);
      })
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, [fairId]);

  // Merge: API images first, then fallback to prop brands not already present
  const imageUrls = new Set(images.map((img) => img.url?.toLowerCase().trim()));
  const fallbackBrands = (apiExhibitors ?? []).filter(
    (b) => b.logoUrl && !imageUrls.has(b.logoUrl.toLowerCase().trim())
  );

  const allLogos: Array<{ id: string; url: string; caption: string | null }> = [
    ...images.map((img) => ({ id: img.id, url: img.url, caption: img.caption })),
    ...fallbackBrands.map((b) => ({ id: `brand-${b.name}`, url: b.logoUrl, caption: b.name })),
  ];

  if (!loading && allLogos.length === 0) return null;

  return (
    <section className="py-24 bg-brand-blue relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-brand-cyan font-bold tracking-[0.2em] uppercase text-sm mb-4"
          >
            Presenças Confirmadas
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white"
          >
            INDÚSTRIAS QUE ESTARÃO <br />
            <span className="text-brand-orange">EXPONDO</span>
          </motion.h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl bg-white/5 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-5">
            {allLogos.map((logo, i) => (
              <motion.div
                key={logo.id}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: (i % 12) * 0.04, duration: 0.3 }}
                viewport={{ once: true }}
                className="aspect-square bg-white rounded-2xl flex items-center justify-center p-3 opacity-75 hover:opacity-100 hover:scale-105 transition-all duration-300"
                title={logo.caption ?? undefined}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.url}
                  alt={logo.caption ?? "Expositor Expo MultiMix"}
                  className="max-w-full max-h-full object-contain"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
