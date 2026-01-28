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

export const metadata: Metadata = {
  title: "Expo MultiMix 2026 | A Maior Feira Multissetorial do Norte",
  description: "O ponto de encontro estratégico para lojistas e indústrias em Belém e Manaus. Renove seu estoque e fortaleça parcerias.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  );
}
