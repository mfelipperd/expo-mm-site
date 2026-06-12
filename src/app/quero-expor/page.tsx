import { Metadata } from "next";
import QueroExporContent from "@/components/QueroExporContent";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Seja um Expositor — Reserve seu Stand em Belém e Manaus",
  description: "Apresente sua indústria ou importadora para milhares de lojistas qualificados. Reserve um stand na maior feira de negócios do Norte. Belém (ago/2026) e Manaus (jun/2026).",
  alternates: { canonical: "https://www.expomultimix.com.br/quero-expor" },
  keywords: [
    "expor em feira de negócios Norte",
    "stand para expositor Belém",
    "stand para expositor Manaus",
    "vender para lojistas atacado",
    "indústria expor feira Norte",
    "importadora feira Belém Manaus",
    "reservar stand feira 2026",
    "expositor Expo MultiMix",
    "ampliar vendas lojistas Amazônia",
    "como expor em feira de atacado",
    "quanto custa stand feira Norte",
    "vender mais no Norte do Brasil",
    "distribuir produtos Região Norte",
    "como vender para lojistas Pará Amazonas",
    "indústria alcançar lojistas Norte",
    "feira para indústria e importadora 2026",
  ],
  openGraph: {
    url: "https://www.expomultimix.com.br/quero-expor",
    title: "Seja um Expositor na Expo MultiMix 2026",
    description: "Reserve seu stand e apresente sua marca para milhares de lojistas em Belém e Manaus.",
    images: [{ url: "/assets/fachada-manaus-2.jpeg", width: 1200, height: 630, alt: "Expo MultiMix — Seja um Expositor" }],
  },
};

export default function QueroExpor() {
  return (
    <>
      <QueroExporContent />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.expomultimix.com.br" },
            { "@type": "ListItem", "position": 2, "name": "Quero Expor", "item": "https://www.expomultimix.com.br/quero-expor" },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": "https://www.expomultimix.com.br/quero-expor#webpage",
          "url": "https://www.expomultimix.com.br/quero-expor",
          "name": "Seja um Expositor — Reserve seu Stand na Expo MultiMix 2026",
          "description": "Indústrias e importadoras: reserve seu stand e apresente sua marca para milhares de lojistas em Belém e Manaus.",
          "inLanguage": "pt-BR",
          "isPartOf": { "@id": "https://www.expomultimix.com.br" }
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Como minha empresa pode expor na Expo MultiMix?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Indústrias, importadoras e distribuidoras podem reservar um stand preenchendo o formulário na página expomultimix.com.br/quero-expor. A equipe comercial da Expo MultiMix entrará em contato para apresentar os planos disponíveis e fechar a reserva."
              }
            },
            {
              "@type": "Question",
              "name": "Quais os tamanhos de stand disponíveis na Expo MultiMix?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "A Expo MultiMix oferece stands montados nos tamanhos 2x3m e 3x3m, já incluindo estrutura, carpete, iluminação e identificação visual. Os stands ficam posicionados no pavilhão principal para máxima visibilidade perante os lojistas visitantes."
              }
            },
            {
              "@type": "Question",
              "name": "Quantos lojistas visitam a Expo MultiMix?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "A Expo MultiMix reúne milhares de lojistas qualificados com CNPJ por edição, representando o comércio varejista de Belém, Manaus e cidades do interior do Pará e Amazonas. É a maior concentração de compradores B2B da Região Norte."
              }
            },
            {
              "@type": "Question",
              "name": "A Expo MultiMix acontece em quais cidades?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "A Expo MultiMix 2026 acontece em duas cidades: Manaus (AM) em junho de 2026 e Belém (PA) em agosto de 2026. Expositores podem reservar stands em uma ou em ambas as cidades."
              }
            },
          ]
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Espaço para Expositores — Expo MultiMix 2026",
          "serviceType": "Locação de Stand em Feira de Negócios",
          "provider": {
            "@type": "Organization",
            "name": "Expo MultiMix",
            "url": "https://www.expomultimix.com.br",
          },
          "description": "Stands 2x3m e 3x3m montados para indústrias e importadoras exporem para lojistas qualificados da Região Norte em Belém e Manaus.",
          "areaServed": ["Belém", "Manaus", "Região Norte do Brasil"],
          "url": "https://www.expomultimix.com.br/quero-expor",
        }}
      />
    </>
  );
}
