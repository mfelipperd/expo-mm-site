"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, CheckCircle2, Star, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Modal from "@/components/Modal";
import LeadModalContent from "@/components/LeadModal";
import VisitModalContent from "@/components/VisitModal";
import WhatsAppModalContent from "@/components/WhatsAppModal";
import ExhibitorBypassModalContent from "@/components/ExhibitorBypassModal";
import RegistrationFormModal from "@/components/RegistrationFormModal";
import WhatsAppFloating from "@/components/WhatsAppFloating";
import CTASection from "@/components/CTASection";
import ExhibitorsSection from "@/components/ExhibitorsSection";

interface Benefit {
  title: string;
  desc: string;
  icon?: React.ReactNode;
}

interface CityTemplateProps {
  cityName: string;
  fairId: string;
  heroTitle: React.ReactNode;
  heroTagline: string;
  heroImage?: string; // New optional prop
  aboutText: string;
  benefits: Benefit[];
  dates: string;
  location: string;
  locationDescription: string;
  mapEmbedUrl: string;
  industries: string[];
  schedule: string;
}

export default function CityTemplate({
  cityName,
  fairId,
  heroTitle,
  heroTagline,
  heroImage, // Destructure
  aboutText,
  benefits,
  dates,
  location,
  locationDescription,
  mapEmbedUrl,
  industries,
  schedule,
}: CityTemplateProps) {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<"none" | "lead" | "visit" | "whatsapp" | "bypass" | "registration">("none");

  const openVisitModal = () => setActiveModal("visit");
  const openLeadModal = () => setActiveModal("lead");
  const openWhatsAppModal = () => setActiveModal("whatsapp");
  const openBypassModal = () => setActiveModal("bypass");
  const openRegistrationModal = () => setActiveModal("registration");
  const closeModal = () => setActiveModal("none");

  const handleExposeClick = () => {
    router.push("/quero-expor?target=stands");
  };

  const handleNavbarVisit = () => {
    const section = document.getElementById("registration-cta");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    } else {
      setActiveModal("registration");
    }
  };

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  
  const colorVariant = cityName.toLowerCase().includes("manaus") ? "pink" : "cyan";
  const buttonColorClass = colorVariant === "pink" ? "bg-brand-pink hover:bg-brand-pink/90 shadow-[0_0_20px_rgba(233,30,99,0.3)]" : "bg-brand-cyan hover:bg-brand-cyan/90 text-brand-blue shadow-[0_0_20px_rgba(34,211,238,0.3)]";

  return (
    <main className="min-h-screen bg-brand-blue selection:bg-brand-cyan/30 selection:text-white">
      <Navbar 
        onVisitClick={handleNavbarVisit} 
        onExposeClick={openLeadModal} 
        onContactClick={openWhatsAppModal}
        visitButtonColor={colorVariant as "cyan" | "pink"}
      />

      {/* Hero Section */}
      <section ref={ref} className="relative h-[85vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden pt-24">
        <motion.div style={{ y }} className="absolute inset-0 z-0">
          <Image
            src={heroImage || "/assets/hero-bg.jpg"} // Use prop or default
            alt={`Expo MultiMix ${cityName}`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-brand-blue/80 via-brand-blue/60 to-brand-blue" />
        </motion.div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-brand-cyan font-bold tracking-widest mb-4 flex items-center justify-center gap-4"
          >
            <span className="h-px w-8 bg-brand-cyan block"></span>
            {cityName} 2025
            <span className="h-px w-8 bg-brand-cyan block"></span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-tight"
          >
            {heroTitle}
          </motion.div>

          {/* Hero Tagline - Optional short text */}
          <motion.p
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 1, delay: 0.5 }}
             className="text-xl md:text-2xl text-white font-medium mb-8 md:mb-12 max-w-3xl mx-auto"
          >
            {heroTagline}
          </motion.p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
             <button 
              onClick={openRegistrationModal}
              className={`${buttonColorClass} px-8 py-4 rounded-full font-bold transition-all hover:scale-105`}
            >
              FAZER CREDENCIAMENTO
            </button>
          </div>


        </div>
      </section>

      {/* About Section - Focused text */}
      <section className="py-24 relative z-10 bg-brand-blue border-b border-white/5">
         <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-8">
               A <span className="text-brand-orange">OPORTUNIDADE</span> {cityName}
            </h2>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed text-balance">
               {aboutText}
            </p>
         </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 relative z-10 bg-brand-blue/50">
         <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-6">
                {benefits.map((benefit, i) => (
                   <div key={i} className="glass p-8 rounded-2xl border border-white/5 hover:border-brand-cyan/30 transition-colors">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 text-brand-cyan">
                         {benefit.icon || <Star size={24} />}
                      </div>
                      <h4 className="text-xl font-bold mb-3">{benefit.title}</h4>
                      <p className="text-gray-400">{benefit.desc}</p>
                   </div>
                ))}
            </div>
         </div>
      </section>

      {/* Info Grid */}
      <section className="py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
             <div className="glass p-8 rounded-3xl border-l-4 border-brand-cyan">
                <div className="flex items-center gap-4 mb-4">
                  <Calendar className="text-brand-cyan" size={32} />
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase">Quando</p>
                    <h3 className="text-2xl font-black text-white">{dates}</h3>
                    <p className="text-white/80">{schedule}</p>
                  </div>
                </div>
             </div>

             <div className="glass p-8 rounded-3xl border-l-4 border-brand-orange overflow-hidden">
                <div className="flex items-center gap-4 mb-4">
                  <MapPin className="text-brand-orange" size={32} />
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase">Onde</p>
                    <h3 className="text-2xl font-black text-white">{location}</h3>
                  </div>
                </div>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  {locationDescription}
                </p>
                
                {/* Embedded Map */}
                <div className="w-full h-[300px] rounded-xl overflow-hidden border border-white/10 bg-white/5 relative">
                   <iframe 
                      src={mapEmbedUrl}
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-500"
                    />
                </div>
             </div>
          </div>

          <div>
             <h3 className="text-3xl font-black mb-8">
               INDÚSTRIAS E <span className="text-brand-cyan">IMPORTADORAS</span>
             </h3>
             <div className="grid grid-cols-1 gap-4">
               {industries.map((item, i) => (
                 <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                   <div className="w-10 h-10 rounded-full bg-brand-cyan/20 flex items-center justify-center text-brand-cyan">
                     <CheckCircle2 size={20} />
                   </div>
                   <span className="font-bold text-lg">{item}</span>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </section>

      <CTASection 
        id="registration-cta"
        title="NÃO FIQUE DE FORA"
        subtitle="Garanta sua participação no maior evento multissetorial da região."
        buttonText="FAZER CREDENCIAMENTO"
        variant={colorVariant as any}
        onClick={openRegistrationModal}
      >
        <Link 
          href="/quero-expor" 
          className="inline-block border-b border-white/30 pb-1 text-sm text-gray-300 hover:text-white hover:border-white transition-colors"
        >
          Quero comprar um stand
        </Link>
      </CTASection>

      {/* Cross-City Promotion Section - Bottom of Page */}
      <section className="py-20 relative overflow-hidden mt-10">
        <div className="absolute inset-0 bg-brand-blue/80 backdrop-blur-sm z-0" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
             {cityName.toLowerCase() === 'manaus' ? (
                <div className="space-y-6">
                    <p className="text-brand-cyan font-bold tracking-widest text-sm uppercase">EXPANDA SEUS HORIZONTES</p>
                    <h2 className="text-3xl md:text-5xl font-black text-white">
                        VAI ESTAR EM <span className="text-brand-cyan">BELÉM?</span>
                    </h2>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        A Expo MultiMix também acontece no Pará! Conheça as datas, local e oportunidades da nossa edição em Belém.
                    </p>
                    <Link 
                        href="/belem"
                        className="inline-flex items-center gap-2 bg-brand-cyan text-brand-blue px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                    >
                        CONHECER EDIÇÃO BELÉM <ArrowRight size={20} />
                    </Link>
                </div>
             ) : (
                <div className="space-y-6">
                    <p className="text-brand-pink font-bold tracking-widest text-sm uppercase">EXPANDA SEUS HORIZONTES</p>
                    <h2 className="text-3xl md:text-5xl font-black text-white">
                        VAI ESTAR EM <span className="text-brand-pink">MANAUS?</span>
                    </h2>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        A Expo MultiMix também acontece no Amazonas! Conheça as datas, local e oportunidades da nossa edição em Manaus.
                    </p>
                    <Link 
                        href="/manaus"
                        className="inline-flex items-center gap-2 bg-brand-pink text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(233,30,99,0.3)]"
                    >
                        CONHECER EDIÇÃO MANAUS <ArrowRight size={20} />
                    </Link>
                </div>
             )}
        </div>
      </section>

      <ExhibitorsSection />

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

      {/* City Specific Registration Modal */}
      <Modal
        isOpen={activeModal === "registration"}
        onClose={closeModal}
      >
        <RegistrationFormModal 
          cityName={cityName} 
          fairId={fairId} 
          industries={industries} 
          onClose={closeModal} 
          />
      </Modal>

    </main>
  );
}
