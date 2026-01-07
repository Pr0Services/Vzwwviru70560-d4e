/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — ONBOARDING PAGE                                 ║
 * ║                    Page de connexion vers l'onboarding Nova                  ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Cette page sert de pont entre le signup public et l'onboarding Nova complet.
 * Elle vérifie l'authentification et redirige vers le wizard approprié.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';

// Import du wizard d'onboarding existant
// Note: Ces imports pointent vers les composants existants dans le projet
// import { CanonicalOnboardingWizard } from '../../components/Onboarding/CanonicalOnboardingWizard';
// import { OnboardingFlow } from './OnboardingFlow';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOADING SCREEN - Shown while checking auth
// ═══════════════════════════════════════════════════════════════════════════════

const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-b from-[#1E1F22] to-[#2F4C39] flex items-center justify-center">
    <div className="text-center">
      <div className="w-20 h-20 mx-auto mb-6 relative">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#3EB4A2] to-[#2F4C39] animate-pulse" />
        <div className="absolute inset-2 rounded-full bg-[#1E1F22] flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-[#3EB4A2]" />
        </div>
      </div>
      <h2 className="text-xl font-semibold text-white mb-2">Préparation de votre espace</h2>
      <p className="text-[#E9E4D6]/60">Nova prépare votre accueil personnalisé...</p>
      <Loader2 className="w-6 h-6 text-[#D8B26A] mx-auto mt-6 animate-spin" />
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// WELCOME SCREEN - Nova's greeting
// ═══════════════════════════════════════════════════════════════════════════════

interface WelcomeScreenProps {
  userName: string;
  planName: string;
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ userName, planName, onStart }) => (
  <div className="min-h-screen bg-gradient-to-b from-[#1E1F22] to-[#2F4C39] flex items-center justify-center p-6">
    {/* Background glow */}
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#3EB4A2]/10 rounded-full blur-3xl" />
    </div>

    <div className="relative max-w-2xl text-center">
      {/* Nova Avatar */}
      <div className="w-24 h-24 mx-auto mb-8 relative">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#3EB4A2] to-[#2F4C39] animate-pulse" />
        <div className="absolute inset-1 rounded-full bg-[#1E1F22] flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-[#3EB4A2]" />
        </div>
        {/* Pulsing ring */}
        <div className="absolute -inset-2 rounded-full border-2 border-[#3EB4A2]/30 animate-ping" />
      </div>

      {/* Welcome Message */}
      <h1 className="text-4xl font-bold text-white mb-4">
        Bienvenue, <span className="text-[#D8B26A]">{userName}</span>
      </h1>
      
      <p className="text-xl text-[#E9E4D6]/80 mb-8">
        Je suis <span className="text-[#3EB4A2] font-semibold">Nova</span>, votre intelligence système. 
        Je vais vous guider dans la configuration de votre espace CHE·NU.
      </p>

      {/* Plan Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D8B26A]/20 rounded-full mb-12">
        <CheckCircle2 className="w-5 h-5 text-[#D8B26A]" />
        <span className="text-[#D8B26A] font-medium">Plan {planName} activé</span>
      </div>

      {/* What's Coming */}
      <div className="bg-[#1E1F22]/50 rounded-2xl border border-white/10 p-8 mb-8">
        <h3 className="text-lg font-semibold text-white mb-6">Ce que nous allons faire ensemble:</h3>
        <div className="grid md:grid-cols-3 gap-6 text-left">
          {[
            { step: '1', title: 'Votre profil', desc: 'Quelques informations pour personnaliser' },
            { step: '2', title: 'Vos sphères', desc: 'Choisir les contextes à activer' },
            { step: '3', title: 'Vos préférences', desc: 'Configurer votre expérience' },
          ].map((item) => (
            <div key={item.step} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#3EB4A2]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[#3EB4A2] font-bold text-sm">{item.step}</span>
              </div>
              <div>
                <h4 className="text-white font-medium">{item.title}</h4>
                <p className="text-[#E9E4D6]/50 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Duration */}
      <p className="text-[#E9E4D6]/50 text-sm mb-8">
        ⏱️ Durée estimée: 3-5 minutes
      </p>

      {/* Start Button */}
      <button
        onClick={onStart}
        className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#D8B26A] to-[#7A593A] text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all"
      >
        Commencer avec Nova
        <ArrowRight className="w-5 h-5" />
      </button>

      {/* Skip Option */}
      <p className="text-[#E9E4D6]/40 text-sm mt-6">
        <button className="hover:text-[#E9E4D6]/70 transition">
          Passer et configurer plus tard →
        </button>
      </p>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    plan: 'Découverte',
  });

  // Check authentication and load user data
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Simulate auth check - replace with real auth logic
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Get user data from auth context or API
        // For now, using mock data
        const planFromUrl = searchParams.get('plan') || 'free';
        const planNames: Record<string, string> = {
          free: 'Découverte',
          base: 'Base',
          pro: 'Pro',
          team: 'Team',
        };
        
        setUserData({
          firstName: 'Utilisateur', // Get from auth
          lastName: '',
          email: 'user@example.com',
          plan: planNames[planFromUrl] || 'Découverte',
        });
        
        setIsLoading(false);
      } catch (error) {
        // Not authenticated, redirect to login
        navigate('/login');
      }
    };
    
    checkAuth();
  }, [navigate, searchParams]);

  // Handle starting the onboarding wizard
  const handleStartOnboarding = () => {
    setShowWelcome(false);
    // Navigate to the actual onboarding wizard
    // This integrates with the existing CanonicalOnboardingWizard or OnboardingFlow
    navigate('/app/onboarding/wizard');
  };

  // Loading state
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Welcome screen (Nova greeting)
  if (showWelcome) {
    return (
      <WelcomeScreen
        userName={userData.firstName}
        planName={userData.plan}
        onStart={handleStartOnboarding}
      />
    );
  }

  // Render the actual onboarding wizard
  // This would import and render the existing components
  return (
    <div className="min-h-screen bg-[#1E1F22]">
      {/* 
        Here we would render the existing onboarding wizard:
        <CanonicalOnboardingWizard onComplete={handleComplete} />
        or
        <OnboardingFlow onComplete={handleComplete} />
      */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-white">
          <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-[#3EB4A2]" />
          <p>Chargement du wizard d'onboarding...</p>
          <p className="text-[#E9E4D6]/50 text-sm mt-2">
            Redirection vers /app/onboarding/wizard
          </p>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ONBOARDING COMPLETE PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export const OnboardingCompletePage: React.FC = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/app/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1E1F22] to-[#2F4C39] flex items-center justify-center p-6">
      {/* Celebration effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#D8B26A]/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative max-w-lg text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-[#3EB4A2] to-[#2F4C39] flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-white" />
        </div>

        <h1 className="text-4xl font-bold text-white mb-4">
          Configuration terminée! 🎉
        </h1>
        
        <p className="text-xl text-[#E9E4D6]/80 mb-8">
          Votre espace CHE·NU est prêt. Nova vous attend dans votre tableau de bord.
        </p>

        {/* Features Ready */}
        <div className="bg-[#1E1F22]/50 rounded-xl border border-white/10 p-6 mb-8">
          <div className="grid grid-cols-3 gap-4">
            {[
              { emoji: '🏠', label: 'Sphères actives' },
              { emoji: '✨', label: 'Nova prête' },
              { emoji: '🤖', label: 'Agents disponibles' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <span className="text-2xl mb-2 block">{item.emoji}</span>
                <span className="text-[#E9E4D6]/70 text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Auto redirect */}
        <p className="text-[#E9E4D6]/50 mb-6">
          Redirection dans {countdown} secondes...
        </p>

        <button
          onClick={() => navigate('/app/dashboard')}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#D8B26A] to-[#7A593A] text-white rounded-xl font-semibold hover:shadow-lg transition"
        >
          Accéder au tableau de bord
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default OnboardingPage;
