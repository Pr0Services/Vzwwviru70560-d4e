/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — REJOINDRE                                       ║
 * ║                    PRE-LOGIN — THRESHOLD, NOT ONBOARDING                     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

const Navigation: React.FC = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1E1F22]/95 backdrop-blur-md border-b border-[#D8B26A]/10">
    <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#D8B26A] to-[#7A593A] flex items-center justify-center">
          <span className="text-[#1E1F22] font-bold">C·N</span>
        </div>
        <span className="text-xl font-semibold text-[#E9E4D6]">CHE<span className="text-[#D8B26A]">·</span>NU</span>
      </Link>
      <Link to="/login" className="text-[#E9E4D6]/70 hover:text-[#D8B26A] transition text-sm">Déjà un compte</Link>
    </div>
  </nav>
);

const Footer: React.FC = () => (
  <footer className="py-8 px-6 bg-[#1E1F22] border-t border-[#D8B26A]/10">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="text-[#8D8371] text-sm">© 2025 CHE·NU™</p>
      <div className="flex items-center gap-6">
        <Link to="/privacy" className="text-[#8D8371] hover:text-[#D8B26A] text-sm transition">Confidentialité</Link>
        <Link to="/terms" className="text-[#8D8371] hover:text-[#D8B26A] text-sm transition">Conditions</Link>
      </div>
    </div>
  </footer>
);

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Champs requis.');
      return;
    }
    if (!email.includes('@')) {
      setError('Email invalide.');
      return;
    }
    if (password.length < 8) {
      setError('Mot de passe: 8 caractères minimum.');
      return;
    }
    if (!acceptTerms) {
      setError('Conditions requises.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/onboarding');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#1E1F22] flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-24 pb-16 px-6">
        <div className="max-w-md mx-auto">
          
          <Link to="/" className="inline-flex items-center gap-2 text-[#8D8371] hover:text-[#D8B26A] text-sm mb-12 transition">
            <ChevronLeft className="w-4 h-4" />
            Retour
          </Link>
          
          <h1 className="text-2xl font-light text-[#E9E4D6] mb-4">Rejoindre</h1>
          <p className="text-[#8D8371] text-sm mb-12">
            Créer un compte ouvre l'accès au système. Rien de plus.
          </p>
          
          {/* What this means */}
          <div className="mb-10 p-4 rounded bg-[#1E1F22]/50 border border-[#8D8371]/10">
            <p className="text-[#8D8371] text-xs mb-3">Ce que rejoindre implique:</p>
            <ul className="space-y-1 text-[#E9E4D6]/60 text-xs">
              <li>• Accepter les règles du système</li>
              <li>• Construire progressivement</li>
              <li>• Valider chaque action conséquente</li>
            </ul>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {error && (
              <div className="p-3 rounded bg-red-500/10 border border-red-500/20 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <p className="text-red-400 text-xs">{error}</p>
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-xs text-[#8D8371] mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D8371]" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#1E1F22] border border-[#8D8371]/30 rounded text-[#E9E4D6] text-sm placeholder-[#8D8371]/50 focus:border-[#D8B26A] focus:outline-none"
                  placeholder="email@exemple.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-xs text-[#8D8371] mb-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D8371]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-[#1E1F22] border border-[#8D8371]/30 rounded text-[#E9E4D6] text-sm placeholder-[#8D8371]/50 focus:border-[#D8B26A] focus:outline-none"
                  placeholder="8 caractères minimum"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8D8371]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-[#8D8371]/30 bg-[#1E1F22] text-[#D8B26A]"
              />
              <label htmlFor="terms" className="text-xs text-[#8D8371]">
                J'accepte les <Link to="/terms" className="text-[#D8B26A]">conditions</Link> et la <Link to="/privacy" className="text-[#D8B26A]">confidentialité</Link>
              </label>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-[#D8B26A] text-[#1E1F22] text-sm font-medium rounded hover:bg-[#E9E4D6] transition disabled:opacity-50"
            >
              {isLoading ? 'Création...' : 'Créer mon accès'}
            </button>
            
          </form>
          
          <p className="mt-8 text-center text-[#8D8371] text-xs">
            <Link to="/faq" className="text-[#D8B26A]">Questions</Link> · <Link to="/demo" className="text-[#D8B26A]">Comprendre</Link>
          </p>
          
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SignupPage;
