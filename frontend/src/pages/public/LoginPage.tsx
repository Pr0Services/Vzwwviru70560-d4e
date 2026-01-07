/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — LOGIN PAGE                                      ║
 * ║                    Page de connexion                                         ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, Lock, Eye, EyeOff, ArrowRight, 
  Sparkles, Shield, AlertCircle, Check
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes - in production, this would be a real API call
      if (email && password) {
        // Success - redirect to dashboard
        navigate('/dashboard');
      } else {
        setError('Veuillez remplir tous les champs');
      }
    } catch (err) {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    logger.debug(`Login with ${provider}`);
    // Implement OAuth flow
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E1F22] via-[#2F4C39] to-[#1E1F22] flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-[#D8B26A] blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-[#3EB4A2] blur-3xl" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-4 mb-12">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D8B26A] to-[#7A593A] flex items-center justify-center">
              <span className="text-white font-bold text-3xl">C</span>
            </div>
            <span className="text-4xl font-bold text-white">
              CHE<span className="text-[#D8B26A]">·</span>NU
            </span>
          </Link>
          
          <h1 className="text-4xl font-bold text-white mb-6">
            Bienvenue dans votre<br />
            <span className="text-[#D8B26A]">Intelligence Gouvernée</span>
          </h1>
          
          <p className="text-xl text-[#E9E4D6]/70 mb-12">
            Reprenez le contrôle de votre IA avec le premier système 
            d'exploitation à gouvernance intégrée.
          </p>
          
          {/* Features */}
          <div className="space-y-4">
            {[
              { icon: Shield, text: 'Checkpoint sur chaque action IA' },
              { icon: Sparkles, text: 'Nova supervise vos 226 agents' },
              { icon: Lock, text: 'Vos données restent les vôtres' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-[#E9E4D6]/80">
                <div className="w-10 h-10 rounded-lg bg-[#3EB4A2]/20 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-[#3EB4A2]" />
                </div>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D8B26A] to-[#7A593A] flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-3xl font-bold text-white">
                CHE<span className="text-[#D8B26A]">·</span>NU
              </span>
            </Link>
          </div>

          {/* Form Card */}
          <div className="bg-[#1E1F22]/80 backdrop-blur-xl rounded-2xl border border-[#D8B26A]/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-2">Connexion</h2>
            <p className="text-[#E9E4D6]/60 mb-8">
              Accédez à votre espace CHE·NU
            </p>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            )}

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => handleSocialLogin('google')}
                className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-white text-sm">Google</span>
              </button>
              <button
                onClick={() => handleSocialLogin('microsoft')}
                className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#F25022" d="M1 1h10v10H1z"/>
                  <path fill="#00A4EF" d="M1 13h10v10H1z"/>
                  <path fill="#7FBA00" d="M13 1h10v10H13z"/>
                  <path fill="#FFB900" d="M13 13h10v10H13z"/>
                </svg>
                <span className="text-white text-sm">Microsoft</span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[#E9E4D6]/40 text-sm">ou</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-[#E9E4D6]/70 text-sm mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#E9E4D6]/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@exemple.com"
                    className="w-full pl-12 pr-4 py-3 bg-[#2F4C39]/30 border border-white/10 rounded-lg text-white placeholder:text-[#E9E4D6]/30 focus:outline-none focus:border-[#D8B26A]/50 transition"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[#E9E4D6]/70 text-sm mb-2">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#E9E4D6]/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 bg-[#2F4C39]/30 border border-white/10 rounded-lg text-white placeholder:text-[#E9E4D6]/30 focus:outline-none focus:border-[#D8B26A]/50 transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#E9E4D6]/40 hover:text-[#E9E4D6]/70"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div 
                    onClick={() => setRememberMe(!rememberMe)}
                    className={`w-5 h-5 rounded border flex items-center justify-center transition ${
                      rememberMe 
                        ? 'bg-[#D8B26A] border-[#D8B26A]' 
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    {rememberMe && <Check className="w-3 h-3 text-[#1E1F22]" />}
                  </div>
                  <span className="text-[#E9E4D6]/60 text-sm">Se souvenir de moi</span>
                </label>
                <Link to="/forgot-password" className="text-[#D8B26A] text-sm hover:underline">
                  Mot de passe oublié?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-[#D8B26A] to-[#7A593A] text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Se connecter
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <p className="text-center text-[#E9E4D6]/60 mt-8">
              Pas encore de compte?{' '}
              <Link to="/signup" className="text-[#D8B26A] font-medium hover:underline">
                Créer un compte
              </Link>
            </p>
          </div>

          {/* Footer */}
          <p className="text-center text-[#E9E4D6]/30 text-sm mt-8">
            © 2025 CHE·NU Inc. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
