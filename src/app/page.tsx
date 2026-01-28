"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import InfoSection from "@/components/InfoSection";
import Features from "@/components/Features";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import Modal from "@/components/Modal";
import LeadModalContent from "@/components/LeadModal";
import VisitModalContent from "@/components/VisitModal";
import WhatsAppModalContent from "@/components/WhatsAppModal";
import ExhibitorBypassModalContent from "@/components/ExhibitorBypassModal";

import WhatsAppFloating from "@/components/WhatsAppFloating";
import { Sparkles, Handshake, BadgeDollarSign } from "lucide-react";

export default function Home() {
  const [activeModal, setActiveModal] = useState<"none" | "lead" | "visit" | "whatsapp" | "bypass">("none");

  const openVisitModal = () => setActiveModal("visit");
  const openLeadModal = () => setActiveModal("lead");
  const openWhatsAppModal = () => setActiveModal("whatsapp");
  const openBypassModal = () => setActiveModal("bypass");
  const closeModal = () => setActiveModal("none");

  const sobreRef = useRef(null);
  const { scrollYProgress: sobreScroll } = useScroll({
    target: sobreRef,
    offset: ["start end", "end start"],
  });

  const sobreY = useTransform(sobreScroll, [0, 1], ["-10%", "10%"]);

  return (
    <main className="min-h-screen bg-brand-blue selection:bg-brand-cyan/30 selection:text-white">
      <Navbar 
        onVisitClick={openVisitModal} 
        onExposeClick={openBypassModal} 
        onContactClick={openWhatsAppModal}
      />
      
      {/* Hero Section */}
      <Hero onVisitClick={openVisitModal} onExposeClick={openBypassModal} />

      {/* Primary Event Info */}
      <InfoSection />

      {/* Recurring CTA for Stand Sales */}
      <CTASection 
        title="O SUCESSO DO SEU NEGÓCIO"
        subtitle="Seja um expositor e apresente suas novidades para milhares de lojistas da região Norte."
        variant="cyan"
        onClick={openBypassModal}
      />

      {/* Categories and Benefits */}
      <Features />

      {/* About the Event & Visitor Info */}
      <section ref={sobreRef} id="sobre" className="py-24 bg-brand-blue relative overflow-hidden">
        {/* Decorative elements */}
        <motion.div 
          style={{ y: sobreY }}
          className="absolute top-0 right-0 w-96 h-96 bg-brand-pink/5 rounded-full blur-[100px]" 
        />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-6 md:mb-8 leading-tight">
              COMO FUNCIONA PARA <br className="md:hidden" /> <span className="text-brand-cyan">LOJISTAS</span>
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              A Expo MultiMix é o ponto de encontro estratégico para quem busca renovar estoques com qualidade e prazos imbatíveis.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: "Teste em Primeira Mão",
                desc: "Veja, toque e teste os lançamentos das maiores indústrias nacionais antes de todo o mercado.",
                icon: <Sparkles className="text-brand-pink" size={32} />,
                color: "border-brand-pink"
              },
              {
                title: "Negociação Direta",
                desc: "Fale diretamente com gerentes e diretores das fábricas. Sem intermediários, melhores condições.",
                icon: <Handshake className="text-brand-cyan" size={32} />,
                color: "border-brand-cyan"
              },
              {
                title: "Descontos Exclusivos",
                desc: "Aproveite condições de pagamento e descontos que só acontecem dentro do pavilhão da feira.",
                icon: <BadgeDollarSign className="text-brand-orange" size={32} />,
                color: "border-brand-orange"
              }
            ].map((item, i) => (
              <div key={i} className={`p-8 rounded-[2rem] glass border-t-4 ${item.color} hover:bg-white/5 transition-all`}>
                <div className="mb-4">{item.icon}</div>
                <h4 className="text-xl font-bold mb-3 text-white">{item.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="glass-dark p-8 md:p-12 rounded-[3rem] border border-white/10 text-center">
            <h3 className="text-2xl font-bold mb-6">Exclusividade B2B</h3>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              A feira é **exclusiva para lojistas e empreendedores**. Para garantir o ambiente de negócios, a entrada é permitida apenas mediante comprovação de CNPJ do setor.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm font-bold text-gray-500 uppercase tracking-widest mb-10">
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-brand-cyan" /> Entrada Gratuita</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-brand-pink" /> Credenciamento Online</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-brand-orange" /> Networking Regional</span>
            </div>
            
            <button
              onClick={openVisitModal}
              className="bg-brand-cyan text-white px-10 py-5 rounded-full font-black text-lg shadow-2xl hover:scale-105 transition-transform"
            >
              FAZER MEU CREDENCIAMENTO AGORA
            </button>
          </div>
        </div>
      </section>

      {/* Secondary CTA for Registration/Visit */}
      <CTASection 
        title="NÃO FIQUE DE FORA"
        subtitle="A feira é exclusiva para lojistas (B2B) e requer CNPJ para entrada."
        buttonText="FAZER MEU CREDENCIAMENTO"
        variant="pink"
        onClick={openVisitModal}
      />

      <Footer onWhatsAppClick={openWhatsAppModal} />
      
      {/* Floating WhatsApp */}
      <WhatsAppFloating onClick={openWhatsAppModal} />

      {/* Modals */}
      <Modal 
        isOpen={activeModal === "lead"} 
        onClose={closeModal} 
        title="COMO DESEJA PARTICIPAR?"
      >
        <LeadModalContent 
          onSelectLojista={openVisitModal}
          onSelectExpositor={openBypassModal}
        />
      </Modal>

      <Modal 
        isOpen={activeModal === "visit"} 
        onClose={closeModal} 
        title="QUERO VISITAR"
      >
        <VisitModalContent />
      </Modal>

      <Modal 
        isOpen={activeModal === "bypass"} 
        onClose={closeModal} 
        title="QUALIFICAÇÃO DE EXPOSITOR"
      >
        <ExhibitorBypassModalContent 
          onConfirmExpositor={openWhatsAppModal}
          onSelectLojista={openVisitModal}
        />
      </Modal>

      <Modal 
        isOpen={activeModal === "whatsapp"} 
        onClose={closeModal} 
        title="FALE COM UM CONSULTOR"
      >
        <WhatsAppModalContent />
      </Modal>
    </main>
  );
}
