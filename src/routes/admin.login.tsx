import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Lock, Mail, ArrowRight, ArrowLeft, AlertCircle, Check } from "lucide-react";
import { loginAdminUser, getCurrentAdmin } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import logoImg from "@/assets/telemed_logo.webp";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

const REMEMBER_EMAIL_KEY = "telemed_remember_admin_email";

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Si déjà connecté, rediriger vers /admin
    getCurrentAdmin().then((user) => {
      if (user) {
        navigate({ to: "/admin" });
      }
    });

    // Charger l'email sauvegardé si "Se souvenir de moi"
    if (typeof window !== "undefined") {
      const savedEmail = localStorage.getItem(REMEMBER_EMAIL_KEY);
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await loginAdminUser(email, password);
      if (res.success) {
        // Sauvegarder ou effacer selon "Se souvenir de moi"
        if (typeof window !== "undefined") {
          if (rememberMe) {
            localStorage.setItem(REMEMBER_EMAIL_KEY, email);
          } else {
            localStorage.removeItem(REMEMBER_EMAIL_KEY);
          }
        }
        toast.success("Connexion réussie");
        navigate({ to: "/admin" });
      } else {
        setErrorMsg(res.error || "Identifiants invalides.");
        toast.error(res.error || "Erreur de connexion");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur inattendue";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center p-4 selection:bg-[#74a638] selection:text-white relative">
      {/* Halo décoratif très doux vert primaire */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[#74a638]/10 via-[#74a638]/5 to-transparent pointer-events-none" />

      {/* Top navigation */}
      <div className="w-full max-w-sm mb-6 flex justify-between items-center z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Retour au site public
        </Link>
        <span className="text-[11px] font-semibold text-[#74a638] uppercase tracking-wider">
          Portail RAFT CI
        </span>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-sm bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xl shadow-slate-200/50 relative z-10">
        {/* Official Logo */}
        <div className="flex flex-col items-center text-center mb-6">
          <img
            src={logoImg}
            alt="Logo Télémédecine Côte d'Ivoire"
            className="h-10 w-auto object-contain mb-3"
          />
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Espace d'Administration
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gestion du portail national de télémédecine
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Adresse Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@telemedecine.ci"
                className="pl-10 bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638] text-xs h-10 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Mot de Passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="pl-10 bg-slate-50/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#74a638] focus-visible:border-[#74a638] text-xs h-10 rounded-xl"
              />
            </div>
          </div>

          {/* Se souvenir de moi */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600 hover:text-slate-900">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#74a638] focus:ring-[#74a638] accent-[#74a638] cursor-pointer"
              />
              <span>Se souvenir de moi</span>
            </label>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#74a638] hover:bg-[#63912e] text-white font-semibold py-2.5 rounded-xl shadow-md shadow-[#74a638]/20 transition-all duration-200 cursor-pointer text-xs mt-2 h-10"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Connexion en cours...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Se connecter
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            )}
          </Button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Accès sécurisé réservé aux administrateurs autorisés
          </p>
        </div>
      </div>
    </div>
  );
}
