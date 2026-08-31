import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff, KeyRound } from 'lucide-react';
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
  const [email, setEmail] = useState('admin@djiaccess.dj');
  const [password, setPassword] = useState('djibouti2026');
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
      setError(err.message || 'Identifiants invalides. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = () => {
    setEmail('admin@djiaccess.dj');
    setPassword('djibouti2026');
    setError(null);
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
            Connectez-vous pour administrer la boutique DjiAccess
          </p>
        </div>

        {/* Demo Credentials Note */}
        <div className="p-3.5 rounded-2xl bg-[#F4F2EB] border border-[#EAE7E0] text-xs text-[#3D3A35] space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#2D2926] flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#5A5A40]" />
              Identifiants d'accès commerçant :
            </span>
            <button
              type="button"
              onClick={fillCredentials}
              className="text-[11px] font-semibold text-[#5A5A40] hover:underline cursor-pointer"
            >
              Remplir
            </button>
          </div>
          <div className="bg-white/80 p-2.5 rounded-xl border border-[#EAE7E0] space-y-1 font-mono text-[11px]">
            <p className="flex justify-between">
              <span className="text-[#7A766F]">Email :</span>
              <strong className="text-[#2D2926]">admin@djiaccess.dj</strong>
            </p>
            <p className="flex justify-between">
              <span className="text-[#7A766F]">Mot de passe :</span>
              <strong className="text-[#2D2926]">djibouti2026</strong>
            </p>
          </div>
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A766F] hover:text-[#2D2926] p-0.5"
                tabIndex={-1}
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
            className="text-xs font-semibold text-[#7A766F] hover:text-[#2D2926] transition-colors"
          >
            ← Retourner au site public
          </button>
        </div>

      </div>
    </div>
  );
};

