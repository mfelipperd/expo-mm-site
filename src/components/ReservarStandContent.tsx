"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Store, CheckCircle2, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloating from "@/components/WhatsAppFloating";
import { StandFloorPlan } from "@/components/StandFloorPlan";
import { openWhatsApp } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";
import { fetchFair, fetchStandMap, type FairDetail, type StandMapItem } from "@/lib/fairsApi";

function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function isTipo3x3(name?: string | null): boolean {
  return !!name && name.toLowerCase().includes("3x3");
}

type SelectedStand = StandMapItem & { sizeLabel: string };

export default function ReservarStandContent({ fairId }: { fairId: string }) {
  const router = useRouter();
  const [fair, setFair] = useState<FairDetail | null>(null);
  const [stands, setStands] = useState<StandMapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStands, setSelectedStands] = useState<SelectedStand[]>([]);
  const [highlightType, setHighlightType] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchFair(fairId), fetchStandMap(fairId)]).then(([fairData, standMap]) => {
      setFair(fairData);
      setStands(standMap);
      setLoading(false);
    });
  }, [fairId]);

  // Tipos com pelo menos um stand disponível, 3x3 sempre primeiro (é o mais escolhido).
  const typeOptions = Array.from(
    new Map(
      stands
        .filter((s) => s.isAvailable && s.standConfigurationName)
        .map((s) => [s.standConfigurationName!, s.standConfigurationName!])
    ).values()
  ).sort((a, b) => (isTipo3x3(a) ? -1 : isTipo3x3(b) ? 1 : a.localeCompare(b)));

  const handleToggleStand = (stand: StandMapItem, sizeLabel: string) => {
    setSelectedStands((prev) => {
      const alreadySelected = prev.some((s) => s.id === stand.id);
      if (alreadySelected) return prev.filter((s) => s.id !== stand.id);
      return [...prev, { ...stand, sizeLabel }];
    });
    // Clicar num stand de um tipo já destaca os outros do mesmo tipo na planta,
    // sem impedir escolher stands de outro tipo depois.
    if (stand.standConfigurationName) setHighlightType(stand.standConfigurationName);
    trackEvent("cta_click", { label: "selecionar_stand_mapa" });
  };

  const handleRemoveStand = (standId: number) => {
    setSelectedStands((prev) => prev.filter((s) => s.id !== standId));
  };

  const totalPrice = selectedStands.reduce(
    (sum, s) => sum + (s.standConfigurationPrice ?? 0),
    0
  );

  const handleConfirm = () => {
    if (selectedStands.length === 0) return;
    trackEvent("cta_click", { label: "confirmar_stand_whatsapp" });
    const lista = selectedStands
      .map((s) => `Stand ${s.standNumber} (${s.sizeLabel})`)
      .join(", ");
    const totalTexto = totalPrice > 0 ? ` Total: ${formatPrice(totalPrice)}.` : "";
    openWhatsApp(
      `Olá! Quero reservar ${selectedStands.length > 1 ? "os stands" : "o stand"} ${lista} na ${fair?.name ?? "feira"}.${totalTexto}`
    );
  };

  return (
    <main className="min-h-screen bg-brand-blue selection:bg-brand-cyan/30 selection:text-white">
      <Navbar
        onVisitClick={() => router.push("/")}
        onExposeClick={() => router.push("/quero-expor")}
        onContactClick={() => openWhatsApp()}
        exposeButtonText="VER TODOS OS STANDS"
      />

      <section className="pt-28 pb-16 max-w-5xl mx-auto px-4 sm:px-6">
        <button
          type="button"
          onClick={() => router.push("/quero-expor")}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm font-bold mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Voltar
        </button>

        <div className="text-center mb-8">
          <p className="text-brand-orange font-bold tracking-widest text-sm uppercase mb-2">
            Reserva de stand
          </p>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            {loading ? "Carregando..." : fair?.name ?? "Feira não encontrada"}
          </h1>
          <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
            Clique em um stand disponível na planta abaixo pra escolher a posição no pavilhão.
          </p>
        </div>

        {!loading && !fair?.floorPlanUrl ? (
          <p className="text-center text-gray-400 py-12">
            A planta interativa dessa edição ainda não está disponível.{" "}
            <button
              type="button"
              onClick={() => openWhatsApp("Comercial")}
              className="text-brand-orange font-bold underline"
            >
              Fale com um consultor
            </button>
            .
          </p>
        ) : loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/40" />
          </div>
        ) : (
          <div className="space-y-6">
            {typeOptions.length > 1 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wide mr-1">
                  Destacar tipo:
                </span>
                {typeOptions.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setHighlightType((prev) => (prev === type ? null : type))}
                    className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wide transition-all ${
                      highlightType === type
                        ? "bg-brand-orange text-white"
                        : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}

            <StandFloorPlan
              svgUrl={fair!.floorPlanUrl!}
              stands={stands}
              selectedStandNumbers={selectedStands.map((s) => s.standNumber)}
              onToggleStand={handleToggleStand}
              highlightTypeName={highlightType}
            />

            <div className="rounded-2xl glass border border-white/10 p-5 sm:p-6 space-y-4">
              {selectedStands.length > 0 ? (
                <>
                  <div className="space-y-2">
                    {selectedStands.map((stand) => (
                      <div
                        key={stand.id}
                        className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2.5"
                      >
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                          <Store className="text-brand-orange" size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-white text-sm flex items-center gap-2 flex-wrap">
                            Stand {stand.standNumber}
                            {isTipo3x3(stand.sizeLabel) && (
                              <span className="text-[9px] font-black uppercase tracking-widest bg-brand-orange text-white px-2 py-0.5 rounded-full">
                                ⭐ Mais escolhido
                              </span>
                            )}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {stand.sizeLabel}
                            {stand.standConfigurationPrice != null &&
                              ` — ${formatPrice(stand.standConfigurationPrice)}`}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveStand(stand.id)}
                          className="text-gray-500 hover:text-white p-1 shrink-0"
                          aria-label={`Remover Stand ${stand.standNumber}`}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between pt-2 border-t border-white/10">
                    {totalPrice > 0 && (
                      <p className="text-white font-black">
                        Total: <span className="text-brand-orange">{formatPrice(totalPrice)}</span>
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={handleConfirm}
                      className="bg-brand-orange text-white px-6 py-4 rounded-xl font-black text-sm uppercase tracking-wide hover:scale-105 transition-transform inline-flex items-center justify-center gap-2 whitespace-nowrap sm:ml-auto"
                    >
                      <CheckCircle2 size={18} />
                      Confirmar {selectedStands.length > 1 ? `${selectedStands.length} stands` : "reserva"}
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-400 text-sm">
                  Nenhum stand selecionado ainda. Você pode escolher mais de um.
                </p>
              )}
            </div>
          </div>
        )}
      </section>

      <Footer onWhatsAppClick={() => openWhatsApp()} />
      <WhatsAppFloating onClick={() => openWhatsApp()} />
    </main>
  );
}
