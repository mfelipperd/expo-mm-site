"use client";

import { motion } from "framer-motion";
import { Zap, TrendingUp, Shield, CheckCircle2 } from "lucide-react";
import BaroloCard from "./BaroloCard";

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

          <BaroloCard />
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
