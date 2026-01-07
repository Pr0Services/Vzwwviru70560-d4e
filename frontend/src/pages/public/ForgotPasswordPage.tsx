/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — FORGOT PASSWORD PAGE                            ║
 * ║                    Récupération de mot de passe                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !email.includes('@')) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSuccess(true);
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-[#1E1F22] via-[#2F4C39] to-[#1E1F22] flex items-center justify-center p-6"
      role="main"
      aria-labelledby="page-title"
    >
      <div className="w-full max-w-md">
        {/* Back Link */}
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 text-[#E9E4D6]/60 hover:text-white mb-8 transition"
          aria-label="Retour à la page de connexion"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Retour à la connexion
        </Link>

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3" aria-label="Accueil CHE·NU">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D8B26A] to-[#7A593A] flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-3xl font-bold text-white">
              CHE<span className="text-[#D8B26A]">·</span>NU
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-[#1E1F22]/80 backdrop-blur-xl rounded-2xl border border-[#D8B26A]/20 p-8">
          {!isSuccess ? (
            <>
              <h1 id="page-title" className="text-2xl font-bold text-white mb-2">
                Mot de passe oublié?
              </h1>
              <p className="text-[#E9E4D6]/60 mb-8">
                Entrez votre email et nous vous enverrons un lien de réinitialisation.
              </p>

              {/* Error */}
              {error && (
                <div 
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3"
                  role="alert"
                  aria-live="polite"
                >
                  <AlertCircle className="w-5 h-5 text-red-400" aria-hidden="true" />
                  <span className="text-red-400 text-sm">{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-6">
                  <label 
                    htmlFor="email" 
                    className="block text-[#E9E4D6]/70 text-sm mb-2"
                  >
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail 
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#E9E4D6]/40" 
                      aria-hidden="true" 
                    />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vous@exemple.com"
                      className="w-full pl-12 pr-4 py-3 bg-[#2F4C39]/30 border border-white/10 rounded-lg text-white placeholder:text-[#E9E4D6]/30 focus:outline-none focus:border-[#D8B26A]/50 transition"
                      required
                      aria-required="true"
                      aria-describedby="email-hint"
                    />
                  </div>
                  <p id="email-hint" className="text-[#E9E4D6]/40 text-xs mt-2">
                    L'email associé à votre compte CHE·NU
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-[#D8B26A] to-[#7A593A] text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                  aria-busy={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    'Envoyer le lien'
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-6" role="status" aria-live="polite">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#3EB4A2]/20 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-[#3EB4A2]" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                Email envoyé!
              </h2>
              <p className="text-[#E9E4D6]/70 mb-6">
                Si un compte existe avec l'adresse <strong className="text-white">{email}</strong>, 
                vous recevrez un lien de réinitialisation dans quelques minutes.
              </p>
              <p className="text-[#E9E4D6]/50 text-sm mb-6">
                Pensez à vérifier vos spams si vous ne voyez pas l'email.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Retour à la connexion
              </Link>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-[#E9E4D6]/40 text-sm mt-8">
          Besoin d'aide? <a href="mailto:support@che-nu.com" className="text-[#D8B26A] hover:underline">support@che-nu.com</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
