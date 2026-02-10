import { Metadata } from "next";
import HomeContent from "@/components/HomeContent";

export const metadata: Metadata = {
  title: "Fornecedores Atacado e Feira de Negócios",
  description: "Abasteça seu estoque para Natal e Black Friday 2026. A maior feira B2B de utilidades domésticas, brinquedos e variedades em Belém e Manaus.",
  keywords: [
    "Feira multissetorial Norte 2026", 
    "Fornecedores atacado Região Norte", 
    "Abastecer estoque para Natal", 
    "Black Friday 2026", 
    "Utilidades domésticas em Belém", 
    "Tendências para o varejo Norte 2026"
  ],
};

export default function Home() {
  return <HomeContent />;
}
