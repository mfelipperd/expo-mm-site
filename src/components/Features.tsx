"use client";

import { motion } from "framer-motion";
import { CheckCircle, Zap, Shield, TrendingUp } from "lucide-react";
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
            
            <div className="flex flex-wrap gap-3">
              {categories.map((cat, i) => (
                <span 
                  key={cat} 
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  {cat}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[400px] rounded-2xl overflow-hidden glass"
          >
            <Image 
              src="/assets/info-bg.jpg" 
              alt="Expo Background" 
              fill 
              className="object-cover opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="text-center p-8 glass-dark rounded-2xl border border-white/20">
                <h4 className="text-2xl font-bold mb-2">PONTO DE ENCONTRO</h4>
                <p className="text-brand-cyan font-bold tracking-widest">ESTOQUE & PARCERIAS</p>
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
