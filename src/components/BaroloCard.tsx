"use client";

import { motion } from "framer-motion";
import { Plane, Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";

export default function BaroloCard() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-900 border border-white/5 group"
        >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/assets/info-bg.jpg"
                    alt="Barolo Background"
                    fill
                    className="object-cover opacity-30 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-b from-slate-900/90 via-slate-900/80 to-slate-900" />
            </div>

            <div className="relative z-10 p-8 md:p-10 flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-[#dcb469]/20 flex items-center justify-center border border-[#dcb469]/30">
                        <Plane className="text-[#dcb469] w-8 h-8 -rotate-45" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-white leading-none mb-1">
                            PARCEIRO <span className="text-[#dcb469]">OFICIAL</span>
                        </h3>
                        <p className="text-sm text-gray-400 font-medium">Agência de Turismo Exclusiva</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-6 mb-8 flex-grow">
                    <div>
                        <h4 className="text-xl font-bold text-white mb-2">
                           Passagens Aéreas com <br/> 
                           <span className="text-transparent bg-clip-text bg-linear-to-r from-[#dcb469] to-[#bf9545]">
                                Descontos Especiais
                           </span>
                        </h4>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Garanta condições exclusivas em voos e hospedagem para a Expo MultiMix. Tarifas negociadas especialmente para expositores e visitantes.
                        </p>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-5 border border-white/5 space-y-3">
                        <div className="flex items-center gap-3 text-gray-300 text-sm">
                            <Phone className="text-[#dcb469] w-4 h-4" />
                            <span>11 5199-3957</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300 text-sm">
                            <Mail className="text-[#dcb469] w-4 h-4" />
                            <span>lazer@barolo.tur.br</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                         <a
                            href="https://wa.me/551151993957"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center gap-1 bg-[#dcb469] hover:bg-[#c9a255] text-slate-900 font-bold py-3 px-4 rounded-xl transition-all text-sm group/btn"
                        >
                            <span className="text-xs font-black uppercase tracking-wider opacity-70">Manaus</span>
                            <span className="flex items-center gap-1">RESERVAR <Plane size={12} className="-rotate-45 group-hover/btn:translate-x-1 transition-transform" /></span>
                        </a>
                        
                        <a
                            href="https://wa.me/551151993957"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center gap-1 bg-white/10 hover:bg-white/20 text-white border border-white/10 font-bold py-3 px-4 rounded-xl transition-all text-sm group/btn"
                        >
                            <span className="text-xs font-black uppercase tracking-wider opacity-50">Belém</span>
                            <span className="flex items-center gap-1">RESERVAR <Plane size={12} className="-rotate-45 group-hover/btn:translate-x-1 transition-transform" /></span>
                        </a>
                    </div>
                    <p className="text-[10px] text-center text-gray-500 uppercase tracking-widest font-bold">
                        Barolo Viagens
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
