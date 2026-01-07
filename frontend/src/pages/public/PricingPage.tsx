/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — TARIFS                                          ║
 * ║                    PRE-LOGIN — NO IMPLICIT PROMISES                          ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Users, Building2 } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  billing: string;
  limits: string[];
}

const individualPlans: Plan[] = [
  {
    id: 'decouverte',
    name: 'Découverte',
    price: 0,
    billing: 'Gratuit',
    limits: ['75 requêtes/mois', '1 GB', '1 agent', '3 sphères'],
  },
  {
    id: 'base',
    name: 'Base',
    price: 9.99,
    billing: '/mois',
    limits: ['200 requêtes/mois', '5 GB', '3 agents', '6 sphères'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 39.99,
    billing: '/mois',
    limits: ['1 000 requêtes/mois', '25 GB', '10 agents', '9 sphères'],
  },
];

const enterprisePlans: Plan[] = [
  {
    id: 'my_team',
    name: 'Team',
    price: 99,
    billing: '/mois',
    limits: ['15 utilisateurs', '5 000 requêtes/mois', '100 GB', '25 agents'],
  },
  {
    id: 'business',
    name: 'Business',
    price: 299,
    billing: '/mois',
    limits: ['50 utilisateurs', '20 000 requêtes/mois', '500 GB', '100 agents'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 599,
    billing: '/mois',
    limits: ['200 utilisateurs', '75 000 requêtes/mois', '2 TB', '500 agents'],
  },
  {
    id: 'mega',
    name: 'Mega',
    price: 999,
    billing: '/mois',
    limits: ['Utilisateurs illimités', '200 000 requêtes/mois', '10 TB', 'Agents illimités'],
  },
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
        <Link to="/services" className="text-[#E9E4D6]/70 hover:text-[#D8B26A] transition text-sm">Services</Link>
        <Link to="/pricing" className="text-[#D8B26A] text-sm font-medium">Tarifs</Link>
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

const PlanCard: React.FC<{ plan: Plan }> = ({ plan }) => (
  <div className="p-5 rounded bg-[#1E1F22]/50 border border-[#8D8371]/10">
    <h3 className="text-sm font-medium text-[#E9E4D6] mb-2">{plan.name}</h3>
    <div className="mb-4">
      <span className="text-2xl font-light text-[#D8B26A]">
        {plan.price === 0 ? 'Gratuit' : `${plan.price}$`}
      </span>
      {plan.price > 0 && <span className="text-[#8D8371] text-xs">{plan.billing}</span>}
    </div>
    <ul className="space-y-1 mb-4">
      {plan.limits.map((limit, i) => (
        <li key={i} className="text-[#8D8371] text-xs">• {limit}</li>
      ))}
    </ul>
    <Link
      to={`/signup?plan=${plan.id}`}
      className="block w-full py-2 text-center text-xs border border-[#D8B26A]/30 text-[#D8B26A] rounded hover:bg-[#D8B26A]/10 transition"
    >
      Choisir
    </Link>
  </div>
);

export const PricingPage: React.FC = () => {
  const [showEnterprise, setShowEnterprise] = useState(false);

  return (
    <div className="min-h-screen bg-[#1E1F22] flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          
          <Link to="/" className="inline-flex items-center gap-2 text-[#8D8371] hover:text-[#D8B26A] text-sm mb-12 transition">
            <ChevronLeft className="w-4 h-4" />
            Retour
          </Link>
          
          <h1 className="text-2xl font-light text-[#E9E4D6] mb-4">Tarifs</h1>
          <p className="text-[#8D8371] text-sm mb-10">
            Les limites de chaque plan.
          </p>
          
          {/* Toggle */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => setShowEnterprise(false)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition ${
                !showEnterprise ? 'text-[#D8B26A] border border-[#D8B26A]/30' : 'text-[#8D8371]'
              }`}
            >
              <Users className="w-3 h-3" />
              Particuliers
            </button>
            <button
              onClick={() => setShowEnterprise(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition ${
                showEnterprise ? 'text-[#D8B26A] border border-[#D8B26A]/30' : 'text-[#8D8371]'
              }`}
            >
              <Building2 className="w-3 h-3" />
              Entreprises
            </button>
          </div>
          
          {/* Plans */}
          {!showEnterprise ? (
            <div className="grid md:grid-cols-3 gap-4 mb-12">
              {individualPlans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {enterprisePlans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          )}
          
          {/* Note */}
          <p className="text-[#8D8371] text-xs">
            Les requêtes non utilisées ne se cumulent pas. Les dépassements sont facturés séparément.
          </p>
          
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PricingPage;
