"use client";

import { useEffect, useState, useCallback } from "react";
import AdminGuard from "@/components/AdminGuard";
import ExhibitorForm from "@/components/admin/ExhibitorForm";
import { fetchClients, deleteClient, type ClientDto } from "@/lib/adminApi";
import { Plus, Edit2, Trash2, Globe, LayoutGrid, Search, Loader2, RefreshCw, AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
  const [clients, setClients] = useState<ClientDto[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loadClients = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const data = await fetchClients(search ? { search } : undefined);
      setClients(data);
    } catch (err: any) {
      if (err.message === "UNAUTHORIZED") {
        setError("Sessão expirada. Faça login novamente.");
      } else {
        setError("Erro ao carregar expositores. Tente novamente.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${name}"? Esta ação não pode ser desfeita.`)) return;
    try {
      await deleteClient(id);
      setClients((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(err.message === "UNAUTHORIZED"
        ? "Sessão expirada. Faça login novamente."
        : "Erro ao excluir. Tente novamente.");
    }
  };

  const handleSuccess = () => {
    setIsAdding(false);
    setEditingClient(null);
    loadClients(true);
  };

  return (
    <AdminGuard>
      <main className="min-h-screen bg-brand-blue pb-20">
        <div className="max-w-7xl mx-auto px-6 pt-10">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-black text-white mb-2 tracking-tight">GESTÃO DE EXPOSITORES</h1>
              <p className="text-gray-400">Gerencie as fábricas que aparecerão na Home e nas páginas das Cidades.</p>
            </div>
            {!isAdding && !editingClient && (
              <button
                onClick={() => setIsAdding(true)}
                className="bg-brand-orange text-white font-black px-8 py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-xl shadow-brand-orange/20"
              >
                <Plus size={20} />
                NOVO EXPOSITOR
              </button>
            )}
          </div>

          {/* Status bar */}
          <div className="mb-8 p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-wrap gap-6 items-center text-xs">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 font-bold uppercase tracking-widest">Status:</span>
              <span className={`px-2 py-0.5 rounded-full font-black uppercase ${
                error ? "bg-red-500/20 text-red-500" :
                loading ? "bg-orange-500/20 text-orange-500" :
                "bg-green-500/20 text-green-500"
              }`}>
                {error ? "Erro" : loading ? "Carregando..." : "API Online"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 font-bold uppercase tracking-widest">Total:</span>
              <span className="text-white font-black">{clients.length} Expositores</span>
            </div>
            <button
              onClick={() => loadClients(true)}
              disabled={refreshing || loading}
              className="ml-auto flex items-center gap-2 text-gray-400 hover:text-brand-cyan transition-colors disabled:opacity-40"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
              <span className="font-bold uppercase tracking-wider">Atualizar</span>
            </button>
          </div>

          {/* Backend pending fields notice */}
          <div className="flex items-start gap-3 bg-brand-orange/10 border border-brand-orange/30 rounded-2xl p-4 mb-8">
            <AlertTriangle size={16} className="text-brand-orange flex-shrink-0 mt-0.5" />
            <p className="text-xs text-brand-orange/90">
              <strong>Campos pendentes no backend:</strong> filtragem por cidade, cor de fundo e setor de atuação aguardam implementação. Ver <code>docs/backend-public-api-requirements.md</code>.
            </p>
          </div>

          {(isAdding || editingClient) ? (
            <ExhibitorForm
              initialData={editingClient ?? undefined}
              onSuccess={handleSuccess}
              onCancel={() => { setIsAdding(false); setEditingClient(null); }}
            />
          ) : (
            <div className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por nome da empresa..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-cyan transition-colors max-w-md"
                />
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-white/10">
                  <Loader2 className="animate-spin text-brand-cyan mb-4" size={40} />
                  <p className="text-gray-400">Carregando expositores...</p>
                </div>
              ) : error ? (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-red-500/20">
                  <p className="text-red-400 text-lg mb-4">{error}</p>
                  <button onClick={() => loadClients()} className="text-brand-cyan font-bold hover:underline">
                    Tentar novamente
                  </button>
                </div>
              ) : clients.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                  <LayoutGrid className="text-gray-700 mx-auto mb-4" size={48} />
                  <p className="text-gray-400 text-lg">
                    {search ? `Nenhum resultado para "${search}".` : "Nenhum expositor cadastrado ainda."}
                  </p>
                  {!search && (
                    <button onClick={() => setIsAdding(true)} className="text-brand-cyan font-bold mt-4 hover:underline">
                      Começar agora
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {clients.map((client) => (
                    <div
                      key={client.id}
                      className="glass p-6 rounded-3xl border border-white/10 flex flex-col group hover:border-brand-cyan/30 transition-all"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-20 h-20 flex items-center justify-center p-2 bg-white rounded-xl shadow-inner overflow-hidden">
                          {client.logoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={client.logoUrl} alt={client.name} className="max-w-full max-h-full object-contain" />
                          ) : (
                            <span className="text-2xl font-black text-brand-blue/40">{client.name.charAt(0)}</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingClient(client)}
                            className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-brand-cyan hover:bg-brand-cyan/10 transition-all"
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(client.id, client.name)}
                            className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                            title="Excluir"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-1">{client.name}</h3>
                      <p className="text-xs text-gray-500 mb-3 font-mono">{client.cnpj}</p>

                      <div className="flex gap-2 mb-4 flex-wrap">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                          client.isActive ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-500"
                        }`}>
                          {client.isActive ? "Ativo" : "Inativo"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Globe size={14} className={client.website ? "text-brand-cyan" : "text-gray-700"} />
                        {client.website ? (
                          <a
                            href={client.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="truncate hover:text-brand-cyan transition-colors text-xs"
                          >
                            {client.website}
                          </a>
                        ) : (
                          <span className="italic text-xs">Sem site cadastrado</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </AdminGuard>
  );
}
