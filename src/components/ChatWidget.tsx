"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Bot, User, Loader2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ATTENDANTS = ["Ana Paula", "Gabriel", "Mariana", "Ricardo", "Beatriz"];

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
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

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener("open-chat", handleOpenChat);

    // Detect city from URL
    const path = window.location.pathname;
    if (path.includes("belem")) setCurrentCity("belem");
    else if (path.includes("manaus")) setCurrentCity("manaus");

    return () => window.removeEventListener("open-chat", handleOpenChat);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    
    let currentAttendant = attendantName;
    const newMessages: Message[] = [];

    // First message logic: pick an attendant
    if (!currentAttendant) {
      const randomName = ATTENDANTS[Math.floor(Math.random() * ATTENDANTS.length)];
      currentAttendant = randomName;
      setAttendantName(randomName);
      
      // Delay slightly for the "entered the chat" message
      await new Promise(r => setTimeout(r, 600));
      setMessages([{ role: "system", content: `${randomName} entrou no chat.` }]);
      await new Promise(r => setTimeout(r, 400));
    }

    const userMessage: Message = { role: "user", content: userMsg };
    setMessages((prev) => [...prev, userMessage]);
    
    setIsTyping(true);
    setIsLoading(true);

    // Artificial delay to simulate human typing
    await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: messages
            .filter(m => m.role !== "system")
            .concat(userMessage),
          attendantName: currentAttendant,
          currentCity
        }),
      });

      const data = await response.json();
      
      if (data.error) throw new Error(data.error);

      // Handle server-side generated response
      const assistantMessage: Message = {
        role: "assistant",
        content: data.content,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Check if registration was triggered
      if (data.registrationPayload) {
        setPendingRegistrationPayload(data.registrationPayload);
      }
    } catch (error: any) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Erro de conexão. Verifique sua internet." },
      ]);
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
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "✅ **Cadastro realizado com sucesso!** Seja bem-vindo(a) à Expo MultiMix 2026. Seu credenciamento foi processado com sucesso.",
          },
        ]);
        setPendingRegistrationPayload(null);
      } else {
        const errorText = await apiRes.text();
        console.error("API Error:", errorText);
        
        // Do NOT add raw errors to local state (don't show to user)
        // Just trigger AI response to explain the error friendly
        setIsLoading(true);
        setIsTyping(true);
        try {
          const chatRes = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              messages: messages.concat([
                { role: "system", content: `PÁRE TUDO: O cadastro do usuário falhou na API com o seguinte erro: "${errorText}". NÃO EXIBA ESSE JSON em hipótese alguma. Apenas explique ao usuário de forma amigável e humana (como ${attendantName || "atendente"}) o que ele precisa corrigir no chat (ex: o estado precisa ser sigla de 2 letras, ou o CNPJ está inválido) e peça para ele enviar o dado correto.` }
              ]),
              attendantName,
              currentCity
            }),
          });
          const chatData = await chatRes.json();
          if (chatData.content) {
            setMessages(prev => [...prev, { role: "assistant", content: chatData.content }]);
          }
        } catch (chatErr) {
          console.error("Error triggering AI feedback:", chatErr);
          setMessages(prev => [...prev, { role: "assistant", content: "Puxa, tive um probleminha técnico aqui. Poderia confirmar seus dados e tentar de novo?" }]);
        }
      }
    } catch (err) {
      console.error("Registration error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Erro de conexão ao finalizar cadastro. Tente novamente em instantes.",
        },
      ]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const renderContent = (content: string) => {
    if (!content) return null;
    // Split for both WhatsApp and Confirm Registration buttons
    const parts = content.split(/(\[WHATSAPP:[^\]]+\]|\[CONFIRM_REGISTRATION:[^\]]+\])/g);
    
    return parts.map((part, i) => {
      // Handle WhatsApp
      const waMatch = part.match(/\[WHATSAPP:([^|]+)\|([^|]+)\|([^\]]+)\]/);
      if (waMatch) {
        const [_, label, phone, message] = waMatch;
        const cleanPhone = phone.replace(/\D/g, "");
        const url = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`;
        
        return (
          <a
            key={i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 bg-[#25D366] text-white py-2.5 px-4 rounded-xl text-xs font-bold hover:brightness-110 active:scale-95 transition-all w-full"
          >
            <MessageSquare size={14} fill="white" />
            {label}
          </a>
        );
      }

      // Handle Confirm Registration
      const confirmMatch = part.match(/\[CONFIRM_REGISTRATION:([^\]]+)\]/);
      if (confirmMatch) {
        const [_, label] = confirmMatch;
        return (
          <button
            key={i}
            onClick={() => setShowLGPDModal(true)}
            className="mt-3 flex items-center justify-center gap-2 bg-brand-cyan text-brand-blue py-2.5 px-4 rounded-xl text-xs font-bold hover:brightness-110 active:scale-95 transition-all w-full shadow-[0_0_15px_rgba(34,211,238,0.3)]"
          >
            <Bot size={14} />
            {label}
          </button>
        );
      }

      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="fixed bottom-28 right-8 z-90 flex flex-col items-end">
      {/* LGPD Modal Overlay */}
      <AnimatePresence>
        {showLGPDModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-brand-blue border border-white/10 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-brand-cyan/20 flex items-center justify-center text-brand-cyan">
                    <Bot size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Finalizar Credenciamento</h3>
                </div>
                
                {/* Data Review Section */}
                {pendingRegistrationPayload && (
                  <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
                    <h4 className="text-[10px] uppercase tracking-widest text-brand-cyan font-bold mb-2">Revisão dos Dados</h4>
                    <div className="grid grid-cols-2 gap-y-2 text-[11px]">
                      <div>
                        <p className="text-gray-500 uppercase font-bold text-[9px]">Nome</p>
                        <p className="text-white truncate">{pendingRegistrationPayload.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 uppercase font-bold text-[9px]">Empresa</p>
                        <p className="text-white truncate">{pendingRegistrationPayload.company}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 uppercase font-bold text-[9px]">CNPJ</p>
                        <p className="text-white">{pendingRegistrationPayload.cnpj}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 uppercase font-bold text-[9px]">WhatsApp</p>
                        <p className="text-white">{pendingRegistrationPayload.phone}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-500 uppercase font-bold text-[9px]">Email</p>
                        <p className="text-white truncate">{pendingRegistrationPayload.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4 text-sm text-gray-300 leading-relaxed mb-6">
                  <p>
                    Para concluir seu cadastro na <strong>Expo MultiMix 2026</strong>, precisamos da sua autorização para processar seus dados conforme a Lei Geral de Proteção de Dados (LGPD).
                  </p>
                  <p className="text-[11px] bg-white/5 p-3 rounded-lg border border-white/5">
                    Seus dados serão utilizados exclusivamente para a emissão do seu ingresso e comunicações oficiais do evento. Não compartilhamos suas informações com terceiros sem seu consentimento.
                  </p>
                  
                  <label className="flex items-start gap-3 p-3 bg-brand-cyan/5 border border-brand-cyan/20 rounded-xl cursor-pointer group hover:bg-brand-cyan/10 transition-all">
                    <input
                      type="checkbox"
                      checked={lgpdAccepted}
                      onChange={(e) => setLgpdAccepted(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-brand-cyan focus:ring-brand-cyan/20 cursor-pointer"
                    />
                    <span className="text-xs text-gray-200 group-hover:text-white transition-colors">
                      Li e concordo com os <strong>Termos de Uso</strong> e a <strong>Política de Privacidade</strong> da Expo MultiMix.
                    </span>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLGPDModal(false)}
                    className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    disabled={!lgpdAccepted || isLoading}
                    onClick={handleFinalizeRegistration}
                    className="flex-1 py-3 px-4 rounded-xl text-sm font-bold bg-brand-cyan text-brand-blue disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 active:scale-95 transition-all shadow-lg"
                  >
                    {isLoading ? "Processando..." : "Confirmar e Enviar"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-brand-blue border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-brand-blue/50 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-cyan/20 flex items-center justify-center text-brand-cyan">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {attendantName ? `Atendimento: ${attendantName}` : "Atendimento Online"}
                  </h3>
                  <p className="text-[10px] text-brand-cyan uppercase tracking-wider font-bold">Responde em instantes</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Fechar chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
            >
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                   <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-brand-cyan/50">
                     <MessageSquare size={32} />
                   </div>
                   <h4 className="text-white font-bold mb-2">Como podemos ajudar?</h4>
                   <p className="text-xs text-gray-400">Envie uma mensagem para iniciar o atendimento.</p>
                </div>
              )}
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex w-full",
                    msg.role === "system" ? "justify-center py-2" :
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] text-sm leading-relaxed",
                      msg.role === "system" 
                        ? "text-[10px] text-gray-500 uppercase tracking-widest font-bold" 
                        : "p-3 rounded-2xl shadow-sm",
                      msg.role === "user"
                        ? "bg-brand-cyan text-brand-blue font-medium rounded-tr-none"
                        : msg.role === "assistant"
                        ? "bg-white/5 text-gray-200 border border-white/5 rounded-tl-none"
                        : ""
                    )}
                  >
                    {msg.role === "system" ? msg.content : renderContent(msg.content)}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-none flex gap-1 items-center">
                    <motion.div 
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      className="w-1.5 h-1.5 rounded-full bg-brand-cyan/50" 
                    />
                    <motion.div 
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      className="w-1.5 h-1.5 rounded-full bg-brand-cyan/50" 
                    />
                    <motion.div 
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      className="w-1.5 h-1.5 rounded-full bg-brand-cyan/50" 
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-brand-blue/50 border-t border-white/10">
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Escreva sua mensagem..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-sm text-white placeholder:text-gray-500 focus:outline-hidden focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/20 transition-all shadow-inner"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 w-8 h-8 rounded-full bg-brand-cyan text-brand-blue flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 active:scale-95 transition-all shadow-lg"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300",
          isOpen 
            ? "bg-white/10 text-white backdrop-blur-md" 
            : "bg-brand-blue border-2 border-brand-cyan text-brand-cyan"
        )}
        aria-label="Falar conosco"
      >
        {isOpen ? <X size={32} /> : <MessageSquare size={32} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-pink opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-pink"></span>
          </span>
        )}
      </motion.button>
    </div>
  );
}
