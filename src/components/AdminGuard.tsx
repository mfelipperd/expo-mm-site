"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  User
} from "firebase/auth";
import { isAuthorized } from "@/lib/AuthRegistry";
import { Loader2, Lock, LogOut } from "lucide-react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        if (isAuthorized(currentUser.email)) {
          setUser(currentUser);
          setError(null);
        } else {
          setUser(null);
          setError("Acesso negado. Seu e-mail não está autorizado.");
          signOut(auth);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Erro ao fazer login com Google.");
      setLoading(false);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-blue flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-cyan" size={48} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-brand-blue flex items-center justify-center p-6">
        <div className="glass max-w-md w-full p-10 rounded-3xl border border-white/10 text-center">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
            <Lock className="text-brand-orange" size={40} />
          </div>
          <h1 className="text-3xl font-black text-white mb-4">ÁREA RESTRITA</h1>
          <p className="text-gray-400 mb-8">
            {error || "Acesse com sua conta Google autorizada para gerenciar os expositores."}
          </p>
          <button
            onClick={handleLogin}
            className="w-full bg-white text-brand-blue font-black py-4 rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-3"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            ENTRAR COM GOOGLE
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-brand-blue/90 border-b border-white/10 py-4 px-6 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 rounded-full overflow-hidden border border-brand-cyan/30">
              <img src={user.photoURL || ""} alt={user.displayName || "Admin"} />
           </div>
           <div>
              <p className="text-xs text-brand-cyan font-bold uppercase tracking-wider">Administrador</p>
              <p className="text-sm text-white font-medium">{user.displayName}</p>
           </div>
        </div>
        <button 
          onClick={handleLogout}
          className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold"
        >
          <LogOut size={18} />
          SAIR
        </button>
      </div>
      {children}
    </>
  );
}
