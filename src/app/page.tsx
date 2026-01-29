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
import DevGeoControls from "@/components/DevGeoControls";
import { useGeoLocation } from "@/hooks/useGeoLocation";
import { useRouter } from "next/navigation";
import CrossCityWarningModalContent from "@/components/CrossCityWarningModalContent";

export default function Home() {
  const [activeModal, setActiveModal] = useState<"none" | "lead" | "visit" | "whatsapp" | "bypass" | "crossCity">("none");
  const [pendingTargetCity, setPendingTargetCity] = useState<string | null>(null);
  const { city: detectedCity, loading } = useGeoLocation();
  const router = useRouter();

  const openVisitModal = () => {
    if (detectedCity) {
      router.push(`/${detectedCity}`);
    } else {
      setActiveModal("visit");
    }
  };
  const openLeadModal = () => setActiveModal("lead");
  const openWhatsAppModal = () => setActiveModal("whatsapp");
  const openBypassModal = () => setActiveModal("bypass");
  const closeModal = () => setActiveModal("none");

  const handleEventClick = (slug: string) => {
    // If we have a detected city and the user is trying to go to a different city
    if (detectedCity && slug !== detectedCity) {
      setPendingTargetCity(slug);
      setActiveModal("crossCity");
    } else {
      // Otherwise, just go there
      router.push(`/${slug}`);
    }
  };

  const handleCrossCityProceed = () => {
    if (pendingTargetCity) {
      router.push(`/${pendingTargetCity}`);
    }
    setActiveModal("none");
  };

  const handleCrossCityRedirect = () => {
    if (detectedCity) {
      router.push(`/${detectedCity}`);
    }
    setActiveModal("none");
  };

  const handleExposeClick = () => {
    router.push("/quero-expor?target=stands");
  };

  return (
    <main className="min-h-screen bg-brand-blue selection:bg-brand-cyan/30 selection:text-white">
      <Navbar 
        onVisitClick={openVisitModal} 
        onExposeClick={openLeadModal} 
        onContactClick={openWhatsAppModal}
        visitButtonColor={detectedCity === "manaus" ? "pink" : detectedCity === "belem" ? "cyan" : undefined}
      />
      
      {/* Hero Section */}
      <Hero 
        onVisitClick={openVisitModal} 
        onExposeClick={openLeadModal} 
        detectedCity={detectedCity}
      />

      {/* About the Event & Visitor Info (Moved Up) */}
      <AboutSection onVisitClick={openVisitModal} />

      {/* Primary Event Info (Events) */}
      <InfoSection 
        detectedCity={detectedCity} 
        onEventClick={handleEventClick}
      />

      {/* Recurring CTA for Stand Sales */}
      <CTASection 
        title="O SUCESSO DO SEU NEGÓCIO"
        subtitle="Seja um expositor e apresente suas novidades para milhares de lojistas da região Norte."
        variant="orange"
        onClick={openLeadModal}
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
          onSelectExpositor={handleExposeClick}
        />
      </Modal>

      <Modal 
        isOpen={activeModal === "visit"} 
        onClose={closeModal} 
        title={detectedCity ? `QUERO VISITAR (${detectedCity.toUpperCase()})` : "QUERO VISITAR"}
      >
        <VisitModalContent detectedCity={detectedCity} />
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

      <Modal 
        isOpen={activeModal === "crossCity"} 
        onClose={closeModal} 
        title="CONFIRMAR LOCALIZAÇÃO"
      >
        {detectedCity && pendingTargetCity && (
          <CrossCityWarningModalContent
            userCity={detectedCity}
            targetCity={pendingTargetCity}
            onProceed={handleCrossCityProceed}
            onRedirect={handleCrossCityRedirect}
          />
        )}
      </Modal>

      <DevGeoControls />
    </main>
  );
}
