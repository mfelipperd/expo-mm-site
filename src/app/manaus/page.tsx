import CityTemplate from "@/components/CityTemplate";
import { Sparkles, Handshake, BadgeDollarSign } from "lucide-react";

export default function ManausPage() {
  return (
    <CityTemplate
      cityName="MANAUS"
      fairId={process.env.NEXT_PUBLIC_FAIR_ID_MANAUS || ""} // Using Env Var
      heroTitle={
        <>
          CONHEÇA A <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-pink to-brand-orange">
            EXPO MULTIMIX 2025
          </span>
        </>
      }
      heroTagline="É o momento perfeito para renovar seus estoques."
      aboutText="A Expo MultiMix chegou em Manaus! Com as maiores marcas e indústrias de todo o Brasil, a EMM 2025 está repleta de novidades para os lojistas e empreendedores do Amazonas. É uma oportunidade única de ver e testar os produtos em primeira mão e descobrir novas possibilidades."
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
      dates="01, 02 E 03 DE JULHO"
      schedule="13H ÀS 20H"
      location="CENTRO DE CONVENÇÕES VASCO VASQUES"
      locationDescription="O maior e mais moderno espaço do gênero da Região Norte, com boa localização e estacionamento gratuito."
      mapEmbedUrl="https://maps.google.com/maps?q=Centro+de+Convenções+Vasco+Vasques,Manaus&t=&z=15&ie=UTF8&iwloc=&output=embed"
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
    />
  );
}
