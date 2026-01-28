"use client";

import { Factory, ShoppingBag, UserX, ArrowRight } from "lucide-react";

interface ExhibitorBypassProps {
  onConfirmExpositor: () => void;
  onSelectLojista: () => void;
}

export default function ExhibitorBypassModalContent({
  onConfirmExpositor,
  onSelectLojista,
}: ExhibitorBypassProps) {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-brand-orange/10 border border-brand-orange/20 mb-6">
        <p className="text-sm text-brand-orange font-bold text-center uppercase tracking-widest">
          Atenção: Canal de Venda de Stands
        </p>
      </div>

      <p className="text-gray-400 mb-6">
        Este canal é **exclusivo para empresas** que desejam expor (vender) seus produtos na feira. Por favor, confirme seu perfil:
      </p>

      {/* Opção 1: Expositor Real */}
      <button
        onClick={onConfirmExpositor}
        className="w-full group p-6 rounded-2xl glass hover:bg-white/10 border border-white/5 transition-all flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-brand-orange/10 text-brand-orange">
            <Factory size={24} />
          </div>
          <div>
            <h4 className="text-lg font-black tracking-tight leading-tight">SOU INDÚSTRIA / FÁBRICA</h4>
            <p className="text-sm text-gray-400 mt-1 italic">Desejo comprar um stand para expor minha marca.</p>
          </div>
        </div>
        <ArrowRight className="text-gray-600 group-hover:text-white transition-colors" />
      </button>

      {/* Opção 2: Lojista Enganado */}
      <button
        onClick={onSelectLojista}
        className="w-full group p-6 rounded-2xl glass hover:bg-white/5 border border-white/5 transition-all flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-brand-cyan/10 text-brand-cyan">
            <ShoppingBag size={24} />
          </div>
          <div>
            <h4 className="text-lg font-black tracking-tight leading-tight">SOU LOJISTA / VISITANTE</h4>
            <p className="text-sm text-gray-500 mt-1 italic">Desejo apenas visitar a feira para fazer compras.</p>
          </div>
        </div>
        <ArrowRight className="text-gray-600 group-hover:text-white transition-colors" />
      </button>

      {/* Opção 3: Consumidor Final */}
      <div className="p-6 rounded-2xl glass border border-white/5 bg-red-500/5 group">
        <div className="flex items-center gap-4 opacity-70">
          <div className="p-3 rounded-xl bg-red-500/10 text-red-500">
            <UserX size={24} />
          </div>
          <div>
            <h4 className="text-lg font-black tracking-tight leading-tight text-white/50 underline decoration-red-500/30">SOU CONSUMIDOR FINAL</h4>
            <p className="text-xs text-red-400/80 mt-1 font-bold">
              ESTA FEIRA É EXCLUSIVAMENTE B2B (RESTRITA A CNPJ).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
