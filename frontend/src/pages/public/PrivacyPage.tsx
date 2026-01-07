/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — PRIVACY POLICY PAGE                             ║
 * ║                    Politique de confidentialité                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Database, UserCheck, Globe, Mail } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════════

const lastUpdated = '1er janvier 2025';

const sections = [
  {
    id: 'introduction',
    title: '1. Introduction',
    content: `
CHE·NU Inc. ("CHE·NU", "nous", "notre") s'engage à protéger votre vie privée. Cette politique de confidentialité explique comment nous collectons, utilisons, stockons et protégeons vos informations personnelles lorsque vous utilisez notre plateforme CHE·NU™ (le "Service").

En utilisant CHE·NU, vous acceptez les pratiques décrites dans cette politique. Si vous n'acceptez pas cette politique, veuillez ne pas utiliser notre Service.
    `.trim(),
  },
  {
    id: 'data-collection',
    title: '2. Données que nous collectons',
    content: `
**Informations que vous nous fournissez:**
- Informations de compte: nom, email, mot de passe, photo de profil
- Informations professionnelles: entreprise, poste, secteur d'activité
- Contenu utilisateur: notes, tâches, projets, threads, fichiers
- Préférences: sphères actives, paramètres de l'interface, langue

**Informations collectées automatiquement:**
- Données d'utilisation: interactions avec l'interface, fonctionnalités utilisées
- Données techniques: type d'appareil, navigateur, adresse IP, logs de connexion
- Données de performance: temps de réponse, erreurs système

**Données IA:**
- Historique des conversations avec Nova et les agents
- Tokens consommés par requête
- Décisions de checkpoint (approbations/refus)
    `.trim(),
  },
  {
    id: 'data-usage',
    title: '3. Utilisation de vos données',
    content: `
Nous utilisons vos données pour:

**Fournir le Service:**
- Créer et gérer votre compte
- Personnaliser votre expérience par sphère
- Exécuter les requêtes IA via Nova et les agents
- Synchroniser vos données entre appareils

**Améliorer le Service:**
- Analyser les patterns d'utilisation (anonymisés)
- Optimiser les performances
- Développer de nouvelles fonctionnalités

**Communications:**
- Notifications relatives au Service
- Alertes de sécurité
- Mises à jour importantes (vous pouvez vous désabonner du marketing)

**CE QUE NOUS NE FAISONS JAMAIS:**
- ❌ Vendre vos données personnelles
- ❌ Utiliser vos données pour entraîner des modèles IA tiers
- ❌ Partager vos contenus avec des annonceurs
- ❌ Profiler pour de la publicité ciblée
    `.trim(),
  },
  {
    id: 'data-storage',
    title: '4. Stockage et sécurité',
    content: `
**Sécurité technique:**
- Chiffrement AES-256 au repos pour toutes les données
- TLS 1.3 pour toutes les transmissions
- Infrastructure hébergée sur des serveurs certifiés SOC 2
- Isolation des données par utilisateur et par sphère

**Conservation des données:**
- Données de compte: conservées tant que le compte est actif
- Contenu utilisateur: conservé jusqu'à suppression par l'utilisateur
- Logs techniques: 90 jours
- Audit trail (hash chain): 7 ans (obligation légale)

**Localisation:**
- Serveurs principaux: Canada (Montréal)
- Redondance: États-Unis (Virginie)
- Option on-premise disponible pour Enterprise
    `.trim(),
  },
  {
    id: 'data-sharing',
    title: '5. Partage de données',
    content: `
Nous ne partageons vos données personnelles qu'avec:

**Fournisseurs de services:**
- Hébergement cloud (infrastructure)
- Fournisseurs d'IA (Anthropic, OpenAI) - uniquement les requêtes, pas vos données personnelles
- Services de paiement (Stripe)

**Obligations légales:**
- Ordonnances judiciaires
- Demandes légitimes des autorités
- Protection de nos droits légaux

**Avec votre consentement:**
- Intégrations tierces que vous activez (Google, Microsoft, etc.)
- Partage de projets avec d'autres utilisateurs

Nous exigeons contractuellement que tous nos partenaires respectent des normes de confidentialité équivalentes.
    `.trim(),
  },
  {
    id: 'your-rights',
    title: '6. Vos droits (RGPD & LPRPDE)',
    content: `
Vous avez le droit de:

**Accès:** Demander une copie de toutes vos données personnelles
**Rectification:** Corriger des informations inexactes
**Suppression:** Demander l'effacement de vos données ("droit à l'oubli")
**Portabilité:** Recevoir vos données dans un format standard
**Opposition:** Refuser certains traitements de données
**Limitation:** Restreindre le traitement dans certains cas

**Pour exercer vos droits:**
Email: privacy@che-nu.com
Délai de réponse: 30 jours maximum

**Suppression de compte:**
- Vous pouvez supprimer votre compte à tout moment dans Paramètres
- Vos données sont supprimées sous 30 jours
- Certaines données peuvent être conservées pour obligations légales
    `.trim(),
  },
  {
    id: 'ai-transparency',
    title: '7. Transparence IA',
    content: `
CHE·NU utilise l'intelligence artificielle de manière gouvernée:

**Modèles utilisés:**
- Claude (Anthropic) pour Nova et agents spécialisés
- GPT-4 (OpenAI) pour certaines tâches
- Modèles locaux pour optimisation des coûts

**Ce que l'IA voit:**
- Votre requête et le contexte de la sphère active
- Historique du thread en cours (si applicable)
- Jamais de données d'autres sphères sans autorisation

**Gouvernance:**
- Checkpoint humain obligatoire avant toute action
- Vous décidez d'approuver ou refuser chaque action
- Audit trail complet de toutes les décisions IA

**Entraînement:**
- Vos données ne sont JAMAIS utilisées pour entraîner des modèles IA
- Nous utilisons uniquement des modèles pré-entraînés par nos partenaires
    `.trim(),
  },
  {
    id: 'cookies',
    title: '8. Cookies et technologies similaires',
    content: `
CHE·NU utilise des cookies essentiels uniquement:

**Cookies strictement nécessaires:**
- Authentification et session
- Préférences de langue et thème
- Sécurité (CSRF protection)

**Nous n'utilisons PAS:**
- Cookies publicitaires
- Cookies de tracking tiers
- Pixels de remarketing

Vous pouvez configurer votre navigateur pour bloquer les cookies, mais cela pourrait affecter le fonctionnement du Service.
    `.trim(),
  },
  {
    id: 'children',
    title: '9. Protection des mineurs',
    content: `
CHE·NU n'est pas destiné aux personnes de moins de 16 ans. Nous ne collectons pas sciemment d'informations personnelles auprès de mineurs.

Si vous êtes parent et pensez que votre enfant nous a fourni des données personnelles, contactez-nous à privacy@che-nu.com pour demander leur suppression.
    `.trim(),
  },
  {
    id: 'changes',
    title: '10. Modifications de cette politique',
    content: `
Nous pouvons mettre à jour cette politique de confidentialité périodiquement. En cas de modification substantielle:

- Nous vous informerons par email ou notification dans l'application
- La date "Dernière mise à jour" sera actualisée
- Votre utilisation continue du Service après notification vaut acceptation

Pour les modifications mineures (clarifications, corrections), la mise à jour se fait sans notification.
    `.trim(),
  },
  {
    id: 'contact',
    title: '11. Nous contacter',
    content: `
Pour toute question concernant cette politique ou vos données:

**Délégué à la Protection des Données:**
Email: privacy@che-nu.com

**Adresse postale:**
CHE·NU Inc.
Montréal, Québec, Canada

**Autorité de contrôle:**
Si vous n'êtes pas satisfait de notre réponse, vous pouvez contacter:
- Canada: Commissariat à la protection de la vie privée
- France: CNIL (Commission Nationale de l'Informatique et des Libertés)
- UE: Autorité de protection des données de votre pays
    `.trim(),
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1E1F22] to-[#2F4C39]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1E1F22]/90 backdrop-blur-md border-b border-[#D8B26A]/20">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#D8B26A] to-[#7A593A] flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-2xl font-bold text-white">
              CHE<span className="text-[#D8B26A]">·</span>NU
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/terms" className="text-[#E9E4D6]/60 hover:text-[#D8B26A] text-sm">
              Conditions
            </Link>
            <Link to="/security" className="text-[#E9E4D6]/60 hover:text-[#D8B26A] text-sm">
              Sécurité
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-[#3EB4A2]/20 flex items-center justify-center">
              <Shield className="w-7 h-7 text-[#3EB4A2]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Politique de Confidentialité
              </h1>
              <p className="text-[#E9E4D6]/60">
                Dernière mise à jour: {lastUpdated}
              </p>
            </div>
          </div>
          
          {/* Key Points */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            {[
              { icon: Lock, text: 'Chiffrement AES-256' },
              { icon: Eye, text: 'Zéro tracking publicitaire' },
              { icon: Database, text: 'Vos données vous appartiennent' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-[#1E1F22]/50 rounded-xl border border-white/10">
                <item.icon className="w-5 h-5 text-[#D8B26A]" />
                <span className="text-white text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="px-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1E1F22]/50 rounded-xl border border-white/10 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Table des matières</h2>
            <div className="grid md:grid-cols-2 gap-2">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-[#E9E4D6]/70 hover:text-[#D8B26A] text-sm py-1 transition"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto space-y-12">
          {sections.map((section) => (
            <div key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="text-xl font-semibold text-[#D8B26A] mb-4">
                {section.title}
              </h2>
              <div className="prose prose-invert max-w-none">
                {section.content.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="text-[#E9E4D6]/80 mb-4 whitespace-pre-line">
                    {paragraph.split('**').map((part, j) => 
                      j % 2 === 1 ? <strong key={j} className="text-white">{part}</strong> : part
                    )}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-[#3EB4A2]/20 to-[#D8B26A]/20 rounded-2xl p-8 text-center">
            <Mail className="w-10 h-10 text-[#D8B26A] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Des questions sur vos données?
            </h3>
            <p className="text-[#E9E4D6]/70 mb-6">
              Notre équipe est là pour vous aider
            </p>
            <a
              href="mailto:privacy@che-nu.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#D8B26A] to-[#7A593A] text-white rounded-lg font-medium hover:shadow-lg transition"
            >
              privacy@che-nu.com
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[#E9E4D6]/50 text-sm">
            © 2025 CHE·NU Inc. Tous droits réservés.
          </div>
          <div className="flex gap-6">
            <Link to="/terms" className="text-[#E9E4D6]/50 hover:text-[#D8B26A] text-sm">Conditions</Link>
            <Link to="/security" className="text-[#E9E4D6]/50 hover:text-[#D8B26A] text-sm">Sécurité</Link>
            <Link to="/" className="text-[#E9E4D6]/50 hover:text-[#D8B26A] text-sm">Accueil</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPage;
