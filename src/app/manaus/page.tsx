import CityTemplate from "@/components/CityTemplate";
import { Sparkles, Handshake, BadgeDollarSign } from "lucide-react";
import { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import {
  fetchFair,
  formatFairDates,
  formatFairSchedule,
  formatFairLocation,
  buildMapEmbedUrl,
} from "@/lib/fairsApi";

export const metadata: Metadata = {
  title: "Feira de Negócios em Manaus 2026 — Fornecedores e Atacado no Amazonas",
  description: "A maior feira de negócios de Manaus. Fornecedores de brinquedos, puericultura, utilidades domésticas, festas e variedades. Compre direto da fábrica. 9, 10 e 11 de junho de 2026 — Centro de Convenções Vasco Vasques.",
  alternates: { canonical: "https://www.expomultimix.com.br/manaus" },
  keywords: [
    "feira de negócios em Manaus",
    "fornecedores atacado Manaus",
    "comprar direto da fábrica Manaus",
    "atacado brinquedos Manaus Amazonas",
    "atacado puericultura Norte",
    "feira B2B Manaus 2026",
    "lojista atacado Amazonas",
    "credenciamento feira Manaus",
    "Vasco Vasques feira",
    "fornecedor artigos festa atacado Manaus",
    "distribuidora utilidades domésticas Amazonas",
  ],
  openGraph: {
    url: "https://www.expomultimix.com.br/manaus",
    title: "Feira de Negócios em Manaus 2026 — Expo MultiMix",
    description: "Compre direto da fábrica no Centro de Convenções Vasco Vasques. 9 a 11 de junho de 2026. Credenciamento gratuito para lojistas.",
    images: [{ url: "/assets/fachada-manaus-emm.jpeg", width: 1200, height: 630, alt: "Expo MultiMix Manaus 2026" }],
  },
};

export default async function ManausPage() {
  const fairId = process.env.NEXT_PUBLIC_FAIR_ID_MANAUS || "";
  const fair = await fetchFair(fairId);

  const dates = fair
    ? formatFairDates(fair.startDate, fair.endDate) || "09, 10 E 11 DE JUNHO"
    : "09, 10 E 11 DE JUNHO";

  const schedule = fair?.dailySchedule?.length
    ? formatFairSchedule(fair.dailySchedule) || "13H ÀS 20H"
    : "13H ÀS 20H";

  const location = fair?.address
    ? formatFairLocation(fair.address) || "CENTRO DE CONVENÇÕES VASCO VASQUES"
    : "CENTRO DE CONVENÇÕES VASCO VASQUES";

  const mapUrl = fair
    ? buildMapEmbedUrl(fair.coordinates, fair.address?.venue, fair.address?.city) ||
      "https://maps.google.com/maps?q=Centro+de+Convenções+Vasco+Vasques,Manaus&t=&z=15&ie=UTF8&iwloc=&output=embed"
    : "https://maps.google.com/maps?q=Centro+de+Convenções+Vasco+Vasques,Manaus&t=&z=15&ie=UTF8&iwloc=&output=embed";

  const heroImage = fair?.bannerUrl || "/assets/fachada-manaus-emm.jpeg";

  const aboutText = fair?.description ||
    "A Expo MultiMix chegou em Manaus! Com as maiores marcas e indústrias de todo o Brasil, a EMM 2025 está repleta de novidades para os lojistas e empreendedores do Amazonas. É uma oportunidade única de ver e testar os produtos em primeira mão e descobrir novas possibilidades.";

  return (
    <>
    <CityTemplate
      cityName="MANAUS"
      fairId={fairId}
      heroTitle={
        <>
          CONHEÇA A <br />
            EXPO MULTIMIX 2026
        </>
      }
      heroTagline="É o momento perfeito para renovar seus estoques."
      heroImage={heroImage}
      aboutText={aboutText}
      benefits={[
        {
          title: "Experiência Real",
          desc: "Veja e teste os produtos em primeira mão antes de comprar.",
          icon: <Sparkles className="text-brand-pink" />
        },
        {
          title: "Direto da Fábrica",
          desc: "Encontre diretamente com os gerentes das fábricas.",
          icon: <Handshake className="text-brand-cyan" />
        },
        {
          title: "Ofertas Únicas",
          desc: "Consiga descontos imperdíveis disponíveis apenas no evento.",
          icon: <BadgeDollarSign className="text-brand-orange" />
        }
      ]}
      dates={dates}
      schedule={schedule}
      location={location}
      locationDescription="O maior e mais moderno espaço do gênero da Região Norte, com boa localização e estacionamento gratuito."
      mapEmbedUrl={mapUrl}
      industries={[
        "Utilidades Domésticas",
        "Brinquedos",
        "Puericultura",
        "Festas",
        "Variedades",
        "Decoração",
        "Descartáveis",
        "Pet"
      ]}
      expectedVisitors={fair?.expectedVisitors}
      expectedExhibitors={fair?.expectedExhibitors}
      transportLinks={fair?.transportLinks}
    />
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.expomultimix.com.br" },
          { "@type": "ListItem", "position": 2, "name": "Feira Manaus 2026", "item": "https://www.expomultimix.com.br/manaus" },
        ],
      }}
    />
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Event",
        "name": "Expo MultiMix Manaus 2026",
        "startDate": fair?.startDate ? `${fair.startDate}T13:00:00-04:00` : "2026-06-09T13:00:00-04:00",
        "endDate": fair?.endDate ? `${fair.endDate}T20:00:00-04:00` : "2026-06-11T20:00:00-04:00",
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "description": "A maior feira de negócios B2B do Amazonas. Fornecedores de brinquedos, puericultura, utilidades domésticas, festas, variedades e pet. Compre direto da fábrica com condições exclusivas para lojistas.",
        "image": "https://www.expomultimix.com.br/assets/fachada-manaus-emm.jpeg",
        "url": "https://www.expomultimix.com.br/manaus",
        "location": {
          "@type": "Place",
          "name": fair?.address?.venue || "Centro de Convenções Vasco Vasques",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": fair?.address?.street
              ? `${fair.address.street}${fair.address.number ? `, ${fair.address.number}` : ""}`
              : "Av. Constantino Nery, 5001",
            "addressLocality": fair?.address?.city || "Manaus",
            "addressRegion": fair?.address?.state || "AM",
            "postalCode": fair?.address?.zipCode || "69050-001",
            "addressCountry": "BR",
          },
        },
        "organizer": {
          "@type": "Organization",
          "name": "Expo MultiMix",
          "url": "https://www.expomultimix.com.br",
        },
        "offers": {
          "@type": "Offer",
          "url": "https://www.expomultimix.com.br/manaus",
          "price": "0",
          "priceCurrency": "BRL",
          "availability": "https://schema.org/InStock",
          "validFrom": "2026-01-01",
          "description": "Credenciamento gratuito para lojistas com CNPJ",
        },
        "audience": {
          "@type": "Audience",
          "audienceType": "Lojistas, Varejistas, Compradores B2B, Empreendedores",
        },
        "keywords": "feira de negócios Manaus, fornecedores atacado Amazonas, comprar direto da fábrica, lojista Manaus",
      }}
    />
    </>
  );
}
