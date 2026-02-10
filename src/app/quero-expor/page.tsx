import { Metadata } from "next";
import QueroExporContent from "@/components/QueroExporContent";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Seja um Expositor",
  description: "Reserve seu stand na maior vitrine de negócios do Norte. Conecte sua indústria com milhares de lojistas em Belém e Manaus.",
  keywords: [
    "Expo MultiMix credenciamento lojista", 
    "Vender na feira", 
    "Stand em feira de negócios", 
    "Expor em Belém", 
    "Expor em Manaus"
  ],
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
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://www.expomultimix.co"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Quero Expor",
              "item": "https://www.expomultimix.co/quero-expor"
            }
          ]
        }}
      />
    </>
  );
}
