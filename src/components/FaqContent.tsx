"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, MapPin, Users, Briefcase, HelpCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Modal from "@/components/Modal";
import LeadModalContent from "@/components/LeadModal";
import VisitModalContent from "@/components/VisitModal";
import WhatsAppModalContent from "@/components/WhatsAppModal";

type Category = "todos" | "visitantes" | "expositores" | "datas-local" | "geral";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: Exclude<Category, "todos">;
}

const FAQ_DATA: FaqItem[] = [
  // Visitantes
  {
    id: 1,
    category: "visitantes",
    question: "O que é a Expo MultiMix?",
    answer:
      "A Expo MultiMix é a maior feira de negócios B2B da Região Norte do Brasil. O evento conecta indústrias e importadoras diretamente com lojistas e varejistas de Belém (PA) e Manaus (AM), permitindo que compradores adquiram produtos direto da fábrica com condições exclusivas de preço e prazo de pagamento que só existem durante os dias da feira.",
  },
  {
    id: 2,
    category: "visitantes",
    question: "Como faço o credenciamento para visitar a Expo MultiMix?",
    answer:
      "O credenciamento é feito online e é gratuito. Basta acessar a página da cidade que deseja visitar (expomultimix.com.br/belem ou expomultimix.com.br/manaus), clicar em 'Quero Me Credenciar' e preencher o formulário com seus dados e CNPJ. Após o credenciamento, você receberá a confirmação e poderá acessar o evento nos dias marcados.",
  },
  {
    id: 3,
    category: "visitantes",
    question: "O credenciamento custa alguma coisa?",
    answer:
      "Não. O credenciamento para visitar a Expo MultiMix é totalmente gratuito para lojistas com CNPJ ativo. Não há cobrança de ingresso, taxa de entrada ou nenhum outro valor para participar como visitante.",
  },
  {
    id: 4,
    category: "visitantes",
    question: "Preciso ter CNPJ para participar?",
    answer:
      "Sim. A Expo MultiMix é um evento exclusivamente B2B (business-to-business). O acesso é destinado a lojistas, varejistas, revendedores e compradores com CNPJ ativo. O evento não é aberto ao público geral ou para compras em nome de pessoa física.",
  },
  {
    id: 5,
    category: "visitantes",
    question: "Quais produtos e segmentos posso encontrar na feira?",
    answer:
      "A Expo MultiMix reúne expositores dos segmentos de: Utilidades Domésticas, Brinquedos, Puericultura, Artigos para Festas, Variedades, Decoração, Descartáveis e Pet. São centenas de marcas nacionais e importadoras com seus representantes presentes para negociação direta.",
  },
  {
    id: 6,
    category: "visitantes",
    question: "Posso levar minha equipe ou funcionários comigo?",
    answer:
      "Sim! Você pode trazer compradores, gerentes ou sócios da sua empresa. Cada pessoa deve fazer o credenciamento individualmente pelo site, indicando o CNPJ da empresa. O credenciamento é pessoal e intransferível.",
  },
  {
    id: 7,
    category: "visitantes",
    question: "Como são as condições de compra na feira?",
    answer:
      "As condições de compra são negociadas diretamente entre o lojista e o expositor (fábrica ou importadora) no stand. Geralmente incluem preços de tabela de fábrica, descontos por volume, prazos de pagamento diferenciados e promoções exclusivas do evento — condições que normalmente não estão disponíveis fora da feira.",
  },
  {
    id: 8,
    category: "visitantes",
    question: "Há estacionamento nos locais da feira?",
    answer:
      "Sim. Ambos os locais oferecem estacionamento: a Estação das Docas (Belém) possui estacionamento na região central com várias opções próximas, e o Centro de Convenções Vasco Vasques (Manaus) conta com estacionamento gratuito no próprio local.",
  },

  // Datas e Local
  {
    id: 9,
    category: "datas-local",
    question: "Quando e onde acontece a Expo MultiMix 2026?",
    answer:
      "A Expo MultiMix 2026 acontece em duas cidades:\n\n• Manaus (AM): 9, 10 e 11 de junho de 2026 — Centro de Convenções Vasco Vasques (Av. Constantino Nery, 5001). Horário: 13h às 20h.\n\n• Belém (PA): 18, 19 e 20 de agosto de 2026 — Estação das Docas (Boulevard Castilhos França, s/n). Horário: 13h às 21h.",
  },
  {
    id: 10,
    category: "datas-local",
    question: "Onde fica a Estação das Docas em Belém?",
    answer:
      "A Estação das Docas está localizada na Boulevard Castilhos França, s/n, no centro histórico de Belém do Pará — CEP 66020-200. É um dos pontos turísticos mais famosos da cidade, à beira do Rio Guamá, com localização central e infraestrutura completa.",
  },
  {
    id: 11,
    category: "datas-local",
    question: "Onde fica o Centro de Convenções Vasco Vasques em Manaus?",
    answer:
      "O Centro de Convenções Vasco Vasques está localizado na Av. Constantino Nery, 5001, Chapada, em Manaus — CEP 69050-001. É o maior e mais moderno centro de convenções da Região Norte, com fácil acesso, amplo estacionamento gratuito e excelente infraestrutura.",
  },
  {
    id: 12,
    category: "datas-local",
    question: "Haverá edições em outras cidades além de Belém e Manaus?",
    answer:
      "Para 2026 as edições confirmadas são em Manaus (junho) e Belém (agosto). A expansão para outras cidades da Região Norte é planejada para edições futuras. Acompanhe nossas redes sociais (@expomultimix) para ser o primeiro a saber sobre novas cidades.",
  },

  // Expositores
  {
    id: 13,
    category: "expositores",
    question: "Como minha empresa pode expor na Expo MultiMix?",
    answer:
      "Indústrias, importadoras e distribuidoras interessadas em expor devem acessar expomultimix.com.br/quero-expor e preencher o formulário de interesse. Nossa equipe comercial entrará em contato em até 48h para apresentar os planos de stand disponíveis, localização no pavilhão e condições de pagamento.",
  },
  {
    id: 14,
    category: "expositores",
    question: "Quais os tamanhos de stand disponíveis e o que está incluso?",
    answer:
      "Oferecemos stands montados nos tamanhos 2x3m e 3x3m. Cada stand já inclui: estrutura montada, carpete, iluminação, identificação visual com o nome da empresa, e acesso a energia elétrica. Stands personalizados e módulos maiores são negociados diretamente com a equipe comercial.",
  },
  {
    id: 15,
    category: "expositores",
    question: "Posso expor nas duas cidades — Belém e Manaus?",
    answer:
      "Sim! Muitos expositores participam das duas edições. É possível reservar stands em Manaus (junho) e Belém (agosto) com um único contrato, o que garante presença em ambos os principais mercados consumidores da Região Norte e condições comerciais diferenciadas para quem fecha os dois eventos.",
  },
  {
    id: 16,
    category: "expositores",
    question: "Qual é o perfil dos visitantes da Expo MultiMix?",
    answer:
      "Os visitantes são exclusivamente lojistas, varejistas, revendedores e compradores B2B com CNPJ ativo. A maioria representa pequenas e médias empresas do comércio varejista de Belém, Manaus e cidades do interior do Pará e Amazonas. São compradores que chegam com intenção de negociar e renovar estoques.",
  },
  {
    id: 17,
    category: "expositores",
    question: "Como funciona a montagem do stand antes do evento?",
    answer:
      "A estrutura do stand já é montada pela organização antes da abertura do evento. Os expositores têm acesso ao pavilhão no dia anterior ao início da feira para decorar e abastecer seus stands com produtos, materiais de marketing e amostras. O cronograma completo de montagem e desmontagem é enviado aos expositores confirmados.",
  },

  // Geral
  {
    id: 18,
    category: "geral",
    question: "A Expo MultiMix tem redes sociais? Como acompanhar as novidades?",
    answer:
      "Sim! Siga a Expo MultiMix nas redes sociais para acompanhar confirmações de expositores, datas, promoções e novidades do evento:\n\n• Instagram: @expomultimix\n• Facebook: /expomultimix\n\nVocê também pode se inscrever para receber notificações pelo próprio site.",
  },
  {
    id: 19,
    category: "geral",
    question: "Como entrar em contato com a organização da Expo MultiMix?",
    answer:
      "Você pode entrar em contato pelo WhatsApp: (91) 98130-6900. O atendimento está disponível em dias úteis. Para dúvidas sobre credenciamento de visitantes, acesse a página da cidade desejada no site. Para interesse em expor, acesse expomultimix.com.br/quero-expor.",
  },
  {
    id: 20,
    category: "geral",
    question: "A Expo MultiMix é acessível para pessoas com deficiência?",
    answer:
      "Sim. Ambos os locais de realização da Expo MultiMix — a Estação das Docas (Belém) e o Centro de Convenções Vasco Vasques (Manaus) — possuem infraestrutura de acessibilidade, incluindo rampas de acesso, banheiros adaptados e circulação adequada para cadeirantes e pessoas com mobilidade reduzida.",
  },
];

const CATEGORIES: { value: Category; label: string; icon: React.ReactNode }[] = [
  { value: "todos", label: "Todas", icon: <HelpCircle size={16} /> },
  { value: "visitantes", label: "Visitantes", icon: <Users size={16} /> },
  { value: "expositores", label: "Expositores", icon: <Briefcase size={16} /> },
  { value: "datas-local", label: "Datas & Local", icon: <MapPin size={16} /> },
  { value: "geral", label: "Geral", icon: <HelpCircle size={16} /> },
];

function highlightText(text: string, query: string) {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-brand-cyan/30 text-brand-cyan rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function AccordionItem({
  item,
  isOpen,
  onToggle,
  query,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
  query: string;
}) {
  const categoryColors: Record<Exclude<Category, "todos">, string> = {
    visitantes: "text-brand-cyan border-brand-cyan/30",
    expositores: "text-brand-orange border-brand-orange/30",
    "datas-local": "text-brand-pink border-brand-pink/30",
    geral: "text-gray-400 border-gray-400/30",
  };
  const categoryLabels: Record<Exclude<Category, "todos">, string> = {
    visitantes: "Visitantes",
    expositores: "Expositores",
    "datas-local": "Datas & Local",
    geral: "Geral",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`glass-card rounded-2xl overflow-hidden transition-all duration-300 ${
        isOpen ? "border border-white/15" : "border border-white/5"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full text-left px-6 py-5 flex items-start gap-4 group"
        aria-expanded={isOpen}
      >
        <span
          className={`mt-0.5 flex-shrink-0 text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
            categoryColors[item.category]
          }`}
        >
          {categoryLabels[item.category]}
        </span>
        <span className="flex-1 text-base font-semibold text-white group-hover:text-brand-cyan transition-colors leading-snug">
          {highlightText(item.question, query)}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="flex-shrink-0 mt-0.5"
        >
          <ChevronDown size={20} className={isOpen ? "text-brand-cyan" : "text-gray-500"} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 text-gray-300 leading-relaxed text-sm md:text-base whitespace-pre-line border-t border-white/5 pt-4 ml-0">
              {highlightText(item.answer, query)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FaqContent() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("todos");
  const [openId, setOpenId] = useState<number | null>(1);
  const [activeModal, setActiveModal] = useState<"none" | "lead" | "visit" | "whatsapp">("none");

  const openVisitModal = () => setActiveModal("visit");
  const openLeadModal = () => setActiveModal("lead");
  const openWhatsAppModal = () => setActiveModal("whatsapp");
  const closeModal = () => setActiveModal("none");
  const handleExposeClick = () => router.push("/quero-expor?target=stands");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return FAQ_DATA.filter((item) => {
      const matchesCategory =
        activeCategory === "todos" || item.category === activeCategory;
      const matchesQuery =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  const handleToggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <main className="min-h-screen bg-brand-blue text-white">
      <Navbar onVisitClick={openVisitModal} onExposeClick={openLeadModal} onContactClick={openWhatsAppModal} />
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-cyan/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 left-10 w-48 h-48 bg-brand-pink/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-brand-cyan font-bold tracking-widest text-sm mb-4 flex items-center justify-center gap-3"
          >
            <span className="h-px w-8 bg-brand-cyan" />
            CENTRAL DE AJUDA
            <span className="h-px w-8 bg-brand-cyan" />
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight"
          >
            PERGUNTAS{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-cyan to-blue-400">
              FREQUENTES
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg mb-10"
          >
            Tudo o que você precisa saber sobre a maior feira de negócios do Norte do Brasil.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative max-w-xl mx-auto"
          >
            <Search
              size={20}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveCategory("todos");
                setOpenId(null);
              }}
              placeholder="Buscar pergunta... ex: credenciamento, stand, CNPJ"
              className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-14 pr-6 text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-cyan/60 focus:bg-white/8 transition-all text-sm md:text-base"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors text-lg leading-none"
                aria-label="Limpar busca"
              >
                ×
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Category tabs */}
      <section className="px-6 pb-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-2 justify-center"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setActiveCategory(cat.value);
                  setQuery("");
                  setOpenId(null);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === cat.value
                    ? "bg-brand-cyan text-brand-blue shadow-[0_0_15px_rgba(0,188,212,0.4)]"
                    : "glass text-gray-400 hover:text-white hover:bg-white/8"
                }`}
              >
                {cat.icon}
                {cat.label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    activeCategory === cat.value
                      ? "bg-brand-blue/30 text-brand-blue"
                      : "bg-white/10 text-gray-400"
                  }`}
                >
                  {cat.value === "todos"
                    ? FAQ_DATA.length
                    : FAQ_DATA.filter((i) => i.category === cat.value).length}
                </span>
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Results count when searching */}
      <AnimatePresence>
        {query && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-6 py-2"
          >
            <p className="text-center text-sm text-gray-500">
              {filtered.length === 0
                ? "Nenhuma pergunta encontrada."
                : `${filtered.length} resultado${filtered.length !== 1 ? "s" : ""} para "${query}"`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAQ list */}
      <section className="px-6 py-8 pb-20">
        <div className="max-w-4xl mx-auto">
          {filtered.length > 0 ? (
            <motion.div layout className="flex flex-col gap-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((item) => (
                  <AccordionItem
                    key={item.id}
                    item={item}
                    isOpen={openId === item.id}
                    onToggle={() => handleToggle(item.id)}
                    query={query}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-400 text-lg mb-2">Nenhuma pergunta encontrada.</p>
              <p className="text-gray-600 text-sm mb-6">
                Tente outros termos ou entre em contato conosco diretamente.
              </p>
              <button
                onClick={() => { setQuery(""); setActiveCategory("todos"); }}
                className="text-brand-cyan underline text-sm"
              >
                Ver todas as perguntas
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-dark border border-white/10 rounded-3xl p-8 md:p-14 text-center relative overflow-hidden"
          >
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-brand-pink/15 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-cyan/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10">
              <p className="text-brand-cyan font-bold tracking-widest text-sm mb-4">
                AINDA TEM DÚVIDAS?
              </p>
              <h2 className="text-2xl md:text-4xl font-black mb-4">
                FALE DIRETAMENTE COM NOSSA EQUIPE
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                Nossa equipe está pronta para responder qualquer dúvida sobre credenciamento, stands ou o evento.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/5591981306900?text=Olá!%20Tenho%20uma%20dúvida%20sobre%20a%20Expo%20MultiMix."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-brand-cyan text-brand-blue px-8 py-4 rounded-full font-black transition-all hover:scale-105 shadow-[0_0_20px_rgba(0,188,212,0.3)]"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.121.554 4.112 1.524 5.84L0 24l6.341-1.498A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.51-5.17-1.4l-.37-.22-3.765.889.908-3.672-.242-.379A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                  </svg>
                  FALAR NO WHATSAPP
                </a>
                <Link
                  href="/quero-expor"
                  className="inline-flex items-center justify-center gap-2 glass border border-white/15 text-white px-8 py-4 rounded-full font-bold transition-all hover:scale-105 hover:bg-white/8"
                >
                  QUERO SER EXPOSITOR
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

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
        isOpen={activeModal === "whatsapp"}
        onClose={closeModal}
        title="FALE COM UM CONSULTOR"
      >
        <WhatsAppModalContent />
      </Modal>
    </main>
  );
}
