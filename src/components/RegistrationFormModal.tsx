"use client";

import { useState } from "react";
import { X, CheckCircle, Loader2 } from "lucide-react";

interface RegistrationFormModalProps {
  cityName: string;
  onClose: () => void;
}

export default function RegistrationFormModal({ cityName, onClose }: RegistrationFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Integrate with backend endpoint
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="text-center py-12 px-6">
        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">Credenciamento Realizado!</h3>
        <p className="text-gray-400 mb-8">
          Sua pré-inscrição para a <strong>Expo MultiMix {cityName}</strong> foi recebida com sucesso.
          Em breve entraremos em contato com mais informações.
        </p>
        <button
          onClick={onClose}
          className="bg-brand-cyan text-white px-8 py-3 rounded-full font-bold hover:bg-brand-cyan/90 transition-all"
        >
          FECHAR
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <p className="text-brand-cyan font-bold tracking-widest text-sm uppercase mb-2">
          {cityName} 2025
        </p>
        <h3 className="text-3xl font-black text-white leading-tight">
          GARANTA SUA VAGA
        </h3>
        <p className="text-gray-400 mt-2">
          Preencha o formulário abaixo para realizar seu credenciamento gratuito.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Nome Completo</label>
            <input
              type="text"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors"
              placeholder="Seu nome"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Empresa / Loja</label>
            <input
              type="text"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors"
              placeholder="Nome da sua empresa"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Email Corporativo</label>
          <input
            type="email"
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors"
            placeholder="seu@email.com"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">WhatsApp</label>
            <input
              type="tel"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors"
              placeholder="(00) 00000-0000"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">CNPJ</label>
            <input
              type="text"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors"
              placeholder="00.000.000/0000-00"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-linear-to-r from-brand-pink to-brand-orange text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" /> Processando...
              </>
            ) : (
              "CONFIRMAR CREDENCIAMENTO"
            )}
          </button>
          <p className="text-center text-xs text-gray-500 mt-4">
            *Ao se cadastrar você concorda com nossa política de privacidade.
          </p>
        </div>
      </form>
    </div>
  );
}
