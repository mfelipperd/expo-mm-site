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
  title: {
    template: "%s | Expo MultiMix 2026",
    default: "Expo MultiMix 2026 | A Maior Feira Multissetorial do Norte",
  },
  description: "O ponto de encontro estratégico para lojistas e indústrias em Belém e Manaus. Renove seu estoque e fortaleça parcerias.",
  icons: {
    icon: "/assets/logo EMM_Prancheta 1.png",
    shortcut: "/assets/logo EMM_Prancheta 1.png",
    apple: "/assets/logo EMM_Prancheta 1.png",
  },
  keywords: [
    "Feira multissetorial Norte 2026",
    "Fornecedores atacado Região Norte",
    "Expo MultiMix",
    "Feira B2B",
  ],
  openGraph: {
    images: ["/assets/fachada-belem-emm.jpeg"],
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
            "url": "https://www.expomultimix.co",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://www.expomultimix.co/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }} 
        />
      </body>
    </html>
  );
}
