"use client";

import { useEffect, useState } from "react";
import { getToken, clearToken, login } from "@/lib/adminApi";
import { Loader2, Lock, LogOut, Eye, EyeOff } from "lucide-react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    setAuthenticated(!!token);
    setLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const { setToken } = await import("@/lib/adminApi");
      const token = await login(email, password);
      setToken(token);
      setAuthenticated(true);
    } catch {
      setError("E-mail ou senha incorretos. Verifique suas credenciais.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    clearToken();
    setAuthenticated(false);
    setEmail("");
    setPassword("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-blue flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-cyan" size={48} />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-brand-blue flex items-center justify-center p-6">
        <div className="glass max-w-md w-full p-10 rounded-3xl border border-white/10">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
              <Lock className="text-brand-orange" size={36} />
            </div>
            <h1 className="text-3xl font-black text-white mb-2">ÁREA RESTRITA</h1>
            <p className="text-gray-400 text-sm">Acesse com suas credenciais de administrador.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@expomultimix.com.br"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-cyan transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-cyan transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-brand-cyan text-brand-blue font-black py-4 rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100 mt-2"
            >
              {submitting ? <Loader2 className="animate-spin" size={20} /> : <Lock size={20} />}
              {submitting ? "ENTRANDO..." : "ENTRAR"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-brand-blue/90 border-b border-white/10 py-4 px-6 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-cyan/20 border border-brand-cyan/30 flex items-center justify-center">
            <Lock size={14} className="text-brand-cyan" />
          </div>
          <div>
            <p className="text-xs text-brand-cyan font-bold uppercase tracking-wider">Administrador</p>
            <p className="text-sm text-white font-medium">Expo MultiMix</p>
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
