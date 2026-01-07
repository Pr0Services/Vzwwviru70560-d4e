/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — SECURITY PAGE                                   ║
 * ║                    Sécurité et protection des données                        ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, Lock, Key, Server, Eye, FileCheck,
  CheckCircle2, AlertTriangle, Globe, Fingerprint,
  Database, Network, Clock, Award
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════════

const securityFeatures = [
  {
    icon: Lock,
    title: 'Chiffrement AES-256',
    description: 'Toutes vos données sont chiffrées au repos avec l\'algorithme AES-256, le standard utilisé par les institutions financières.',
  },
  {
    icon: Network,
    title: 'TLS 1.3',
    description: 'Toutes les communications sont protégées par TLS 1.3, le protocole de sécurité le plus récent.',
  },
  {
    icon: Fingerprint,
    title: 'Authentification Multi-Facteurs',
    description: 'Protégez votre compte avec 2FA via application authenticator, SMS, ou clé de sécurité.',
  },
  {
    icon: Database,
    title: 'Isolation des données',
    description: 'Vos données sont isolées par sphère et par utilisateur. Aucun croisement possible sans autorisation.',
  },
  {
    icon: Eye,
    title: 'Audit Trail Immutable',
    description: 'Chaque action est enregistrée dans un journal immuable avec hash chain pour détecter toute altération.',
  },
  {
    icon: Server,
    title: 'Infrastructure SOC 2',
    description: 'Nos serveurs sont hébergés dans des datacenters certifiés SOC 2 Type II au Canada.',
  },
];

const certifications = [
  { name: 'SOC 2 Type II', status: 'Certifié' },
  { name: 'RGPD', status: 'Conforme' },
  { name: 'LPRPDE', status: 'Conforme' },
  { name: 'EU AI Act', status: 'En cours' },
  { name: 'ISO 27001', status: 'Planifié 2025' },
];

const practices = [
  {
    title: 'Tests de pénétration',
    description: 'Audits de sécurité trimestriels par des firmes indépendantes',
    frequency: 'Trimestriel',
  },
  {
    title: 'Revue de code',
    description: 'Chaque modification passe par une revue de sécurité',
    frequency: 'Continue',
  },
  {
    title: 'Formation équipe',
    description: 'Formation continue de nos équipes sur les bonnes pratiques',
    frequency: 'Mensuel',
  },
  {
    title: 'Bug Bounty',
    description: 'Programme de récompenses pour les chercheurs en sécurité',
    frequency: 'Permanent',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const SecurityPage: React.FC = () => {
  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-[#1E1F22] to-[#2F4C39]"
      role="main"
      aria-labelledby="page-title"
    >
      {/* Navigation */}
      <nav 
        className="fixed top-0 left-0 right-0 z-50 bg-[#1E1F22]/90 backdrop-blur-md border-b border-[#D8B26A]/20"
        role="navigation"
        aria-label="Navigation principale"
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3" aria-label="Accueil CHE·NU">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#D8B26A] to-[#7A593A] flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-2xl font-bold text-white">
              CHE<span className="text-[#D8B26A]">·</span>NU
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link to="/privacy" className="text-[#E9E4D6]/60 hover:text-[#D8B26A] text-sm transition">
              Confidentialité
            </Link>
            <Link to="/terms" className="text-[#E9E4D6]/60 hover:text-[#D8B26A] text-sm transition">
              Conditions
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-[#3EB4A2] to-[#2F4C39] flex items-center justify-center">
            <Shield className="w-10 h-10 text-white" aria-hidden="true" />
          </div>
          
          <h1 id="page-title" className="text-4xl md:text-5xl font-bold text-white mb-6">
            Sécurité et<br />
            <span className="text-[#3EB4A2]">Protection des Données</span>
          </h1>
          
          <p className="text-xl text-[#E9E4D6]/80 max-w-2xl mx-auto">
            La sécurité n'est pas une fonctionnalité chez CHE·NU, c'est une fondation. 
            Vos données sont protégées par les standards les plus stricts de l'industrie.
          </p>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16 px-6" aria-labelledby="features-title">
        <div className="max-w-6xl mx-auto">
          <h2 id="features-title" className="text-2xl font-bold text-white text-center mb-12">
            Mesures de sécurité
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
            {securityFeatures.map((feature, i) => (
              <article 
                key={i} 
                className="p-6 bg-[#1E1F22]/50 rounded-xl border border-white/10 hover:border-[#3EB4A2]/30 transition"
                role="listitem"
              >
                <div className="w-12 h-12 rounded-lg bg-[#3EB4A2]/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-[#3EB4A2]" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-[#E9E4D6]/60 text-sm">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Governance Model */}
      <section className="py-16 px-6 bg-[#1E1F22]/50" aria-labelledby="governance-title">
        <div className="max-w-4xl mx-auto">
          <h2 id="governance-title" className="text-2xl font-bold text-white text-center mb-4">
            Gouvernance IA: Votre Contrôle Absolu
          </h2>
          <p className="text-[#E9E4D6]/70 text-center mb-12 max-w-2xl mx-auto">
            CHE·NU suit le principe "Governance &gt; Execution". L'IA ne peut jamais agir sans votre approbation.
          </p>
          
          <div className="bg-[#2F4C39]/30 rounded-2xl p-8 border border-[#3EB4A2]/30">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl mb-3">🛡️</div>
                <h3 className="text-white font-semibold mb-2">Checkpoint</h3>
                <p className="text-[#E9E4D6]/60 text-sm">
                  Chaque action significative passe par un checkpoint pour votre approbation
                </p>
              </div>
              <div>
                <div className="text-4xl mb-3">👁️</div>
                <h3 className="text-white font-semibold mb-2">Transparence</h3>
                <p className="text-[#E9E4D6]/60 text-sm">
                  Vous voyez exactement ce que l'IA va faire avant de l'autoriser
                </p>
              </div>
              <div>
                <div className="text-4xl mb-3">📜</div>
                <h3 className="text-white font-semibold mb-2">Audit</h3>
                <p className="text-[#E9E4D6]/60 text-sm">
                  Historique complet et immuable de toutes les décisions IA
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 px-6" aria-labelledby="certifications-title">
        <div className="max-w-4xl mx-auto">
          <h2 id="certifications-title" className="text-2xl font-bold text-white text-center mb-12">
            Conformité et Certifications
          </h2>
          
          <div className="grid md:grid-cols-5 gap-4" role="list">
            {certifications.map((cert, i) => (
              <div 
                key={i} 
                className="p-4 bg-[#1E1F22] rounded-xl border border-white/10 text-center"
                role="listitem"
              >
                <Award className="w-8 h-8 text-[#D8B26A] mx-auto mb-3" aria-hidden="true" />
                <div className="text-white font-medium text-sm mb-1">{cert.name}</div>
                <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                  cert.status === 'Certifié' || cert.status === 'Conforme'
                    ? 'bg-[#3EB4A2]/20 text-[#3EB4A2]'
                    : 'bg-[#D8B26A]/20 text-[#D8B26A]'
                }`}>
                  {cert.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Practices */}
      <section className="py-16 px-6 bg-[#1E1F22]/50" aria-labelledby="practices-title">
        <div className="max-w-4xl mx-auto">
          <h2 id="practices-title" className="text-2xl font-bold text-white text-center mb-12">
            Pratiques de Sécurité
          </h2>
          
          <div className="space-y-4" role="list">
            {practices.map((practice, i) => (
              <div 
                key={i} 
                className="flex items-center gap-6 p-5 bg-[#1E1F22] rounded-xl border border-white/10"
                role="listitem"
              >
                <div className="w-12 h-12 rounded-lg bg-[#D8B26A]/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-[#D8B26A]" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium">{practice.title}</h3>
                  <p className="text-[#E9E4D6]/60 text-sm">{practice.description}</p>
                </div>
                <div className="px-3 py-1 bg-[#3EB4A2]/20 text-[#3EB4A2] text-sm rounded-full">
                  {practice.frequency}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Report Vulnerability */}
      <section className="py-16 px-6" aria-labelledby="vulnerability-title">
        <div className="max-w-3xl mx-auto text-center">
          <AlertTriangle className="w-12 h-12 text-[#D8B26A] mx-auto mb-6" aria-hidden="true" />
          <h2 id="vulnerability-title" className="text-2xl font-bold text-white mb-4">
            Signaler une vulnérabilité
          </h2>
          <p className="text-[#E9E4D6]/70 mb-8">
            Vous avez découvert une faille de sécurité? Nous prenons cela très au sérieux. 
            Contactez notre équipe de sécurité de manière responsable.
          </p>
          <a
            href="mailto:security@che-nu.com"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#D8B26A] to-[#7A593A] text-white rounded-xl font-semibold hover:shadow-lg transition"
          >
            <Key className="w-5 h-5" aria-hidden="true" />
            security@che-nu.com
          </a>
          <p className="text-[#E9E4D6]/50 text-sm mt-4">
            Programme Bug Bounty disponible pour les chercheurs qualifiés
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[#E9E4D6]/50 text-sm">
            © 2025 CHE·NU Inc. Tous droits réservés.
          </div>
          <nav className="flex gap-6" aria-label="Liens du pied de page">
            <Link to="/privacy" className="text-[#E9E4D6]/50 hover:text-[#D8B26A] text-sm transition">
              Confidentialité
            </Link>
            <Link to="/terms" className="text-[#E9E4D6]/50 hover:text-[#D8B26A] text-sm transition">
              Conditions
            </Link>
            <Link to="/" className="text-[#E9E4D6]/50 hover:text-[#D8B26A] text-sm transition">
              Accueil
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default SecurityPage;
