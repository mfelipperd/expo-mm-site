import { Metadata } from "next";
import FaqContent from "@/components/FaqContent";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Perguntas Frequentes — Expo MultiMix 2026",
  description:
    "Tire todas as suas dúvidas sobre a Expo MultiMix 2026: credenciamento gratuito, datas, locais em Belém e Manaus, como expor, CNPJ, stands e muito mais.",
  alternates: { canonical: "https://www.expomultimix.com.br/faq" },
  keywords: [
    "perguntas frequentes Expo MultiMix",
    "credenciamento feira Belém Manaus",
    "como participar feira atacado Norte",
    "dúvidas Expo MultiMix 2026",
    "CNPJ credenciamento feira",
    "como expor feira Norte Brasil",
    "stand expositor feira Belém",
    "stand expositor feira Manaus",
    "horário Expo MultiMix",
    "endereço Estação das Docas feira",
    "endereço Vasco Vasques feira",
    "comprar direto fábrica lojista",
    "acesso feira gratuito lojista",
  ],
  openGraph: {
    url: "https://www.expomultimix.com.br/faq",
    title: "Perguntas Frequentes — Expo MultiMix 2026",
    description:
      "Tire todas as suas dúvidas sobre credenciamento, datas, locais, stands e muito mais.",
    images: [
      {
        url: "/assets/fachada-belem-emm.jpeg",
        width: 1200,
        height: 630,
        alt: "Expo MultiMix 2026 — FAQ",
      },
    ],
  },
};

const FAQ_SCHEMA_DATA = [
  {
    question: "O que é a Expo MultiMix?",
    answer:
      "A Expo MultiMix é a maior feira de negócios B2B da Região Norte do Brasil, conectando indústrias e importadoras com lojistas e varejistas em Belém (PA) e Manaus (AM). Permite comprar direto da fábrica com condições exclusivas.",
  },
  {
    question: "Como faço o credenciamento para visitar a Expo MultiMix?",
    answer:
      "O credenciamento é feito online e é gratuito. Acesse expomultimix.com.br/belem ou expomultimix.com.br/manaus, clique em 'Quero Me Credenciar' e preencha o formulário com seu CNPJ.",
  },
  {
    question: "O credenciamento custa alguma coisa?",
    answer:
      "Não. O credenciamento para visitar a Expo MultiMix é totalmente gratuito para lojistas com CNPJ ativo. Não há cobrança de ingresso.",
  },
  {
    question: "Preciso ter CNPJ para participar?",
    answer:
      "Sim. A Expo MultiMix é um evento B2B exclusivo para lojistas, varejistas e compradores com CNPJ ativo. Não é aberto ao público geral.",
  },
  {
    question: "Quando e onde acontece a Expo MultiMix 2026?",
    answer:
      "Manaus (AM): 9, 10 e 11 de junho de 2026, no Centro de Convenções Vasco Vasques. Belém (PA): 18, 19 e 20 de agosto de 2026, na Estação das Docas.",
  },
  {
    question: "Quais produtos e segmentos posso encontrar na feira?",
    answer:
      "Utilidades domésticas, brinquedos, puericultura, artigos para festas, variedades, decoração, descartáveis e pet. São centenas de marcas nacionais e importadoras.",
  },
  {
    question: "Como minha empresa pode expor na Expo MultiMix?",
    answer:
      "Acesse expomultimix.com.br/quero-expor e preencha o formulário de interesse. Nossa equipe comercial entrará em contato em até 48h.",
  },
  {
    question: "Quais os tamanhos de stand disponíveis e o que está incluso?",
    answer:
      "Stands montados de 2x3m e 3x3m, incluindo estrutura, carpete, iluminação, identificação visual e energia elétrica.",
  },
  {
    question: "Posso expor nas duas cidades — Belém e Manaus?",
    answer:
      "Sim. É possível reservar stands em Manaus (junho) e Belém (agosto) com condições diferenciadas para quem fecha os dois eventos.",
  },
  {
    question: "Há estacionamento nos locais da feira?",
    answer:
      "Sim. O Centro de Convenções Vasco Vasques (Manaus) tem estacionamento gratuito. A Estação das Docas (Belém) possui várias opções próximas.",
  },
  {
    question: "Posso levar minha equipe ou funcionários comigo?",
    answer:
      "Sim. Cada pessoa deve fazer o credenciamento individualmente pelo site, indicando o CNPJ da empresa.",
  },
  {
    question: "Como entrar em contato com a organização da Expo MultiMix?",
    answer:
      "Pelo WhatsApp: (91) 98130-6900, em dias úteis. Para expositores: expomultimix.com.br/quero-expor.",
  },
];

export default function FaqPage() {
  return (
    <>
      <FaqContent />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://www.expomultimix.com.br",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Perguntas Frequentes",
              item: "https://www.expomultimix.com.br/faq",
            },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ_SCHEMA_DATA.map(({ question, answer }) => ({
            "@type": "Question",
            name: question,
            acceptedAnswer: {
              "@type": "Answer",
              text: answer,
            },
          })),
        }}
      />
    </>
  );
}
