/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — SERVICES                                        ║
 * ║                    PRE-LOGIN — CAPABILITIES, NOT FEATURES                    ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

// Transversal capabilities (conceptual, not actionable)
const capabilities = [
  {
    id: 'governed',
    title: 'Intelligence gouvernée',
    description: 'Le système soumet chaque proposition à validation humaine. Rien ne s\'exécute sans approbation explicite.',
  },
  {
    id: 'contextual',
    title: 'Raisonnement contextuel',
    description: 'Le système sépare les contextes de pensée. Ce qui appartient à un domaine reste dans ce domaine.',
  },
  {
    id: 'auditable',
    title: 'Mémoire auditable',
    description: 'Le système enregistre chaque décision avec son contexte. Tout reste traçable.',
  },
  {
    id: 'explicit',
    title: 'Règles explicites',
    description: 'Le système rend visibles les contraintes qui s\'appliquent. Les limites sont connues.',
  },
  {
    id: 'progressive',
    title: 'Construction progressive',
    description: 'Le système ne pré-remplit rien. Tout se construit par intention.',
  },
];

// Domains (where, not how)
const domains = [
  { name: 'Personnel', context: 'Espace privé de réflexion.' },
  { name: 'Entreprise', context: 'Espace de raisonnement organisationnel.' },
  { name: 'Studio', context: 'Espace de conception.' },
  { name: 'Social', context: 'Espace de présence.' },
  { name: 'Communauté', context: 'Espace de coordination collective.' },
  { name: 'Gouvernement', context: 'Espace institutionnel.' },
  { name: 'Scholars', context: 'Espace de recherche.' },
  { name: 'Mon Équipe', context: 'Espace de collaboration.' },
];

const Navigation: React.FC = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1E1F22]/95 backdrop-blur-md border-b border-[#D8B26A]/10">
    <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#D8B26A] to-[#7A593A] flex items-center justify-center">
          <span className="text-[#1E1F22] font-bold">C·N</span>
        </div>
        <span className="text-xl font-semibold text-[#E9E4D6]">CHE<span className="text-[#D8B26A]">·</span>NU</span>
      </Link>
      <div className="hidden md:flex items-center gap-8">
        <Link to="/services" className="text-[#D8B26A] text-sm font-medium">Services</Link>
        <Link to="/demo" className="text-[#E9E4D6]/70 hover:text-[#D8B26A] transition text-sm">Comprendre</Link>
        <Link to="/faq" className="text-[#E9E4D6]/70 hover:text-[#D8B26A] transition text-sm">Questions</Link>
      </div>
      <Link to="/login" className="text-[#E9E4D6]/70 hover:text-[#D8B26A] transition text-sm">Connexion</Link>
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

export const ServicesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#1E1F22] flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-24 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          
          <Link to="/" className="inline-flex items-center gap-2 text-[#8D8371] hover:text-[#D8B26A] text-sm mb-12 transition">
            <ChevronLeft className="w-4 h-4" />
            Retour
          </Link>
          
          <h1 className="text-2xl font-light text-[#E9E4D6] mb-16">
            Ce que le système rend possible.
          </h1>
          
          {/* Capabilities */}
          <section className="mb-16">
            <h2 className="text-sm uppercase tracking-wider text-[#8D8371] mb-8">Capacités</h2>
            <div className="space-y-8">
              {capabilities.map((cap) => (
                <div key={cap.id}>
                  <h3 className="text-[#E9E4D6] font-medium mb-1">{cap.title}</h3>
                  <p className="text-[#8D8371] text-sm leading-relaxed">{cap.description}</p>
                </div>
              ))}
            </div>
          </section>
          
          {/* Divider */}
          <div className="w-12 h-px bg-[#D8B26A]/20 mb-16" />
          
          {/* Domains */}
          <section className="mb-16">
            <h2 className="text-sm uppercase tracking-wider text-[#8D8371] mb-8">Domaines</h2>
            <div className="grid grid-cols-2 gap-4">
              {domains.map((domain) => (
                <div key={domain.name} className="p-3 rounded bg-[#1E1F22]/50 border border-[#8D8371]/10">
                  <p className="text-[#E9E4D6] text-sm font-medium">{domain.name}</p>
                  <p className="text-[#8D8371] text-xs">{domain.context}</p>
                </div>
              ))}
            </div>
          </section>
          
          {/* Navigation */}
          <Link to="/demo" className="text-[#D8B26A] hover:text-[#E9E4D6] text-sm transition">
            Comprendre la logique →
          </Link>
          
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export const FeaturesPage = ServicesPage;
export default ServicesPage;
