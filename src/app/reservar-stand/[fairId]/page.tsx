import { Metadata } from "next";
import ReservarStandContent from "@/components/ReservarStandContent";

export const metadata: Metadata = {
  title: "Reserve seu Stand — Escolha no Mapa | Expo MultiMix",
  description: "Escolha a posição do seu stand direto na planta interativa do pavilhão.",
  robots: { index: false, follow: false },
};

export default async function ReservarStandPage({
  params,
}: {
  params: Promise<{ fairId: string }>;
}) {
  const { fairId } = await params;
  return <ReservarStandContent fairId={fairId} />;
}
