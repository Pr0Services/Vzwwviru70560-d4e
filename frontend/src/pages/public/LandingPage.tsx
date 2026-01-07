/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — HOME / ACCUEIL                                  ║
 * ║                    PRE-LOGIN — INVITE, DON'T EXPLAIN                         ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

// Logo SVG (placeholder for minimal tree)
const ChenuLogo: React.FC<{ size?: number }> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D8B26A" />
        <stop offset="100%" stopColor="#7A593A" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="20" fill="url(#logoGrad)" />
    <text x="50" y="68" fontFamily="Georgia, serif" fontSize="36" fill="#1E1F22" textAnchor="middle" fontWeight="bold">C·N</text>
  </svg>
);

const Navigation: React.FC = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1E1F22]/95 backdrop-blur-md border-b border-[#D8B26A]/10">
    <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-3">
        <ChenuLogo size={40} />
        <span className="text-xl font-semibold text-[#E9E4D6]">CHE<span className="text-[#D8B26A]">·</span>NU</span>
      </Link>
      <div className="hidden md:flex items-center gap-8">
        <Link to="/services" className="text-[#E9E4D6]/70 hover:text-[#D8B26A] transition text-sm">Services</Link>
        <Link to="/demo" className="text-[#E9E4D6]/70 hover:text-[#D8B26A] transition text-sm">Comprendre</Link>
        <Link to="/faq" className="text-[#E9E4D6]/70 hover:text-[#D8B26A] transition text-sm">Questions</Link>
        <Link to="/investor" className="text-[#E9E4D6]/70 hover:text-[#D8B26A] transition text-sm">Investisseurs</Link>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/login" className="text-[#E9E4D6]/70 hover:text-[#D8B26A] transition text-sm">Connexion</Link>
        <Link to="/signup" className="px-4 py-2 bg-[#D8B26A]/10 border border-[#D8B26A]/30 text-[#D8B26A] text-sm rounded-lg hover:bg-[#D8B26A]/20 transition">Rejoindre</Link>
      </div>
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

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#1E1F22] flex flex-col">
      <Navigation />
      
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-24 pb-16">
        <div className="max-w-xl mx-auto text-center">
          
          {/* Logo */}
          <div className="mb-16">
            <ChenuLogo size={72} />
          </div>
          
          {/* Invitation — not explanation */}
          <p className="text-xl text-[#E9E4D6]/80 font-light leading-relaxed mb-20">
            Un système pour raisonner avec l'intelligence.
          </p>
          
          {/* Three words — no description */}
          <div className="flex justify-center gap-12 mb-20 text-[#8D8371] text-sm">
            <span>Gouverné</span>
            <span>·</span>
            <span>Contextuel</span>
            <span>·</span>
            <span>Auditable</span>
          </div>
          
          {/* Single action */}
          <Link 
            to="/demo"
            className="inline-flex items-center gap-2 text-[#D8B26A] hover:text-[#E9E4D6] transition text-sm"
          >
            Comprendre CHE·NU
            <ChevronRight className="w-4 h-4" />
          </Link>
          
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;
