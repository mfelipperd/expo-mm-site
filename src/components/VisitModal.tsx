"use client";

import { MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface VisitModalProps {
  onSelect: (city: string) => void;
}

export default function VisitModalContent() {
  const options = [
    {
      city: "MANAUS",
      link: "https://www.expomultimix.com/c%C3%B3pia-emm-manaus",
      color: "text-brand-pink",
      bg: "bg-brand-pink/10",
    },
    {
      city: "BELÉM",
      link: "https://credenciamento-frontend.vercel.app/public-form/0299a14d-10f1-4799-bf18-a0ecfec99d62",
      color: "text-brand-cyan",
      bg: "bg-brand-cyan/10",
    },
  ];

  return (
    <div className="space-y-4">
      <p className="text-gray-400 mb-6">
        Selecione a edição da feira que deseja visitar para acessar o formulário de inscrição.
      </p>
      {options.map((opt) => (
        <a
          key={opt.city}
          href={opt.link}
          target="_blank"
          rel="noopener noreferrer"
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
