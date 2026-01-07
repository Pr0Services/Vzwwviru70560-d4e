/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V68 — LOGIN PAGE                                  ║
 * ║                    Page de connexion avec branding CHE·NU                     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, FormEvent } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        navigate('/personal/quickcapture');
      } else {
        setError('Email ou mot de passe incorrect');
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#1E1F22] flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, #D8B26A 2px, transparent 0)`,
          backgroundSize: '50px 50px',
        }} />
      </div>
      
      {/* Login Card */}
      <div className="relative w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#D8B26A] to-[#7A593A] mb-4">
            <span className="text-4xl">🏛️</span>
          </div>
          <h1 className="text-3xl font-bold text-[#E9E4D6]">
            CHE<span className="text-[#D8B26A]">·</span>NU™
          </h1>
          <p className="text-[#8D8371] mt-2">
            Governed Intelligence Operating System
          </p>
        </div>
        
        {/* Form Card */}
        <div className="bg-[#2A2B2E] rounded-xl border border-[#3A3B3E] p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-[#E9E4D6] mb-6 text-center">
            Connexion
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-[#8D8371] mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jo@chenu.ai"
                required
                data-testid="email-input"
                className="w-full px-4 py-3 bg-[#1E1F22] border border-[#3A3B3E] rounded-lg 
                         text-[#E9E4D6] placeholder-[#5A5B5E]
                         focus:outline-none focus:border-[#D8B26A] focus:ring-1 focus:ring-[#D8B26A]
                         transition-colors"
              />
            </div>
            
            {/* Password */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-[#8D8371] mb-2"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                data-testid="password-input"
                className="w-full px-4 py-3 bg-[#1E1F22] border border-[#3A3B3E] rounded-lg 
                         text-[#E9E4D6] placeholder-[#5A5B5E]
                         focus:outline-none focus:border-[#D8B26A] focus:ring-1 focus:ring-[#D8B26A]
                         transition-colors"
              />
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              data-testid="login-button"
              className="w-full py-3 px-4 bg-gradient-to-r from-[#D8B26A] to-[#C9A35B] 
                       text-[#1E1F22] font-semibold rounded-lg
                       hover:from-[#E9C37B] hover:to-[#D8B26A]
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200
                       flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#1E1F22] border-t-transparent rounded-full animate-spin" />
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>
          
          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-[#1E1F22] rounded-lg border border-[#3A3B3E]">
            <p className="text-sm text-[#8D8371] mb-2 text-center">
              🧪 Compte démo:
            </p>
            <div className="text-sm text-[#E9E4D6] space-y-1">
              <p><span className="text-[#8D8371]">Email:</span> jo@chenu.ai</p>
              <p><span className="text-[#8D8371]">Mot de passe:</span> test123</p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-[#5A5B5E]">
            GOUVERNANCE &gt; EXÉCUTION
          </p>
          <p className="text-xs text-[#4A4B4E] mt-2">
            © 2026 CHE·NU™ — Tous droits réservés
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
