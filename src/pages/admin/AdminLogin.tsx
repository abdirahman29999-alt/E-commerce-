import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onNavigateHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onNavigateHome
}) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password.trim());
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Identifiants invalides. Veuillez vérifier vos accès.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#FAF9F6]">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#EAE7E0] shadow-xl p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#5A5A40]/10 text-[#5A5A40] mx-auto flex items-center justify-center">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#2D2926] font-serif">
            Espace Commerçant
          </h1>
          <p className="text-xs text-[#7A766F]">
            Accès sécurisé réservé à l'administrateur
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#2D2926]">Identifiant / Email</label>
            <div className="relative">
              <input
                id="admin-login-email"
                type="text"
                required
                placeholder="Votre identifiant"
                autoComplete="username"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-[#FAF9F6] rounded-xl border border-[#EAE7E0] text-[#2D2926] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#5A5A40]"
              />
              <Mail className="w-4 h-4 text-[#7A766F] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#2D2926]">Mot de passe</label>
            <div className="relative">
              <input
                id="admin-login-password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm bg-[#FAF9F6] rounded-xl border border-[#EAE7E0] text-[#2D2926] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#5A5A40]"
              />
              <Lock className="w-4 h-4 text-[#7A766F] absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A766F] hover:text-[#2D2926] p-0.5 cursor-pointer"
                tabIndex={-1}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            id="btn-admin-submit-login"
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-full bg-[#5A5A40] hover:bg-[#4A4A30] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 active:scale-98 cursor-pointer"
          >
            {loading ? (
              <span>Connexion en cours...</span>
            ) : (
              <>
                <span>Accéder au Tableau de Bord</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onNavigateHome}
            className="text-xs font-semibold text-[#7A766F] hover:text-[#2D2926] transition-colors cursor-pointer"
          >
            ← Retourner au site public
          </button>
        </div>

      </div>
    </div>
  );
};

