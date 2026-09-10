"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, MessageCircle, QrCode } from "lucide-react";
import Footer from "@/components/Footer";
import { openWhatsApp } from "@/lib/whatsapp";

export default function CredenciamentoConfirmadoContent() {
  const [cidade, setCidade] = useState<string | null>(null);
  const [visitantes, setVisitantes] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cidadeValue = params.get("cidade") || params.get("city");
    const visitantesValue = Number(params.get("visitantes"));
    const t = setTimeout(() => {
      setCidade(cidadeValue);
      if (visitantesValue > 0) setVisitantes(visitantesValue);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const handleWhatsAppClick = () => openWhatsApp("Olá! Gostaria de falar com a equipe da Expo MultiMix.");

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
            com sucesso.
            {visitantes && visitantes > 1 ? ` Cadastramos ${visitantes} visitantes.` : ""}
          </p>

          <div className="mt-6 bg-brand-cyan/10 border border-brand-cyan/20 p-4 rounded-xl flex items-start gap-3 text-left">
            <QrCode size={22} className="text-brand-cyan shrink-0 mt-0.5" />
            <p className="text-sm text-gray-200">
              Enviamos um email com o <strong className="text-white">QR Code de confirmação</strong> do seu
              credenciamento — apresente ele na entrada do evento. Confira sua caixa de entrada (e a pasta de
              spam, por garantia).
            </p>
          </div>

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
