/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — COMPRENDRE                                      ║
 * ║                    PRE-LOGIN — LOGIC, NOT ACTIONS                            ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Chapters — reasoning, not usage
interface Chapter {
  id: string;
  number: number;
  title: string;
  content: string[];
}

const chapters: Chapter[] = [
  {
    id: 'limits',
    number: 1,
    title: 'Les limites des outils actuels',
    content: [
      'Les outils d\'intelligence artificielle actuels exécutent sans gouvernance. L\'utilisateur délègue à des systèmes qu\'il ne contrôle pas.',
      'Le résultat: une perte de clarté sur ce qui se passe, pourquoi, et à quel coût.',
      'CHE·NU part d\'un constat: le problème n\'est pas l\'intelligence. C\'est l\'absence de gouvernance.',
    ],
  },
  {
    id: 'human',
    number: 2,
    title: 'Commencer par l\'humain',
    content: [
      'CHE·NU ne part pas de ce que l\'IA peut faire. Il part de ce que l\'humain a besoin de comprendre.',
      'Besoin de clarté: savoir ce qui se passe. Besoin de contrôle: décider ce qui s\'exécute. Besoin de contexte: séparer les domaines de pensée.',
      'Le système ne fait rien sans approbation explicite. Chaque proposition passe par un checkpoint.',
    ],
  },
  {
    id: 'structure',
    number: 3,
    title: 'Personnel, Équipe, Sphères',
    content: [
      'Tout commence par l\'espace Personnel. Fondation privée. Rien n\'est partagé par défaut.',
      'Ensuite vient Mon Équipe. Configuration des agents et des règles. Définition des contraintes.',
      'Les sphères contextuelles s\'ouvrent selon les besoins. Chacune isole ses données et sa logique.',
    ],
  },
  {
    id: 'governance',
    number: 4,
    title: 'Gouvernance et validation',
    content: [
      'Chaque action conséquente passe par un checkpoint. Le système propose, l\'humain dispose.',
      'Tout est enregistré. Chaque décision peut être revue. L\'historique reste accessible.',
      'Cette validation n\'est pas un frein. C\'est ce qui rend la confiance possible.',
    ],
  },
  {
    id: 'boundary',
    number: 5,
    title: 'Avant et après la connexion',
    content: [
      'Avant la connexion, le système s\'explique. Il ne démontre pas. Il ne simule pas.',
      'Après la connexion, le système s\'ouvre. L\'utilisateur entre dans un espace gouverné.',
      'La frontière est nette. Ce qui est accessible avant n\'est pas ce qui est accessible après.',
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
        <Link to="/demo" className="text-[#D8B26A] text-sm font-medium">Comprendre</Link>
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

export const DemoPage: React.FC = () => {
  const [currentChapter, setCurrentChapter] = useState(0);
  const chapter = chapters[currentChapter];
  
  const goToNext = () => {
    if (currentChapter < chapters.length - 1) setCurrentChapter(currentChapter + 1);
  };
  
  const goToPrev = () => {
    if (currentChapter > 0) setCurrentChapter(currentChapter - 1);
  };

  return (
    <div className="min-h-screen bg-[#1E1F22] flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-24 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          
          <Link to="/" className="inline-flex items-center gap-2 text-[#8D8371] hover:text-[#D8B26A] text-sm mb-12 transition">
            <ChevronLeft className="w-4 h-4" />
            Retour
          </Link>
          
          {/* Notice */}
          <p className="text-[#8D8371] text-sm mb-12">
            Ceci explique la logique du système. Ce n'est pas une démonstration d'usage.
          </p>
          
          {/* Chapter Navigation (left) */}
          <div className="grid md:grid-cols-[200px,1fr] gap-12">
            
            <aside className="hidden md:block">
              <div className="sticky top-28 space-y-2">
                {chapters.map((ch, idx) => (
                  <button
                    key={ch.id}
                    onClick={() => setCurrentChapter(idx)}
                    className={`w-full text-left p-2 rounded text-sm transition ${
                      idx === currentChapter
                        ? 'text-[#D8B26A]'
                        : 'text-[#8D8371] hover:text-[#E9E4D6]'
                    }`}
                  >
                    {ch.number}. {ch.title}
                  </button>
                ))}
              </div>
            </aside>
            
            {/* Content */}
            <article>
              <span className="text-[#8D8371] text-xs">{chapter.number} / {chapters.length}</span>
              <h1 className="text-xl font-light text-[#E9E4D6] mt-2 mb-8">{chapter.title}</h1>
              
              <div className="space-y-6">
                {chapter.content.map((p, i) => (
                  <p key={i} className="text-[#E9E4D6]/70 leading-relaxed">{p}</p>
                ))}
              </div>
              
              {/* Nav */}
              <div className="flex items-center justify-between mt-12 pt-8 border-t border-[#D8B26A]/10">
                <button
                  onClick={goToPrev}
                  disabled={currentChapter === 0}
                  className={`text-sm ${currentChapter === 0 ? 'text-[#8D8371]/30' : 'text-[#8D8371] hover:text-[#D8B26A]'}`}
                >
                  ← Précédent
                </button>
                
                {currentChapter < chapters.length - 1 ? (
                  <button onClick={goToNext} className="text-sm text-[#D8B26A] hover:text-[#E9E4D6]">
                    Suivant →
                  </button>
                ) : (
                  <Link to="/faq" className="text-sm text-[#D8B26A] hover:text-[#E9E4D6]">
                    Questions →
                  </Link>
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

export default DemoPage;
