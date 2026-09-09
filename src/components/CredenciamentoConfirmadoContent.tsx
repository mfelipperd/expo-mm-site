"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, MessageCircle } from "lucide-react";
import Footer from "@/components/Footer";

export default function CredenciamentoConfirmadoContent() {
  const [cidade, setCidade] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const value = params.get("cidade") || params.get("city");
    const t = setTimeout(() => setCidade(value), 0);
    return () => clearTimeout(t);
  }, []);

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/5591981306900", "_blank", "noopener,noreferrer");
  };

  return (
    <main className="min-h-screen bg-brand-blue flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-lg w-full text-center">
          <Link href="/" className="relative h-12 w-40 mx-auto mb-10 block">
            <Image
              src="/assets/logo EMM_Prancheta 1.png"
              alt="Expo MultiMix"
              fill
              className="object-contain"
            />
          </Link>

          <div className="w-20 h-20 bg-brand-cyan/20 text-brand-cyan rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-white mb-4">
            Credenciamento confirmado!
          </h1>
          <p className="text-gray-400 leading-relaxed">
            Seu cadastro{cidade ? ` para a Expo MultiMix ${cidade}` : " na Expo MultiMix"} foi confirmado
            com sucesso. Você já está inscrito — fique de olho no seu email e WhatsApp, vamos enviar mais
            detalhes conforme a data do evento se aproxima.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-brand-cyan text-brand-blue px-8 py-3 rounded-full font-bold hover:bg-brand-cyan/90 transition-all"
            >
              VOLTAR AO SITE
            </Link>
            <button
              type="button"
              onClick={handleWhatsAppClick}
              className="inline-flex items-center justify-center gap-2 glass hover:bg-white/10 text-white px-8 py-3 rounded-full font-bold transition-all"
            >
              <MessageCircle size={18} /> FALAR NO WHATSAPP
            </button>
          </div>
        </div>
      </div>

      <Footer onWhatsAppClick={handleWhatsAppClick} />
    </main>
  );
}
