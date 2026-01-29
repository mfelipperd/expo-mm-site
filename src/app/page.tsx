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
import AboutSection from "@/components/AboutSection";

import WhatsAppFloating from "@/components/WhatsAppFloating";
import { Sparkles, Handshake, BadgeDollarSign } from "lucide-react";

export default function Home() {
  const [activeModal, setActiveModal] = useState<"none" | "lead" | "visit" | "whatsapp" | "bypass">("none");

  const openVisitModal = () => setActiveModal("visit");
  const openLeadModal = () => setActiveModal("lead");
  const openWhatsAppModal = () => setActiveModal("whatsapp");
  const openBypassModal = () => setActiveModal("bypass");
  const closeModal = () => setActiveModal("none");

  return (
    <main className="min-h-screen bg-brand-blue selection:bg-brand-cyan/30 selection:text-white">
      <Navbar 
        onVisitClick={openVisitModal} 
        onExposeClick={openBypassModal} 
        onContactClick={openWhatsAppModal}
      />
      
      {/* Hero Section */}
      <Hero onVisitClick={openVisitModal} onExposeClick={openBypassModal} />

      {/* About the Event & Visitor Info (Moved Up) */}
      <AboutSection onVisitClick={openVisitModal} />

      {/* Primary Event Info (Events) */}
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
