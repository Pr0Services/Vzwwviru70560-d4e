/**
 * CHE·NU™ — 100 SCÉNARIOS CIRCONSTANCIELS
 * 
 * ════════════════════════════════════════════════════════════════════════════
 * CARTOGRAPHIE DES CAS D'USAGE RÉELS
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * Chaque scénario définit:
 * - Le contexte de l'utilisateur
 * - La sphère principale
 * - Les sphères connectées
 * - Les données nécessaires
 * - Les actions possibles
 * - Les flux entre sphères
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type SphereId = 
  | 'personal' 
  | 'business' 
  | 'government' 
  | 'design_studio' 
  | 'community' 
  | 'social' 
  | 'entertainment' 
  | 'my_team';

export interface CircumstantialScenario {
  id: string;
  
  // Contexte
  title: string;
  titleFr: string;
  description: string;
  descriptionFr: string;
  
  // Utilisateur type
  userProfile: string;
  userProfileFr: string;
  
  // Sphères impliquées
  primarySphere: SphereId;
  connectedSpheres: SphereId[];
  
  // Données nécessaires
  requiredData: DataRequirement[];
  
  // Actions disponibles
  actions: ScenarioAction[];
  
  // Flux entre sphères
  sphereFlows: SphereFlow[];
  
  // Catégorie du scénario
  category: ScenarioCategory;
  
  // Tags pour recherche
  tags: string[];
}

export interface DataRequirement {
  dataId: string;
  dataName: string;
  dataNameFr: string;
  sourceSphere: SphereId;
  isRequired: boolean;
  purpose: string;
  purposeFr: string;
}

export interface ScenarioAction {
  actionId: string;
  actionName: string;
  actionNameFr: string;
  sphere: SphereId;
  triggersFlow?: string; // ID du flow déclenché
}

export interface SphereFlow {
  flowId: string;
  flowName: string;
  flowNameFr: string;
  fromSphere: SphereId;
  toSphere: SphereId;
  dataTransferred: string[];
  trigger: string;
  automation: 'manual' | 'suggested' | 'automatic';
}

export type ScenarioCategory = 
  | 'creative'           // Création artistique
  | 'administrative'     // Administration, paperasse
  | 'financial'          // Finances, comptabilité
  | 'social'             // Relations, réseautage
  | 'professional'       // Travail, carrière
  | 'personal'           // Vie personnelle
  | 'legal'              // Juridique, conformité
  | 'health'             // Santé, bien-être
  | 'education'          // Apprentissage
  | 'entertainment'      // Loisirs
  | 'family'             // Famille
  | 'real-estate'        // Immobilier
  | 'travel'             // Voyages
  | 'technology'         // Tech, digital
  | 'event';             // Événements

// ═══════════════════════════════════════════════════════════════════════════
// 100 SCÉNARIOS CIRCONSTANCIELS
// ═══════════════════════════════════════════════════════════════════════════

export const CIRCUMSTANTIAL_SCENARIOS: CircumstantialScenario[] = [

  // ═══════════════════════════════════════════════════════════════════════════
  // SCÉNARIOS 1-10: CRÉATION MUSICALE & ARTISTIQUE
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'scenario-001',
    title: 'Music Band Association',
    titleFr: 'Association de groupe de musique',
    description: 'Musician creates an association for their band to manage shared assets and performances',
    descriptionFr: 'Un musicien crée une association pour son groupe afin de gérer les actifs partagés et les performances',
    userProfile: 'Musician in a band',
    userProfileFr: 'Musicien dans un groupe',
    primarySphere: 'government',
    connectedSpheres: ['design_studio', 'community', 'business', 'entertainment'],
    requiredData: [
      { dataId: 'assoc-name', dataName: 'Association Name', dataNameFr: 'Nom de l\'association', sourceSphere: 'government', isRequired: true, purpose: 'Legal registration', purposeFr: 'Enregistrement légal' },
      { dataId: 'members', dataName: 'Band Members', dataNameFr: 'Membres du groupe', sourceSphere: 'community', isRequired: true, purpose: 'Member registry', purposeFr: 'Registre des membres' },
      { dataId: 'bank-account', dataName: 'Association Bank Account', dataNameFr: 'Compte bancaire association', sourceSphere: 'business', isRequired: true, purpose: 'Financial management', purposeFr: 'Gestion financière' }
    ],
    actions: [
      { actionId: 'create-assoc', actionName: 'Create Association', actionNameFr: 'Créer l\'association', sphere: 'government', triggersFlow: 'flow-assoc-to-community' },
      { actionId: 'invite-members', actionName: 'Invite Band Members', actionNameFr: 'Inviter les membres', sphere: 'community' },
      { actionId: 'share-partition', actionName: 'Share Sheet Music', actionNameFr: 'Partager les partitions', sphere: 'design_studio' },
      { actionId: 'upload-assets', actionName: 'Upload Visual Assets', actionNameFr: 'Téléverser les visuels', sphere: 'design_studio' },
      { actionId: 'plan-concert', actionName: 'Plan Concert', actionNameFr: 'Planifier un concert', sphere: 'entertainment' }
    ],
    sphereFlows: [
      { flowId: 'flow-assoc-to-community', flowName: 'Association to Community Space', flowNameFr: 'Association vers Espace Communauté', fromSphere: 'government', toSphere: 'community', dataTransferred: ['association-id', 'member-roles'], trigger: 'Association created', automation: 'automatic' },
      { flowId: 'flow-studio-to-community', flowName: 'Studio Assets to Shared Space', flowNameFr: 'Assets Studio vers Espace partagé', fromSphere: 'design_studio', toSphere: 'community', dataTransferred: ['partitions', 'recordings', 'visuals'], trigger: 'Asset shared', automation: 'manual' },
      { flowId: 'flow-concert-to-business', flowName: 'Concert Revenue to Accounting', flowNameFr: 'Revenus concert vers Comptabilité', fromSphere: 'entertainment', toSphere: 'business', dataTransferred: ['ticket-sales', 'expenses'], trigger: 'Event completed', automation: 'suggested' }
    ],
    category: 'creative',
    tags: ['music', 'band', 'association', 'nonprofit', 'creative', 'collaboration']
  },

  {
    id: 'scenario-002',
    title: 'Freelance Graphic Designer',
    titleFr: 'Designer graphique freelance',
    description: 'Freelance designer manages clients, projects, invoicing and creative portfolio',
    descriptionFr: 'Designer freelance gère clients, projets, facturation et portfolio créatif',
    userProfile: 'Freelance graphic designer',
    userProfileFr: 'Designer graphique freelance',
    primarySphere: 'design_studio',
    connectedSpheres: ['business', 'social', 'government'],
    requiredData: [
      { dataId: 'portfolio', dataName: 'Portfolio Works', dataNameFr: 'Œuvres du portfolio', sourceSphere: 'design_studio', isRequired: true, purpose: 'Showcase work', purposeFr: 'Montrer son travail' },
      { dataId: 'client-list', dataName: 'Client Database', dataNameFr: 'Base de données clients', sourceSphere: 'business', isRequired: true, purpose: 'Client management', purposeFr: 'Gestion des clients' },
      { dataId: 'tax-number', dataName: 'Business Tax Number', dataNameFr: 'Numéro de taxe', sourceSphere: 'government', isRequired: true, purpose: 'Invoicing', purposeFr: 'Facturation' }
    ],
    actions: [
      { actionId: 'create-project', actionName: 'Create Client Project', actionNameFr: 'Créer un projet client', sphere: 'design_studio' },
      { actionId: 'generate-invoice', actionName: 'Generate Invoice', actionNameFr: 'Générer une facture', sphere: 'business', triggersFlow: 'flow-invoice' },
      { actionId: 'share-portfolio', actionName: 'Share Portfolio on Social', actionNameFr: 'Partager portfolio sur réseaux', sphere: 'social' },
      { actionId: 'track-expenses', actionName: 'Track Business Expenses', actionNameFr: 'Suivre les dépenses', sphere: 'business' }
    ],
    sphereFlows: [
      { flowId: 'flow-invoice', flowName: 'Project to Invoice', flowNameFr: 'Projet vers Facture', fromSphere: 'design_studio', toSphere: 'business', dataTransferred: ['project-details', 'hours', 'deliverables'], trigger: 'Project completed', automation: 'suggested' },
      { flowId: 'flow-portfolio-social', flowName: 'Portfolio to Social Media', flowNameFr: 'Portfolio vers Réseaux sociaux', fromSphere: 'design_studio', toSphere: 'social', dataTransferred: ['project-images', 'case-study'], trigger: 'Manual share', automation: 'manual' }
    ],
    category: 'creative',
    tags: ['design', 'freelance', 'portfolio', 'invoicing', 'clients']
  },

  {
    id: 'scenario-003',
    title: 'Independent Filmmaker',
    titleFr: 'Cinéaste indépendant',
    description: 'Filmmaker manages film production, crew, funding applications and distribution',
    descriptionFr: 'Cinéaste gère la production, l\'équipe, les demandes de financement et la distribution',
    userProfile: 'Independent film director',
    userProfileFr: 'Réalisateur de films indépendant',
    primarySphere: 'design_studio',
    connectedSpheres: ['business', 'government', 'community', 'entertainment', 'social'],
    requiredData: [
      { dataId: 'project-bible', dataName: 'Film Project Bible', dataNameFr: 'Bible du projet film', sourceSphere: 'design_studio', isRequired: true, purpose: 'Project management', purposeFr: 'Gestion du projet' },
      { dataId: 'crew-database', dataName: 'Crew Database', dataNameFr: 'Base de données équipe', sourceSphere: 'community', isRequired: true, purpose: 'Team coordination', purposeFr: 'Coordination d\'équipe' },
      { dataId: 'grant-apps', dataName: 'Grant Applications', dataNameFr: 'Demandes de subventions', sourceSphere: 'government', isRequired: false, purpose: 'Funding', purposeFr: 'Financement' }
    ],
    actions: [
      { actionId: 'create-production', actionName: 'Create Production', actionNameFr: 'Créer une production', sphere: 'design_studio' },
      { actionId: 'apply-grant', actionName: 'Apply for Film Grant', actionNameFr: 'Demander une subvention', sphere: 'government', triggersFlow: 'flow-grant-app' },
      { actionId: 'hire-crew', actionName: 'Hire Crew Members', actionNameFr: 'Engager l\'équipe', sphere: 'community' },
      { actionId: 'submit-festival', actionName: 'Submit to Festival', actionNameFr: 'Soumettre à un festival', sphere: 'entertainment' },
      { actionId: 'promote-film', actionName: 'Promote Film', actionNameFr: 'Promouvoir le film', sphere: 'social' }
    ],
    sphereFlows: [
      { flowId: 'flow-grant-app', flowName: 'Budget to Grant Application', flowNameFr: 'Budget vers Demande subvention', fromSphere: 'business', toSphere: 'government', dataTransferred: ['budget', 'timeline', 'team-info'], trigger: 'Grant application started', automation: 'suggested' },
      { flowId: 'flow-crew-contracts', flowName: 'Crew to Contracts', flowNameFr: 'Équipe vers Contrats', fromSphere: 'community', toSphere: 'business', dataTransferred: ['crew-rates', 'availability', 'contracts'], trigger: 'Crew hired', automation: 'automatic' }
    ],
    category: 'creative',
    tags: ['film', 'cinema', 'production', 'grants', 'festivals', 'crew']
  },

  {
    id: 'scenario-004',
    title: 'Podcast Creator',
    titleFr: 'Créateur de podcast',
    description: 'Podcaster manages episodes, guests, monetization and audience growth',
    descriptionFr: 'Podcasteur gère les épisodes, invités, monétisation et croissance d\'audience',
    userProfile: 'Podcast host and producer',
    userProfileFr: 'Animateur et producteur de podcast',
    primarySphere: 'design_studio',
    connectedSpheres: ['social', 'business', 'entertainment', 'community'],
    requiredData: [
      { dataId: 'episodes', dataName: 'Episode Library', dataNameFr: 'Bibliothèque d\'épisodes', sourceSphere: 'design_studio', isRequired: true, purpose: 'Content management', purposeFr: 'Gestion du contenu' },
      { dataId: 'guests', dataName: 'Guest Database', dataNameFr: 'Base de données invités', sourceSphere: 'community', isRequired: false, purpose: 'Guest coordination', purposeFr: 'Coordination des invités' },
      { dataId: 'sponsors', dataName: 'Sponsor Contacts', dataNameFr: 'Contacts sponsors', sourceSphere: 'business', isRequired: false, purpose: 'Monetization', purposeFr: 'Monétisation' }
    ],
    actions: [
      { actionId: 'plan-episode', actionName: 'Plan Episode', actionNameFr: 'Planifier un épisode', sphere: 'design_studio' },
      { actionId: 'invite-guest', actionName: 'Invite Guest', actionNameFr: 'Inviter un invité', sphere: 'community' },
      { actionId: 'publish-episode', actionName: 'Publish Episode', actionNameFr: 'Publier l\'épisode', sphere: 'entertainment', triggersFlow: 'flow-publish' },
      { actionId: 'track-analytics', actionName: 'Track Analytics', actionNameFr: 'Suivre les analytics', sphere: 'social' },
      { actionId: 'manage-sponsors', actionName: 'Manage Sponsors', actionNameFr: 'Gérer les sponsors', sphere: 'business' }
    ],
    sphereFlows: [
      { flowId: 'flow-publish', flowName: 'Episode to Platforms', flowNameFr: 'Épisode vers Plateformes', fromSphere: 'design_studio', toSphere: 'entertainment', dataTransferred: ['audio-file', 'show-notes', 'metadata'], trigger: 'Episode finalized', automation: 'suggested' },
      { flowId: 'flow-promo', flowName: 'Episode to Social Promo', flowNameFr: 'Épisode vers Promo sociale', fromSphere: 'entertainment', toSphere: 'social', dataTransferred: ['clips', 'quotes', 'artwork'], trigger: 'Episode published', automation: 'automatic' }
    ],
    category: 'creative',
    tags: ['podcast', 'audio', 'guests', 'sponsors', 'content']
  },

  {
    id: 'scenario-005',
    title: 'Self-Published Author',
    titleFr: 'Auteur auto-édité',
    description: 'Writer manages manuscripts, publishing, marketing and reader community',
    descriptionFr: 'Écrivain gère manuscrits, publication, marketing et communauté de lecteurs',
    userProfile: 'Self-published author',
    userProfileFr: 'Auteur auto-édité',
    primarySphere: 'design_studio',
    connectedSpheres: ['business', 'social', 'community', 'government'],
    requiredData: [
      { dataId: 'manuscripts', dataName: 'Manuscript Library', dataNameFr: 'Bibliothèque de manuscrits', sourceSphere: 'design_studio', isRequired: true, purpose: 'Writing management', purposeFr: 'Gestion de l\'écriture' },
      { dataId: 'isbn', dataName: 'ISBN Numbers', dataNameFr: 'Numéros ISBN', sourceSphere: 'government', isRequired: true, purpose: 'Book registration', purposeFr: 'Enregistrement des livres' },
      { dataId: 'royalties', dataName: 'Royalty Tracking', dataNameFr: 'Suivi des redevances', sourceSphere: 'business', isRequired: true, purpose: 'Income tracking', purposeFr: 'Suivi des revenus' }
    ],
    actions: [
      { actionId: 'write-book', actionName: 'Write/Edit Book', actionNameFr: 'Écrire/Éditer un livre', sphere: 'design_studio' },
      { actionId: 'get-isbn', actionName: 'Get ISBN', actionNameFr: 'Obtenir ISBN', sphere: 'government' },
      { actionId: 'publish-book', actionName: 'Publish Book', actionNameFr: 'Publier le livre', sphere: 'design_studio', triggersFlow: 'flow-publish-book' },
      { actionId: 'market-book', actionName: 'Market Book', actionNameFr: 'Marketer le livre', sphere: 'social' },
      { actionId: 'engage-readers', actionName: 'Engage Reader Community', actionNameFr: 'Engager la communauté', sphere: 'community' }
    ],
    sphereFlows: [
      { flowId: 'flow-publish-book', flowName: 'Manuscript to Sales Platforms', flowNameFr: 'Manuscrit vers Plateformes de vente', fromSphere: 'design_studio', toSphere: 'business', dataTransferred: ['book-file', 'metadata', 'pricing'], trigger: 'Book ready', automation: 'manual' },
      { flowId: 'flow-royalties', flowName: 'Sales to Royalties', flowNameFr: 'Ventes vers Redevances', fromSphere: 'business', toSphere: 'government', dataTransferred: ['income', 'sales-reports'], trigger: 'Monthly', automation: 'automatic' }
    ],
    category: 'creative',
    tags: ['writing', 'books', 'publishing', 'marketing', 'royalties']
  },

  {
    id: 'scenario-006',
    title: 'YouTube Content Creator',
    titleFr: 'Créateur de contenu YouTube',
    description: 'YouTuber manages video production, channel growth, monetization and brand deals',
    descriptionFr: 'YouTubeur gère production vidéo, croissance chaîne, monétisation et partenariats',
    userProfile: 'Full-time YouTuber',
    userProfileFr: 'YouTubeur à temps plein',
    primarySphere: 'design_studio',
    connectedSpheres: ['social', 'business', 'entertainment', 'my_team'],
    requiredData: [
      { dataId: 'video-library', dataName: 'Video Library', dataNameFr: 'Bibliothèque vidéo', sourceSphere: 'design_studio', isRequired: true, purpose: 'Content management', purposeFr: 'Gestion du contenu' },
      { dataId: 'channel-analytics', dataName: 'Channel Analytics', dataNameFr: 'Analytics de chaîne', sourceSphere: 'social', isRequired: true, purpose: 'Growth tracking', purposeFr: 'Suivi de croissance' },
      { dataId: 'brand-deals', dataName: 'Brand Partnerships', dataNameFr: 'Partenariats de marques', sourceSphere: 'business', isRequired: false, purpose: 'Monetization', purposeFr: 'Monétisation' }
    ],
    actions: [
      { actionId: 'create-video', actionName: 'Create Video', actionNameFr: 'Créer une vidéo', sphere: 'design_studio' },
      { actionId: 'schedule-upload', actionName: 'Schedule Upload', actionNameFr: 'Planifier le téléversement', sphere: 'entertainment' },
      { actionId: 'analyze-performance', actionName: 'Analyze Performance', actionNameFr: 'Analyser la performance', sphere: 'social' },
      { actionId: 'negotiate-deal', actionName: 'Negotiate Brand Deal', actionNameFr: 'Négocier un partenariat', sphere: 'business' },
      { actionId: 'manage-editor', actionName: 'Manage Video Editor', actionNameFr: 'Gérer le monteur', sphere: 'my_team' }
    ],
    sphereFlows: [
      { flowId: 'flow-video-upload', flowName: 'Video to Platform', flowNameFr: 'Vidéo vers Plateforme', fromSphere: 'design_studio', toSphere: 'entertainment', dataTransferred: ['video-file', 'thumbnail', 'metadata'], trigger: 'Video finalized', automation: 'manual' },
      { flowId: 'flow-revenue', flowName: 'Revenue to Accounting', flowNameFr: 'Revenus vers Comptabilité', fromSphere: 'entertainment', toSphere: 'business', dataTransferred: ['adsense-revenue', 'brand-payments'], trigger: 'Monthly', automation: 'automatic' }
    ],
    category: 'creative',
    tags: ['youtube', 'video', 'creator', 'monetization', 'brand-deals']
  },

  {
    id: 'scenario-007',
    title: 'Wedding Photographer',
    titleFr: 'Photographe de mariage',
    description: 'Photographer manages bookings, shoots, editing, delivery and business',
    descriptionFr: 'Photographe gère réservations, séances, retouches, livraison et affaires',
    userProfile: 'Professional wedding photographer',
    userProfileFr: 'Photographe de mariage professionnel',
    primarySphere: 'design_studio',
    connectedSpheres: ['business', 'personal', 'social'],
    requiredData: [
      { dataId: 'photo-library', dataName: 'Photo Library', dataNameFr: 'Photothèque', sourceSphere: 'design_studio', isRequired: true, purpose: 'Asset management', purposeFr: 'Gestion des assets' },
      { dataId: 'bookings', dataName: 'Booking Calendar', dataNameFr: 'Calendrier de réservations', sourceSphere: 'business', isRequired: true, purpose: 'Scheduling', purposeFr: 'Planification' },
      { dataId: 'contracts', dataName: 'Client Contracts', dataNameFr: 'Contrats clients', sourceSphere: 'business', isRequired: true, purpose: 'Legal protection', purposeFr: 'Protection légale' }
    ],
    actions: [
      { actionId: 'book-wedding', actionName: 'Book Wedding', actionNameFr: 'Réserver un mariage', sphere: 'business' },
      { actionId: 'shoot-event', actionName: 'Shoot Event', actionNameFr: 'Photographier l\'événement', sphere: 'design_studio' },
      { actionId: 'edit-photos', actionName: 'Edit Photos', actionNameFr: 'Retoucher les photos', sphere: 'design_studio' },
      { actionId: 'deliver-gallery', actionName: 'Deliver Gallery', actionNameFr: 'Livrer la galerie', sphere: 'design_studio', triggersFlow: 'flow-delivery' },
      { actionId: 'post-portfolio', actionName: 'Post to Portfolio', actionNameFr: 'Ajouter au portfolio', sphere: 'social' }
    ],
    sphereFlows: [
      { flowId: 'flow-delivery', flowName: 'Gallery to Client', flowNameFr: 'Galerie vers Client', fromSphere: 'design_studio', toSphere: 'business', dataTransferred: ['gallery-link', 'download-access'], trigger: 'Editing complete', automation: 'manual' },
      { flowId: 'flow-calendar', flowName: 'Booking to Personal Calendar', flowNameFr: 'Réservation vers Calendrier perso', fromSphere: 'business', toSphere: 'personal', dataTransferred: ['event-date', 'location', 'client-info'], trigger: 'Booking confirmed', automation: 'automatic' }
    ],
    category: 'creative',
    tags: ['photography', 'weddings', 'bookings', 'editing', 'delivery']
  },

  {
    id: 'scenario-008',
    title: 'Music Producer Home Studio',
    titleFr: 'Producteur musique studio maison',
    description: 'Music producer manages beats, clients, licensing and equipment',
    descriptionFr: 'Producteur musical gère beats, clients, licences et équipement',
    userProfile: 'Independent music producer',
    userProfileFr: 'Producteur de musique indépendant',
    primarySphere: 'design_studio',
    connectedSpheres: ['business', 'government', 'entertainment', 'personal'],
    requiredData: [
      { dataId: 'beat-catalog', dataName: 'Beat Catalog', dataNameFr: 'Catalogue de beats', sourceSphere: 'design_studio', isRequired: true, purpose: 'Inventory', purposeFr: 'Inventaire' },
      { dataId: 'licenses', dataName: 'License Agreements', dataNameFr: 'Accords de licence', sourceSphere: 'government', isRequired: true, purpose: 'Rights management', purposeFr: 'Gestion des droits' },
      { dataId: 'equipment', dataName: 'Equipment Inventory', dataNameFr: 'Inventaire équipement', sourceSphere: 'personal', isRequired: false, purpose: 'Asset tracking', purposeFr: 'Suivi des actifs' }
    ],
    actions: [
      { actionId: 'create-beat', actionName: 'Create Beat', actionNameFr: 'Créer un beat', sphere: 'design_studio' },
      { actionId: 'sell-license', actionName: 'Sell License', actionNameFr: 'Vendre une licence', sphere: 'business', triggersFlow: 'flow-license-sale' },
      { actionId: 'register-work', actionName: 'Register with PRO', actionNameFr: 'Enregistrer auprès SACEM', sphere: 'government' },
      { actionId: 'distribute-music', actionName: 'Distribute Music', actionNameFr: 'Distribuer la musique', sphere: 'entertainment' }
    ],
    sphereFlows: [
      { flowId: 'flow-license-sale', flowName: 'Beat to License Contract', flowNameFr: 'Beat vers Contrat licence', fromSphere: 'design_studio', toSphere: 'business', dataTransferred: ['beat-file', 'license-type', 'price'], trigger: 'Sale initiated', automation: 'automatic' },
      { flowId: 'flow-royalties', flowName: 'Streams to Royalties', flowNameFr: 'Streams vers Redevances', fromSphere: 'entertainment', toSphere: 'business', dataTransferred: ['stream-count', 'royalty-amount'], trigger: 'Monthly', automation: 'automatic' }
    ],
    category: 'creative',
    tags: ['music', 'production', 'beats', 'licensing', 'studio']
  },

  {
    id: 'scenario-009',
    title: 'Tattoo Artist Studio',
    titleFr: 'Artiste tatoueur studio',
    description: 'Tattoo artist manages appointments, designs, client history and business',
    descriptionFr: 'Tatoueur gère rendez-vous, designs, historique clients et affaires',
    userProfile: 'Professional tattoo artist',
    userProfileFr: 'Artiste tatoueur professionnel',
    primarySphere: 'design_studio',
    connectedSpheres: ['business', 'personal', 'social', 'government'],
    requiredData: [
      { dataId: 'design-portfolio', dataName: 'Design Portfolio', dataNameFr: 'Portfolio de designs', sourceSphere: 'design_studio', isRequired: true, purpose: 'Showcase work', purposeFr: 'Montrer le travail' },
      { dataId: 'client-history', dataName: 'Client History', dataNameFr: 'Historique clients', sourceSphere: 'business', isRequired: true, purpose: 'Track work done', purposeFr: 'Suivi du travail' },
      { dataId: 'health-permits', dataName: 'Health & Safety Permits', dataNameFr: 'Permis santé et sécurité', sourceSphere: 'government', isRequired: true, purpose: 'Compliance', purposeFr: 'Conformité' }
    ],
    actions: [
      { actionId: 'create-design', actionName: 'Create Custom Design', actionNameFr: 'Créer un design personnalisé', sphere: 'design_studio' },
      { actionId: 'book-appointment', actionName: 'Book Appointment', actionNameFr: 'Prendre rendez-vous', sphere: 'business' },
      { actionId: 'record-session', actionName: 'Record Session', actionNameFr: 'Enregistrer la séance', sphere: 'design_studio' },
      { actionId: 'post-work', actionName: 'Post Finished Work', actionNameFr: 'Publier le travail fini', sphere: 'social' }
    ],
    sphereFlows: [
      { flowId: 'flow-design-to-appointment', flowName: 'Design to Appointment', flowNameFr: 'Design vers Rendez-vous', fromSphere: 'design_studio', toSphere: 'business', dataTransferred: ['design-file', 'size-estimate', 'price-quote'], trigger: 'Design approved', automation: 'suggested' },
      { flowId: 'flow-healed-to-social', flowName: 'Healed Tattoo to Social', flowNameFr: 'Tatouage guéri vers Social', fromSphere: 'design_studio', toSphere: 'social', dataTransferred: ['healed-photo', 'description'], trigger: 'Client shares', automation: 'manual' }
    ],
    category: 'creative',
    tags: ['tattoo', 'art', 'appointments', 'portfolio', 'health-permits']
  },

  {
    id: 'scenario-010',
    title: 'Interior Designer',
    titleFr: 'Designer d\'intérieur',
    description: 'Interior designer manages projects, mood boards, vendors and client presentations',
    descriptionFr: 'Designer d\'intérieur gère projets, planches d\'ambiance, fournisseurs et présentations',
    userProfile: 'Professional interior designer',
    userProfileFr: 'Designer d\'intérieur professionnel',
    primarySphere: 'design_studio',
    connectedSpheres: ['business', 'personal', 'community'],
    requiredData: [
      { dataId: 'project-boards', dataName: 'Project Mood Boards', dataNameFr: 'Planches d\'ambiance', sourceSphere: 'design_studio', isRequired: true, purpose: 'Design vision', purposeFr: 'Vision du design' },
      { dataId: 'vendor-database', dataName: 'Vendor Database', dataNameFr: 'Base de données fournisseurs', sourceSphere: 'business', isRequired: true, purpose: 'Sourcing', purposeFr: 'Approvisionnement' },
      { dataId: 'contractor-network', dataName: 'Contractor Network', dataNameFr: 'Réseau d\'entrepreneurs', sourceSphere: 'community', isRequired: true, purpose: 'Project execution', purposeFr: 'Exécution du projet' }
    ],
    actions: [
      { actionId: 'create-moodboard', actionName: 'Create Mood Board', actionNameFr: 'Créer une planche d\'ambiance', sphere: 'design_studio' },
      { actionId: 'source-materials', actionName: 'Source Materials', actionNameFr: 'Sourcer les matériaux', sphere: 'business' },
      { actionId: 'present-client', actionName: 'Present to Client', actionNameFr: 'Présenter au client', sphere: 'design_studio' },
      { actionId: 'coordinate-contractors', actionName: 'Coordinate Contractors', actionNameFr: 'Coordonner les entrepreneurs', sphere: 'community' },
      { actionId: 'track-budget', actionName: 'Track Project Budget', actionNameFr: 'Suivre le budget projet', sphere: 'business' }
    ],
    sphereFlows: [
      { flowId: 'flow-spec-to-order', flowName: 'Specifications to Orders', flowNameFr: 'Spécifications vers Commandes', fromSphere: 'design_studio', toSphere: 'business', dataTransferred: ['item-specs', 'quantities', 'vendors'], trigger: 'Design approved', automation: 'suggested' },
      { flowId: 'flow-budget-tracking', flowName: 'Orders to Budget', flowNameFr: 'Commandes vers Budget', fromSphere: 'business', toSphere: 'business', dataTransferred: ['order-costs', 'invoices'], trigger: 'Order placed', automation: 'automatic' }
    ],
    category: 'creative',
    tags: ['interior-design', 'mood-boards', 'vendors', 'contractors', 'budget']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SCÉNARIOS 11-20: ENTREPRISE & FREELANCE
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'scenario-011',
    title: 'Starting a Small Business',
    titleFr: 'Démarrer une petite entreprise',
    description: 'Entrepreneur registers business, opens accounts, sets up operations',
    descriptionFr: 'Entrepreneur enregistre l\'entreprise, ouvre les comptes, met en place les opérations',
    userProfile: 'First-time entrepreneur',
    userProfileFr: 'Entrepreneur débutant',
    primarySphere: 'business',
    connectedSpheres: ['government', 'personal', 'my_team'],
    requiredData: [
      { dataId: 'business-name', dataName: 'Business Name', dataNameFr: 'Nom de l\'entreprise', sourceSphere: 'business', isRequired: true, purpose: 'Registration', purposeFr: 'Enregistrement' },
      { dataId: 'business-type', dataName: 'Business Structure', dataNameFr: 'Structure d\'entreprise', sourceSphere: 'government', isRequired: true, purpose: 'Legal setup', purposeFr: 'Configuration légale' },
      { dataId: 'initial-capital', dataName: 'Initial Capital', dataNameFr: 'Capital initial', sourceSphere: 'personal', isRequired: true, purpose: 'Funding', purposeFr: 'Financement' }
    ],
    actions: [
      { actionId: 'register-business', actionName: 'Register Business', actionNameFr: 'Enregistrer l\'entreprise', sphere: 'government', triggersFlow: 'flow-registration' },
      { actionId: 'open-bank-account', actionName: 'Open Business Bank Account', actionNameFr: 'Ouvrir un compte bancaire', sphere: 'business' },
      { actionId: 'setup-accounting', actionName: 'Setup Accounting', actionNameFr: 'Configurer la comptabilité', sphere: 'business' },
      { actionId: 'get-insurance', actionName: 'Get Business Insurance', actionNameFr: 'Obtenir une assurance', sphere: 'business' },
      { actionId: 'setup-agents', actionName: 'Setup AI Assistants', actionNameFr: 'Configurer les assistants IA', sphere: 'my_team' }
    ],
    sphereFlows: [
      { flowId: 'flow-registration', flowName: 'Registration to Business Setup', flowNameFr: 'Enregistrement vers Configuration', fromSphere: 'government', toSphere: 'business', dataTransferred: ['business-number', 'tax-accounts', 'legal-name'], trigger: 'Business registered', automation: 'automatic' },
      { flowId: 'flow-personal-to-business', flowName: 'Personal Funds to Business', flowNameFr: 'Fonds personnels vers Entreprise', fromSphere: 'personal', toSphere: 'business', dataTransferred: ['capital-amount', 'loan-details'], trigger: 'Initial investment', automation: 'manual' }
    ],
    category: 'professional',
    tags: ['startup', 'business', 'registration', 'banking', 'insurance']
  },

  {
    id: 'scenario-012',
    title: 'Consultant Going Independent',
    titleFr: 'Consultant devenant indépendant',
    description: 'Professional leaves corporate job to start consulting practice',
    descriptionFr: 'Professionnel quitte son emploi pour démarrer une pratique de consultation',
    userProfile: 'Corporate professional turning consultant',
    userProfileFr: 'Professionnel d\'entreprise devenant consultant',
    primarySphere: 'business',
    connectedSpheres: ['personal', 'government', 'social', 'community'],
    requiredData: [
      { dataId: 'expertise-areas', dataName: 'Areas of Expertise', dataNameFr: 'Domaines d\'expertise', sourceSphere: 'personal', isRequired: true, purpose: 'Service definition', purposeFr: 'Définition des services' },
      { dataId: 'network-contacts', dataName: 'Professional Network', dataNameFr: 'Réseau professionnel', sourceSphere: 'community', isRequired: true, purpose: 'Client acquisition', purposeFr: 'Acquisition de clients' },
      { dataId: 'rate-card', dataName: 'Rate Card', dataNameFr: 'Grille tarifaire', sourceSphere: 'business', isRequired: true, purpose: 'Pricing', purposeFr: 'Tarification' }
    ],
    actions: [
      { actionId: 'define-services', actionName: 'Define Services', actionNameFr: 'Définir les services', sphere: 'business' },
      { actionId: 'create-website', actionName: 'Create Website', actionNameFr: 'Créer un site web', sphere: 'social' },
      { actionId: 'reach-network', actionName: 'Reach Out to Network', actionNameFr: 'Contacter le réseau', sphere: 'community' },
      { actionId: 'setup-contracts', actionName: 'Setup Contract Templates', actionNameFr: 'Créer des modèles de contrats', sphere: 'business' },
      { actionId: 'register-self-employed', actionName: 'Register as Self-Employed', actionNameFr: 'S\'enregistrer comme travailleur autonome', sphere: 'government' }
    ],
    sphereFlows: [
      { flowId: 'flow-expertise-to-services', flowName: 'Expertise to Services', flowNameFr: 'Expertise vers Services', fromSphere: 'personal', toSphere: 'business', dataTransferred: ['skills', 'experience', 'certifications'], trigger: 'Service definition', automation: 'suggested' },
      { flowId: 'flow-network-to-leads', flowName: 'Network to Leads', flowNameFr: 'Réseau vers Prospects', fromSphere: 'community', toSphere: 'business', dataTransferred: ['contacts', 'referrals'], trigger: 'Outreach', automation: 'manual' }
    ],
    category: 'professional',
    tags: ['consulting', 'independent', 'freelance', 'networking', 'transition']
  },

  {
    id: 'scenario-013',
    title: 'E-commerce Store Owner',
    titleFr: 'Propriétaire de boutique e-commerce',
    description: 'Entrepreneur runs online store with inventory, orders, and shipping',
    descriptionFr: 'Entrepreneur gère une boutique en ligne avec inventaire, commandes et expédition',
    userProfile: 'E-commerce entrepreneur',
    userProfileFr: 'Entrepreneur e-commerce',
    primarySphere: 'business',
    connectedSpheres: ['government', 'social', 'personal', 'my_team'],
    requiredData: [
      { dataId: 'product-catalog', dataName: 'Product Catalog', dataNameFr: 'Catalogue produits', sourceSphere: 'business', isRequired: true, purpose: 'Inventory', purposeFr: 'Inventaire' },
      { dataId: 'sales-tax-setup', dataName: 'Sales Tax Configuration', dataNameFr: 'Configuration taxes de vente', sourceSphere: 'government', isRequired: true, purpose: 'Compliance', purposeFr: 'Conformité' },
      { dataId: 'shipping-accounts', dataName: 'Shipping Accounts', dataNameFr: 'Comptes d\'expédition', sourceSphere: 'business', isRequired: true, purpose: 'Fulfillment', purposeFr: 'Exécution des commandes' }
    ],
    actions: [
      { actionId: 'add-product', actionName: 'Add Product', actionNameFr: 'Ajouter un produit', sphere: 'business' },
      { actionId: 'process-order', actionName: 'Process Order', actionNameFr: 'Traiter une commande', sphere: 'business', triggersFlow: 'flow-order' },
      { actionId: 'run-ad-campaign', actionName: 'Run Ad Campaign', actionNameFr: 'Lancer une campagne pub', sphere: 'social' },
      { actionId: 'file-sales-tax', actionName: 'File Sales Tax', actionNameFr: 'Déclarer les taxes de vente', sphere: 'government' },
      { actionId: 'setup-chatbot', actionName: 'Setup Customer Service Bot', actionNameFr: 'Configurer un chatbot service client', sphere: 'my_team' }
    ],
    sphereFlows: [
      { flowId: 'flow-order', flowName: 'Order to Fulfillment', flowNameFr: 'Commande vers Exécution', fromSphere: 'business', toSphere: 'business', dataTransferred: ['order-details', 'shipping-label'], trigger: 'Order received', automation: 'automatic' },
      { flowId: 'flow-sales-to-tax', flowName: 'Sales to Tax Report', flowNameFr: 'Ventes vers Rapport fiscal', fromSphere: 'business', toSphere: 'government', dataTransferred: ['sales-totals', 'tax-collected'], trigger: 'Tax period end', automation: 'suggested' }
    ],
    category: 'professional',
    tags: ['ecommerce', 'online-store', 'inventory', 'shipping', 'sales-tax']
  },

  {
    id: 'scenario-014',
    title: 'Real Estate Agent',
    titleFr: 'Agent immobilier',
    description: 'Real estate agent manages listings, clients, showings and transactions',
    descriptionFr: 'Agent immobilier gère les inscriptions, clients, visites et transactions',
    userProfile: 'Licensed real estate agent',
    userProfileFr: 'Agent immobilier licencié',
    primarySphere: 'business',
    connectedSpheres: ['personal', 'community', 'government', 'social'],
    requiredData: [
      { dataId: 'listings', dataName: 'Property Listings', dataNameFr: 'Inscriptions immobilières', sourceSphere: 'business', isRequired: true, purpose: 'Inventory', purposeFr: 'Inventaire' },
      { dataId: 'client-database', dataName: 'Client Database', dataNameFr: 'Base de données clients', sourceSphere: 'business', isRequired: true, purpose: 'Client management', purposeFr: 'Gestion des clients' },
      { dataId: 'license', dataName: 'Real Estate License', dataNameFr: 'Permis immobilier', sourceSphere: 'government', isRequired: true, purpose: 'Legal practice', purposeFr: 'Pratique légale' }
    ],
    actions: [
      { actionId: 'add-listing', actionName: 'Add Listing', actionNameFr: 'Ajouter une inscription', sphere: 'business' },
      { actionId: 'schedule-showing', actionName: 'Schedule Showing', actionNameFr: 'Planifier une visite', sphere: 'personal', triggersFlow: 'flow-showing' },
      { actionId: 'market-property', actionName: 'Market Property', actionNameFr: 'Marketer une propriété', sphere: 'social' },
      { actionId: 'manage-transaction', actionName: 'Manage Transaction', actionNameFr: 'Gérer une transaction', sphere: 'business' },
      { actionId: 'network-event', actionName: 'Attend Networking Event', actionNameFr: 'Assister à un événement réseau', sphere: 'community' }
    ],
    sphereFlows: [
      { flowId: 'flow-showing', flowName: 'Showing to Calendar', flowNameFr: 'Visite vers Calendrier', fromSphere: 'business', toSphere: 'personal', dataTransferred: ['property-address', 'client-info', 'time'], trigger: 'Showing booked', automation: 'automatic' },
      { flowId: 'flow-listing-to-social', flowName: 'Listing to Social Media', flowNameFr: 'Inscription vers Réseaux sociaux', fromSphere: 'business', toSphere: 'social', dataTransferred: ['photos', 'description', 'price'], trigger: 'Listing approved', automation: 'suggested' }
    ],
    category: 'professional',
    tags: ['real-estate', 'listings', 'showings', 'transactions', 'networking']
  },

  {
    id: 'scenario-015',
    title: 'Restaurant Owner',
    titleFr: 'Propriétaire de restaurant',
    description: 'Restaurant owner manages menu, staff, inventory, reservations and compliance',
    descriptionFr: 'Propriétaire de restaurant gère menu, personnel, inventaire, réservations et conformité',
    userProfile: 'Restaurant owner',
    userProfileFr: 'Propriétaire de restaurant',
    primarySphere: 'business',
    connectedSpheres: ['government', 'community', 'social', 'my_team'],
    requiredData: [
      { dataId: 'menu', dataName: 'Menu Items', dataNameFr: 'Articles du menu', sourceSphere: 'business', isRequired: true, purpose: 'Operations', purposeFr: 'Opérations' },
      { dataId: 'health-permits', dataName: 'Health Permits', dataNameFr: 'Permis de santé', sourceSphere: 'government', isRequired: true, purpose: 'Compliance', purposeFr: 'Conformité' },
      { dataId: 'staff-roster', dataName: 'Staff Roster', dataNameFr: 'Liste du personnel', sourceSphere: 'community', isRequired: true, purpose: 'HR', purposeFr: 'RH' }
    ],
    actions: [
      { actionId: 'update-menu', actionName: 'Update Menu', actionNameFr: 'Mettre à jour le menu', sphere: 'business' },
      { actionId: 'manage-inventory', actionName: 'Manage Inventory', actionNameFr: 'Gérer l\'inventaire', sphere: 'business' },
      { actionId: 'schedule-staff', actionName: 'Schedule Staff', actionNameFr: 'Planifier le personnel', sphere: 'community' },
      { actionId: 'handle-reservations', actionName: 'Handle Reservations', actionNameFr: 'Gérer les réservations', sphere: 'business' },
      { actionId: 'respond-reviews', actionName: 'Respond to Reviews', actionNameFr: 'Répondre aux avis', sphere: 'social' },
      { actionId: 'setup-ordering-ai', actionName: 'Setup AI Ordering Assistant', actionNameFr: 'Configurer l\'assistant commandes IA', sphere: 'my_team' }
    ],
    sphereFlows: [
      { flowId: 'flow-schedule-to-payroll', flowName: 'Schedule to Payroll', flowNameFr: 'Horaire vers Paie', fromSphere: 'community', toSphere: 'business', dataTransferred: ['hours-worked', 'rates'], trigger: 'Pay period end', automation: 'automatic' },
      { flowId: 'flow-inspection', flowName: 'Permit to Inspection', flowNameFr: 'Permis vers Inspection', fromSphere: 'government', toSphere: 'personal', dataTransferred: ['inspection-date', 'requirements'], trigger: 'Inspection scheduled', automation: 'automatic' }
    ],
    category: 'professional',
    tags: ['restaurant', 'food', 'staff', 'inventory', 'health-permits', 'reservations']
  },

  {
    id: 'scenario-016',
    title: 'Personal Trainer Business',
    titleFr: 'Entreprise d\'entraîneur personnel',
    description: 'Personal trainer manages clients, sessions, programs and business growth',
    descriptionFr: 'Entraîneur personnel gère clients, séances, programmes et croissance',
    userProfile: 'Certified personal trainer',
    userProfileFr: 'Entraîneur personnel certifié',
    primarySphere: 'business',
    connectedSpheres: ['personal', 'social', 'government', 'community'],
    requiredData: [
      { dataId: 'client-profiles', dataName: 'Client Profiles', dataNameFr: 'Profils clients', sourceSphere: 'business', isRequired: true, purpose: 'Training programs', purposeFr: 'Programmes d\'entraînement' },
      { dataId: 'certifications', dataName: 'Trainer Certifications', dataNameFr: 'Certifications d\'entraîneur', sourceSphere: 'government', isRequired: true, purpose: 'Credibility', purposeFr: 'Crédibilité' },
      { dataId: 'session-calendar', dataName: 'Session Calendar', dataNameFr: 'Calendrier des séances', sourceSphere: 'personal', isRequired: true, purpose: 'Scheduling', purposeFr: 'Planification' }
    ],
    actions: [
      { actionId: 'create-program', actionName: 'Create Training Program', actionNameFr: 'Créer un programme d\'entraînement', sphere: 'business' },
      { actionId: 'book-session', actionName: 'Book Session', actionNameFr: 'Réserver une séance', sphere: 'personal' },
      { actionId: 'track-progress', actionName: 'Track Client Progress', actionNameFr: 'Suivre les progrès du client', sphere: 'business' },
      { actionId: 'share-transformation', actionName: 'Share Transformation', actionNameFr: 'Partager une transformation', sphere: 'social' },
      { actionId: 'refer-clients', actionName: 'Get Client Referrals', actionNameFr: 'Obtenir des références', sphere: 'community' }
    ],
    sphereFlows: [
      { flowId: 'flow-session-to-calendar', flowName: 'Session to Calendar', flowNameFr: 'Séance vers Calendrier', fromSphere: 'business', toSphere: 'personal', dataTransferred: ['client-name', 'time', 'location'], trigger: 'Session booked', automation: 'automatic' },
      { flowId: 'flow-progress-to-social', flowName: 'Progress to Social', flowNameFr: 'Progrès vers Social', fromSphere: 'business', toSphere: 'social', dataTransferred: ['before-after', 'testimonial'], trigger: 'Client permission', automation: 'manual' }
    ],
    category: 'professional',
    tags: ['fitness', 'training', 'clients', 'scheduling', 'certifications']
  },

  {
    id: 'scenario-017',
    title: 'Law Firm Solo Practice',
    titleFr: 'Cabinet d\'avocat individuel',
    description: 'Solo lawyer manages cases, clients, billing and court deadlines',
    descriptionFr: 'Avocat solo gère dossiers, clients, facturation et échéances judiciaires',
    userProfile: 'Solo practice attorney',
    userProfileFr: 'Avocat en pratique solo',
    primarySphere: 'business',
    connectedSpheres: ['government', 'personal', 'community'],
    requiredData: [
      { dataId: 'case-files', dataName: 'Case Files', dataNameFr: 'Dossiers de cas', sourceSphere: 'business', isRequired: true, purpose: 'Case management', purposeFr: 'Gestion des dossiers' },
      { dataId: 'bar-license', dataName: 'Bar License', dataNameFr: 'Licence du barreau', sourceSphere: 'government', isRequired: true, purpose: 'Legal practice', purposeFr: 'Pratique légale' },
      { dataId: 'court-calendar', dataName: 'Court Calendar', dataNameFr: 'Calendrier judiciaire', sourceSphere: 'government', isRequired: true, purpose: 'Deadlines', purposeFr: 'Échéances' }
    ],
    actions: [
      { actionId: 'open-case', actionName: 'Open Case', actionNameFr: 'Ouvrir un dossier', sphere: 'business' },
      { actionId: 'track-billing', actionName: 'Track Billable Hours', actionNameFr: 'Suivre les heures facturables', sphere: 'business' },
      { actionId: 'file-documents', actionName: 'File Court Documents', actionNameFr: 'Déposer des documents au tribunal', sphere: 'government' },
      { actionId: 'calendar-deadlines', actionName: 'Calendar Deadlines', actionNameFr: 'Calendrier des échéances', sphere: 'personal' },
      { actionId: 'network-bar', actionName: 'Bar Association Events', actionNameFr: 'Événements du barreau', sphere: 'community' }
    ],
    sphereFlows: [
      { flowId: 'flow-court-to-calendar', flowName: 'Court Dates to Calendar', flowNameFr: 'Dates de cour vers Calendrier', fromSphere: 'government', toSphere: 'personal', dataTransferred: ['hearing-date', 'case-name', 'location'], trigger: 'Date set', automation: 'automatic' },
      { flowId: 'flow-case-to-billing', flowName: 'Case Work to Billing', flowNameFr: 'Travail de dossier vers Facturation', fromSphere: 'business', toSphere: 'business', dataTransferred: ['hours', 'activities', 'expenses'], trigger: 'Work logged', automation: 'automatic' }
    ],
    category: 'professional',
    tags: ['law', 'legal', 'cases', 'billing', 'court', 'deadlines']
  },

  {
    id: 'scenario-018',
    title: 'Accountant Tax Season',
    titleFr: 'Comptable en période fiscale',
    description: 'Accountant manages multiple client tax returns and deadlines',
    descriptionFr: 'Comptable gère plusieurs déclarations fiscales clients et échéances',
    userProfile: 'CPA/Chartered Accountant',
    userProfileFr: 'CPA/Comptable agréé',
    primarySphere: 'business',
    connectedSpheres: ['government', 'personal', 'my_team'],
    requiredData: [
      { dataId: 'client-files', dataName: 'Client Tax Files', dataNameFr: 'Dossiers fiscaux clients', sourceSphere: 'business', isRequired: true, purpose: 'Tax preparation', purposeFr: 'Préparation fiscale' },
      { dataId: 'tax-deadlines', dataName: 'Tax Deadlines', dataNameFr: 'Échéances fiscales', sourceSphere: 'government', isRequired: true, purpose: 'Compliance', purposeFr: 'Conformité' },
      { dataId: 'cpa-license', dataName: 'CPA License', dataNameFr: 'Licence CPA', sourceSphere: 'government', isRequired: true, purpose: 'Credentials', purposeFr: 'Accréditation' }
    ],
    actions: [
      { actionId: 'collect-documents', actionName: 'Collect Client Documents', actionNameFr: 'Collecter les documents clients', sphere: 'business' },
      { actionId: 'prepare-return', actionName: 'Prepare Tax Return', actionNameFr: 'Préparer la déclaration', sphere: 'business' },
      { actionId: 'e-file', actionName: 'E-file Return', actionNameFr: 'Transmettre électroniquement', sphere: 'government' },
      { actionId: 'track-refunds', actionName: 'Track Refunds', actionNameFr: 'Suivre les remboursements', sphere: 'business' },
      { actionId: 'setup-tax-ai', actionName: 'Setup Tax Analysis AI', actionNameFr: 'Configurer l\'IA d\'analyse fiscale', sphere: 'my_team' }
    ],
    sphereFlows: [
      { flowId: 'flow-return-to-efile', flowName: 'Return to E-file', flowNameFr: 'Déclaration vers Transmission', fromSphere: 'business', toSphere: 'government', dataTransferred: ['return-data', 'signatures'], trigger: 'Return approved', automation: 'manual' },
      { flowId: 'flow-deadline-reminder', flowName: 'Deadline to Calendar', flowNameFr: 'Échéance vers Calendrier', fromSphere: 'government', toSphere: 'personal', dataTransferred: ['deadline-date', 'client-name'], trigger: 'Tax period start', automation: 'automatic' }
    ],
    category: 'professional',
    tags: ['accounting', 'taxes', 'cpa', 'deadlines', 'e-filing']
  },

  {
    id: 'scenario-019',
    title: 'Contractor/Handyman Business',
    titleFr: 'Entreprise d\'entrepreneur/homme à tout faire',
    description: 'Contractor manages jobs, quotes, materials and client relationships',
    descriptionFr: 'Entrepreneur gère les travaux, devis, matériaux et relations clients',
    userProfile: 'Independent contractor',
    userProfileFr: 'Entrepreneur indépendant',
    primarySphere: 'business',
    connectedSpheres: ['government', 'personal', 'community'],
    requiredData: [
      { dataId: 'job-list', dataName: 'Job List', dataNameFr: 'Liste des travaux', sourceSphere: 'business', isRequired: true, purpose: 'Work management', purposeFr: 'Gestion du travail' },
      { dataId: 'contractor-license', dataName: 'Contractor License', dataNameFr: 'Licence d\'entrepreneur', sourceSphere: 'government', isRequired: true, purpose: 'Legal work', purposeFr: 'Travail légal' },
      { dataId: 'supplier-accounts', dataName: 'Supplier Accounts', dataNameFr: 'Comptes fournisseurs', sourceSphere: 'business', isRequired: true, purpose: 'Materials', purposeFr: 'Matériaux' }
    ],
    actions: [
      { actionId: 'create-quote', actionName: 'Create Quote', actionNameFr: 'Créer un devis', sphere: 'business' },
      { actionId: 'schedule-job', actionName: 'Schedule Job', actionNameFr: 'Planifier un travail', sphere: 'personal' },
      { actionId: 'order-materials', actionName: 'Order Materials', actionNameFr: 'Commander des matériaux', sphere: 'business' },
      { actionId: 'invoice-client', actionName: 'Invoice Client', actionNameFr: 'Facturer le client', sphere: 'business' },
      { actionId: 'get-referrals', actionName: 'Get Referrals', actionNameFr: 'Obtenir des références', sphere: 'community' }
    ],
    sphereFlows: [
      { flowId: 'flow-quote-to-job', flowName: 'Quote to Scheduled Job', flowNameFr: 'Devis vers Travail planifié', fromSphere: 'business', toSphere: 'personal', dataTransferred: ['job-details', 'dates', 'client-address'], trigger: 'Quote accepted', automation: 'automatic' },
      { flowId: 'flow-job-to-invoice', flowName: 'Job to Invoice', flowNameFr: 'Travail vers Facture', fromSphere: 'business', toSphere: 'business', dataTransferred: ['work-done', 'materials-used', 'hours'], trigger: 'Job completed', automation: 'suggested' }
    ],
    category: 'professional',
    tags: ['contractor', 'handyman', 'quotes', 'materials', 'scheduling']
  },

  {
    id: 'scenario-020',
    title: 'Import/Export Business',
    titleFr: 'Entreprise d\'import/export',
    description: 'Trader manages international shipments, customs and suppliers',
    descriptionFr: 'Commerçant gère les expéditions internationales, douanes et fournisseurs',
    userProfile: 'Import/export trader',
    userProfileFr: 'Commerçant import/export',
    primarySphere: 'business',
    connectedSpheres: ['government', 'community', 'my_team'],
    requiredData: [
      { dataId: 'supplier-database', dataName: 'Supplier Database', dataNameFr: 'Base de données fournisseurs', sourceSphere: 'business', isRequired: true, purpose: 'Sourcing', purposeFr: 'Approvisionnement' },
      { dataId: 'customs-accounts', dataName: 'Customs Accounts', dataNameFr: 'Comptes douaniers', sourceSphere: 'government', isRequired: true, purpose: 'Import/export', purposeFr: 'Import/export' },
      { dataId: 'shipping-partners', dataName: 'Shipping Partners', dataNameFr: 'Partenaires d\'expédition', sourceSphere: 'community', isRequired: true, purpose: 'Logistics', purposeFr: 'Logistique' }
    ],
    actions: [
      { actionId: 'place-order', actionName: 'Place Order', actionNameFr: 'Passer une commande', sphere: 'business' },
      { actionId: 'track-shipment', actionName: 'Track Shipment', actionNameFr: 'Suivre l\'expédition', sphere: 'business' },
      { actionId: 'file-customs', actionName: 'File Customs Declaration', actionNameFr: 'Déclarer en douane', sphere: 'government', triggersFlow: 'flow-customs' },
      { actionId: 'coordinate-logistics', actionName: 'Coordinate Logistics', actionNameFr: 'Coordonner la logistique', sphere: 'community' },
      { actionId: 'setup-tracking-ai', actionName: 'Setup Shipment Tracking AI', actionNameFr: 'Configurer l\'IA de suivi', sphere: 'my_team' }
    ],
    sphereFlows: [
      { flowId: 'flow-customs', flowName: 'Shipment to Customs', flowNameFr: 'Expédition vers Douanes', fromSphere: 'business', toSphere: 'government', dataTransferred: ['goods-description', 'value', 'origin'], trigger: 'Shipment arrives', automation: 'suggested' },
      { flowId: 'flow-delivery', flowName: 'Customs to Delivery', flowNameFr: 'Douanes vers Livraison', fromSphere: 'government', toSphere: 'business', dataTransferred: ['clearance-status', 'duties-paid'], trigger: 'Customs cleared', automation: 'automatic' }
    ],
    category: 'professional',
    tags: ['import', 'export', 'customs', 'shipping', 'international']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SCÉNARIOS 21-30: VIE PERSONNELLE & FAMILLE
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'scenario-021',
    title: 'Planning a Wedding',
    titleFr: 'Planifier un mariage',
    description: 'Couple plans their wedding with vendors, budget, guests and timeline',
    descriptionFr: 'Couple planifie leur mariage avec fournisseurs, budget, invités et calendrier',
    userProfile: 'Engaged couple',
    userProfileFr: 'Couple fiancé',
    primarySphere: 'personal',
    connectedSpheres: ['business', 'community', 'entertainment', 'government'],
    requiredData: [
      { dataId: 'guest-list', dataName: 'Guest List', dataNameFr: 'Liste des invités', sourceSphere: 'community', isRequired: true, purpose: 'Invitations', purposeFr: 'Invitations' },
      { dataId: 'budget', dataName: 'Wedding Budget', dataNameFr: 'Budget mariage', sourceSphere: 'business', isRequired: true, purpose: 'Financial planning', purposeFr: 'Planification financière' },
      { dataId: 'marriage-license', dataName: 'Marriage License', dataNameFr: 'Licence de mariage', sourceSphere: 'government', isRequired: true, purpose: 'Legal marriage', purposeFr: 'Mariage légal' }
    ],
    actions: [
      { actionId: 'set-date', actionName: 'Set Wedding Date', actionNameFr: 'Fixer la date', sphere: 'personal' },
      { actionId: 'book-venue', actionName: 'Book Venue', actionNameFr: 'Réserver le lieu', sphere: 'entertainment' },
      { actionId: 'hire-vendors', actionName: 'Hire Vendors', actionNameFr: 'Engager les fournisseurs', sphere: 'business' },
      { actionId: 'send-invitations', actionName: 'Send Invitations', actionNameFr: 'Envoyer les invitations', sphere: 'community' },
      { actionId: 'get-license', actionName: 'Get Marriage License', actionNameFr: 'Obtenir la licence', sphere: 'government' }
    ],
    sphereFlows: [
      { flowId: 'flow-rsvp', flowName: 'RSVP to Guest Count', flowNameFr: 'RSVP vers Nombre d\'invités', fromSphere: 'community', toSphere: 'business', dataTransferred: ['confirmed-guests', 'meal-choices'], trigger: 'RSVP received', automation: 'automatic' },
      { flowId: 'flow-vendor-payment', flowName: 'Vendor to Payment', flowNameFr: 'Fournisseur vers Paiement', fromSphere: 'entertainment', toSphere: 'business', dataTransferred: ['invoice', 'due-date'], trigger: 'Contract signed', automation: 'automatic' }
    ],
    category: 'family',
    tags: ['wedding', 'planning', 'vendors', 'guests', 'budget']
  },

  {
    id: 'scenario-022',
    title: 'First-Time Home Buyer',
    titleFr: 'Premier achat immobilier',
    description: 'Person navigates buying their first home with mortgage, inspection, closing',
    descriptionFr: 'Personne navigue l\'achat de sa première maison avec hypothèque, inspection, clôture',
    userProfile: 'First-time home buyer',
    userProfileFr: 'Premier acheteur immobilier',
    primarySphere: 'personal',
    connectedSpheres: ['business', 'government', 'community'],
    requiredData: [
      { dataId: 'financial-info', dataName: 'Financial Information', dataNameFr: 'Information financière', sourceSphere: 'business', isRequired: true, purpose: 'Mortgage approval', purposeFr: 'Approbation hypothécaire' },
      { dataId: 'property-search', dataName: 'Property Search Criteria', dataNameFr: 'Critères de recherche', sourceSphere: 'personal', isRequired: true, purpose: 'House hunting', purposeFr: 'Recherche de maison' },
      { dataId: 'mortgage-preapproval', dataName: 'Mortgage Pre-approval', dataNameFr: 'Pré-approbation hypothécaire', sourceSphere: 'business', isRequired: true, purpose: 'Buying power', purposeFr: 'Pouvoir d\'achat' }
    ],
    actions: [
      { actionId: 'get-preapproval', actionName: 'Get Mortgage Pre-approval', actionNameFr: 'Obtenir pré-approbation', sphere: 'business' },
      { actionId: 'search-homes', actionName: 'Search Homes', actionNameFr: 'Chercher des maisons', sphere: 'personal' },
      { actionId: 'make-offer', actionName: 'Make Offer', actionNameFr: 'Faire une offre', sphere: 'business' },
      { actionId: 'home-inspection', actionName: 'Get Home Inspection', actionNameFr: 'Faire inspecter', sphere: 'community' },
      { actionId: 'close-deal', actionName: 'Close on Home', actionNameFr: 'Conclure l\'achat', sphere: 'government', triggersFlow: 'flow-deed' }
    ],
    sphereFlows: [
      { flowId: 'flow-deed', flowName: 'Closing to Property Record', flowNameFr: 'Clôture vers Titre', fromSphere: 'government', toSphere: 'personal', dataTransferred: ['deed', 'property-info', 'mortgage-details'], trigger: 'Closing complete', automation: 'automatic' },
      { flowId: 'flow-expense', flowName: 'Home Expense to Budget', flowNameFr: 'Dépense maison vers Budget', fromSphere: 'personal', toSphere: 'business', dataTransferred: ['mortgage-payment', 'property-tax', 'insurance'], trigger: 'Monthly', automation: 'automatic' }
    ],
    category: 'real-estate',
    tags: ['home-buying', 'mortgage', 'real-estate', 'inspection', 'closing']
  },

  {
    id: 'scenario-023',
    title: 'New Baby Preparation',
    titleFr: 'Préparation pour un nouveau bébé',
    description: 'Expectant parents prepare for baby with registry, appointments, benefits',
    descriptionFr: 'Futurs parents préparent l\'arrivée du bébé avec liste de naissance, rendez-vous, prestations',
    userProfile: 'Expectant parents',
    userProfileFr: 'Futurs parents',
    primarySphere: 'personal',
    connectedSpheres: ['government', 'business', 'community'],
    requiredData: [
      { dataId: 'due-date', dataName: 'Due Date', dataNameFr: 'Date prévue', sourceSphere: 'personal', isRequired: true, purpose: 'Planning', purposeFr: 'Planification' },
      { dataId: 'parental-benefits', dataName: 'Parental Benefits Info', dataNameFr: 'Info prestations parentales', sourceSphere: 'government', isRequired: true, purpose: 'Benefits', purposeFr: 'Prestations' },
      { dataId: 'baby-budget', dataName: 'Baby Budget', dataNameFr: 'Budget bébé', sourceSphere: 'business', isRequired: true, purpose: 'Financial planning', purposeFr: 'Planification financière' }
    ],
    actions: [
      { actionId: 'track-appointments', actionName: 'Track Medical Appointments', actionNameFr: 'Suivre les rendez-vous médicaux', sphere: 'personal' },
      { actionId: 'create-registry', actionName: 'Create Baby Registry', actionNameFr: 'Créer une liste de naissance', sphere: 'personal' },
      { actionId: 'apply-benefits', actionName: 'Apply for Parental Benefits', actionNameFr: 'Demander les prestations', sphere: 'government' },
      { actionId: 'plan-leave', actionName: 'Plan Parental Leave', actionNameFr: 'Planifier le congé parental', sphere: 'business' },
      { actionId: 'baby-shower', actionName: 'Plan Baby Shower', actionNameFr: 'Planifier la fête prénatale', sphere: 'community' }
    ],
    sphereFlows: [
      { flowId: 'flow-birth-cert', flowName: 'Birth to Certificate', flowNameFr: 'Naissance vers Certificat', fromSphere: 'personal', toSphere: 'government', dataTransferred: ['baby-name', 'birth-date', 'parents-info'], trigger: 'Baby born', automation: 'suggested' },
      { flowId: 'flow-benefits-claim', flowName: 'Birth to Benefits Claim', flowNameFr: 'Naissance vers Demande prestations', fromSphere: 'government', toSphere: 'business', dataTransferred: ['benefit-amount', 'duration'], trigger: 'Certificate received', automation: 'automatic' }
    ],
    category: 'family',
    tags: ['baby', 'parenting', 'benefits', 'registry', 'medical']
  },

  {
    id: 'scenario-024',
    title: 'Divorce Process',
    titleFr: 'Processus de divorce',
    description: 'Person navigates divorce with legal, financial and personal aspects',
    descriptionFr: 'Personne navigue le divorce avec aspects légaux, financiers et personnels',
    userProfile: 'Person going through divorce',
    userProfileFr: 'Personne en instance de divorce',
    primarySphere: 'personal',
    connectedSpheres: ['government', 'business', 'community'],
    requiredData: [
      { dataId: 'marriage-info', dataName: 'Marriage Information', dataNameFr: 'Information sur le mariage', sourceSphere: 'government', isRequired: true, purpose: 'Legal process', purposeFr: 'Processus légal' },
      { dataId: 'shared-assets', dataName: 'Shared Assets', dataNameFr: 'Actifs partagés', sourceSphere: 'business', isRequired: true, purpose: 'Division', purposeFr: 'Division' },
      { dataId: 'support-network', dataName: 'Support Network', dataNameFr: 'Réseau de soutien', sourceSphere: 'community', isRequired: false, purpose: 'Emotional support', purposeFr: 'Soutien émotionnel' }
    ],
    actions: [
      { actionId: 'file-divorce', actionName: 'File for Divorce', actionNameFr: 'Demander le divorce', sphere: 'government' },
      { actionId: 'document-assets', actionName: 'Document Assets', actionNameFr: 'Documenter les actifs', sphere: 'business' },
      { actionId: 'find-lawyer', actionName: 'Find Divorce Lawyer', actionNameFr: 'Trouver un avocat', sphere: 'community' },
      { actionId: 'separate-finances', actionName: 'Separate Finances', actionNameFr: 'Séparer les finances', sphere: 'business' },
      { actionId: 'update-documents', actionName: 'Update Legal Documents', actionNameFr: 'Mettre à jour les documents', sphere: 'government' }
    ],
    sphereFlows: [
      { flowId: 'flow-decree', flowName: 'Divorce to Document Updates', flowNameFr: 'Divorce vers Mise à jour documents', fromSphere: 'government', toSphere: 'personal', dataTransferred: ['divorce-decree', 'name-change'], trigger: 'Divorce finalized', automation: 'suggested' },
      { flowId: 'flow-asset-split', flowName: 'Assets to Separate Accounts', flowNameFr: 'Actifs vers Comptes séparés', fromSphere: 'business', toSphere: 'personal', dataTransferred: ['divided-assets', 'new-ownership'], trigger: 'Division agreed', automation: 'manual' }
    ],
    category: 'family',
    tags: ['divorce', 'legal', 'assets', 'separation', 'lawyer']
  },

  {
    id: 'scenario-025',
    title: 'Elderly Parent Care',
    titleFr: 'Soins d\'un parent âgé',
    description: 'Adult child manages care for elderly parent with medical, legal and financial needs',
    descriptionFr: 'Enfant adulte gère les soins d\'un parent âgé avec besoins médicaux, légaux et financiers',
    userProfile: 'Adult caregiver',
    userProfileFr: 'Aidant naturel adulte',
    primarySphere: 'personal',
    connectedSpheres: ['government', 'business', 'community'],
    requiredData: [
      { dataId: 'medical-info', dataName: 'Parent Medical Info', dataNameFr: 'Info médicale du parent', sourceSphere: 'personal', isRequired: true, purpose: 'Healthcare', purposeFr: 'Soins de santé' },
      { dataId: 'power-attorney', dataName: 'Power of Attorney', dataNameFr: 'Procuration', sourceSphere: 'government', isRequired: true, purpose: 'Legal authority', purposeFr: 'Autorité légale' },
      { dataId: 'care-costs', dataName: 'Care Costs', dataNameFr: 'Coûts des soins', sourceSphere: 'business', isRequired: true, purpose: 'Financial planning', purposeFr: 'Planification financière' }
    ],
    actions: [
      { actionId: 'manage-appointments', actionName: 'Manage Medical Appointments', actionNameFr: 'Gérer les rendez-vous médicaux', sphere: 'personal' },
      { actionId: 'setup-poa', actionName: 'Setup Power of Attorney', actionNameFr: 'Établir une procuration', sphere: 'government' },
      { actionId: 'find-care', actionName: 'Find Care Services', actionNameFr: 'Trouver des services de soins', sphere: 'community' },
      { actionId: 'manage-finances', actionName: 'Manage Parent Finances', actionNameFr: 'Gérer les finances du parent', sphere: 'business' },
      { actionId: 'apply-benefits', actionName: 'Apply for Senior Benefits', actionNameFr: 'Demander les prestations aînés', sphere: 'government' }
    ],
    sphereFlows: [
      { flowId: 'flow-care-to-budget', flowName: 'Care Costs to Budget', flowNameFr: 'Coûts soins vers Budget', fromSphere: 'community', toSphere: 'business', dataTransferred: ['care-invoices', 'recurring-costs'], trigger: 'Service billed', automation: 'automatic' },
      { flowId: 'flow-medical-to-calendar', flowName: 'Appointments to Calendar', flowNameFr: 'Rendez-vous vers Calendrier', fromSphere: 'community', toSphere: 'personal', dataTransferred: ['appointment-details', 'location'], trigger: 'Appointment booked', automation: 'automatic' }
    ],
    category: 'family',
    tags: ['elderly-care', 'caregiving', 'medical', 'power-of-attorney', 'seniors']
  },

  {
    id: 'scenario-026',
    title: 'International Relocation',
    titleFr: 'Déménagement international',
    description: 'Family relocates to another country with visa, moving, new setup',
    descriptionFr: 'Famille déménage dans un autre pays avec visa, déménagement, nouvelle installation',
    userProfile: 'Relocating family',
    userProfileFr: 'Famille en relocalisation',
    primarySphere: 'personal',
    connectedSpheres: ['government', 'business', 'community', 'entertainment'],
    requiredData: [
      { dataId: 'visa-info', dataName: 'Visa Information', dataNameFr: 'Information sur le visa', sourceSphere: 'government', isRequired: true, purpose: 'Immigration', purposeFr: 'Immigration' },
      { dataId: 'moving-inventory', dataName: 'Moving Inventory', dataNameFr: 'Inventaire déménagement', sourceSphere: 'personal', isRequired: true, purpose: 'Moving', purposeFr: 'Déménagement' },
      { dataId: 'relocation-budget', dataName: 'Relocation Budget', dataNameFr: 'Budget de relocalisation', sourceSphere: 'business', isRequired: true, purpose: 'Financial planning', purposeFr: 'Planification financière' }
    ],
    actions: [
      { actionId: 'apply-visa', actionName: 'Apply for Visa', actionNameFr: 'Demander un visa', sphere: 'government' },
      { actionId: 'hire-movers', actionName: 'Hire International Movers', actionNameFr: 'Engager des déménageurs', sphere: 'business' },
      { actionId: 'close-accounts', actionName: 'Close/Transfer Accounts', actionNameFr: 'Fermer/Transférer les comptes', sphere: 'business' },
      { actionId: 'find-housing', actionName: 'Find Housing', actionNameFr: 'Trouver un logement', sphere: 'personal' },
      { actionId: 'say-goodbye', actionName: 'Organize Farewell', actionNameFr: 'Organiser les adieux', sphere: 'community' }
    ],
    sphereFlows: [
      { flowId: 'flow-visa-to-move', flowName: 'Visa to Move Planning', flowNameFr: 'Visa vers Planification déménagement', fromSphere: 'government', toSphere: 'personal', dataTransferred: ['visa-approval', 'entry-date'], trigger: 'Visa approved', automation: 'automatic' },
      { flowId: 'flow-new-country-setup', flowName: 'Move to New Country Setup', flowNameFr: 'Déménagement vers Installation', fromSphere: 'personal', toSphere: 'government', dataTransferred: ['new-address', 'residency-status'], trigger: 'Arrived', automation: 'suggested' }
    ],
    category: 'personal',
    tags: ['relocation', 'international', 'visa', 'moving', 'immigration']
  },

  {
    id: 'scenario-027',
    title: 'Kid Going to College',
    titleFr: 'Enfant partant à l\'université',
    description: 'Parents help child with college applications, financial aid, and transition',
    descriptionFr: 'Parents aident l\'enfant avec candidatures universitaires, aide financière et transition',
    userProfile: 'Parent of college-bound student',
    userProfileFr: 'Parent d\'étudiant futur universitaire',
    primarySphere: 'personal',
    connectedSpheres: ['business', 'government', 'community'],
    requiredData: [
      { dataId: 'college-list', dataName: 'College List', dataNameFr: 'Liste des universités', sourceSphere: 'personal', isRequired: true, purpose: 'Applications', purposeFr: 'Candidatures' },
      { dataId: 'financial-aid', dataName: 'Financial Aid Info', dataNameFr: 'Info aide financière', sourceSphere: 'government', isRequired: true, purpose: 'Affordability', purposeFr: 'Accessibilité financière' },
      { dataId: 'education-savings', dataName: 'Education Savings', dataNameFr: 'Épargne-études', sourceSphere: 'business', isRequired: false, purpose: 'Payment', purposeFr: 'Paiement' }
    ],
    actions: [
      { actionId: 'research-colleges', actionName: 'Research Colleges', actionNameFr: 'Rechercher des universités', sphere: 'personal' },
      { actionId: 'submit-applications', actionName: 'Submit Applications', actionNameFr: 'Soumettre les candidatures', sphere: 'personal' },
      { actionId: 'apply-fafsa', actionName: 'Apply for Financial Aid', actionNameFr: 'Demander l\'aide financière', sphere: 'government' },
      { actionId: 'plan-visits', actionName: 'Plan Campus Visits', actionNameFr: 'Planifier les visites', sphere: 'entertainment' },
      { actionId: 'budget-tuition', actionName: 'Budget for Tuition', actionNameFr: 'Budgéter les frais', sphere: 'business' }
    ],
    sphereFlows: [
      { flowId: 'flow-acceptance', flowName: 'Acceptance to Financial Planning', flowNameFr: 'Acceptation vers Plan financier', fromSphere: 'personal', toSphere: 'business', dataTransferred: ['tuition-cost', 'aid-package', 'payment-schedule'], trigger: 'College chosen', automation: 'suggested' },
      { flowId: 'flow-savings-to-payment', flowName: 'Savings to Tuition Payment', flowNameFr: 'Épargne vers Paiement', fromSphere: 'business', toSphere: 'government', dataTransferred: ['payment-amount', 'student-id'], trigger: 'Semester start', automation: 'manual' }
    ],
    category: 'family',
    tags: ['college', 'education', 'financial-aid', 'applications', 'tuition']
  },

  {
    id: 'scenario-028',
    title: 'Estate Planning',
    titleFr: 'Planification successorale',
    description: 'Person creates comprehensive estate plan with will, trusts, beneficiaries',
    descriptionFr: 'Personne crée un plan successoral complet avec testament, fiducies, bénéficiaires',
    userProfile: 'Adult planning estate',
    userProfileFr: 'Adulte planifiant sa succession',
    primarySphere: 'personal',
    connectedSpheres: ['government', 'business', 'community'],
    requiredData: [
      { dataId: 'assets', dataName: 'Complete Asset List', dataNameFr: 'Liste complète des actifs', sourceSphere: 'business', isRequired: true, purpose: 'Distribution', purposeFr: 'Distribution' },
      { dataId: 'beneficiaries', dataName: 'Beneficiary List', dataNameFr: 'Liste des bénéficiaires', sourceSphere: 'community', isRequired: true, purpose: 'Inheritance', purposeFr: 'Héritage' },
      { dataId: 'existing-docs', dataName: 'Existing Legal Documents', dataNameFr: 'Documents légaux existants', sourceSphere: 'government', isRequired: false, purpose: 'Review', purposeFr: 'Révision' }
    ],
    actions: [
      { actionId: 'create-will', actionName: 'Create Will', actionNameFr: 'Créer un testament', sphere: 'government' },
      { actionId: 'setup-trust', actionName: 'Setup Trust', actionNameFr: 'Établir une fiducie', sphere: 'government' },
      { actionId: 'designate-beneficiaries', actionName: 'Designate Beneficiaries', actionNameFr: 'Désigner les bénéficiaires', sphere: 'business' },
      { actionId: 'healthcare-directive', actionName: 'Create Healthcare Directive', actionNameFr: 'Créer des directives de soins', sphere: 'personal' },
      { actionId: 'inform-family', actionName: 'Inform Family', actionNameFr: 'Informer la famille', sphere: 'community' }
    ],
    sphereFlows: [
      { flowId: 'flow-assets-to-will', flowName: 'Assets to Will', flowNameFr: 'Actifs vers Testament', fromSphere: 'business', toSphere: 'government', dataTransferred: ['asset-list', 'values', 'ownership'], trigger: 'Will drafted', automation: 'suggested' },
      { flowId: 'flow-beneficiaries-to-accounts', flowName: 'Beneficiaries to Accounts', flowNameFr: 'Bénéficiaires vers Comptes', fromSphere: 'community', toSphere: 'business', dataTransferred: ['beneficiary-names', 'percentages'], trigger: 'Designations complete', automation: 'manual' }
    ],
    category: 'personal',
    tags: ['estate', 'will', 'trust', 'beneficiaries', 'inheritance']
  },

  {
    id: 'scenario-029',
    title: 'Managing Chronic Illness',
    titleFr: 'Gestion d\'une maladie chronique',
    description: 'Person manages chronic health condition with appointments, medications, insurance',
    descriptionFr: 'Personne gère une condition de santé chronique avec rendez-vous, médicaments, assurance',
    userProfile: 'Person with chronic illness',
    userProfileFr: 'Personne avec maladie chronique',
    primarySphere: 'personal',
    connectedSpheres: ['business', 'government', 'community'],
    requiredData: [
      { dataId: 'medical-records', dataName: 'Medical Records', dataNameFr: 'Dossiers médicaux', sourceSphere: 'personal', isRequired: true, purpose: 'Care coordination', purposeFr: 'Coordination des soins' },
      { dataId: 'insurance-coverage', dataName: 'Insurance Coverage', dataNameFr: 'Couverture d\'assurance', sourceSphere: 'business', isRequired: true, purpose: 'Payment', purposeFr: 'Paiement' },
      { dataId: 'disability-benefits', dataName: 'Disability Benefits', dataNameFr: 'Prestations d\'invalidité', sourceSphere: 'government', isRequired: false, purpose: 'Income support', purposeFr: 'Soutien au revenu' }
    ],
    actions: [
      { actionId: 'track-symptoms', actionName: 'Track Symptoms', actionNameFr: 'Suivre les symptômes', sphere: 'personal' },
      { actionId: 'manage-medications', actionName: 'Manage Medications', actionNameFr: 'Gérer les médicaments', sphere: 'personal' },
      { actionId: 'schedule-appointments', actionName: 'Schedule Appointments', actionNameFr: 'Planifier les rendez-vous', sphere: 'personal' },
      { actionId: 'file-claims', actionName: 'File Insurance Claims', actionNameFr: 'Soumettre des réclamations', sphere: 'business' },
      { actionId: 'join-support-group', actionName: 'Join Support Group', actionNameFr: 'Joindre un groupe de soutien', sphere: 'community' }
    ],
    sphereFlows: [
      { flowId: 'flow-rx-to-refill', flowName: 'Prescription to Refill', flowNameFr: 'Prescription vers Renouvellement', fromSphere: 'personal', toSphere: 'business', dataTransferred: ['medication', 'dosage', 'pharmacy'], trigger: 'Refill needed', automation: 'suggested' },
      { flowId: 'flow-expense-to-claim', flowName: 'Medical Expense to Claim', flowNameFr: 'Dépense médicale vers Réclamation', fromSphere: 'personal', toSphere: 'business', dataTransferred: ['receipt', 'diagnosis-code', 'provider'], trigger: 'Payment made', automation: 'suggested' }
    ],
    category: 'health',
    tags: ['health', 'chronic', 'medications', 'insurance', 'appointments']
  },

  {
    id: 'scenario-030',
    title: 'Retirement Planning',
    titleFr: 'Planification de la retraite',
    description: 'Person plans retirement with savings, benefits, lifestyle adjustments',
    descriptionFr: 'Personne planifie sa retraite avec épargne, prestations, ajustements de style de vie',
    userProfile: 'Pre-retiree',
    userProfileFr: 'Pré-retraité',
    primarySphere: 'personal',
    connectedSpheres: ['business', 'government', 'entertainment'],
    requiredData: [
      { dataId: 'retirement-savings', dataName: 'Retirement Savings', dataNameFr: 'Épargne-retraite', sourceSphere: 'business', isRequired: true, purpose: 'Financial planning', purposeFr: 'Planification financière' },
      { dataId: 'pension-info', dataName: 'Pension Information', dataNameFr: 'Information sur la pension', sourceSphere: 'government', isRequired: true, purpose: 'Income planning', purposeFr: 'Planification des revenus' },
      { dataId: 'retirement-goals', dataName: 'Retirement Goals', dataNameFr: 'Objectifs de retraite', sourceSphere: 'personal', isRequired: true, purpose: 'Lifestyle planning', purposeFr: 'Planification du style de vie' }
    ],
    actions: [
      { actionId: 'calculate-needs', actionName: 'Calculate Retirement Needs', actionNameFr: 'Calculer les besoins', sphere: 'business' },
      { actionId: 'check-pension', actionName: 'Check Pension Eligibility', actionNameFr: 'Vérifier l\'admissibilité', sphere: 'government' },
      { actionId: 'plan-activities', actionName: 'Plan Retirement Activities', actionNameFr: 'Planifier les activités', sphere: 'entertainment' },
      { actionId: 'downsize-home', actionName: 'Consider Downsizing', actionNameFr: 'Considérer réduire', sphere: 'personal' },
      { actionId: 'optimize-portfolio', actionName: 'Optimize Investment Portfolio', actionNameFr: 'Optimiser le portefeuille', sphere: 'business' }
    ],
    sphereFlows: [
      { flowId: 'flow-pension-to-income', flowName: 'Pension to Income Plan', flowNameFr: 'Pension vers Plan de revenus', fromSphere: 'government', toSphere: 'business', dataTransferred: ['pension-amount', 'start-date', 'survivor-benefits'], trigger: 'Eligibility confirmed', automation: 'automatic' },
      { flowId: 'flow-savings-to-income', flowName: 'Savings to Retirement Income', flowNameFr: 'Épargne vers Revenu retraite', fromSphere: 'business', toSphere: 'personal', dataTransferred: ['withdrawal-schedule', 'monthly-income'], trigger: 'Retirement date', automation: 'suggested' }
    ],
    category: 'personal',
    tags: ['retirement', 'pension', 'savings', 'planning', 'lifestyle']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SCÉNARIOS 31-50: COMMUNAUTÉ & ASSOCIATIONS (Suite du fichier...)
  // ═══════════════════════════════════════════════════════════════════════════
  // ... (à continuer dans la partie 2)

];

// Export count for verification
export const SCENARIO_COUNT = CIRCUMSTANTIAL_SCENARIOS.length;
