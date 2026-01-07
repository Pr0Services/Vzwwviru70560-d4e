/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — TERMS OF SERVICE PAGE                           ║
 * ║                    Conditions générales d'utilisation                        ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Scale, AlertTriangle, CheckCircle2, XCircle, Mail } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════════

const lastUpdated = '1er janvier 2025';
const effectiveDate = '1er janvier 2025';

const sections = [
  {
    id: 'acceptance',
    title: '1. Acceptation des conditions',
    content: `
En accédant ou en utilisant le service CHE·NU™ ("Service"), vous acceptez d'être lié par ces Conditions Générales d'Utilisation ("Conditions"). Si vous n'acceptez pas ces Conditions, vous ne pouvez pas utiliser le Service.

Ces Conditions constituent un accord juridiquement contraignant entre vous ("Utilisateur", "vous") et CHE·NU Inc. ("CHE·NU", "nous", "notre").

Nous nous réservons le droit de modifier ces Conditions à tout moment. Les modifications entrent en vigueur dès leur publication. Votre utilisation continue du Service après modification vaut acceptation des nouvelles Conditions.
    `.trim(),
  },
  {
    id: 'description',
    title: '2. Description du Service',
    content: `
CHE·NU est un Système d'Exploitation à Intelligence Gouvernée qui permet:

**Fonctionnalités principales:**
- Gestion de 9 sphères contextuelles (Personnel, Business, Gouvernement, Studio, Communauté, Social, Entertainment, Équipe, Scholars)
- Accès à Nova, l'intelligence système
- Utilisation d'agents IA spécialisés
- Système de gouvernance avec checkpoints
- Stockage et organisation de données

**Modèle de gouvernance:**
Le Service opère selon le principe "Gouvernance > Exécution". Toute action IA significative requiert votre approbation explicite via un checkpoint avant exécution.

**Disponibilité:**
Nous nous efforçons de maintenir le Service disponible 24/7, mais ne garantissons pas une disponibilité ininterrompue. Des maintenances programmées peuvent occasionner des interruptions temporaires.
    `.trim(),
  },
  {
    id: 'accounts',
    title: '3. Comptes utilisateurs',
    content: `
**Création de compte:**
- Vous devez avoir au moins 16 ans pour créer un compte
- Les informations fournies doivent être exactes et à jour
- Un compte par personne physique (sauf plans Équipe/Entreprise)
- Vous êtes responsable de la confidentialité de vos identifiants

**Sécurité du compte:**
- Utilisez un mot de passe fort et unique
- Activez l'authentification à deux facteurs (recommandé)
- Ne partagez jamais vos identifiants
- Informez-nous immédiatement de tout accès non autorisé

**Suspension et résiliation:**
Nous pouvons suspendre ou résilier votre compte si:
- Vous violez ces Conditions
- Vous utilisez le Service de manière frauduleuse
- Vous ne payez pas les frais applicables
- Votre compte est inactif depuis plus de 12 mois (plan gratuit)
    `.trim(),
  },
  {
    id: 'usage',
    title: '4. Utilisation acceptable',
    content: `
**Vous pouvez:**
✓ Utiliser le Service pour des fins personnelles ou professionnelles légitimes
✓ Stocker, organiser et traiter vos données
✓ Interagir avec Nova et les agents dans le respect des limites de votre plan
✓ Exporter vos données à tout moment
✓ Partager des projets avec d'autres utilisateurs autorisés

**Vous ne pouvez PAS:**
✗ Utiliser le Service pour des activités illégales
✗ Tenter de contourner les systèmes de sécurité ou de gouvernance
✗ Générer du contenu haineux, violent, diffamatoire ou pornographique
✗ Harceler, menacer ou intimider d'autres utilisateurs
✗ Usurper l'identité d'une autre personne ou entité
✗ Transmettre des virus, malwares ou code malveillant
✗ Surcharger intentionnellement nos systèmes (attaques DDoS)
✗ Revendre ou redistribuer le Service sans autorisation
✗ Extraire massivement des données (scraping) sans consentement
    `.trim(),
  },
  {
    id: 'ai-usage',
    title: '5. Utilisation de l\'IA',
    content: `
**Système de gouvernance:**
- Toute action IA significative passe par un checkpoint
- Vous êtes responsable des actions que vous approuvez
- Le refus d'un checkpoint annule l'action proposée
- L'audit trail conserve l'historique de vos décisions

**Limites de l'IA:**
- L'IA peut faire des erreurs ou fournir des informations inexactes
- Les réponses IA ne constituent pas des conseils professionnels (juridiques, médicaux, financiers)
- Vous devez vérifier les informations importantes de manière indépendante
- Nous ne garantissons pas l'exactitude des outputs IA

**Tokens et consommation:**
- Chaque requête consomme des tokens selon la complexité
- Les limites de tokens dépendent de votre plan
- Les tokens non utilisés ne sont pas reportés au mois suivant
- En cas de dépassement, les fonctionnalités IA sont suspendues jusqu'au renouvellement

**Contenu généré:**
- Vous êtes propriétaire du contenu que vous créez avec l'aide de l'IA
- Vous êtes responsable de l'utilisation du contenu généré
- Ne générez pas de contenu qui violerait des droits d'auteur tiers
    `.trim(),
  },
  {
    id: 'payment',
    title: '6. Paiement et facturation',
    content: `
**Plans et tarifs:**
- Plan Découverte: Gratuit (limites appliquées)
- Plans payants: Facturation mensuelle ou annuelle
- Les prix sont affichés en dollars américains (USD)
- Taxes applicables ajoutées selon votre juridiction

**Facturation:**
- Paiement par carte de crédit via Stripe
- Facturation automatique à chaque période
- Factures disponibles dans votre tableau de bord

**Modifications de prix:**
- Nous pouvons modifier les tarifs avec 30 jours de préavis
- Les changements n'affectent pas la période en cours
- Vous pouvez annuler avant l'entrée en vigueur des nouveaux tarifs

**Remboursements:**
- Garantie satisfait ou remboursé de 14 jours pour les nouveaux abonnés
- Pas de remboursement au prorata pour les annulations en cours de période
- Pas de remboursement pour les tokens consommés
    `.trim(),
  },
  {
    id: 'intellectual-property',
    title: '7. Propriété intellectuelle',
    content: `
**Propriété de CHE·NU:**
- Le Service, son code, design, logos et marques appartiennent à CHE·NU Inc.
- "CHE·NU", "Nova", et le logo sont des marques déposées
- Vous ne pouvez pas copier, modifier ou distribuer notre propriété intellectuelle

**Votre contenu:**
- Vous conservez tous les droits sur le contenu que vous créez ou téléchargez
- Vous nous accordez une licence limitée pour stocker et traiter votre contenu
- Cette licence est nécessaire pour fournir le Service
- Nous n'utilisons pas votre contenu à d'autres fins

**Contenu généré par IA:**
- Le contenu créé avec l'aide de l'IA vous appartient
- Certains outputs peuvent ne pas être protégeables par le droit d'auteur selon votre juridiction
- Vous êtes responsable de vérifier les implications légales dans votre juridiction
    `.trim(),
  },
  {
    id: 'liability',
    title: '8. Limitation de responsabilité',
    content: `
**Exclusions:**
DANS LA MESURE PERMISE PAR LA LOI, CHE·NU NE SERA PAS RESPONSABLE POUR:
- Les dommages indirects, consécutifs, spéciaux ou punitifs
- La perte de données, profits, revenus ou opportunités commerciales
- Les erreurs ou inexactitudes dans les outputs IA
- Les actions prises sur la base des recommandations IA
- Les interruptions de service ou problèmes techniques
- Les actions de tiers utilisant le Service

**Plafond de responsabilité:**
Notre responsabilité totale est limitée au montant que vous nous avez payé au cours des 12 derniers mois, ou 100 USD si vous utilisez le plan gratuit.

**Exceptions:**
Ces limitations ne s'appliquent pas aux cas de:
- Négligence grave ou faute intentionnelle de notre part
- Violation de vos droits fondamentaux
- Cas où la loi interdit de telles limitations
    `.trim(),
  },
  {
    id: 'indemnification',
    title: '9. Indemnisation',
    content: `
Vous acceptez d'indemniser et de dégager CHE·NU Inc., ses dirigeants, employés et partenaires de toute réclamation, perte, dommage, coût ou dépense (y compris les honoraires d'avocats) résultant de:

- Votre violation de ces Conditions
- Votre utilisation du Service
- Le contenu que vous créez, téléchargez ou partagez
- Votre violation des droits de tiers
- Les actions que vous approuvez via les checkpoints
    `.trim(),
  },
  {
    id: 'termination',
    title: '10. Résiliation',
    content: `
**Par vous:**
- Vous pouvez résilier votre compte à tout moment
- Rendez-vous dans Paramètres > Compte > Supprimer le compte
- Vos données seront supprimées sous 30 jours
- Certaines données peuvent être conservées pour obligations légales

**Par nous:**
- Nous pouvons résilier votre compte pour violation des Conditions
- En cas de fraude, la résiliation est immédiate sans préavis
- Nous vous notifierons par email sauf en cas de violation grave

**Effets de la résiliation:**
- Accès au Service révoqué immédiatement
- Données exportables pendant 30 jours après résiliation
- Aucun remboursement pour la période en cours
- Les sections sur la propriété intellectuelle et la limitation de responsabilité survivent
    `.trim(),
  },
  {
    id: 'disputes',
    title: '11. Résolution des litiges',
    content: `
**Loi applicable:**
Ces Conditions sont régies par les lois de la province de Québec et les lois fédérales du Canada applicables.

**Règlement amiable:**
Avant toute action en justice, vous acceptez de nous contacter pour tenter de résoudre le litige à l'amiable. Envoyez un email à legal@che-nu.com décrivant le problème.

**Arbitrage:**
Pour les litiges non résolus à l'amiable, vous acceptez de soumettre le différend à un arbitrage contraignant selon les règles du Centre canadien d'arbitrage commercial (CCAC).

**Exceptions:**
Vous pouvez introduire une action en justice pour:
- Protection de propriété intellectuelle
- Injonctions d'urgence
- Petites créances dans votre juridiction

**Renonciation aux recours collectifs:**
Vous acceptez de résoudre les litiges individuellement et renoncez au droit de participer à des recours collectifs.
    `.trim(),
  },
  {
    id: 'miscellaneous',
    title: '12. Dispositions générales',
    content: `
**Intégralité de l'accord:**
Ces Conditions, avec notre Politique de Confidentialité, constituent l'intégralité de l'accord entre vous et CHE·NU concernant le Service.

**Divisibilité:**
Si une disposition est jugée invalide, les autres dispositions restent en vigueur.

**Renonciation:**
Le fait de ne pas exercer un droit ne constitue pas une renonciation à ce droit.

**Cession:**
Vous ne pouvez pas céder vos droits sous ces Conditions sans notre consentement écrit. Nous pouvons céder nos droits à tout moment.

**Force majeure:**
Nous ne sommes pas responsables des retards ou manquements dus à des événements hors de notre contrôle (catastrophes naturelles, guerres, pandémies, etc.).

**Langue:**
En cas de divergence entre versions linguistiques, la version française prévaut.
    `.trim(),
  },
  {
    id: 'contact',
    title: '13. Contact',
    content: `
Pour toute question concernant ces Conditions:

**Service juridique:**
Email: legal@che-nu.com

**Adresse postale:**
CHE·NU Inc.
Montréal, Québec, Canada

**Support général:**
Email: support@che-nu.com
    `.trim(),
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const TermsPage: React.FC = () => {
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
            <Link to="/privacy" className="text-[#E9E4D6]/60 hover:text-[#D8B26A] text-sm">
              Confidentialité
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
            <div className="w-14 h-14 rounded-xl bg-[#D8B26A]/20 flex items-center justify-center">
              <FileText className="w-7 h-7 text-[#D8B26A]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Conditions Générales d'Utilisation
              </h1>
              <p className="text-[#E9E4D6]/60">
                Dernière mise à jour: {lastUpdated}
              </p>
            </div>
          </div>
          
          {/* Important Notice */}
          <div className="bg-[#D8B26A]/10 border border-[#D8B26A]/30 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-[#D8B26A] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white font-semibold mb-2">Important</h3>
                <p className="text-[#E9E4D6]/80 text-sm">
                  Ces conditions constituent un accord juridique contraignant. Veuillez les lire attentivement 
                  avant d'utiliser CHE·NU. En utilisant le Service, vous acceptez d'être lié par ces conditions.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Summary */}
          <div className="grid md:grid-cols-2 gap-4 mb-12">
            <div className="p-4 bg-[#3EB4A2]/10 rounded-xl border border-[#3EB4A2]/30">
              <h4 className="flex items-center gap-2 text-[#3EB4A2] font-medium mb-3">
                <CheckCircle2 className="w-5 h-5" />
                Vous pouvez
              </h4>
              <ul className="space-y-2 text-[#E9E4D6]/70 text-sm">
                <li>• Utiliser le Service légalement</li>
                <li>• Exporter vos données</li>
                <li>• Annuler à tout moment</li>
              </ul>
            </div>
            <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/30">
              <h4 className="flex items-center gap-2 text-red-400 font-medium mb-3">
                <XCircle className="w-5 h-5" />
                Interdit
              </h4>
              <ul className="space-y-2 text-[#E9E4D6]/70 text-sm">
                <li>• Activités illégales</li>
                <li>• Contourner la sécurité</li>
                <li>• Contenu haineux</li>
              </ul>
            </div>
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
          <div className="bg-gradient-to-r from-[#D8B26A]/20 to-[#3EB4A2]/20 rounded-2xl p-8 text-center">
            <Scale className="w-10 h-10 text-[#D8B26A] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Questions juridiques?
            </h3>
            <p className="text-[#E9E4D6]/70 mb-6">
              Notre équipe juridique est disponible pour répondre à vos questions
            </p>
            <a
              href="mailto:legal@che-nu.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#D8B26A] to-[#7A593A] text-white rounded-lg font-medium hover:shadow-lg transition"
            >
              legal@che-nu.com
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
            <Link to="/privacy" className="text-[#E9E4D6]/50 hover:text-[#D8B26A] text-sm">Confidentialité</Link>
            <Link to="/security" className="text-[#E9E4D6]/50 hover:text-[#D8B26A] text-sm">Sécurité</Link>
            <Link to="/" className="text-[#E9E4D6]/50 hover:text-[#D8B26A] text-sm">Accueil</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TermsPage;
