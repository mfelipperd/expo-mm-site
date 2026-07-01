"use client";

import { useState } from "react";
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
import CrossCityWarningModalContent from "@/components/CrossCityWarningModalContent";
import ExhibitorsSection from "@/components/ExhibitorsSection";
import LogosCarousel from "@/components/LogosCarousel";
import FairHistoryTimeline from "@/components/FairHistoryTimeline";
import RegionSelectorSheet from "@/components/RegionSelectorSheet";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { useFairRouting } from "@/hooks/useFairRouting";
import { useRouter } from "next/navigation";

export default function HomeContent() {
  const [activeModal, setActiveModal] = useState<"none" | "lead" | "visit" | "whatsapp" | "bypass" | "crossCity">("none");
  const [pendingTargetCity, setPendingTargetCity] = useState<string | null>(null);
  const router = useRouter();

  const {
    activeFairs,
    detectedCity,
    hasChosenCity,
    setCity,
  } = useFairRouting();

  const openVisitModal = () => {
    if (detectedCity) {
      router.push(`/${detectedCity}`);
    } else {
      setActiveModal("visit");
    }
  };
  const openLeadModal = () => setActiveModal("lead");
  const openWhatsAppModal = () => setActiveModal("whatsapp");
  const closeModal = () => setActiveModal("none");

  const handleExposeClick = () => router.push("/quero-expor?target=stands");

  const primaryExposeAction = openLeadModal;

  const handleEventClick = (slug: string) => {
    if (detectedCity && slug !== detectedCity) {
      setPendingTargetCity(slug);
      setActiveModal("crossCity");
    } else {
      router.push(`/${slug}`);
    }
  };

  const handleCrossCityProceed = () => {
    if (pendingTargetCity) router.push(`/${pendingTargetCity}`);
    setActiveModal("none");
  };

  const handleCrossCityRedirect = () => {
    if (detectedCity) router.push(`/${detectedCity}`);
    setActiveModal("none");
  };

  return (
    <main className="min-h-screen bg-brand-blue selection:bg-brand-cyan/30 selection:text-white">
      <Navbar
        onVisitClick={openVisitModal}
        onExposeClick={primaryExposeAction}
        onContactClick={openWhatsAppModal}
        visitButtonColor={detectedCity === "manaus" ? "pink" : detectedCity === "belem" ? "cyan" : undefined}
      />

      <Hero
        onVisitClick={openVisitModal}
        detectedCity={detectedCity}
        activeFairs={activeFairs}
      />

      <LogosCarousel
        title="QUEM ESTARÁ NA FEIRA"
        subtitle="Expositores confirmados"
        direction="left"
      />

      <AboutSection onVisitClick={openVisitModal} />

      <InfoSection
        detectedCity={detectedCity}
        onEventClick={handleEventClick}
      />

      <CTASection
        title="O SUCESSO DO SEU NEGÓCIO"
        subtitle="Seja um expositor e apresente suas novidades para milhares de lojistas da região Norte."
        variant="orange"
        onClick={primaryExposeAction}
      />

      <Features />

      <LogosCarousel
        title="INDÚSTRIAS E IMPORTADORAS"
        subtitle="Veja quem estará expondo"
        direction="right"
      />

      <CTASection
        title="NÃO FIQUE DE FORA"
        subtitle="A feira é exclusiva para lojistas (B2B) e requer CNPJ para entrada."
        buttonText="FAZER MEU CREDENCIAMENTO"
        variant="pink"
        onClick={openVisitModal}
      />

      <ExhibitorsSection />

      <FairHistoryTimeline />

      <Footer onWhatsAppClick={openWhatsAppModal} />

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

      {/* Region prompt — appears 2s after load until the visitor picks a city */}
      <RegionSelectorSheet
        show={!hasChosenCity}
        onSelect={setCity}
      />

      {/* Mobile sticky bar — always-visible registration shortcut */}
      <StickyMobileCTA
        onLeftClick={openVisitModal}
        onRightClick={primaryExposeAction}
      />
    </main>
  );
}
