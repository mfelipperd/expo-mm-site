"use client";

import { motion } from "framer-motion";
import { CheckCircle, CheckCircle2, Zap, Shield, TrendingUp, Plane, Phone, Mail } from "lucide-react";
import Image from "next/image";

export default function Features() {
  const categories = [
    "Utilidades Domésticas",
    "Brinquedos",
    "Puericultura",
    "Festas",
    "Descartáveis",
    "Variedades",
    "Decoração",
  ];

  const benefits = [
    {
      title: "Variedade",
      desc: "Encontre diversas fábricas e importadoras em um só lugar.",
      icon: <Zap className="text-brand-orange" />,
    },
    {
      title: "Networking",
      desc: "O ponto de encontro ideal para fortalecer parcerias comerciais.",
      icon: <TrendingUp className="text-brand-cyan" />,
    },
    {
      title: "Exclusividade",
      desc: "Feira exclusiva para o público de lojistas e empreendedores.",
      icon: <Shield className="text-brand-pink" />,
    },
  ];

  return (
    <section className="py-24 bg-linear-to-b from-brand-blue to-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
              EXPOSITORES <br />
              <span className="text-brand-orange">FÁBRICAS E IMPORTADORAS</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-lg">
              A Expo MultiMix reúne as maiores marcas do Brasil, oferecendo uma diversidade incomparável de produtos para o seu negócio.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((cat, i) => (
                <motion.div 
                  key={cat}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-cyan/20 flex items-center justify-center text-brand-cyan shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="font-bold text-sm">{cat}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Top Section - Contact & Info */}
            <div className="relative p-8 bg-slate-900 flex flex-col items-center justify-center text-center">
              <Image 
                src="/assets/info-bg.jpg" 
                alt="Barolo Background" 
                fill 
                className="object-cover opacity-20"
              />
              <div className="relative z-10 flex flex-col items-center w-full">
                <div className="mb-6">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Plane className="text-[#dcb469] w-8 h-8 -rotate-45" />
                    <h3 className="text-3xl font-bold text-[#dcb469]">Barolo</h3>
                  </div>
                  <h3 className="text-3xl font-bold text-[#dcb469] leading-none">Viagens</h3>
                  <p className="text-xs text-gray-300 mt-1 uppercase tracking-widest">Viajando mais perto de você</p>
                </div>

                <p className="text-white font-medium text-lg leading-snug mb-6 max-w-xs">
                  Garanta já suas passagens para a Expo MultiMix 2026 Manaus e Belém com o melhor preço!
                </p>

                <p className="text-gray-300 text-sm mb-6 max-w-xs">
                   Entre em contato com um de nossos consultores para que seja dado todo o suporte e direcionamento que você precisa.
                </p>

                <div className="bg-[#dcb469] text-slate-900 py-3 px-6 rounded-lg font-bold text-center w-full max-w-[280px]">
                    <div className="text-lg flex items-center justify-center gap-2">
                      <Phone size={18} /> 11 5199-3957
                    </div>
                    <div className="text-sm flex items-center justify-center gap-2">
                       <Mail size={14} /> lazer@barolo.tur.br
                    </div>
                </div>
              </div>
            </div>

            {/* Bottom Section - Promo & Action */}
            <div className="bg-[#0B1426] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-brand-blue/20 rounded-full blur-[60px]" />
               
               <div className="relative z-10 w-full flex flex-col items-center">
                  <h3 className="text-xl md:text-2xl font-black text-white uppercase leading-tight mb-4">
                      Passagens Aéreas com <br/> <span className="text-brand-cyan">Desconto Promocional</span>
                  </h3>

                  <Plane className="text-white/10 w-16 h-16 mx-auto mb-4 -rotate-45" strokeWidth={1} />

                  <p className="text-[#dcb469] text-sm mb-6 max-w-xs mx-auto">
                      Desconto especial exclusivo para expositores e visitantes da Expo Multimix durante o período da feira.
                  </p>

                  <div className="space-y-3 w-full max-w-[280px] mx-auto">
                      <a 
                          href="https://wa.me/551151993957"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full bg-[#dcb469] hover:bg-[#c9a255] text-slate-900 font-bold py-3 rounded-lg transition-colors text-sm uppercase"
                      >
                          Reserve para Manaus
                      </a>
                      <a 
                          href="https://wa.me/551151993957"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full bg-[#dcb469] hover:bg-[#c9a255] text-slate-900 font-bold py-3 rounded-lg transition-colors text-sm uppercase"
                      >
                           Reserve para Belém
                      </a>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 rounded-2xl border border-white/5"
            >
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                {benefit.icon}
              </div>
              <h4 className="text-xl font-bold mb-3">{benefit.title}</h4>
              <p className="text-gray-400 leading-relaxed">
                {benefit.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
