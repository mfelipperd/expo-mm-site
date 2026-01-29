"use client";

import { useState } from "react";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, updateDoc, doc, Timestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Loader2, Upload, X, Save } from "lucide-react";

interface ExhibitorFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ExhibitorForm({ initialData, onSuccess, onCancel }: ExhibitorFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [link, setLink] = useState(initialData?.link || "");
  const [cities, setCities] = useState<string[]>(initialData?.cities || []);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>(initialData?.logoUrl || "");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("A logo deve ter menos de 2MB.");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("O arquivo deve ser uma imagem.");
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("O nome da empresa é obrigatório.");
      return;
    }
    if (!initialData && !logoFile) {
      setError("A logo é obrigatória para novos cadastros.");
      return;
    }
    if (cities.length === 0) {
      setError("Selecione pelo menos uma cidade para o expositor.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Submit started. Name:", name);
      let logoUrl = initialData?.logoUrl || "";

      if (logoFile) {
        setStatus("Iniciando upload...");
        console.log("Preparing storage ref for:", logoFile.name);
        const storageRef = ref(storage, `exhibitors/${Date.now()}_${logoFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, logoFile);

        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setProgress(Math.round(p));
              setStatus(`Enviando logo: ${Math.round(p)}%`);
              console.log(`Upload progress: ${p}%`);
            },
            (err) => {
              console.error("Upload error:", err);
              reject(err);
            },
            async () => {
              console.log("Upload completed, getting URL...");
              logoUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }

      setStatus("Salvando no banco...");
      console.log("Saving to Firestore with logoUrl:", logoUrl);

      const exhibitorData = {
        name: name.trim(),
        link: link.trim() || null,
        cities,
        logoUrl,
        updatedAt: Timestamp.now(),
      };

      if (initialData?.id) {
        console.log("Updating document:", initialData.id);
        await updateDoc(doc(db, "exhibitors", initialData.id), exhibitorData);
      } else {
        console.log("Adding new document");
        await addDoc(collection(db, "exhibitors"), {
          ...exhibitorData,
          createdAt: Timestamp.now(),
        });
      }

      console.log("Save successful!");
      onSuccess();
    } catch (err: any) {
      console.error("Error saving exhibitor full log:", err);
      const errorMessage = err.message || "Erro desconhecido";
      setError(`Erro ao salvar: ${errorMessage}. Confira o console do navegador.`);
    } finally {
      setLoading(false);
      setStatus(null);
    }
  };

  return (
    <div className="glass p-8 rounded-3xl border border-white/10 max-w-2xl mx-auto">
      <h2 className="text-2xl font-black text-white mb-6">
        {initialData ? "EDITAR EXPOSITOR" : "NOVO EXPOSITOR"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Nome da Fábrica / Empresa *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors"
            placeholder="Ex: Fábrica de Cadeiras EMM"
          />
        </div>

        <div>
           <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Link Opcional (URL)</label>
           <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors"
            placeholder="https://suaempresa.com.br"
          />
          <p className="text-xs text-gray-500 mt-2">Se deixado em branco, o card não será clicável.</p>
        </div>

        <div>
           <label className="block text-sm font-bold text-gray-400 uppercase mb-3">Participação nas Feiras *</label>
           <div className="flex gap-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox"
                    checked={cities.includes("manaus")}
                    onChange={(e) => {
                      if (e.target.checked) setCities([...cities, "manaus"]);
                      else setCities(cities.filter(c => c !== "manaus"));
                    }}
                    className="w-5 h-5 rounded border-white/10 bg-white/5 checked:bg-brand-pink accent-brand-pink"
                  />
                  <span className="text-white font-bold group-hover:text-brand-pink transition-colors">MANAUS</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox"
                    checked={cities.includes("belem")}
                    onChange={(e) => {
                      if (e.target.checked) setCities([...cities, "belem"]);
                      else setCities(cities.filter(c => c !== "belem"));
                    }}
                    className="w-5 h-5 rounded border-white/10 bg-white/5 checked:bg-brand-cyan accent-brand-cyan"
                  />
                  <span className="text-white font-bold group-hover:text-brand-cyan transition-colors">BELÉM</span>
              </label>
           </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Logo da Empresa *</label>
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 bg-white/5 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center p-2 relative overflow-hidden group">
              {logoPreview ? (
                <img src={logoPreview} alt="Preview" className="w-full h-full object-contain" />
              ) : (
                <Upload className="text-gray-600" />
              )}
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <div className="text-sm text-gray-400">
              <p>Formatos: PNG, JPG ou WEBP</p>
              <p>Tamanho máximo: 2MB</p>
              <p className="mt-2 text-brand-cyan font-medium">Clique no quadrado para selecionar</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-sm font-bold">
            {error}
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-brand-cyan text-brand-blue font-black py-4 rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                <span>{status || "CARREGANDO..."}</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>{initialData ? "ATUALIZAR" : "SALVAR EXPOSITOR"}</span>
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            className="px-6 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
          >
            CANCELAR
          </button>
        </div>
      </form>
    </div>
  );
}
