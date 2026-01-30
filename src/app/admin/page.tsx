"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import ExhibitorForm from "@/components/admin/ExhibitorForm";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { Plus, Edit2, Trash2, Globe, LayoutGrid, List } from "lucide-react";

export default function AdminDashboard() {
  const [exhibitors, setExhibitors] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingExhibitor, setEditingExhibitor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<"connecting" | "connected" | "error">("connecting");
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    console.log("AdminDashboard: Starting sync...");
    // Removing orderBy temporarily as documents manually created in Firestore might lack 'createdAt'
    const q = query(collection(db, "exhibitors"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log(`AdminDashboard: Received snapshot with ${snapshot.docs.length} docs`);
      snapshot.docs.forEach(d => console.log("Doc ID:", d.id, "Data:", d.data()));
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setExhibitors(docs);
      setLoading(false);
      setSyncStatus("connected");
      setSyncError(null);
    }, (err) => {
      console.error("AdminDashboard: Sync Error:", err);
      setSyncStatus("error");
      setSyncError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este expositor?")) {
      try {
        await deleteDoc(doc(db, "exhibitors", id));
      } catch (err) {
        console.error("Error deleting exhibitor:", err);
        alert("Erro ao excluir. Tente novamente.");
      }
    }
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
             {!isAdding && !editingExhibitor && (
                <button
                  onClick={() => setIsAdding(true)}
                  className="bg-brand-orange text-white font-black px-8 py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-xl shadow-brand-orange/20"
                >
                  <Plus size={20} />
                  NOVO EXPOSITOR
                </button>
             )}
          </div>

          {/* Painel de Diagnóstico */}
          <div className="mb-12 p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-wrap gap-6 items-center text-xs">
             <div className="flex items-center gap-2">
                <span className="text-gray-500 font-bold uppercase tracking-widest">Status da Conexão:</span>
                <span className={`px-2 py-0.5 rounded-full font-black uppercase ${
                  syncStatus === "connected" ? "bg-green-500/20 text-green-500" :
                  syncStatus === "error" ? "bg-red-500/20 text-red-500" :
                  "bg-orange-500/20 text-orange-500"
                }`}>
                  {syncStatus === "connected" ? "Conectado" : syncStatus === "error" ? "Erro de Permissão" : "Conectando..."}
                </span>
             </div>
             <div className="flex items-center gap-2">
                <span className="text-gray-500 font-bold uppercase tracking-widest">Total no Banco:</span>
                <span className="text-white font-black">{exhibitors.length} Itens</span>
             </div>
             <div className="flex items-center gap-2">
                <span className="text-gray-500 font-bold uppercase tracking-widest">Projeto ID:</span>
                <span className="text-white font-black">{db.app.options.projectId}</span>
             </div>
             {syncError && (
               <div className="w-full text-red-400 font-medium bg-red-500/5 p-2 rounded-lg mt-2">
                  Erro técnico: {syncError}
               </div>
             )}
          </div>

          {(isAdding || editingExhibitor) ? (
            <ExhibitorForm 
              initialData={editingExhibitor}
              onSuccess={() => {
                setIsAdding(false);
                setEditingExhibitor(null);
              }}
              onCancel={() => {
                setIsAdding(false);
                setEditingExhibitor(null);
              }}
            />
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-gray-500 text-sm font-bold uppercase tracking-widest px-4">
                 <span>{exhibitors.length} Empresas Cadastradas</span>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-white/10">
                   <div className="animate-spin h-8 w-8 border-4 border-brand-cyan border-t-transparent rounded-full mb-4"></div>
                   <p className="text-gray-400">Carregando expositores...</p>
                </div>
              ) : exhibitors.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                   <LayoutGrid className="text-gray-700 mx-auto mb-4" size={48} />
                   <p className="text-gray-400 text-lg">Nenhum expositor cadastrado ainda.</p>
                   <button 
                    onClick={() => setIsAdding(true)}
                    className="text-brand-cyan font-bold mt-4 hover:underline"
                   >
                     Começar agora
                   </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {exhibitors.map((exhibitor) => (
                    <div key={exhibitor.id} className="glass p-6 rounded-3xl border border-white/10 flex flex-col group hover:border-brand-cyan/30 transition-all">
                      <div className="flex justify-between items-start mb-6">
                        <div className={`w-20 h-20 flex items-center justify-center p-2 ${
                          exhibitor.bgColor === "white" ? "bg-white rounded-xl shadow-inner" :
                          exhibitor.bgColor === "brand-blue" ? "bg-brand-blue rounded-xl shadow-inner" :
                          exhibitor.bgColor === "brand-pink" ? "bg-brand-pink rounded-xl shadow-inner" :
                          exhibitor.bgColor === "brand-orange" ? "bg-brand-orange rounded-xl shadow-inner" :
                          "bg-transparent"
                        }`}>
                          <img src={exhibitor.logoUrl} alt={exhibitor.name} className="max-w-full max-h-full object-contain" />
                        </div>
                        <div className="flex gap-2">
                           <button 
                            onClick={() => setEditingExhibitor(exhibitor)}
                            className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-brand-cyan hover:bg-brand-cyan/10 transition-all"
                           >
                              <Edit2 size={18} />
                           </button>
                           <button 
                            onClick={() => handleDelete(exhibitor.id)}
                            className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                           >
                              <Trash2 size={18} />
                           </button>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-2">{exhibitor.name}</h3>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {exhibitor.cities?.includes("manaus") && (
                          <span className="text-[10px] font-black bg-brand-pink/20 text-brand-pink px-2 py-0.5 rounded-full uppercase tracking-tighter">Manaus</span>
                        )}
                        {exhibitor.cities?.includes("belem") && (
                          <span className="text-[10px] font-black bg-brand-cyan/20 text-brand-cyan px-2 py-0.5 rounded-full uppercase tracking-tighter">Belém</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Globe size={14} className={exhibitor.link ? "text-brand-cyan" : "text-gray-700"} />
                        {exhibitor.link ? (
                          <a href={exhibitor.link} target="_blank" rel="noopener noreferrer" className="truncate hover:text-brand-cyan transition-colors">
                            {exhibitor.link}
                          </a>
                        ) : (
                          <span className="italic">Sem link cadastrado</span>
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
