"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StandImageCarouselProps {
  images: string[];
  alt: string;
  autoAdvanceMs?: number;
}

export function StandImageCarousel({ images, alt, autoAdvanceMs = 4000 }: StandImageCarouselProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, autoAdvanceMs);
    return () => clearInterval(timer);
  }, [images.length, autoAdvanceMs]);

  const goTo = (i: number) => setIndex((i + images.length) % images.length);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={`${alt} ${i + 1}`}
            fill
            className={`object-cover transition-opacity duration-500 ${i === index ? "opacity-100" : "opacity-0"}`}
          />
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goTo(index - 1);
            }}
            aria-label="Foto anterior"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-slate-900/60 hover:bg-slate-900/80 text-white rounded-full p-1.5 z-10 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goTo(index + 1);
            }}
            aria-label="Próxima foto"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-900/60 hover:bg-slate-900/80 text-white rounded-full p-1.5 z-10 transition-colors"
          >
            <ChevronRight size={16} />
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goTo(i);
                }}
                aria-label={`Ver foto ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-4 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
