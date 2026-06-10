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
  title: "Feira de Negócios em Belém 2026 — Comprar Direto da Fábrica no Pará",
  description: "A maior feira de negócios de Belém. Encontre fornecedores de utilidades domésticas, brinquedos, festas e variedades. Compre direto da fábrica com condições exclusivas. 18, 19 e 20 de agosto de 2026 — Estação das Docas.",
  alternates: { canonical: "https://www.expomultimix.com.br/belem" },
  keywords: [
    "feira de negócios em Belém",
    "comprar direto da fábrica Belém",
    "fornecedores atacado Belém Pará",
    "atacado utilidades domésticas Belém",
    "atacado brinquedos Belém",
    "feira B2B Belém 2026",
    "lojista atacado Pará",
    "credenciamento feira Belém",
    "Estação das Docas feira",
    "fornecedor variedades decoração Belém",
    "distribuidora descartáveis Pará",
  ],
  openGraph: {
    url: "https://www.expomultimix.com.br/belem",
    title: "Feira de Negócios em Belém 2026 — Expo MultiMix",
    description: "Compre direto da fábrica na Estação das Docas. 18 a 20 de agosto de 2026. Credenciamento gratuito para lojistas.",
    images: [{ url: "/assets/fachada-belem-emm.jpeg", width: 1200, height: 630, alt: "Expo MultiMix Belém 2026" }],
  },
};

export default async function BelemPage() {
  const fairId = process.env.NEXT_PUBLIC_FAIR_ID_BELEM || "";
  const fair = await fetchFair(fairId);

  const dates = fair
    ? formatFairDates(fair.startDate, fair.endDate) || "18, 19 E 20 DE AGOSTO DE 2026"
    : "18, 19 E 20 DE AGOSTO DE 2026";

  const schedule = fair?.dailySchedule?.length
    ? formatFairSchedule(fair.dailySchedule) || "13H ÀS 21H"
    : "13H ÀS 21H";

  const location = fair?.address
    ? formatFairLocation(fair.address) || "ESTAÇÃO DAS DOCAS"
    : "ESTAÇÃO DAS DOCAS";

  const mapUrl = fair
    ? buildMapEmbedUrl(fair.coordinates, fair.address?.venue, fair.address?.city) ||
      "https://maps.google.com/maps?q=Estação+das+Docas,Belém&t=&z=15&ie=UTF8&iwloc=&output=embed"
    : "https://maps.google.com/maps?q=Estação+das+Docas,Belém&t=&z=15&ie=UTF8&iwloc=&output=embed";

  const heroImage = fair?.bannerUrl || "/assets/fachada-belem-emm.jpeg";

  const aboutText = fair?.description ||
    "A Estação das Docas receberá milhares de lojistas para o maior encontro de negócios da região. A Expo MultiMix é o ponto de encontro estratégico para quem busca renovar estoques com qualidade e prazos imbatíveis. Prepare-se para renovar seu estoque e fortalecer sua marca.";

  return (
    <>
    <CityTemplate
      cityName="BELÉM"
      fairId={fairId}
      heroTitle={
        <>
          A FEIRA MAIS <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-cyan to-blue-500">
            COMPLETA
          </span>{" "}
          DO PARÁ
        </>
      }
      heroTagline="O maior encontro de negócios da região Norte."
      heroImage={heroImage}
      aboutText={aboutText}
      benefits={[
        {
          title: "Novidades",
          desc: "Veja em primeira mão os lançamentos das maiores indústrias nacionais.",
          icon: <Sparkles className="text-brand-pink" />
        },
        {
          title: "Negócios",
          desc: "Negocie diretamente com gerentes e diretores, sem intermediários.",
          icon: <Handshake className="text-brand-cyan" />
        },
        {
          title: "Descontos",
          desc: "Condições exclusivas de pagamento que só acontecem na feira.",
          icon: <BadgeDollarSign className="text-brand-orange" />
        }
      ]}
      dates={dates}
      schedule={schedule}
      location={location}
      locationDescription="Um dos mais famosos pontos turísticos de Belém, com localização central, estacionamento, infraestrutura completa e um pôr-do-sol espetacular!"
      mapEmbedUrl={mapUrl}
      industries={[
        "Utilidades Domésticas",
        "Brinquedos",
        "Puericultura",
        "Festas",
        "Variedades",
        "Decoração",
        "Descartáveis"
      ]}
      expectedVisitors={fair?.expectedVisitors}
      expectedExhibitors={fair?.expectedExhibitors}
      transportLinks={fair?.transportLinks}
      exhibitorBrands={fair?.exhibitorBrands}
    />
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.expomultimix.com.br" },
          { "@type": "ListItem", "position": 2, "name": "Feira Belém 2026", "item": "https://www.expomultimix.com.br/belem" },
        ],
      }}
    />
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Event",
        "name": "Expo MultiMix Belém 2026",
        "startDate": fair?.startDate ? `${fair.startDate}T13:00:00-03:00` : "2026-08-18T13:00:00-03:00",
        "endDate": fair?.endDate ? `${fair.endDate}T21:00:00-03:00` : "2026-08-20T21:00:00-03:00",
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "description": "A maior feira de negócios B2B do Pará. Fornecedores de utilidades domésticas, brinquedos, festas, variedades e decoração. Compre direto da fábrica com condições exclusivas para lojistas.",
        "image": "https://www.expomultimix.com.br/assets/fachada-belem-emm.jpeg",
        "url": "https://www.expomultimix.com.br/belem",
        "location": {
          "@type": "Place",
          "name": fair?.address?.venue || "Estação das Docas — Pavilhão de Feiras",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": fair?.address?.street
              ? `${fair.address.street}${fair.address.number ? `, ${fair.address.number}` : ""}`
              : "Boulevard Castilhos França, s/n",
            "addressLocality": fair?.address?.city || "Belém",
            "addressRegion": fair?.address?.state || "PA",
            "postalCode": fair?.address?.zipCode || "66020-200",
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
          "url": "https://www.expomultimix.com.br/belem",
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
        "keywords": "feira de negócios Belém, fornecedores atacado Pará, comprar direto da fábrica, lojista Belém",
      }}
    />
    </>
  );
}
