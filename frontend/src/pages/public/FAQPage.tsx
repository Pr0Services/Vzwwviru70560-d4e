/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — QUESTIONS                                       ║
 * ║                    PRE-LOGIN — CLEARER NOs                                   ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  // What CHE·NU IS
  {
    question: "Qu'est-ce que CHE·NU?",
    answer: "Un système d'intelligence gouvernée. Pas un chatbot. Pas une application de productivité. Pas un réseau social. Pas une plateforme d'investissement."
  },
  {
    question: "Que signifie 'gouverné'?",
    answer: "Le système soumet chaque proposition à validation humaine. Rien ne s'exécute sans approbation explicite. Il n'y a pas d'exception."
  },
  
  // What CHE·NU is NOT
  {
    question: "CHE·NU remplace-t-il d'autres outils?",
    answer: "Non. CHE·NU n'est pas conçu pour remplacer. Il est conçu pour raisonner différemment."
  },
  {
    question: "Les tokens sont-ils une cryptomonnaie?",
    answer: "Non. Les tokens sont des unités de mesure internes. Ils n'ont aucune valeur spéculative. Ils ne s'échangent pas."
  },
  {
    question: "CHE·NU automatise-t-il des tâches?",
    answer: "Non. Le système ne cherche pas à automatiser. Il cherche à rendre visible. L'exécution reste humaine."
  },
  
  // Limits
  {
    question: "Le nombre de sphères peut-il changer?",
    answer: "Non. Le système a exactement 9 sphères. Cette limite est architecturale et ne changera pas."
  },
  {
    question: "Les checkpoints peuvent-ils être désactivés?",
    answer: "Non. Les checkpoints sont le fondement du système. Les désactiver reviendrait à supprimer la gouvernance."
  },
  {
    question: "Le système est-il rapide?",
    answer: "Non, au sens habituel. La gouvernance introduit des pauses intentionnelles. Si la vitesse est prioritaire, CHE·NU n'est pas adapté."
  },
  
  // Boundary
  {
    question: "Que se passe-t-il avant la connexion?",
    answer: "Le système s'explique. Il ne simule pas. Il n'y a pas d'aperçu de l'application."
  },
  {
    question: "Que se passe-t-il après la connexion?",
    answer: "L'utilisateur entre dans un espace gouverné. Il construit progressivement. Rien n'est pré-configuré."
  },
  
  // Data
  {
    question: "Les données sont-elles vendues?",
    answer: "Non. Les données ne sont pas vendues. Elles ne sont pas utilisées pour de la publicité. Elles ne sont pas partagées."
  },
  {
    question: "Les données peuvent-elles être supprimées?",
    answer: "Oui. Toute donnée peut être supprimée. La suppression est définitive."
  },
  
  // Honest limits
  {
    question: "CHE·NU convient-il à tout le monde?",
    answer: "Non. CHE·NU convient à ceux qui acceptent la gouvernance, les limites explicites, et la construction progressive. Pas à ceux qui cherchent de l'automatisation ou de la vitesse."
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
        <Link to="/faq" className="text-[#D8B26A] text-sm font-medium">Questions</Link>
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

const FAQItemComponent: React.FC<{ item: FAQItem; isOpen: boolean; onToggle: () => void }> = ({ item, isOpen, onToggle }) => (
  <div className="border-b border-[#D8B26A]/10">
    <button onClick={onToggle} className="w-full py-4 flex items-start justify-between gap-4 text-left">
      <span className={`text-sm transition ${isOpen ? 'text-[#D8B26A]' : 'text-[#E9E4D6]'}`}>{item.question}</span>
      <ChevronDown className={`w-4 h-4 text-[#8D8371] flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    {isOpen && (
      <p className="pb-4 text-[#8D8371] text-sm leading-relaxed">{item.answer}</p>
    )}
  </div>
);

export const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#1E1F22] flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-24 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          
          <Link to="/" className="inline-flex items-center gap-2 text-[#8D8371] hover:text-[#D8B26A] text-sm mb-12 transition">
            <ChevronLeft className="w-4 h-4" />
            Retour
          </Link>
          
          <h1 className="text-2xl font-light text-[#E9E4D6] mb-4">Questions</h1>
          <p className="text-[#8D8371] text-sm mb-12">Certaines réponses sont des limites.</p>
          
          <div className="mb-12">
            {faqItems.map((item, index) => (
              <FAQItemComponent
                key={index}
                item={item}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>
          
          <Link to="/signup" className="text-[#D8B26A] hover:text-[#E9E4D6] text-sm transition">
            Rejoindre →
          </Link>
          
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQPage;
