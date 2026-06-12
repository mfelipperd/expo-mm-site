import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import NotificationProvider from "@/components/NotificationProvider";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.expomultimix.com.br"),
  title: {
    template: "%s | Expo MultiMix 2026",
    default: "Expo MultiMix 2026 | Maior Feira de Negócios do Norte do Brasil",
  },
  description: "Feira B2B de atacado em Belém e Manaus. Compre direto da fábrica, encontre fornecedores de utilidades domésticas, brinquedos, festas e variedades. Credenciamento gratuito para lojistas.",
  icons: {
    icon: "/assets/logo EMM_Prancheta 1.png",
    shortcut: "/assets/logo EMM_Prancheta 1.png",
    apple: "/assets/logo EMM_Prancheta 1.png",
  },
  keywords: [
    "Expo MultiMix 2026",
    "feira de negócios Belém",
    "feira de negócios Manaus",
    "fornecedores atacado Norte",
    "comprar direto da fábrica Belém",
    "comprar direto da fábrica Manaus",
    "feira B2B Região Norte",
    "atacado utilidades domésticas",
    "atacado brinquedos Pará",
    "fornecedor lojista Amazônia",
    "feira multissetorial Norte",
    "credenciamento lojista gratuito",
    "onde encontrar fornecedores no Norte do Brasil",
    "maior feira de atacado da Amazônia",
    "feira de atacado Pará Amazonas",
    "renovar estoque lojista Norte",
    "feira de negócios 2026 Norte",
    "indústrias e importadoras Belém Manaus",
    "feira para lojista com CNPJ",
    "compra e venda atacado Região Norte",
    "evento de negócios Belém 2026",
    "evento de negócios Manaus 2026",
    "onde comprar no atacado em Belém",
    "onde comprar no atacado em Manaus",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Expo MultiMix",
    title: "Expo MultiMix 2026 | Maior Feira de Negócios do Norte do Brasil",
    description: "Feira B2B de atacado em Belém (ago/2026) e Manaus (jun/2026). Compre direto da fábrica com condições exclusivas. Credenciamento gratuito para lojistas.",
    images: [
      {
        url: "/assets/fachada-belem-emm.jpeg",
        width: 1200,
        height: 630,
        alt: "Expo MultiMix — Feira de Negócios Belém e Manaus",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Expo MultiMix 2026 | Maior Feira de Negócios do Norte",
    description: "Feira B2B de atacado em Belém e Manaus. Compre direto da fábrica. Credenciamento gratuito.",
    images: ["/assets/fachada-belem-emm.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NotificationProvider>
          {children}
        </NotificationProvider>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Expo MultiMix",
            "alternateName": ["EMM", "Expo MultiMix 2026", "Feira de Negócios Belém Manaus"],
            "url": "https://www.expomultimix.com.br",
            "description": "A maior feira de negócios B2B da Região Norte do Brasil, realizada em Belém (PA) e Manaus (AM).",
            "inLanguage": "pt-BR",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://www.expomultimix.com.br/faq?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Páginas principais da Expo MultiMix",
            "itemListElement": [
              {
                "@type": "SiteLinksSearchBox",
                "target": "https://www.expomultimix.com.br/faq?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            ]
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": "https://www.expomultimix.com.br/#webpage",
            "url": "https://www.expomultimix.com.br",
            "name": "Expo MultiMix 2026 | Maior Feira de Negócios do Norte do Brasil",
            "description": "Feira B2B de atacado em Belém e Manaus. Compre direto da fábrica, encontre fornecedores de utilidades domésticas, brinquedos, festas e variedades. Credenciamento gratuito para lojistas.",
            "isPartOf": { "@id": "https://www.expomultimix.com.br" },
            "about": { "@type": "Thing", "name": "Feira de Negócios B2B Região Norte" },
            "hasPart": [
              {
                "@type": "WebPage",
                "url": "https://www.expomultimix.com.br/manaus",
                "name": "Expo MultiMix Manaus 2026",
                "description": "Feira de negócios em Manaus. 9 a 11 de junho de 2026. Centro de Convenções Vasco Vasques. Credenciamento gratuito para lojistas."
              },
              {
                "@type": "WebPage",
                "url": "https://www.expomultimix.com.br/belem",
                "name": "Expo MultiMix Belém 2026",
                "description": "Feira de negócios em Belém. 18 a 20 de agosto de 2026. Estação das Docas. Credenciamento gratuito para lojistas."
              },
              {
                "@type": "WebPage",
                "url": "https://www.expomultimix.com.br/quero-expor",
                "name": "Seja um Expositor — Reserve seu Stand",
                "description": "Indústrias e importadoras: reserve seu stand na maior feira de negócios do Norte do Brasil em Belém e Manaus."
              },
              {
                "@type": "WebPage",
                "url": "https://www.expomultimix.com.br/faq",
                "name": "Perguntas Frequentes — Expo MultiMix",
                "description": "Tire suas dúvidas sobre credenciamento, datas, locais, stands e muito mais sobre a Expo MultiMix 2026."
              }
            ]
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "O que é a Expo MultiMix?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A Expo MultiMix é a maior feira de negócios B2B da Região Norte do Brasil, que conecta indústrias e importadoras diretamente com lojistas e varejistas em Belém (Pará) e Manaus (Amazonas). O evento permite que lojistas comprem produtos direto da fábrica com condições exclusivas de preço e pagamento."
                }
              },
              {
                "@type": "Question",
                "name": "Quando e onde acontece a Expo MultiMix 2026?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A Expo MultiMix 2026 acontece em duas cidades: Manaus (AM) de 9 a 11 de junho de 2026, no Centro de Convenções Vasco Vasques; e Belém (PA) de 18 a 20 de agosto de 2026, na Estação das Docas."
                }
              },
              {
                "@type": "Question",
                "name": "Como faço o credenciamento para a Expo MultiMix?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "O credenciamento para visitar a Expo MultiMix é gratuito e exclusivo para lojistas com CNPJ. Basta acessar o site expomultimix.com.br, escolher a cidade (Belém ou Manaus) e preencher o formulário de credenciamento online. Não é necessário pagar ingresso."
                }
              },
              {
                "@type": "Question",
                "name": "Quais produtos são vendidos na Expo MultiMix?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Na Expo MultiMix são comercializados produtos das categorias: utilidades domésticas, brinquedos, puericultura, artigos para festas, variedades, decoração, descartáveis e pet. Os produtos são vendidos no atacado, diretamente por indústrias e importadoras nacionais."
                }
              },
              {
                "@type": "Question",
                "name": "Quem pode participar da Expo MultiMix?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Podem participar lojistas, varejistas, empreendedores e compradores B2B com CNPJ ativo. O acesso é exclusivo para o setor comercial — não é aberto ao público geral."
                }
              },
              {
                "@type": "Question",
                "name": "Como expor na Expo MultiMix?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Indústrias, importadoras e distribuidoras interessadas em expor na Expo MultiMix podem reservar um stand pelo site na página 'Quero Expor' (expomultimix.com.br/quero-expor). Há opções de stands 2x3m e 3x3m, montados e prontos para uso nas cidades de Belém e Manaus."
                }
              },
              {
                "@type": "Question",
                "name": "A Expo MultiMix é a maior feira de atacado do Norte do Brasil?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sim. A Expo MultiMix é reconhecida como a maior feira multissetorial de negócios B2B da Região Norte do Brasil, reunindo centenas de expositores e milhares de lojistas por edição nas cidades de Belém e Manaus."
                }
              },
            ]
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Expo MultiMix",
            "url": "https://www.expomultimix.com.br",
            "logo": "https://www.expomultimix.com.br/assets/logo EMM_Prancheta 1.png",
            "description": "Maior feira multissetorial B2B da Região Norte do Brasil, conectando indústrias, importadoras e lojistas em Belém (PA) e Manaus (AM).",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+55-91-98130-6900",
              "contactType": "customer service",
              "availableLanguage": "Portuguese"
            },
            "areaServed": ["Belém", "Manaus", "Pará", "Amazonas", "Região Norte"],
            "sameAs": [
              "https://www.instagram.com/expomultimix",
              "https://www.facebook.com/expomultimix"
            ]
          }}
        />
      </body>
    </html>
  );
}
