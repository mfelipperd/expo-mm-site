const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

// ─── Token storage ────────────────────────────────────────────────────────────

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("emm_admin_token");
}

export function setToken(token: string) {
  localStorage.setItem("emm_admin_token", token);
}

export function clearToken() {
  localStorage.removeItem("emm_admin_token");
}

// ─── Authenticated fetch ──────────────────────────────────────────────────────

export async function adminFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (res.status === 401) {
    clearToken();
    throw new Error("UNAUTHORIZED");
  }
  return res;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginResponse {
  accessToken?: string;
  access_token?: string;
  token?: string;
}

export async function login(email: string, password: string): Promise<string> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("LOGIN_FAILED");
  const data: LoginResponse = await res.json();
  const token = data.accessToken ?? data.access_token ?? data.token;
  if (!token) throw new Error("NO_TOKEN");
  return token;
}

// ─── Clients (Expositores) ────────────────────────────────────────────────────

export interface ClientDto {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone?: string | null;
  website?: string | null;
  contactPerson?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  logoUrl?: string | null;
}

export interface CreateClientDto {
  name: string;
  cnpj: string;
  email: string;
  phone?: string;
  website?: string;
  contactPerson?: string;
}

export async function fetchClients(params?: { search?: string; fairId?: string }): Promise<ClientDto[]> {
  const qs = new URLSearchParams();
  if (params?.search) qs.set("search", params.search);
  if (params?.fairId) qs.set("fairId", params.fairId);
  const res = await adminFetch(`/finance/clients${qs.toString() ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error("FETCH_CLIENTS_FAILED");
  const data = await res.json();
  return Array.isArray(data) ? data : (data.data ?? []);
}

export async function createClient(dto: CreateClientDto): Promise<ClientDto> {
  const res = await adminFetch("/finance/clients", {
    method: "POST",
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "CREATE_CLIENT_FAILED");
  }
  return res.json();
}

export async function updateClient(id: string, dto: Partial<CreateClientDto>): Promise<ClientDto> {
  const res = await adminFetch(`/finance/clients/${id}`, {
    method: "PATCH",
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error("UPDATE_CLIENT_FAILED");
  return res.json();
}

export async function deleteClient(id: string): Promise<void> {
  const res = await adminFetch(`/finance/clients/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("DELETE_CLIENT_FAILED");
}

// ─── Client images ────────────────────────────────────────────────────────────

export interface ClientImageDto {
  id: string;
  clientId: string | null;
  registeredFairId: string | null;
  url: string;
  caption: string | null;
  createdAt: string;
}

export async function uploadClientImage(clientId: string, file: File, fairId?: string): Promise<ClientImageDto> {
  const form = new FormData();
  form.append("file", file);
  if (fairId) form.append("fairId", fairId);
  const res = await adminFetch(`/finance/clients/${clientId}/images`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error("UPLOAD_IMAGE_FAILED");
  return res.json();
}

export async function fetchClientImages(clientId: string): Promise<ClientImageDto[]> {
  const res = await adminFetch(`/finance/clients/${clientId}/images`);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

// ─── Public: images para um fair (sem autenticação) ──────────────────────────

export async function fetchFairImages(fairId: string): Promise<ClientImageDto[]> {
  const res = await fetch(`${API_BASE}/finance/clients/images${fairId ? `?fairId=${fairId}` : ""}`, {
    next: { revalidate: 300 },
  } as RequestInit);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}
