"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Modal from "@/components/Modal";
import WhatsAppModalContent from "@/components/WhatsAppModal";
import ExhibitorBypassModalContent from "@/components/ExhibitorBypassModal";
import VisitModalContent from "@/components/VisitModal";
import WhatsAppFloating from "@/components/WhatsAppFloating";
import { useState, useRef, useEffect } from "react";
import { CheckCircle2, TrendingUp, Users, Package, ArrowRight, Rocket, ShieldCheck, Handshake, Calendar, MapPin } from "lucide-react";
import Image from "next/image";

export default function QueroExpor() {
  const [activeModal, setActiveModal] = useState<"none" | "whatsapp" | "bypass" | "visit">("none");
  const [whatsAppFilter, setWhatsAppFilter] = useState<string | undefined>(undefined);

  const openWhatsAppModal = () => {
      setWhatsAppFilter(undefined);
      setActiveModal("whatsapp");
  };
  const openBypassModal = () => setActiveModal("bypass");
  const openVisitModal = () => setActiveModal("visit");
  const closeModal = () => setActiveModal("none");

  const scrollToStands = () => {
     document.getElementById("modelos-stands")?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Check for query param 'target=stands' to trigger smooth scroll
    if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        if (params.get("target") === "stands") {
            // Timeout ensures page is rendered before scrolling
            setTimeout(() => {
                scrollToStands();
            }, 600); 
        }
    }
  }, []);

  const handleBuyStand = (standModel: string) => {
      setWhatsAppFilter("Comercial");
      setActiveModal("whatsapp");
  };

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <main className="min-h-screen bg-brand-blue selection:bg-brand-cyan/30 selection:text-white">
      <Navbar 
        onVisitClick={openVisitModal} 
        onExposeClick={scrollToStands} 
        onContactClick={openWhatsAppModal}
      />

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/fachada-manaus-2.jpeg"
            alt="Expo MultiMix Manaus"
            fill
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-linear-to-b from-brand-blue/70 via-brand-blue/60 to-brand-blue" />
        </div>
        
        <motion.div 
          style={{ y }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-linear-to-b from-brand-orange/10 to-transparent blur-[120px] pointer-events-none z-0" 
        />
        
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
            onClick={scrollToStands}
            className="bg-brand-orange text-white px-10 py-5 rounded-full font-black text-lg shadow-2xl hover:scale-105 transition-transform"
          >
            RESERVAR MEU STAND AGORA
          </motion.button>
        </div>
      </section>

      {/* Event Calendar / Dates for Exhibitors */}
      <section className="py-20 bg-brand-blue border-b border-white/5 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
                <span className="text-brand-cyan font-bold tracking-widest text-sm uppercase">Calendário 2026</span>
                <h2 className="text-3xl md:text-4xl font-black text-white mt-2">NOSSAS EDIÇÕES</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
                {/* Manaus Card */}
                <div className="glass p-8 rounded-3xl border-l-4 border-brand-pink hover:bg-white/5 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <span className="bg-brand-pink/20 text-brand-pink text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Amazonas</span>
                            <h3 className="text-3xl font-black text-white mt-2">MANAUS</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Rocket className="text-brand-pink" size={24} />
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-gray-300">
                             <div className="w-8 h-8 rounded-lg bg-brand-pink/10 flex items-center justify-center text-brand-pink">
                                <Calendar size={16} />
                             </div>
                             <div>
                                <p className="text-xs font-bold text-gray-500 uppercase">Data</p>
                                <p className="font-bold text-white">09, 10 e 11 de Junho</p>
                             </div>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                             <div className="w-8 h-8 rounded-lg bg-brand-pink/10 flex items-center justify-center text-brand-pink">
                                <MapPin size={16} />
                             </div>
                             <div>
                                <p className="text-xs font-bold text-gray-500 uppercase">Local</p>
                                <p className="font-bold text-white">Centro de Convenções Vasco Vasques</p>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Belém Card */}
                 <div className="glass p-8 rounded-3xl border-l-4 border-brand-cyan hover:bg-white/5 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <span className="bg-brand-cyan/20 text-brand-cyan text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Pará</span>
                            <h3 className="text-3xl font-black text-white mt-2">BELÉM</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Rocket className="text-brand-cyan" size={24} />
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-gray-300">
                             <div className="w-8 h-8 rounded-lg bg-brand-cyan/10 flex items-center justify-center text-brand-cyan">
                                <Calendar size={16} />
                             </div>
                             <div>
                                <p className="text-xs font-bold text-gray-500 uppercase">Data</p>
                                <p className="font-bold text-white">18, 19 e 20 de Agosto</p>
                             </div>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                             <div className="w-8 h-8 rounded-lg bg-brand-cyan/10 flex items-center justify-center text-brand-cyan">
                                <MapPin size={16} />
                             </div>
                             <div>
                                <p className="text-xs font-bold text-gray-500 uppercase">Local</p>
                                <p className="font-bold text-white">Estação das Docas - Pavilhão de Feiras</p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>
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
            <div className="relative h-full">
              <div className="h-full aspect-square md:aspect-auto glass rounded-3xl border border-white/10 flex items-center justify-center p-12 text-center overflow-hidden relative group">
                
                {/* Background Images Collage */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-[url('/assets/fachada-belem-emm.jpeg')] bg-cover bg-center opacity-40 mix-blend-overlay transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[url('/assets/fachada-manaus-emm.jpeg')] bg-cover bg-center opacity-40 mix-blend-overlay transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-brand-blue/80 backdrop-blur-[2px]" />
                </div>

                <div className="absolute inset-0 bg-linear-to-br from-brand-orange/20 via-transparent to-brand-pink/20 z-0 pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="mb-8 relative">
                    <div className="absolute inset-0 bg-brand-orange/20 blur-xl rounded-full" />
                    <Rocket size={64} className="text-brand-orange mx-auto relative z-10" />
                  </div>
                  <h3 className="text-3xl font-black mb-6 text-white drop-shadow-md">SUCESSO REGIONAL</h3>
                  <p className="text-gray-200 text-lg leading-relaxed font-medium">
                    "Chegando à sua 17ª edição em Belém e consolidando a 3ª edição em Manaus como referência para o setor."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SCROLLTELLING SECTION (New) */}
      <FairScrollTelling />

      {/* Stand Info */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-12">STANDS PRONTOS PARA VENDER</h2>
          <p className="text-xl text-gray-400 mb-12 leading-relaxed">
            Nossos stands são projetados para máxima eficiência. Com montagem inclusa, você foca no que importa: **apresentar seus produtos e fechar negócios.**
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
            {[
              "Estrutura completa com prateleiras, mesa e cadeiras",
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

      {/* Stand Models Section */}
      <section id="modelos-stands" className="py-20 bg-brand-blue/30 border-t border-white/5">
         <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
               <span className="text-brand-orange font-bold tracking-widest text-sm uppercase">ESCOLHA O SEU</span>
               <h2 className="text-3xl md:text-5xl font-black text-white mt-2">MODELOS DISPONÍVEIS</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
               {/* Stand 2x3 */}
               <div className="glass p-8 rounded-3xl border border-white/10 hover:border-brand-orange/50 transition-all flex flex-col group">
                  <div className="aspect-video bg-white/5 rounded-2xl mb-6 relative overflow-hidden">
                     <Image 
                        src="/assets/Stand-2-3.jpeg"
                        alt="Stand Standard 2x3m"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                     />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">STAND STANDARD 2x3m</h3>
                  <p className="text-gray-400 mb-6 text-sm">Ideal para pequenas exposições e ativação de marca.</p>
                  <ul className="space-y-3 mb-8 flex-1">
                     <li className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle2 size={16} className="text-brand-cyan" /> 6m² de área total
                     </li>
                     <li className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle2 size={16} className="text-brand-cyan" /> Montagem básica inclusa
                     </li>
                     <li className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle2 size={16} className="text-brand-cyan" /> Iluminação e Tomada
                     </li>
                  </ul>
                  <button 
                    onClick={() => handleBuyStand('2x3m')}
                    className="w-full bg-white/5 hover:bg-brand-orange hover:text-white text-brand-orange font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 border border-brand-orange/30 hover:border-brand-orange"
                  >
                     SABER MAIS <ArrowRight size={18} />
                  </button>
               </div>

               {/* Stand 3x3 */}
               <div className="glass p-8 rounded-3xl border border-white/10 hover:border-brand-orange/50 transition-all flex flex-col group">
                  <div className="aspect-video bg-white/5 rounded-2xl mb-6 relative overflow-hidden">
                      <Image 
                        src="/assets/stand-3-3.jpeg"
                        alt="Stand Standard 3x3m"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                     />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">STAND STANDARD 3x3m</h3>
                  <p className="text-gray-400 mb-6 text-sm">Mais espaço para produtos e atendimento.</p>
                   <ul className="space-y-3 mb-8 flex-1">
                     <li className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle2 size={16} className="text-brand-cyan" /> 9m² de área total
                     </li>
                     <li className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle2 size={16} className="text-brand-cyan" /> Montagem básica inclusa
                     </li>
                     <li className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle2 size={16} className="text-brand-cyan" /> Iluminação e Tomada
                     </li>
                  </ul>
                  <button 
                     onClick={() => handleBuyStand('3x3m')}
                     className="w-full bg-brand-orange text-white font-bold py-4 rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-lg shadow-brand-orange/20"
                  >
                     SABER MAIS <ArrowRight size={18} />
                  </button>
               </div>
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
            onClick={scrollToStands}
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
        <WhatsAppModalContent filterRole={whatsAppFilter} />
      </Modal>
    </main>
  );
}

// Sub-component for Scrolltelling
function FairScrollTelling() {
  const steps = [
    {
      title: "CONFIABILIDADE",
      desc: "Mais de 15 anos de história conectando grandes marcas a lojistas qualificados. Um evento consolidado no calendário do varejo.",
      img: "/assets/gallery-1.jpg",
      icon: <ShieldCheck size={32} className="text-brand-cyan" />
    },
    {
      title: "NETWORKING REAL",
      desc: "Corredores movimentados, aperto de mão e olho no olho. O ambiente perfeito para fechar negócios que duram o ano todo.",
      img: "/assets/gallery-2.jpg",
      icon: <Handshake size={32} className="text-brand-pink" />
    },
    {
      title: "ESTRUTURA DE PONTA",
      desc: "Pavilhões climatizados, segurança completa e organização impecável para você receber seus clientes com conforto.",
      img: "/assets/gallery-3.jpg",
      icon: <Rocket size={32} className="text-brand-orange" />
    }
  ];

  return (
    <div className="py-24 bg-brand-blue relative">
       <div className="text-center mb-20 px-6">
          <p className="text-brand-cyan font-bold tracking-widest mb-4">A FEIRA NA PRÁTICA</p>
          <h2 className="text-3xl md:text-5xl font-black text-white">VEJA COMO É <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-cyan to-brand-pink">PARTICIPAR</span></h2>
       </div>

       <div className="max-w-7xl mx-auto px-6">
          {steps.map((step, i) => (
             <ScrollStep key={i} step={step} index={i} />
          ))}
       </div>
    </div>
  );
}

function ScrollStep({ step, index }: { step: any, index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-50% 0px -50% 0px" });

  return (
    <div ref={ref} className={`flex flex-col md:flex-row items-center gap-12 py-24 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
       {/* Text Side */}
       <div className="flex-1 space-y-6">
          <motion.div 
             initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
             whileInView={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8 }}
             className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10"
          >
             {step.icon}
          </motion.div>
          <motion.h3 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             className="text-3xl font-black text-white"
          >
             {step.title}
          </motion.h3>
          <motion.p 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             className="text-xl text-gray-400 leading-relaxed"
          >
             {step.desc}
          </motion.p>
       </div>

       {/* Image Side - Simple parallax/reveal */}
       <div className="flex-1 w-full">
          <motion.div
             className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl"
             initial={{ opacity: 0, scale: 0.9 }}
             animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0.5, scale: 0.95 }}
             transition={{ duration: 0.8 }}
          >
             <Image 
                src={step.img}
                alt={step.title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
             />
             <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-60" />
          </motion.div>
       </div>
    </div>
  );
}
