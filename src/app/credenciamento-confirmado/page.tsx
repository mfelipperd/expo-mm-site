import { Metadata } from "next";
import CredenciamentoConfirmadoContent from "@/components/CredenciamentoConfirmadoContent";

export const metadata: Metadata = {
  title: "Credenciamento Confirmado",
  robots: { index: false, follow: false },
};

export default function CredenciamentoConfirmadoPage() {
  return <CredenciamentoConfirmadoContent />;
}
