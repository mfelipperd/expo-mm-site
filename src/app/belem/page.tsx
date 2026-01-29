import CityTemplate from "@/components/CityTemplate";
import { Sparkles, Handshake, BadgeDollarSign } from "lucide-react";

export default function BelemPage() {
  return (
    <CityTemplate
      cityName="BELÉM"
      fairId="89d8a3ce-36b0-4fe9-b338-ca46fc5855e3" // Placeholder ID
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
      aboutText="A Estação das Docas receberá milhares de lojistas para o maior encontro de negócios da região. A Expo MultiMix é o ponto de encontro estratégico para quem busca renovar estoques com qualidade e prazos imbatíveis. Prepare-se para renovar seu estoque e fortalecer sua marca."
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
      dates="05, 06 e 07 DE AGOSTO"
      schedule="13H ÀS 21H"
      location="ESTAÇÃO DAS DOCAS"
      locationDescription="Um dos mais famosos pontos turísticos de Belém, com localização central, estacionamento, infraestrutura completa e um pôr-do-sol espetacular!"
      mapEmbedUrl="https://maps.google.com/maps?q=Estação+das+Docas,Belém&t=&z=15&ie=UTF8&iwloc=&output=embed" 
      industries={[
        "Utilidades Domésticas",
        "Brinquedos",
        "Puericultura",
        "Festas",
        "Variedades",
        "Decoração",
        "Descartáveis"
      ]}
    />
  );
}
