import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const ogImageAlt = "Expo MultiMix 2026 — Seja um Expositor. Reserve seu stand em Belém e Manaus.";
export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = "image/png";

async function loadGoogleFont(weight: 700 | 900) {
  const css = await (
    await fetch(`https://fonts.googleapis.com/css2?family=Inter:wght@${weight}&text=SejaumExpositorGaranteStandExpoMultiMix2026VagasLimitadasApresentesuamarcaparamilhareslojistasCNPJevendadiretonoatacadoBELÉMAGOMANAUSJUNwww.expomultimix.com.br→1819202119`)
  ).text();
  const match = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/);
  if (!match) throw new Error(`failed to resolve font url for weight ${weight}`);
  const res = await fetch(match[1]);
  return res.arrayBuffer();
}

export async function renderQueroExporOgImage() {
  const [interBold, interBlack, backgroundBuffer, logoBuffer] = await Promise.all([
    loadGoogleFont(700),
    loadGoogleFont(900),
    readFile(join(process.cwd(), "public/assets/fachada-manaus-2.jpeg")),
    readFile(join(process.cwd(), "public/assets/logo EMM_Prancheta 1.png")),
  ]);

  const backgroundSrc = `data:image/jpeg;base64,${backgroundBuffer.toString("base64")}`;
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0A1E3B",
          fontFamily: "Inter",
        }}
      >
        {/* Background photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={backgroundSrc}
          alt=""
          width={1200}
          height={630}
          style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover" }}
        />
        {/* Darkening gradient for legibility */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            background:
              "linear-gradient(100deg, rgba(10,30,59,0.98) 0%, rgba(10,30,59,0.94) 40%, rgba(10,30,59,0.55) 70%, rgba(10,30,59,0.25) 100%)",
            display: "flex",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "44px 56px",
          }}
        >
          {/* Top row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "rgba(255,255,255,0.96)",
                borderRadius: 14,
                padding: "10px 18px",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoSrc} alt="" width={132} height={40} style={{ objectFit: "contain" }} />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "#E91E63",
                color: "#FFFFFF",
                borderRadius: 999,
                padding: "10px 22px",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              Vagas limitadas
            </div>
          </div>

          {/* Middle */}
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 760 }}>
            <div
              style={{
                display: "flex",
                color: "#FFFFFF",
                fontSize: 66,
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: -1,
              }}
            >
              Garanta seu stand de expositor
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 22,
                color: "#00E5FF",
                fontSize: 28,
                fontWeight: 700,
                lineHeight: 1.3,
              }}
            >
              Apresente sua marca para milhares de lojistas com CNPJ e venda direto no atacado.
            </div>

            <div style={{ display: "flex", gap: 16, marginTop: 34 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "rgba(255,255,255,0.12)",
                  border: "2px solid rgba(255,255,255,0.35)",
                  borderRadius: 999,
                  padding: "10px 24px",
                  color: "#FFFFFF",
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                Belém · 18-20 ago
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "rgba(255,255,255,0.12)",
                  border: "2px solid rgba(255,255,255,0.35)",
                  borderRadius: 999,
                  padding: "10px 24px",
                  color: "#FFFFFF",
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                Manaus · 9-11 jun
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", color: "rgba(255,255,255,0.75)", fontSize: 22, fontWeight: 700 }}>
              www.expomultimix.com.br
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "linear-gradient(90deg, #FF7043 0%, #E91E63 100%)",
                color: "#FFFFFF",
                borderRadius: 14,
                padding: "16px 32px",
                fontSize: 26,
                fontWeight: 900,
              }}
            >
              Reserve seu stand →
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...ogImageSize,
      fonts: [
        { name: "Inter", data: interBold, weight: 700, style: "normal" },
        { name: "Inter", data: interBlack, weight: 900, style: "normal" },
      ],
    }
  );
}
