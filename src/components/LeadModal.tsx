"use client";

import { ShoppingBag, Presentation, ArrowRight } from "lucide-react";

interface LeadModalProps {
  onSelectLojista: () => void;
  onSelectExpositor: () => void;
}

export default function LeadModalContent({
  onSelectLojista,
  onSelectExpositor,
}: LeadModalProps) {
  return (
    <div className="space-y-4">
      <p className="text-gray-400 mb-6">
        Para melhor atendê-lo, identifique o seu perfil de interesse na feira.
      </p>

      <button
        onClick={onSelectLojista}
        className="w-full group p-6 rounded-2xl glass hover:bg-white/10 border border-white/5 transition-all flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-brand-cyan/10 text-brand-cyan">
            <ShoppingBag size={24} />
          </div>
          <div>
            <h4 className="text-xl font-black tracking-tight">LOJISTA (VISITANTE)</h4>
            <p className="text-sm text-gray-500 italic">Quero comprar produtos e conhecer novidades.</p>
          </div>
        </div>
        <ArrowRight className="text-gray-600 group-hover:text-white transition-colors" />
      </button>

      <div className="space-y-2">
        <button
          onClick={onSelectExpositor}
          className="w-full group p-6 rounded-2xl glass hover:bg-white/10 border border-white/5 transition-all flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-brand-orange/10 text-brand-orange">
              <Presentation size={24} />
            </div>
            <div>
              <h4 className="text-xl font-black tracking-tight">EXPOSITOR (PARTICIPANTE)</h4>
              <p className="text-sm text-gray-500 italic">Quero expor minha indústria ou fábrica.</p>
            </div>
          </div>
          <ArrowRight className="text-gray-600 group-hover:text-white transition-colors" />
        </button>
        <div className="px-6">
          <a 
            href="/quero-expor" 
            className="text-xs text-brand-orange hover:underline font-bold uppercase tracking-widest"
          >
            Saiba mais sobre como expor →
          </a>
        </div>
      </div>
    </div>
  );
}
