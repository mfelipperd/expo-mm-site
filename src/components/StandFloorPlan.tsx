"use client";

import { useEffect, useRef, useState } from "react";
import type { StandMapItem } from "@/lib/fairsApi";

interface StandFloorPlanProps {
  svgUrl: string;
  stands: StandMapItem[];
  selectedStandNumbers: number[];
  onToggleStand: (stand: StandMapItem, sizeLabel: string) => void;
  /** Nome do tipo de stand (ex: "Stand 3x3") a destacar na planta — não impede selecionar outros. */
  highlightTypeName?: string | null;
}

interface StandGeometry {
  x: number;
  y: number;
  width: number;
  height: number;
  transform: string | null;
  rotationDeg: number;
  /** Tipo lido direto da forma do stand na planta (quadrado = 3x3, retangular = 2x3) —
   * usado sempre que o backend ainda não tem o tipo/preço associado a esse stand. */
  derivedSize: "2x3" | "3x3";
}

const STAND_GROUP_ID_REGEX = /^stand_(\d+)$/i;

const COLOR_AVAILABLE_2X3 = "#00BCD4"; // brand-cyan
const COLOR_AVAILABLE_3X3 = "#E91E63"; // brand-pink — o mais escolhido
const COLOR_AVAILABLE_OTHER = "#8B5CF6"; // violeta — qualquer outro tipo (nem 2x3, nem 3x3)
const COLOR_SELECTED = "#FF7043"; // brand-orange
const COLOR_UNAVAILABLE = "#94a3b8";

function isTipo3x3(name?: string | null): boolean {
  return !!name && name.toLowerCase().includes("3x3");
}

function isTipo2x3(name?: string | null): boolean {
  return !!name && name.toLowerCase().includes("2x3");
}

function extractSizeLabel(name?: string | null): string {
  const match = name?.match(/(\d+\s*[x×]\s*\d+)/i);
  return match ? match[1].replace(/\s+/g, "").toLowerCase() : "";
}

function extractRotationDeg(transform: string | null): number {
  const match = transform?.match(/rotate\(\s*(-?[\d.]+)/);
  return match ? Number(match[1]) : 0;
}

/**
 * Planta SVG interativa do pavilhão. A planta original (paredes, estrutura,
 * textos decorativos) é injetada como background estático via
 * dangerouslySetInnerHTML. Por cima dela, uma camada própria em SVG — só com
 * <rect>/<text>/<image> React normais, controlados 100% por estado — desenha
 * cada stand clicável. Nada é estilizado via manipulação direta do DOM: cor,
 * seleção, destaque e o texto no meio de cada stand são só função do estado
 * React, então uma re-renderização nunca deixa a planta "presa" num estado
 * visual inconsistente.
 */
export function StandFloorPlan({
  svgUrl,
  stands,
  selectedStandNumbers,
  onToggleStand,
  highlightTypeName,
}: StandFloorPlanProps) {
  const [loaded, setLoaded] = useState<{
    url: string;
    markup: string | null;
    viewBox: string;
    geometry: Map<number, StandGeometry>;
    error: boolean;
  } | null>(null);

  const current = loaded?.url === svgUrl ? loaded : null;
  const svgMarkup = current?.markup ?? null;
  const viewBox = current?.viewBox ?? "0 0 100 100";
  const geometry = current?.geometry ?? new Map<number, StandGeometry>();
  const loadError = current?.error ?? false;

  useEffect(() => {
    let cancelled = false;

    fetch(svgUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`SVG respondeu ${res.status}`);
        return res.text();
      })
      .then((text) => {
        if (cancelled) return;

        const doc = new DOMParser().parseFromString(text, "image/svg+xml");
        const svgEl = doc.querySelector("svg");
        const parsedViewBox = svgEl?.getAttribute("viewBox") ?? "0 0 100 100";

        const parsedGeometry = new Map<number, StandGeometry>();
        doc.querySelectorAll("[id]").forEach((el) => {
          const match = el.id.match(STAND_GROUP_ID_REGEX);
          if (!match) return;
          const rect = el.querySelector("rect");
          if (!rect) return;

          const transform = rect.getAttribute("transform");
          const width = Number(rect.getAttribute("width") ?? 0);
          const height = Number(rect.getAttribute("height") ?? 0);
          // Retangular (proporção baixa) = 2x3; próximo de quadrado = 3x3.
          const derivedSize: "2x3" | "3x3" =
            width > 0 && height / width > 0.85 ? "3x3" : "2x3";

          parsedGeometry.set(Number(match[1]), {
            x: Number(rect.getAttribute("x") ?? 0),
            y: Number(rect.getAttribute("y") ?? 0),
            width,
            height,
            transform,
            rotationDeg: extractRotationDeg(transform),
            derivedSize,
          });
        });

        setLoaded({ url: svgUrl, markup: text, viewBox: parsedViewBox, geometry: parsedGeometry, error: false });
      })
      .catch(() => {
        if (!cancelled) {
          setLoaded({ url: svgUrl, markup: null, viewBox: "0 0 100 100", geometry: new Map(), error: true });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [svgUrl]);

  // Animação de "tutorial": assim que a planta carrega, seleciona e desseleciona
  // vários stands aleatórios sozinha (só estado — nada de DOM manual), pra
  // deixar claro que dá pra clicar neles, e só então mostra a dica em texto.
  const [demoStandNumbers, setDemoStandNumbers] = useState<number[]>([]);
  const [hintVisible, setHintVisible] = useState(false);
  const demoPlayedRef = useRef(false);

  const HINT_DISPLAY_MS = 2600;
  const DEMO_SAMPLE_SIZE = 8;

  useEffect(() => {
    if (demoPlayedRef.current || !svgMarkup || stands.length === 0) return;
    demoPlayedRef.current = true;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const showThenHideHint = (delay: number) => {
      timers.push(setTimeout(() => setHintVisible(true), delay));
      timers.push(setTimeout(() => setHintVisible(false), delay + HINT_DISPLAY_MS));
    };

    const available = stands.filter((s) => s.isAvailable);
    if (available.length === 0) {
      showThenHideHint(0);
      return () => timers.forEach(clearTimeout);
    }

    const sampleSize = Math.min(DEMO_SAMPLE_SIZE, available.length);
    const demoNumbers = [...available]
      .sort(() => Math.random() - 0.5)
      .slice(0, sampleSize)
      .map((s) => s.standNumber);

    demoNumbers.forEach((num, i) => {
      timers.push(
        setTimeout(() => setDemoStandNumbers((prev) => [...prev, num]), 300 + i * 220)
      );
    });
    const demoEndsAt = 300 + demoNumbers.length * 220 + 600;
    timers.push(setTimeout(() => setDemoStandNumbers([]), demoEndsAt));
    showThenHideHint(demoEndsAt + 300);

    return () => timers.forEach(clearTimeout);
  }, [svgMarkup, stands]);

  if (loadError) {
    return (
      <p className="text-sm text-red-400 py-8 text-center">
        Não foi possível carregar a planta do pavilhão agora.
      </p>
    );
  }

  if (!svgMarkup) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/40" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ background: COLOR_AVAILABLE_3X3 }} />
          3x3 (mais escolhido)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ background: COLOR_AVAILABLE_2X3 }} />
          2x3
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ background: COLOR_AVAILABLE_OTHER }} />
          Outro tipo
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ background: COLOR_SELECTED }} />
          Selecionado
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ background: COLOR_UNAVAILABLE }} />
          Ocupado
        </span>
      </div>

      <div className="relative">
        <div className="w-full overflow-x-auto rounded-xl border border-white/10 bg-white">
          <div className="min-w-140 relative p-3">
            {/* Fundo estático da planta: paredes, estrutura e demais elementos decorativos */}
            <div
              className="[&_svg]:h-auto [&_svg]:w-full"
              dangerouslySetInnerHTML={{ __html: svgMarkup }}
            />

            {/* Camada interativa: cada stand é um <g> React comum, controlado por estado */}
            <svg
              viewBox={viewBox}
              className="absolute inset-0 h-full w-full"
              style={{ top: "0.75rem", left: "0.75rem", width: "calc(100% - 1.5rem)", height: "calc(100% - 1.5rem)" }}
            >
              {stands.map((stand) => {
                const geo = geometry.get(stand.standNumber);
                if (!geo) return null;

                const isSelected =
                  selectedStandNumbers.includes(stand.standNumber) ||
                  demoStandNumbers.includes(stand.standNumber);
                const hasLogo = !stand.isAvailable && !!stand.exhibitorLogoUrl;

                // Tipo efetivo: usa o que o financeiro já associou ao stand quando
                // existir; a maioria dos stands ainda não tem isso configurado, então
                // cai pra forma real do stand na planta (quadrado = 3x3, retangular =
                // 2x3) — lida direto do SVG, sem depender do backend pra diferenciar.
                const hasBackendType = !!stand.standConfigurationName;
                const is3x3 = hasBackendType
                  ? isTipo3x3(stand.standConfigurationName)
                  : geo.derivedSize === "3x3";
                const is2x3 = hasBackendType
                  ? isTipo2x3(stand.standConfigurationName)
                  : geo.derivedSize === "2x3";

                const fill = hasLogo
                  ? "#ffffff"
                  : isSelected
                    ? COLOR_SELECTED
                    : !stand.isAvailable
                      ? COLOR_UNAVAILABLE
                      : is3x3
                        ? COLOR_AVAILABLE_3X3
                        : is2x3
                          ? COLOR_AVAILABLE_2X3
                          : COLOR_AVAILABLE_OTHER;

                const matchesHighlight =
                  !!highlightTypeName && stand.standConfigurationName === highlightTypeName;
                const isDimmed =
                  !!highlightTypeName && stand.isAvailable && !matchesHighlight && !isSelected;
                const shouldPulse = matchesHighlight && stand.isAvailable && !isSelected;

                const sizeLabel = extractSizeLabel(stand.standConfigurationName) || geo.derivedSize;
                const cx = geo.x + geo.width / 2;
                const cy = geo.y + geo.height / 2;
                const upright = `rotate(${-geo.rotationDeg}, ${cx}, ${cy})`;
                const logoW = geo.width * 0.8;
                const logoH = geo.height * 0.8;

                const tooltip = `Stand ${stand.standNumber} — ${sizeLabel}${
                  stand.isAvailable
                    ? " (disponível)"
                    : ` — ocupado${stand.exhibitorName ? ` por ${stand.exhibitorName}` : ""}`
                }`;

                return (
                  <g
                    key={stand.id}
                    style={{
                      cursor: stand.isAvailable ? "pointer" : "not-allowed",
                      opacity: isDimmed ? 0.35 : 1,
                      transition: "opacity 0.2s ease",
                    }}
                    onClick={() => stand.isAvailable && onToggleStand(stand, sizeLabel)}
                  >
                    <title>{tooltip}</title>
                    <g transform={geo.transform ?? undefined}>
                      <rect
                        x={geo.x}
                        y={geo.y}
                        width={geo.width}
                        height={geo.height}
                        className={shouldPulse ? "stand-pulse-highlight" : undefined}
                        style={{ fill, transition: "fill 0.15s ease" }}
                      />
                      <g transform={upright}>
                        {hasLogo ? (
                          <image
                            href={stand.exhibitorLogoUrl!}
                            x={cx - logoW / 2}
                            y={cy - logoH / 2}
                            width={logoW}
                            height={logoH}
                            preserveAspectRatio="xMidYMid meet"
                          />
                        ) : (
                          <text
                            x={cx}
                            y={cy}
                            textAnchor="middle"
                            dominantBaseline="central"
                            style={{
                              fill: "#ffffff",
                              fontWeight: 900,
                              fontSize: isSelected
                                ? Math.min(geo.width, geo.height) * 0.3
                                : Math.min(geo.width, geo.height) * 0.45,
                              userSelect: "none",
                            }}
                          >
                            {isSelected ? sizeLabel : stand.standNumber}
                          </text>
                        )}
                      </g>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <div
          aria-hidden={!hintVisible}
          className={`absolute inset-0 flex items-center justify-center px-6 pointer-events-none transition-opacity duration-700 ${
            hintVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-center text-2xl sm:text-4xl font-black text-white uppercase leading-tight bg-black/75 backdrop-blur-sm rounded-3xl px-6 py-5 sm:px-10 sm:py-8 shadow-2xl">
            👆 Selecione quantos
            <br />
            stands quiser
          </p>
        </div>
      </div>
    </div>
  );
}
