"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle, Loader2, AlertCircle, Mail, MailCheck } from "lucide-react";
import {
  checkExistingVisitor,
  requestVisitorReuse,
  type CheckExistingVisitorResponse,
} from "@/lib/visitorReuseApi";

interface VisitorReuseFlowProps {
  cityName: string;
  fairId: string;
  onBack: () => void;
}

type Step = "input" | "not-found" | "confirm" | "sent";

function formatPhoneMask(value: string) {
  let digits = value.replace(/\D/g, "");
  if (digits.length > 11) digits = digits.slice(0, 11);
  digits = digits.replace(/^(\d{2})(\d)/g, "($1) $2");
  digits = digits.replace(/(\d)(\d{4})$/, "$1-$2");
  return digits;
}

export default function VisitorReuseFlow({ cityName, fairId, onBack }: VisitorReuseFlowProps) {
  const [step, setStep] = useState<Step>("input");
  const [identifier, setIdentifier] = useState("");
  const [phone, setPhone] = useState("");
  const [match, setMatch] = useState<CheckExistingVisitorResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    if (!identifier.trim()) {
      setError("Informe seu email ou telefone.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const result = await checkExistingVisitor(identifier);
      setMatch(result);
      setStep(result.exists ? "confirm" : "not-found");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (phone.replace(/\D/g, "").length < 10) {
      setError("Informe um telefone válido.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await requestVisitorReuse({ identifier, fairId, phone });
      setStep("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetToInput = () => {
    setMatch(null);
    setPhone("");
    setError(null);
    setStep("input");
  };

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white uppercase tracking-wider transition-colors"
      >
        <ArrowLeft size={14} /> Voltar ao cadastro
      </button>

      <div>
        <p className="text-brand-cyan font-bold tracking-widest text-xs uppercase mb-1">{cityName} 2026</p>
        <h3 className="text-xl md:text-2xl font-black text-white leading-tight">Reaproveitar meu cadastro</h3>
      </div>

      {step === "input" && (
        <div className="space-y-4">
          <p className="text-gray-400 text-sm">
            Já se cadastrou em uma edição anterior da Expo MultiMix? Informe seu email ou telefone pra localizarmos seus dados.
          </p>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Email ou telefone</label>
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCheck()}
              type="text"
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-cyan transition-colors"
              placeholder="seu@email.com ou (00) 00000-0000"
            />
          </div>

          <button
            type="button"
            onClick={handleCheck}
            disabled={isLoading}
            className="w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 bg-brand-cyan hover:bg-brand-cyan/90 text-brand-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : null}
            {isLoading ? "VERIFICANDO..." : "VERIFICAR"}
          </button>
        </div>
      )}

      {step === "not-found" && (
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-sm text-gray-300">
            Não encontramos nenhum cadastro com esse contato.
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={resetToInput}
              className="flex-1 py-3 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 font-bold transition-all"
            >
              TENTAR OUTRO CONTATO
            </button>
            <button
              type="button"
              onClick={onBack}
              className="flex-1 py-3 rounded-lg font-bold bg-brand-cyan hover:bg-brand-cyan/90 text-brand-blue transition-all"
            >
              FAZER CADASTRO NOVO
            </button>
          </div>
        </div>
      )}

      {step === "confirm" && match && (
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-2">
            <p className="text-xs font-bold text-gray-500 uppercase">Achamos seu cadastro</p>
            <div className="flex items-center gap-2 text-white">
              <Mail size={16} className="text-brand-cyan shrink-0" />
              <span className="font-mono text-sm">{match.maskedEmail}</span>
            </div>
            {match.maskedPhone && (
              <p className="text-sm text-gray-400 font-mono pl-6">{match.maskedPhone}</p>
            )}
          </div>

          <p className="text-gray-300 text-sm">É você? Confirme seu telefone atual pra prosseguirmos.</p>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Telefone atual</label>
            <input
              value={phone}
              onChange={(e) => setPhone(formatPhoneMask(e.target.value))}
              onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
              type="tel"
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-cyan transition-colors"
              placeholder="(00) 00000-0000"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={resetToInput}
              className="flex-1 py-3 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 font-bold transition-all"
            >
              NÃO SOU EU
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 bg-brand-cyan hover:bg-brand-cyan/90 text-brand-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : null}
              {isLoading ? "ENVIANDO..." : "SIM, SOU EU"}
            </button>
          </div>
        </div>
      )}

      {step === "sent" && match && (
        <div className="text-center py-6">
          <div className="w-20 h-20 bg-brand-cyan/20 text-brand-cyan rounded-full flex items-center justify-center mx-auto mb-6">
            <MailCheck size={40} />
          </div>
          <h4 className="text-2xl font-bold text-white mb-4">Verifique seu email</h4>
          <p className="text-gray-400">
            Enviamos um link de confirmação para <strong className="text-white font-mono">{match.maskedEmail}</strong>.
            <br />
            Abra sua caixa de entrada e clique no link pra concluir seu credenciamento na{" "}
            <strong>Expo MultiMix {cityName}</strong>.
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-lg text-xs flex items-start gap-2 animate-fade-in">
          <AlertCircle className="shrink-0 mt-0.5 text-red-400" size={16} />
          <span>{error}</span>
        </div>
      )}

      {step !== "sent" && (
        <p className="flex items-center gap-1.5 text-[10px] text-gray-500">
          <CheckCircle size={12} className="text-brand-cyan shrink-0" />
          Só mostramos seus dados mascarados até você confirmar pelo email.
        </p>
      )}
    </div>
  );
}
