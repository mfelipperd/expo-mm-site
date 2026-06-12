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
import DevGeoControls from "@/components/DevGeoControls";
import CrossCityWarningModalContent from "@/components/CrossCityWarningModalContent";
import ExhibitorsSection from "@/components/ExhibitorsSection";
import LogosCarousel from "@/components/LogosCarousel";
import FairHistoryTimeline from "@/components/FairHistoryTimeline";
import WhoAreYouSheet from "@/components/WhoAreYouSheet";
import { useFairRouting } from "@/hooks/useFairRouting";
import { useRouter } from "next/navigation";

export default function HomeContent() {
  const [activeModal, setActiveModal] = useState<"none" | "lead" | "visit" | "whatsapp" | "bypass" | "crossCity">("none");
  const [pendingTargetCity, setPendingTargetCity] = useState<string | null>(null);
  const [sheetDismissed, setSheetDismissed] = useState(false);
  const router = useRouter();

  const {
    mode,
    showTypePrompt,
    setUserType,
    activeFairs,
    detectedCity,
  } = useFairRouting();

  const isExhibitorMode = mode === "exhibitor";

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

  // Exhibitor mode: skip the choice modal, go straight to Quero Expor
  const handleExposeClick = () => router.push("/quero-expor?target=stands");

  const primaryExposeAction = isExhibitorMode ? handleExposeClick : openLeadModal;

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
        onExposeClick={primaryExposeAction}
        detectedCity={detectedCity}
        mode={mode}
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
        title={isExhibitorMode ? "OCUPE SEU STAND" : "O SUCESSO DO SEU NEGÓCIO"}
        subtitle={
          isExhibitorMode
            ? "Stands com tamanhos e preços para cada perfil de expositor. Reserve antes que acabem."
            : "Seja um expositor e apresente suas novidades para milhares de lojistas da região Norte."
        }
        variant="orange"
        onClick={primaryExposeAction}
        buttonText={isExhibitorMode ? "VER OPÇÕES DE STAND" : undefined}
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

      {/* "Who are you?" prompt — appears 2s after load when geo unavailable */}
      <WhoAreYouSheet
        show={showTypePrompt && !sheetDismissed}
        onSelect={(type) => {
          setUserType(type);
          setSheetDismissed(true);
        }}
        onDismiss={() => setSheetDismissed(true)}
      />

      <DevGeoControls />
    </main>
  );
}
