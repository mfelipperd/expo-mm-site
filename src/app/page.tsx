import { Metadata } from "next";
import HomeContent from "@/components/HomeContent";

export const metadata: Metadata = {
  title: "Fornecedores Atacado e Feira de Negócios em Belém e Manaus",
  description: "Compre direto da fábrica na maior feira de negócios do Norte. Fornecedores de utilidades domésticas, brinquedos, festas e variedades. Belém (ago/2026) e Manaus (jun/2026). Credenciamento gratuito.",
  alternates: { canonical: "https://www.expomultimix.com.br" },
  keywords: [
    "feira de negócios Belém 2026",
    "feira de negócios Manaus 2026",
    "comprar direto da fábrica Norte",
    "fornecedores atacado Belém",
    "fornecedores atacado Manaus",
    "atacado brinquedos região Norte",
    "atacado utilidades domésticas Pará",
    "feira B2B lojista Amazônia",
    "abastecer estoque Natal Black Friday",
    "Expo MultiMix 2026",
  ],
  openGraph: {
    url: "https://www.expomultimix.com.br",
    title: "Expo MultiMix 2026 | Fornecedores e Feira de Negócios — Belém e Manaus",
    description: "Compre direto da fábrica na maior feira B2B do Norte. Credenciamento gratuito para lojistas.",
  },
};

export default function Home() {
  return <HomeContent />;
}
