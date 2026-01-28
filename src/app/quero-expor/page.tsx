"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Modal from "@/components/Modal";
import WhatsAppModalContent from "@/components/WhatsAppModal";
import ExhibitorBypassModalContent from "@/components/ExhibitorBypassModal";
import VisitModalContent from "@/components/VisitModal";
import WhatsAppFloating from "@/components/WhatsAppFloating";
import { useState } from "react";
import { CheckCircle2, TrendingUp, Users, Package, ArrowRight, Rocket } from "lucide-react";

export default function QueroExpor() {
  const [activeModal, setActiveModal] = useState<"none" | "whatsapp" | "bypass" | "visit">("none");

  const openWhatsAppModal = () => setActiveModal("whatsapp");
  const openBypassModal = () => setActiveModal("bypass");
  const openVisitModal = () => setActiveModal("visit");
  const closeModal = () => setActiveModal("none");

  return (
    <main className="min-h-screen bg-brand-blue selection:bg-brand-cyan/30 selection:text-white">
      <Navbar 
        onVisitClick={openVisitModal} 
        onExposeClick={openBypassModal} 
        onContactClick={openWhatsAppModal}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-linear-to-b from-brand-orange/10 to-transparent blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-tight"
          >
            APRESENTE SUA MARCA NA <br />
            <span className="text-brand-orange">MAIOR VITRINE</span> DO NORTE
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto mb-10"
          >
            Conecte sua indústria ou importadora diretamente com milhares de lojistas selecionados das regiões de Belém e Manaus.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            onClick={openBypassModal}
            className="bg-brand-orange text-white px-10 py-5 rounded-full font-black text-lg shadow-2xl hover:scale-105 transition-transform"
          >
            RESERVAR MEU STAND AGORA
          </motion.button>
        </div>
      </section>

      {/* Why Exhibit Section */}
      <section className="py-24 bg-black/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-black mb-8">
                POR QUE EXPOR <br className="md:hidden" />
                NA <span className="text-brand-orange">EXPO MULTIMIX?</span>
              </h2>
              <div className="space-y-6">
                {[
                  {
                    title: "Público Altamente Qualificado",
                    desc: "Diferente de feiras nacionais, aqui você encontra o público regional específico que realmente compra.",
                    icon: <Users className="text-brand-cyan" />
                  },
                  {
                    title: "Geração de Leads Reais",
                    desc: "Oportunidade única para abrir novos clientes locais e fortalecer o relacionamento com lojistas tradicionais.",
                    icon: <TrendingUp className="text-brand-pink" />
                  },
                  {
                    title: "Logística Prática",
                    desc: "Oferecemos stands básicos e padronizados já montados. Praticidade total: é só chegar com os produtos e vender!",
                    icon: <Package className="text-brand-orange" />
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-6 rounded-2xl glass hover:bg-white/5 transition-all">
                    <div className="p-3 bg-white/5 rounded-xl h-fit">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square glass rounded-[3rem] border border-white/10 flex items-center justify-center p-12 text-center overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-brand-orange/20 via-transparent to-brand-pink/20" />
                <div className="relative z-10">
                  <div className="mb-6">
                    <Rocket size={64} className="text-brand-orange mx-auto" />
                  </div>
                  <h3 className="text-3xl font-black mb-4">SUCESSO REGIONAL</h3>
                  <p className="text-gray-400 text-lg">
                    "Chegando à sua 17ª edição em Belém e consolidando a 3ª edição em Manaus como referência para o setor."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stand Info */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-12">STANDS PRONTOS PARA VENDER</h2>
          <p className="text-xl text-gray-400 mb-12 leading-relaxed">
            Nossos stands são projetados para máxima eficiência. Com montagem inclusa, você foca no que importa: **apresentar seus produtos e fechar negócios.**
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
            {[
              "Estrutura metálica completa",
              "Iluminação embutida",
              "Identificação da marca",
              "Pisos acarpetados",
              "Ponto de energia 110v/220v",
              "Segurança e limpeza inclusas"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-gray-300">
                <CheckCircle2 className="text-brand-cyan shrink-0" size={20} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-brand-orange">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-8 text-white">GARANTA SEU LUGAR</h2>
          <p className="text-xl text-white/80 mb-12">
            As vagas para expositores são limitadas. Fale agora com nossa equipe comercial e escolha sua localização na planta.
          </p>
          <button 
            onClick={openBypassModal}
            className="bg-white text-brand-orange px-12 py-6 rounded-full font-black text-xl shadow-2xl hover:scale-105 transition-transform inline-flex items-center gap-4"
          >
            FALAR COM CONSULTOR <ArrowRight size={24} />
          </button>
        </div>
      </section>

      <Footer onWhatsAppClick={openWhatsAppModal} />
      <WhatsAppFloating onClick={openWhatsAppModal} />

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
        isOpen={activeModal === "visit"} 
        onClose={closeModal} 
        title="QUERO VISITAR"
      >
        <VisitModalContent />
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
