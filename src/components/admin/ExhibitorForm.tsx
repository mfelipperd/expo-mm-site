"use client";

import { useState } from "react";
import { createClient, updateClient, uploadClientImage, type ClientDto, type CreateClientDto } from "@/lib/adminApi";
import { Loader2, Upload, Save, AlertTriangle } from "lucide-react";

interface ExhibitorFormProps {
  initialData?: ClientDto & { bgColor?: string; cities?: string[] };
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ExhibitorForm({ initialData, onSuccess, onCancel }: ExhibitorFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [cnpj, setCnpj] = useState(initialData?.cnpj ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [phone, setPhone] = useState(initialData?.phone ?? "");
  const [website, setWebsite] = useState(initialData?.website ?? "");
  const [contactPerson, setContactPerson] = useState(initialData?.contactPerson ?? "");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>(initialData?.logoUrl ?? "");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("A logo deve ter menos de 5MB."); return; }
    if (!file.type.startsWith("image/")) { setError("O arquivo deve ser uma imagem."); return; }
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    setError(null);
  };

  const formatCnpj = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 14);
    return digits
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("O nome da empresa é obrigatório."); return; }
    if (!cnpj.trim()) { setError("O CNPJ é obrigatório."); return; }
    if (!email.trim()) { setError("O e-mail é obrigatório."); return; }
    if (!initialData && !logoFile) { setError("A logo é obrigatória para novos cadastros."); return; }

    setLoading(true);
    setError(null);

    try {
      const dto: CreateClientDto = {
        name: name.trim(),
        cnpj: cnpj.replace(/\D/g, ""),
        email: email.trim(),
        ...(phone ? { phone: phone.trim() } : {}),
        ...(website ? { website: website.trim() } : {}),
        ...(contactPerson ? { contactPerson: contactPerson.trim() } : {}),
      };

      let clientId = initialData?.id;

      if (initialData?.id) {
        setStatus("Atualizando dados...");
        await updateClient(initialData.id, dto);
      } else {
        setStatus("Criando expositor...");
        const created = await createClient(dto);
        clientId = created.id;
      }

      if (logoFile && clientId) {
        setStatus("Enviando logo...");
        await uploadClientImage(clientId, logoFile);
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message === "UNAUTHORIZED"
        ? "Sessão expirada. Faça login novamente."
        : `Erro ao salvar: ${err.message ?? "Tente novamente."}`);
    } finally {
      setLoading(false);
      setStatus(null);
    }
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-cyan transition-colors";
  const labelClass = "block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2";

  return (
    <div className="glass p-8 rounded-3xl border border-white/10 max-w-2xl mx-auto">
      <h2 className="text-2xl font-black text-white mb-6">
        {initialData ? "EDITAR EXPOSITOR" : "NOVO EXPOSITOR"}
      </h2>

      {/* Backend pending notice */}
      <div className="flex items-start gap-3 bg-brand-orange/10 border border-brand-orange/30 rounded-2xl p-4 mb-6">
        <AlertTriangle size={18} className="text-brand-orange flex-shrink-0 mt-0.5" />
        <p className="text-xs text-brand-orange/90 leading-relaxed">
          <strong>Campos em desenvolvimento:</strong> filtragem por cidade (Belém/Manaus), cor de fundo da logo e setor de atuação serão habilitados após atualização do backend. Ver <code>docs/backend-public-api-requirements.md</code>.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={labelClass}>Nome da Empresa / Fábrica *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Ex: Nathor Indústria e Comércio" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>CNPJ *</label>
            <input
              type="text"
              value={cnpj}
              onChange={(e) => setCnpj(formatCnpj(e.target.value))}
              className={inputClass}
              placeholder="00.000.000/0000-00"
              maxLength={18}
            />
          </div>
          <div>
            <label className={labelClass}>E-mail *</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="contato@empresa.com.br" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Telefone</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="(91) 99999-9999" />
          </div>
          <div>
            <label className={labelClass}>Responsável</label>
            <input type="text" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} className={inputClass} placeholder="Nome do contato" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Site (URL)</label>
          <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className={inputClass} placeholder="https://suaempresa.com.br" />
        </div>

        <div>
          <label className={labelClass}>Logo da Empresa {!initialData && "*"}</label>
          <div className="flex items-center gap-6">
            <label className="w-32 h-32 rounded-2xl border-2 border-dashed border-white/15 flex items-center justify-center p-2 relative overflow-hidden cursor-pointer bg-white hover:border-brand-cyan transition-colors group">
              {logoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoPreview} alt="Preview" className="w-full h-full object-contain" />
              ) : (
                <Upload className="text-gray-400 group-hover:text-brand-cyan transition-colors" />
              )}
              <input type="file" onChange={handleFileChange} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
            </label>
            <div className="text-sm text-gray-400 space-y-1">
              <p>PNG, JPG ou WEBP</p>
              <p>Máximo 5 MB</p>
              <p className="text-brand-cyan font-medium text-xs mt-2">Clique para selecionar</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-brand-cyan text-brand-blue font-black py-4 rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
          >
            {loading ? (
              <><Loader2 className="animate-spin" size={18} /><span>{status ?? "CARREGANDO..."}</span></>
            ) : (
              <><Save size={18} /><span>{initialData ? "ATUALIZAR" : "SALVAR EXPOSITOR"}</span></>
            )}
          </button>
          <button type="button" onClick={onCancel} className="px-6 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
            CANCELAR
          </button>
        </div>
      </form>
    </div>
  );
}
