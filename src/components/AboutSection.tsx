"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Sparkles, Handshake, BadgeDollarSign, ShieldAlert } from "lucide-react";

interface AboutSectionProps {
    onVisitClick: () => void;
}

export default function AboutSection({ onVisitClick }: AboutSectionProps) {
    const sobreRef = useRef(null);
    const { scrollYProgress: sobreScroll } = useScroll({
        target: sobreRef,
        offset: ["start end", "end start"],
    });

    const sobreY = useTransform(sobreScroll, [0, 1], ["-10%", "10%"]);

    return (
        <section ref={sobreRef} id="sobre" className="py-24 bg-brand-blue relative overflow-hidden">
            {/* Decorative elements */}
            <motion.div
                style={{ y: sobreY }}
                className="absolute top-0 right-0 w-96 h-96 bg-brand-pink/5 rounded-full blur-[100px]"
            />

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black mb-6 md:mb-8 leading-tight">
                        COMO FUNCIONA PARA <br className="md:hidden" /> <span className="text-brand-cyan">LOJISTAS</span>
                    </h2>
                    <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-6">
                        A Expo MultiMix é o ponto de encontro estratégico para quem busca renovar estoques com qualidade e prazos imbatíveis.
                    </p>
                    
                    {/* B2C Warning */}
                    <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-200 px-6 py-3 rounded-full">
                        <ShieldAlert size={20} />
                        <span className="font-bold text-sm uppercase tracking-wide">Não realizamos vendas para consumidor final (Varejo)</span>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {[
                        {
                            title: "Teste em Primeira Mão",
                            desc: "Veja, toque e teste os lançamentos das maiores indústrias nacionais antes de todo o mercado.",
                            icon: <Sparkles className="text-brand-pink" size={32} />,
                            color: "border-brand-pink"
                        },
                        {
                            title: "Negociação Direta",
                            desc: "Fale diretamente com gerentes e diretores das fábricas. Sem intermediários, melhores condições.",
                            icon: <Handshake className="text-brand-cyan" size={32} />,
                            color: "border-brand-cyan"
                        },
                        {
                            title: "Descontos Exclusivos",
                            desc: "Aproveite condições de pagamento e descontos que só acontecem dentro do pavilhão da feira.",
                            icon: <BadgeDollarSign className="text-brand-orange" size={32} />,
                            color: "border-brand-orange"
                        }
                    ].map((item, i) => (
                        <div key={i} className={`p-8 rounded-[2rem] glass border-t-4 ${item.color} hover:bg-white/5 transition-all`}>
                            <div className="mb-4">{item.icon}</div>
                            <h4 className="text-xl font-bold mb-3 text-white">{item.title}</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="glass-dark p-8 md:p-12 rounded-[3rem] border border-white/10 text-center">
                    <h3 className="text-2xl font-bold mb-6">Exclusividade B2B</h3>
                    <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                        A feira é **exclusiva para lojistas e empreendedores**. Para garantir o ambiente de negócios, a entrada é permitida apenas mediante comprovação de CNPJ do setor.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 text-sm font-bold text-gray-500 uppercase tracking-widest mb-10">
                        <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-brand-cyan" /> Entrada Gratuita</span>
                        <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-brand-pink" /> Credenciamento Online</span>
                        <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-brand-orange" /> Networking Regional</span>
                    </div>

                    <button
                        onClick={onVisitClick}
                        className="bg-brand-cyan text-white px-10 py-5 rounded-full font-black text-lg shadow-2xl hover:scale-105 transition-transform"
                    >
                        FAZER MEU CREDENCIAMENTO AGORA
                    </button>
                </div>
            </div>
        </section>
    );
}
