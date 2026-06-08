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
