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
    "feira de negócios Belém",
    "feira de negócios Manaus",
    "fornecedores atacado Norte",
    "comprar direto da fábrica Belém",
    "comprar direto da fábrica Manaus",
    "feira B2B Região Norte",
    "atacado utilidades domésticas",
    "atacado brinquedos Pará",
    "fornecedor lojista Amazônia",
    "Expo MultiMix 2026",
    "feira multissetorial Norte",
    "credenciamento lojista gratuito",
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
            "url": "https://www.expomultimix.com.br",
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
