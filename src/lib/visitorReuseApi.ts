const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export interface CheckExistingVisitorResponse {
  exists: boolean;
  maskedEmail?: string;
  maskedPhone?: string;
  maskedCnpj?: string;
}

export interface RequestVisitorReuseResponse {
  sent: boolean;
}

function normalizeIdentifier(identifier: string): { param: "email" | "phone"; value: string } {
  const trimmed = identifier.trim();
  if (trimmed.includes("@")) return { param: "email", value: trimmed.toLowerCase() };
  return { param: "phone", value: trimmed.replace(/\D/g, "") };
}

export async function checkExistingVisitor(identifier: string): Promise<CheckExistingVisitorResponse> {
  if (!API_BASE) throw new Error("API não configurada.");
  const { param, value } = normalizeIdentifier(identifier);

  const res = await fetch(`${API_BASE}/visitors/public/check-existing?${param}=${encodeURIComponent(value)}`);

  if (res.status === 429) throw new Error("Muitas tentativas. Aguarde alguns minutos e tente novamente.");
  if (!res.ok) throw new Error("Não foi possível verificar o cadastro agora. Tente novamente em instantes.");

  return res.json();
}

export async function requestVisitorReuse(params: {
  identifier: string;
  fairId: string;
  phone: string;
}): Promise<RequestVisitorReuseResponse> {
  if (!API_BASE) throw new Error("API não configurada.");
  const { value: identifierValue } = normalizeIdentifier(params.identifier);

  const res = await fetch(`${API_BASE}/visitors/public/request-reuse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier: identifierValue,
      fairId: params.fairId,
      phone: params.phone.replace(/\D/g, ""),
    }),
  });

  if (res.status === 429) throw new Error("Muitas tentativas. Aguarde alguns minutos e tente novamente.");
  if (!res.ok) throw new Error("Não foi possível enviar o link de confirmação agora. Tente novamente em instantes.");

  return res.json();
}
