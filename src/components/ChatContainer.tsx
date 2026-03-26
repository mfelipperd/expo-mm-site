"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Bot, User, Loader2, ArrowLeft } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { usePathname } from "next/navigation";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ATTENDANTS = ["Carla Souza", "Fabiana Oliveira", "Josefa Santos", "Andreia Lima", "Sheila Rocha"];

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatContainerProps {
  onClose: () => void;
  isFullPage?: boolean;
}

export default function ChatContainer({ onClose, isFullPage = false }: ChatContainerProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [attendantName, setAttendantName] = useState<string | null>(null);
  const [currentCity, setCurrentCity] = useState<string | null>(null);
  const [showLGPDModal, setShowLGPDModal] = useState(false);
  const [lgpdAccepted, setLgpdAccepted] = useState(false);
  const [pendingRegistrationPayload, setPendingRegistrationPayload] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);
  const [viewportTop, setViewportTop] = useState<number>(0);
  const pathname = usePathname();

  const updateViewport = useCallback(() => {
    if (window.visualViewport) {
      setViewportHeight(window.visualViewport.height);
      setViewportTop(window.visualViewport.offsetTop);
    }
  }, []);

  useEffect(() => {
    // Detect city from URL
    if (pathname.includes("belem")) setCurrentCity("belem");
    else if (pathname.includes("manaus")) setCurrentCity("manaus");

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", updateViewport);
      window.visualViewport.addEventListener("scroll", updateViewport);
      updateViewport();
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", updateViewport);
        window.visualViewport.removeEventListener("scroll", updateViewport);
      }
    };
  }, [updateViewport]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    const userMsg = input.trim();
    if (!userMsg || isLoading) return;

    const userMessage: Message = { role: "user", content: userMsg };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    let currentAttendant = attendantName;
    if (!currentAttendant) {
      const randomName = ATTENDANTS[Math.floor(Math.random() * ATTENDANTS.length)];
      currentAttendant = randomName;
      setAttendantName(randomName);
      await new Promise(r => setTimeout(r, 1000));
      setMessages(prev => [...prev, { role: "system", content: `${randomName} entrou no chat.` }]);
      await new Promise(r => setTimeout(r, 800));
    } else {
      await new Promise(r => setTimeout(r, 600));
    }

    setIsTyping(true);
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 800));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: messages.filter(m => m.role !== "system").concat(userMessage),
          attendantName: currentAttendant,
          currentCity
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
      if (data.registrationPayload) setPendingRegistrationPayload(data.registrationPayload);
    } catch (error: any) {
      console.error("Chat Error:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Erro de conexão. Verifique sua internet." }]);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const handleFinalizeRegistration = async () => {
    if (!pendingRegistrationPayload || !lgpdAccepted) return;
    setShowLGPDModal(false);
    setIsLoading(true);
    setIsTyping(true);

    try {
      const apiRes = await fetch("https://credenciamento-api-production.up.railway.app/visitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pendingRegistrationPayload),
      });

      if (apiRes.ok) {
        setMessages((prev) => [...prev, {
          role: "assistant",
          content: "✅ **Cadastro realizado com sucesso!** Seja bem-vindo(a) à Expo MultiMix 2026.",
        }]);
        setPendingRegistrationPayload(null);
      } else {
        const errorText = await apiRes.text();
        const chatRes = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            messages: messages.concat([{ role: "system", content: `PÁRE TUDO: O cadastro falhou com: "${errorText}". Explique ao usuário o que corrigir de forma amigável.` }]),
            attendantName,
            currentCity
          }),
        });
        const chatData = await chatRes.json();
        if (chatData.content) setMessages(prev => [...prev, { role: "assistant", content: chatData.content }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Erro de conexão ao finalizar cadastro." }]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const renderContent = (content: string) => {
    if (!content) return null;
    const parts = content.split(/(\[WHATSAPP:[^\]]+\]|\[CONFIRM_REGISTRATION:[^\]]+\])/g);
    return parts.map((part, i) => {
      const waMatch = part.match(/\[WHATSAPP:([^|]+)\|([^|]+)\|([^\]]+)\]/);
      if (waMatch) {
        const [_, label, phone, message] = waMatch;
        const url = `https://wa.me/55${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
        return (
          <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center justify-center gap-2 bg-[#25D366] text-white py-2.5 px-4 rounded-xl text-xs font-bold hover:brightness-110 active:scale-95 transition-all w-full">
            <MessageSquare size={14} fill="white" />{label}
          </a>
        );
      }
      const confirmMatch = part.match(/\[CONFIRM_REGISTRATION:([^\]]+)\]/);
      if (confirmMatch) {
        return (
          <button key={i} onClick={() => setShowLGPDModal(true)} className="mt-3 flex items-center justify-center gap-2 bg-brand-cyan text-brand-blue py-2.5 px-4 rounded-xl text-xs font-bold hover:brightness-110 active:scale-95 transition-all w-full shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            <Bot size={14} />{confirmMatch[1]}
          </button>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div 
      className={cn(
        "bg-brand-blue flex flex-col overflow-hidden",
        isFullPage 
          ? (typeof window !== "undefined" && window.innerWidth < 1024 
              ? "absolute inset-x-0 z-100 w-screen" // Absolute on mobile to handle Safari offset
              : "fixed inset-0 z-100 w-screen h-screen")
          : "w-full h-full"
      )}
      style={{
        height: viewportHeight && window.innerWidth < 1024 ? `${viewportHeight}px` : undefined,
        top: viewportTop && window.innerWidth < 1024 ? `${viewportTop}px` : (isFullPage ? 0 : undefined),
      }}
    >
      <AnimatePresence>
        {showLGPDModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-brand-blue border border-white/10 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-cyan/20 flex items-center justify-center text-brand-cyan"><Bot size={24} /></div>
                <h3 className="text-xl font-bold text-white">Finalizar Credenciamento</h3>
              </div>
              {pendingRegistrationPayload && (
                <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/5 grid grid-cols-2 gap-y-2 text-[11px]">
                  <div className="col-span-2 text-[9px] uppercase tracking-widest text-brand-cyan font-bold mb-1">Revisão</div>
                  <div><p className="text-gray-500 font-bold">Nome</p><p className="text-white truncate">{pendingRegistrationPayload.name}</p></div>
                  <div><p className="text-gray-500 font-bold">Empresa</p><p className="text-white truncate">{pendingRegistrationPayload.company}</p></div>
                  <div><p className="text-gray-500 font-bold">CNPJ</p><p className="text-white">{pendingRegistrationPayload.cnpj}</p></div>
                  <div><p className="text-gray-500 font-bold">WhatsApp</p><p className="text-white">{pendingRegistrationPayload.phone}</p></div>
                </div>
              )}
              <div className="space-y-4 text-sm text-gray-300 mb-6">
                <p>Autoriza o processamento dos seus dados conforme a LGPD?</p>
                <label className="flex items-start gap-3 p-3 bg-brand-cyan/5 border border-brand-cyan/20 rounded-xl cursor-pointer">
                  <input type="checkbox" checked={lgpdAccepted} onChange={(e) => setLgpdAccepted(e.target.checked)} className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-brand-cyan" />
                  <span className="text-xs text-gray-200">Concordo com os Termos e Privacidade.</span>
                </label>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowLGPDModal(false)} className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5">Cancelar</button>
                <button disabled={!lgpdAccepted || isLoading} onClick={handleFinalizeRegistration} className="flex-1 py-3 px-4 rounded-xl text-sm font-bold bg-brand-cyan text-brand-blue disabled:opacity-50 shadow-lg">{isLoading ? "Processando..." : "Confirmar"}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="p-4 bg-brand-blue/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors" aria-label="Voltar">
            <ArrowLeft size={24} />
          </button>
          <div className="w-8 h-8 rounded-full bg-brand-cyan/20 flex items-center justify-center text-brand-cyan"><User size={20} /></div>
          <div>
            <h3 className="text-sm font-bold text-white truncate max-w-[150px] sm:max-w-none">{attendantName || "Atendimento"}</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <p className="text-[10px] text-brand-cyan uppercase font-bold tracking-wider">Online</p>
            </div>
          </div>
        </div>
        {!isFullPage && (
          <button onClick={onClose} className="hidden lg:block text-gray-400 hover:text-white p-1" aria-label="Fechar"><X size={20} /></button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth min-h-0 bg-brand-blue/20">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50">
            <MessageSquare size={48} className="text-brand-cyan/20 mb-4" />
            <p className="text-sm text-white font-bold">Como podemos ajudar?</p>
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={cn("flex w-full", msg.role === "system" ? "justify-center py-2" : msg.role === "user" ? "justify-end" : "justify-start")}>
            <div className={cn("max-w-[85%] text-sm leading-relaxed", msg.role === "system" ? "text-[10px] text-gray-500 uppercase tracking-widest font-bold" : "p-3 rounded-2xl shadow-sm", msg.role === "user" ? "bg-brand-cyan text-brand-blue font-medium rounded-tr-none" : "bg-white/5 text-gray-200 border border-white/5 rounded-tl-none")}>
              {msg.role === "system" ? msg.content : renderContent(msg.content)}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-none flex gap-1">
              {[0, 0.2, 0.4].map((delay, i) => (
                <motion.div key={i} animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay }} className="w-1.5 h-1.5 rounded-full bg-brand-cyan/50" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-brand-blue/50 border-t border-white/10 shrink-0" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
        <div className="relative flex items-center gap-2 max-w-4xl mx-auto w-full">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Escreva sua mensagem..."
            style={{ fontSize: "16px" }}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-white placeholder:text-gray-500 focus:outline-hidden focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/20 transition-all shadow-inner"
          />
          <button onClick={handleSend} disabled={!input.trim() || isLoading} className="absolute right-2 w-8 h-8 rounded-full bg-brand-cyan text-brand-blue flex items-center justify-center disabled:opacity-50 hover:scale-110 active:scale-95 transition-all shadow-lg">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
