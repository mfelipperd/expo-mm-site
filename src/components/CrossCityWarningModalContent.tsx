
"use client";

import { AlertTriangle, ArrowRight, MapPin } from "lucide-react";

interface CrossCityWarningModalContentProps {
  userCity: string;
  targetCity: string;
  onProceed: () => void;
  onRedirect: () => void;
}

export default function CrossCityWarningModalContent({
  userCity,
  targetCity,
  onProceed,
  onRedirect,
}: CrossCityWarningModalContentProps) {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-500 mb-4">
        <AlertTriangle size={32} />
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-2">
          Você está em {userCity.toUpperCase()}
        </h3>
        <p className="text-gray-400">
          Notamos que você selecionou a feira de <strong className="text-white">{targetCity.toUpperCase()}</strong>, 
          mas sua localização indica que você está em <strong>{userCity.toUpperCase()}</strong>.
        </p>
      </div>

      <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-sm text-gray-400">
        Cadastar-se na feira errada pode dificultar sua visita. Deseja ir para a página da sua região?
      </div>

      <div className="space-y-3 pt-2">
        <button
          onClick={onRedirect}
          className="w-full py-4 bg-brand-cyan hover:bg-brand-cyan/90 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-cyan/20"
        >
          <MapPin size={20} />
          IR PARA {userCity.toUpperCase()} (RECOMENDADO)
        </button>

        <button
          onClick={onProceed}
          className="w-full py-4 glass hover:bg-white/10 text-gray-400 hover:text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
        >
          Continuar para {targetCity.toUpperCase()}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
