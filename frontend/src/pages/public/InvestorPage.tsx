/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — INVESTISSEURS                                   ║
 * ║                    PRE-LOGIN — RESTRAINT, NO PROMISES                        ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface Layer {
  id: string;
  number: number;
  title: string;
  content: string[];
}

const layers: Layer[] = [
  {
    id: 'why',
    number: 1,
    title: 'Pourquoi CHE·NU existe',
    content: [
      'Les systèmes d\'intelligence artificielle actuels posent un problème de gouvernance. L\'utilisateur délègue sans contrôler.',
      'CHE·NU propose une structure différente. Le système soumet chaque proposition à validation humaine.',
      'Cette approche limite certains usages. Elle en rend d\'autres possibles.',
    ],
  },
  {
    id: 'governance',
    number: 2,
    title: 'Gouvernance et confiance',
    content: [
      'Le système applique le principe "Gouvernance > Exécution". Rien ne s\'exécute sans approbation explicite.',
      'Chaque décision est enregistrée. L\'historique reste auditable. Les règles sont explicites.',
      'Cette structure répond aux exigences de transparence et de conformité.',
    ],
  },
  {
    id: 'architecture',
    number: 3,
    title: 'Architecture',
    content: [
      'Le système sépare les contextes en 9 sphères. Chaque sphère isole ses données et sa logique.',
      'L\'architecture est fixe. Le nombre de sphères ne changera pas. Les checkpoints ne peuvent pas être désactivés.',
      'Ces contraintes sont des choix de conception, pas des limitations techniques.',
    ],
  },
  {
    id: 'viability',
    number: 4,
    title: 'Viabilité',
    content: [
      'Le modèle économique repose sur les abonnements. Les données ne sont pas vendues.',
      'La structure tarifaire distingue particuliers et entreprises. Les coûts sont transparents.',
      'Le développement est progressif. La croissance dépend de l\'adoption.',
    ],
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
        <Link to="/demo" className="text-[#E9E4D6]/70 hover:text-[#D8B26A] transition text-sm">Comprendre</Link>
        <Link to="/investor" className="text-[#D8B26A] text-sm font-medium">Investisseurs</Link>
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

export const InvestorPage: React.FC = () => {
  const [currentLayer, setCurrentLayer] = useState(0);
  const layer = layers[currentLayer];

  return (
    <div className="min-h-screen bg-[#1E1F22] flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-24 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          
          <Link to="/" className="inline-flex items-center gap-2 text-[#8D8371] hover:text-[#D8B26A] text-sm mb-12 transition">
            <ChevronLeft className="w-4 h-4" />
            Retour
          </Link>
          
          <h1 className="text-2xl font-light text-[#E9E4D6] mb-4">Investisseurs</h1>
          <p className="text-[#8D8371] text-sm mb-12">
            Documentation structurée. Pas de promesses.
          </p>
          
          {/* Layer navigation */}
          <div className="grid md:grid-cols-[180px,1fr] gap-10">
            
            <aside className="hidden md:block">
              <div className="sticky top-28 space-y-2">
                {layers.map((l, idx) => (
                  <button
                    key={l.id}
                    onClick={() => setCurrentLayer(idx)}
                    className={`w-full text-left p-2 rounded text-sm transition ${
                      idx === currentLayer ? 'text-[#D8B26A]' : 'text-[#8D8371] hover:text-[#E9E4D6]'
                    }`}
                  >
                    {l.number}. {l.title}
                  </button>
                ))}
              </div>
            </aside>
            
            <article>
              <span className="text-[#8D8371] text-xs">{layer.number} / {layers.length}</span>
              <h2 className="text-lg font-light text-[#E9E4D6] mt-2 mb-6">{layer.title}</h2>
              
              <div className="space-y-4">
                {layer.content.map((p, i) => (
                  <p key={i} className="text-[#E9E4D6]/70 text-sm leading-relaxed">{p}</p>
                ))}
              </div>
              
              {/* Nav */}
              <div className="flex items-center justify-between mt-10 pt-6 border-t border-[#D8B26A]/10">
                <button
                  onClick={() => currentLayer > 0 && setCurrentLayer(currentLayer - 1)}
                  disabled={currentLayer === 0}
                  className={`text-xs ${currentLayer === 0 ? 'text-[#8D8371]/30' : 'text-[#8D8371] hover:text-[#D8B26A]'}`}
                >
                  ← Précédent
                </button>
                
                {currentLayer < layers.length - 1 ? (
                  <button 
                    onClick={() => setCurrentLayer(currentLayer + 1)} 
                    className="text-xs text-[#D8B26A] hover:text-[#E9E4D6]"
                  >
                    Suivant →
                  </button>
                ) : (
                  <a href="mailto:investors@chenu.ai" className="text-xs text-[#D8B26A] hover:text-[#E9E4D6]">
                    Contact →
                  </a>
                )}
              </div>
            </article>
            
          </div>
          
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default InvestorPage;
