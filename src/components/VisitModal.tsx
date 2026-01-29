"use client";

import { MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface VisitModalProps {
  onSelect: (city: string) => void;
}

interface VisitModalContentProps {
  detectedCity?: 'manaus' | 'belem' | null;
}

export default function VisitModalContent({ detectedCity }: VisitModalContentProps) {
  const allOptions = [
    {
      city: "MANAUS",
      link: "/manaus",
      color: "text-brand-pink",
      bg: "bg-brand-pink/10",
    },
    {
      city: "BELÉM",
      link: "/belem",
      color: "text-brand-cyan",
      bg: "bg-brand-cyan/10",
    },
  ];

  const options = detectedCity
    ? allOptions.filter(opt => opt.link === `/${detectedCity}`)
    : allOptions;

  return (
    <div className="space-y-4">
      <p className="text-gray-400 mb-6">
        Selecione a edição da feira que deseja visitar para acessar o formulário de inscrição.
      </p>
      {options.map((opt) => (
    <a
          key={opt.city}
          href={opt.link}
          className="group p-6 rounded-2xl glass hover:bg-white/10 border border-white/5 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${opt.bg} ${opt.color}`}>
              <MapPin size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Edição</p>
              <h4 className="text-xl font-black tracking-tight">{opt.city}</h4>
            </div>
          </div>
          <ArrowRight className="text-gray-600 group-hover:text-white transition-colors" />
        </a>
      ))}
    </div>
  );
}
