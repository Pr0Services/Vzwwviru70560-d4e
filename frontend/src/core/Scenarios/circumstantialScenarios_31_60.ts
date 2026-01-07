/**
 * CHE·NU™ — SCÉNARIOS CIRCONSTANCIELS (PARTIE 2 COMPLÈTE)
 * 
 * Scénarios 31-60: Communauté, Gouvernement, Social, Entertainment
 */

import { CircumstantialScenario } from './circumstantialScenarios';

export const SCENARIOS_31_TO_60: CircumstantialScenario[] = [

  // ═══════════════════════════════════════════════════════════════════════════
  // SCÉNARIOS 31-40: COMMUNAUTÉ & ASSOCIATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'scenario-031',
    title: 'Starting a Nonprofit Organization',
    titleFr: 'Créer un organisme à but non lucratif',
    description: 'Founder creates nonprofit with board, bylaws, tax exemption',
    descriptionFr: 'Fondateur crée un OBNL avec conseil d\'administration, règlements, exemption fiscale',
    userProfile: 'Nonprofit founder',
    userProfileFr: 'Fondateur d\'OBNL',
    primarySphere: 'community',
    connectedSpheres: ['government', 'business', 'social'],
    requiredData: [
      { dataId: 'mission', dataName: 'Mission Statement', dataNameFr: 'Énoncé de mission', sourceSphere: 'community', isRequired: true, purpose: 'Purpose definition', purposeFr: 'Définition du but' },
      { dataId: 'board-members', dataName: 'Board Members', dataNameFr: 'Membres du CA', sourceSphere: 'community', isRequired: true, purpose: 'Governance', purposeFr: 'Gouvernance' },
      { dataId: 'tax-exempt-status', dataName: 'Tax Exempt Application', dataNameFr: 'Demande d\'exemption fiscale', sourceSphere: 'government', isRequired: true, purpose: 'Tax benefits', purposeFr: 'Avantages fiscaux' }
    ],
    actions: [
      { actionId: 'draft-bylaws', actionName: 'Draft Bylaws', actionNameFr: 'Rédiger les règlements', sphere: 'community' },
      { actionId: 'incorporate', actionName: 'Incorporate Organization', actionNameFr: 'Incorporer l\'organisme', sphere: 'government' },
      { actionId: 'apply-tax-exempt', actionName: 'Apply for Tax Exemption', actionNameFr: 'Demander l\'exemption', sphere: 'government' },
      { actionId: 'recruit-board', actionName: 'Recruit Board Members', actionNameFr: 'Recruter le CA', sphere: 'community' },
      { actionId: 'setup-fundraising', actionName: 'Setup Fundraising', actionNameFr: 'Établir la collecte de fonds', sphere: 'business' }
    ],
    sphereFlows: [
      { flowId: 'flow-incorporation', flowName: 'Bylaws to Incorporation', flowNameFr: 'Règlements vers Incorporation', fromSphere: 'community', toSphere: 'government', dataTransferred: ['bylaws', 'directors', 'registered-address'], trigger: 'Bylaws approved', automation: 'manual' },
      { flowId: 'flow-donations', flowName: 'Donations to Accounting', flowNameFr: 'Dons vers Comptabilité', fromSphere: 'community', toSphere: 'business', dataTransferred: ['donor-info', 'amount', 'receipt-required'], trigger: 'Donation received', automation: 'automatic' }
    ],
    category: 'administrative',
    tags: ['nonprofit', 'charity', 'board', 'tax-exempt', 'bylaws']
  },

  {
    id: 'scenario-032',
    title: 'Sports League Commissioner',
    titleFr: 'Commissaire de ligue sportive',
    description: 'Runs amateur sports league with teams, schedules, standings',
    descriptionFr: 'Gère une ligue sportive amateur avec équipes, horaires, classements',
    userProfile: 'League commissioner',
    userProfileFr: 'Commissaire de ligue',
    primarySphere: 'community',
    connectedSpheres: ['entertainment', 'business', 'personal'],
    requiredData: [
      { dataId: 'teams', dataName: 'Team Registry', dataNameFr: 'Registre des équipes', sourceSphere: 'community', isRequired: true, purpose: 'League management', purposeFr: 'Gestion de la ligue' },
      { dataId: 'schedule', dataName: 'Game Schedule', dataNameFr: 'Horaire des matchs', sourceSphere: 'entertainment', isRequired: true, purpose: 'Planning', purposeFr: 'Planification' },
      { dataId: 'fees', dataName: 'Registration Fees', dataNameFr: 'Frais d\'inscription', sourceSphere: 'business', isRequired: true, purpose: 'Finances', purposeFr: 'Finances' }
    ],
    actions: [
      { actionId: 'register-teams', actionName: 'Register Teams', actionNameFr: 'Inscrire les équipes', sphere: 'community' },
      { actionId: 'create-schedule', actionName: 'Create Schedule', actionNameFr: 'Créer l\'horaire', sphere: 'entertainment' },
      { actionId: 'track-standings', actionName: 'Track Standings', actionNameFr: 'Suivre les classements', sphere: 'community' },
      { actionId: 'collect-fees', actionName: 'Collect Registration Fees', actionNameFr: 'Collecter les frais', sphere: 'business' },
      { actionId: 'book-facilities', actionName: 'Book Facilities', actionNameFr: 'Réserver les installations', sphere: 'entertainment' }
    ],
    sphereFlows: [
      { flowId: 'flow-schedule-notify', flowName: 'Schedule to Teams', flowNameFr: 'Horaire vers Équipes', fromSphere: 'entertainment', toSphere: 'community', dataTransferred: ['game-dates', 'opponents', 'locations'], trigger: 'Schedule published', automation: 'automatic' },
      { flowId: 'flow-fees-budget', flowName: 'Fees to League Budget', flowNameFr: 'Frais vers Budget ligue', fromSphere: 'community', toSphere: 'business', dataTransferred: ['team-name', 'amount', 'payment-date'], trigger: 'Fee received', automation: 'automatic' }
    ],
    category: 'social',
    tags: ['sports', 'league', 'teams', 'schedule', 'standings']
  },

  {
    id: 'scenario-033',
    title: 'Condo Association Board Member',
    titleFr: 'Membre du CA de copropriété',
    description: 'Board member manages condo association with budget, maintenance, meetings',
    descriptionFr: 'Membre du CA gère la copropriété avec budget, entretien, réunions',
    userProfile: 'Condo board member',
    userProfileFr: 'Membre du CA de copropriété',
    primarySphere: 'community',
    connectedSpheres: ['business', 'government', 'personal'],
    requiredData: [
      { dataId: 'unit-owners', dataName: 'Unit Owners Registry', dataNameFr: 'Registre des copropriétaires', sourceSphere: 'community', isRequired: true, purpose: 'Communication', purposeFr: 'Communication' },
      { dataId: 'reserve-fund', dataName: 'Reserve Fund', dataNameFr: 'Fonds de réserve', sourceSphere: 'business', isRequired: true, purpose: 'Major repairs', purposeFr: 'Réparations majeures' },
      { dataId: 'declaration', dataName: 'Condo Declaration', dataNameFr: 'Déclaration de copropriété', sourceSphere: 'government', isRequired: true, purpose: 'Rules', purposeFr: 'Règles' }
    ],
    actions: [
      { actionId: 'hold-agm', actionName: 'Hold AGM', actionNameFr: 'Tenir l\'AGA', sphere: 'community' },
      { actionId: 'approve-budget', actionName: 'Approve Annual Budget', actionNameFr: 'Approuver le budget annuel', sphere: 'business' },
      { actionId: 'manage-maintenance', actionName: 'Manage Maintenance', actionNameFr: 'Gérer l\'entretien', sphere: 'business' },
      { actionId: 'collect-fees', actionName: 'Collect Condo Fees', actionNameFr: 'Collecter les frais de condo', sphere: 'business' },
      { actionId: 'enforce-rules', actionName: 'Enforce Rules', actionNameFr: 'Faire respecter les règles', sphere: 'community' }
    ],
    sphereFlows: [
      { flowId: 'flow-fees-collection', flowName: 'Fees to Operating Budget', flowNameFr: 'Frais vers Budget opérationnel', fromSphere: 'community', toSphere: 'business', dataTransferred: ['unit', 'owner', 'amount', 'status'], trigger: 'Monthly', automation: 'automatic' },
      { flowId: 'flow-agm-minutes', flowName: 'AGM to Minutes', flowNameFr: 'AGA vers Procès-verbal', fromSphere: 'community', toSphere: 'government', dataTransferred: ['decisions', 'votes', 'attendees'], trigger: 'AGM completed', automation: 'suggested' }
    ],
    category: 'administrative',
    tags: ['condo', 'hoa', 'board', 'maintenance', 'reserve-fund']
  },

  {
    id: 'scenario-034',
    title: 'Youth Program Coordinator',
    titleFr: 'Coordonnateur de programme jeunesse',
    description: 'Runs youth programs with registration, activities, volunteers, safety',
    descriptionFr: 'Gère des programmes jeunesse avec inscriptions, activités, bénévoles, sécurité',
    userProfile: 'Youth program coordinator',
    userProfileFr: 'Coordonnateur de programme jeunesse',
    primarySphere: 'community',
    connectedSpheres: ['government', 'business', 'entertainment'],
    requiredData: [
      { dataId: 'participants', dataName: 'Youth Participants', dataNameFr: 'Participants jeunes', sourceSphere: 'community', isRequired: true, purpose: 'Registration', purposeFr: 'Inscription' },
      { dataId: 'background-checks', dataName: 'Volunteer Background Checks', dataNameFr: 'Vérifications des bénévoles', sourceSphere: 'government', isRequired: true, purpose: 'Safety', purposeFr: 'Sécurité' },
      { dataId: 'program-fees', dataName: 'Program Fees', dataNameFr: 'Frais de programme', sourceSphere: 'business', isRequired: true, purpose: 'Revenue', purposeFr: 'Revenus' }
    ],
    actions: [
      { actionId: 'register-youth', actionName: 'Register Participants', actionNameFr: 'Inscrire les participants', sphere: 'community' },
      { actionId: 'screen-volunteers', actionName: 'Screen Volunteers', actionNameFr: 'Vérifier les bénévoles', sphere: 'government' },
      { actionId: 'plan-activities', actionName: 'Plan Activities', actionNameFr: 'Planifier les activités', sphere: 'entertainment' },
      { actionId: 'manage-waivers', actionName: 'Manage Waivers', actionNameFr: 'Gérer les décharges', sphere: 'government' },
      { actionId: 'collect-fees', actionName: 'Collect Fees', actionNameFr: 'Collecter les frais', sphere: 'business' }
    ],
    sphereFlows: [
      { flowId: 'flow-registration', flowName: 'Registration to Program', flowNameFr: 'Inscription vers Programme', fromSphere: 'community', toSphere: 'entertainment', dataTransferred: ['participant-name', 'age', 'emergency-contact', 'medical-info'], trigger: 'Registration complete', automation: 'automatic' },
      { flowId: 'flow-background-check', flowName: 'Volunteer to Background Check', flowNameFr: 'Bénévole vers Vérification', fromSphere: 'community', toSphere: 'government', dataTransferred: ['volunteer-name', 'consent-form'], trigger: 'Volunteer application', automation: 'suggested' }
    ],
    category: 'social',
    tags: ['youth', 'programs', 'volunteers', 'safety', 'activities']
  },

  {
    id: 'scenario-035',
    title: 'Professional Association Member',
    titleFr: 'Membre d\'association professionnelle',
    description: 'Active member in professional association with committees, events, advocacy',
    descriptionFr: 'Membre actif d\'association professionnelle avec comités, événements, représentation',
    userProfile: 'Association member',
    userProfileFr: 'Membre d\'association',
    primarySphere: 'community',
    connectedSpheres: ['business', 'government', 'entertainment'],
    requiredData: [
      { dataId: 'membership', dataName: 'Membership Status', dataNameFr: 'Statut de membre', sourceSphere: 'community', isRequired: true, purpose: 'Benefits', purposeFr: 'Avantages' },
      { dataId: 'committees', dataName: 'Committee Assignments', dataNameFr: 'Assignations de comités', sourceSphere: 'community', isRequired: false, purpose: 'Participation', purposeFr: 'Participation' },
      { dataId: 'ce-credits', dataName: 'CE Credits', dataNameFr: 'Crédits de formation', sourceSphere: 'government', isRequired: true, purpose: 'License renewal', purposeFr: 'Renouvellement de licence' }
    ],
    actions: [
      { actionId: 'renew-membership', actionName: 'Renew Membership', actionNameFr: 'Renouveler l\'adhésion', sphere: 'community' },
      { actionId: 'join-committee', actionName: 'Join Committee', actionNameFr: 'Joindre un comité', sphere: 'community' },
      { actionId: 'attend-conference', actionName: 'Attend Conference', actionNameFr: 'Assister à la conférence', sphere: 'entertainment' },
      { actionId: 'earn-ce', actionName: 'Earn CE Credits', actionNameFr: 'Obtenir des crédits', sphere: 'government' },
      { actionId: 'network-peers', actionName: 'Network with Peers', actionNameFr: 'Réseauter avec les pairs', sphere: 'community' }
    ],
    sphereFlows: [
      { flowId: 'flow-conference-ce', flowName: 'Conference to CE Credits', flowNameFr: 'Conférence vers Crédits', fromSphere: 'entertainment', toSphere: 'government', dataTransferred: ['session-attended', 'credits-earned', 'certificate'], trigger: 'Session completed', automation: 'automatic' },
      { flowId: 'flow-membership-expense', flowName: 'Membership to Business Expense', flowNameFr: 'Adhésion vers Dépense d\'affaires', fromSphere: 'community', toSphere: 'business', dataTransferred: ['dues-amount', 'receipt'], trigger: 'Renewal paid', automation: 'suggested' }
    ],
    category: 'professional',
    tags: ['association', 'professional', 'networking', 'ce-credits', 'committees']
  },

  {
    id: 'scenario-036',
    title: 'Coworking Space Member',
    titleFr: 'Membre d\'espace de coworking',
    description: 'Freelancer uses coworking space for work, networking, events',
    descriptionFr: 'Travailleur autonome utilise un espace de coworking pour travail, réseautage, événements',
    userProfile: 'Coworking member',
    userProfileFr: 'Membre de coworking',
    primarySphere: 'community',
    connectedSpheres: ['business', 'personal', 'entertainment'],
    requiredData: [
      { dataId: 'membership-plan', dataName: 'Membership Plan', dataNameFr: 'Plan d\'adhésion', sourceSphere: 'community', isRequired: true, purpose: 'Access', purposeFr: 'Accès' },
      { dataId: 'bookings', dataName: 'Room Bookings', dataNameFr: 'Réservations de salles', sourceSphere: 'community', isRequired: false, purpose: 'Meetings', purposeFr: 'Réunions' },
      { dataId: 'member-directory', dataName: 'Member Directory', dataNameFr: 'Répertoire des membres', sourceSphere: 'community', isRequired: false, purpose: 'Networking', purposeFr: 'Réseautage' }
    ],
    actions: [
      { actionId: 'book-room', actionName: 'Book Meeting Room', actionNameFr: 'Réserver une salle', sphere: 'community' },
      { actionId: 'attend-event', actionName: 'Attend Networking Event', actionNameFr: 'Assister à un événement', sphere: 'entertainment' },
      { actionId: 'connect-member', actionName: 'Connect with Member', actionNameFr: 'Se connecter avec un membre', sphere: 'community' },
      { actionId: 'expense-membership', actionName: 'Expense Membership', actionNameFr: 'Comptabiliser l\'adhésion', sphere: 'business' },
      { actionId: 'use-amenities', actionName: 'Use Amenities', actionNameFr: 'Utiliser les commodités', sphere: 'personal' }
    ],
    sphereFlows: [
      { flowId: 'flow-booking-calendar', flowName: 'Booking to Calendar', flowNameFr: 'Réservation vers Calendrier', fromSphere: 'community', toSphere: 'personal', dataTransferred: ['room', 'time', 'purpose'], trigger: 'Booking confirmed', automation: 'automatic' },
      { flowId: 'flow-membership-expense', flowName: 'Membership to Expense', flowNameFr: 'Adhésion vers Dépense', fromSphere: 'community', toSphere: 'business', dataTransferred: ['cost', 'receipt', 'category'], trigger: 'Payment', automation: 'suggested' }
    ],
    category: 'professional',
    tags: ['coworking', 'freelance', 'networking', 'meetings', 'workspace']
  },

  {
    id: 'scenario-037',
    title: 'Cooperative Housing Member',
    titleFr: 'Membre de coopérative d\'habitation',
    description: 'Lives in housing cooperative with shared responsibilities and governance',
    descriptionFr: 'Vit dans une coopérative d\'habitation avec responsabilités partagées et gouvernance',
    userProfile: 'Coop member',
    userProfileFr: 'Membre de coopérative',
    primarySphere: 'community',
    connectedSpheres: ['personal', 'business', 'government'],
    requiredData: [
      { dataId: 'membership-share', dataName: 'Membership Share', dataNameFr: 'Part de membre', sourceSphere: 'business', isRequired: true, purpose: 'Ownership', purposeFr: 'Propriété' },
      { dataId: 'work-hours', dataName: 'Required Work Hours', dataNameFr: 'Heures de travail requises', sourceSphere: 'community', isRequired: true, purpose: 'Contribution', purposeFr: 'Contribution' },
      { dataId: 'coop-rules', dataName: 'Coop Bylaws', dataNameFr: 'Règlements de la coop', sourceSphere: 'government', isRequired: true, purpose: 'Governance', purposeFr: 'Gouvernance' }
    ],
    actions: [
      { actionId: 'log-work-hours', actionName: 'Log Work Hours', actionNameFr: 'Enregistrer les heures', sphere: 'community' },
      { actionId: 'attend-meetings', actionName: 'Attend General Meetings', actionNameFr: 'Assister aux assemblées', sphere: 'community' },
      { actionId: 'pay-housing-charge', actionName: 'Pay Housing Charge', actionNameFr: 'Payer les charges', sphere: 'business' },
      { actionId: 'join-committee', actionName: 'Join Committee', actionNameFr: 'Joindre un comité', sphere: 'community' },
      { actionId: 'vote-decisions', actionName: 'Vote on Decisions', actionNameFr: 'Voter sur les décisions', sphere: 'community' }
    ],
    sphereFlows: [
      { flowId: 'flow-housing-charge', flowName: 'Housing Charge to Budget', flowNameFr: 'Charges vers Budget', fromSphere: 'community', toSphere: 'personal', dataTransferred: ['amount', 'due-date', 'category'], trigger: 'Monthly', automation: 'automatic' },
      { flowId: 'flow-work-tracking', flowName: 'Work Hours to Record', flowNameFr: 'Heures vers Dossier', fromSphere: 'community', toSphere: 'community', dataTransferred: ['hours', 'task', 'date'], trigger: 'Work completed', automation: 'manual' }
    ],
    category: 'personal',
    tags: ['coop', 'housing', 'governance', 'community', 'shared-responsibility']
  },

  {
    id: 'scenario-038',
    title: 'Volunteer Coordinator',
    titleFr: 'Coordonnateur des bénévoles',
    description: 'Manages volunteers for organization with scheduling, training, recognition',
    descriptionFr: 'Gère les bénévoles d\'un organisme avec horaires, formation, reconnaissance',
    userProfile: 'Volunteer coordinator',
    userProfileFr: 'Coordonnateur des bénévoles',
    primarySphere: 'community',
    connectedSpheres: ['personal', 'business', 'government'],
    requiredData: [
      { dataId: 'volunteer-database', dataName: 'Volunteer Database', dataNameFr: 'Base de données bénévoles', sourceSphere: 'community', isRequired: true, purpose: 'Management', purposeFr: 'Gestion' },
      { dataId: 'training-records', dataName: 'Training Records', dataNameFr: 'Dossiers de formation', sourceSphere: 'community', isRequired: true, purpose: 'Compliance', purposeFr: 'Conformité' },
      { dataId: 'background-checks', dataName: 'Background Check Status', dataNameFr: 'Statut des vérifications', sourceSphere: 'government', isRequired: true, purpose: 'Safety', purposeFr: 'Sécurité' }
    ],
    actions: [
      { actionId: 'recruit-volunteers', actionName: 'Recruit Volunteers', actionNameFr: 'Recruter des bénévoles', sphere: 'community' },
      { actionId: 'schedule-shifts', actionName: 'Schedule Shifts', actionNameFr: 'Planifier les quarts', sphere: 'community' },
      { actionId: 'conduct-training', actionName: 'Conduct Training', actionNameFr: 'Donner la formation', sphere: 'community' },
      { actionId: 'track-hours', actionName: 'Track Volunteer Hours', actionNameFr: 'Suivre les heures', sphere: 'community' },
      { actionId: 'recognize-volunteers', actionName: 'Recognize Volunteers', actionNameFr: 'Reconnaître les bénévoles', sphere: 'community' }
    ],
    sphereFlows: [
      { flowId: 'flow-shift-calendar', flowName: 'Shift to Volunteer Calendar', flowNameFr: 'Quart vers Calendrier', fromSphere: 'community', toSphere: 'personal', dataTransferred: ['shift-time', 'location', 'role'], trigger: 'Shift assigned', automation: 'automatic' },
      { flowId: 'flow-hours-certificate', flowName: 'Hours to Certificate', flowNameFr: 'Heures vers Certificat', fromSphere: 'community', toSphere: 'government', dataTransferred: ['total-hours', 'period', 'organization'], trigger: 'Request', automation: 'manual' }
    ],
    category: 'social',
    tags: ['volunteers', 'coordination', 'scheduling', 'training', 'recognition']
  },

  {
    id: 'scenario-039',
    title: 'Mutual Aid Network Organizer',
    titleFr: 'Organisateur de réseau d\'entraide',
    description: 'Coordinates community mutual aid with requests, offers, matching',
    descriptionFr: 'Coordonne l\'entraide communautaire avec demandes, offres, jumelage',
    userProfile: 'Mutual aid organizer',
    userProfileFr: 'Organisateur d\'entraide',
    primarySphere: 'community',
    connectedSpheres: ['personal', 'social'],
    requiredData: [
      { dataId: 'members', dataName: 'Network Members', dataNameFr: 'Membres du réseau', sourceSphere: 'community', isRequired: true, purpose: 'Matching', purposeFr: 'Jumelage' },
      { dataId: 'requests', dataName: 'Aid Requests', dataNameFr: 'Demandes d\'aide', sourceSphere: 'community', isRequired: true, purpose: 'Needs', purposeFr: 'Besoins' },
      { dataId: 'offers', dataName: 'Aid Offers', dataNameFr: 'Offres d\'aide', sourceSphere: 'community', isRequired: true, purpose: 'Resources', purposeFr: 'Ressources' }
    ],
    actions: [
      { actionId: 'post-request', actionName: 'Post Aid Request', actionNameFr: 'Publier une demande', sphere: 'community' },
      { actionId: 'offer-help', actionName: 'Offer Help', actionNameFr: 'Offrir de l\'aide', sphere: 'community' },
      { actionId: 'match-needs', actionName: 'Match Requests with Offers', actionNameFr: 'Jumeler demandes et offres', sphere: 'community' },
      { actionId: 'coordinate-delivery', actionName: 'Coordinate Delivery', actionNameFr: 'Coordonner la livraison', sphere: 'community' },
      { actionId: 'spread-word', actionName: 'Spread the Word', actionNameFr: 'Faire connaître', sphere: 'social' }
    ],
    sphereFlows: [
      { flowId: 'flow-request-match', flowName: 'Request to Match', flowNameFr: 'Demande vers Jumelage', fromSphere: 'community', toSphere: 'community', dataTransferred: ['request-type', 'location', 'urgency'], trigger: 'Request posted', automation: 'suggested' },
      { flowId: 'flow-share-social', flowName: 'Campaign to Social', flowNameFr: 'Campagne vers Social', fromSphere: 'community', toSphere: 'social', dataTransferred: ['needs-summary', 'how-to-help'], trigger: 'Campaign created', automation: 'suggested' }
    ],
    category: 'social',
    tags: ['mutual-aid', 'community', 'solidarity', 'matching', 'help']
  },

  {
    id: 'scenario-040',
    title: 'Trade Union Shop Steward',
    titleFr: 'Délégué syndical',
    description: 'Represents union members with grievances, negotiations, communication',
    descriptionFr: 'Représente les membres du syndicat avec griefs, négociations, communication',
    userProfile: 'Union shop steward',
    userProfileFr: 'Délégué syndical',
    primarySphere: 'community',
    connectedSpheres: ['government', 'business', 'personal'],
    requiredData: [
      { dataId: 'members', dataName: 'Union Members', dataNameFr: 'Membres du syndicat', sourceSphere: 'community', isRequired: true, purpose: 'Representation', purposeFr: 'Représentation' },
      { dataId: 'collective-agreement', dataName: 'Collective Agreement', dataNameFr: 'Convention collective', sourceSphere: 'government', isRequired: true, purpose: 'Rights', purposeFr: 'Droits' },
      { dataId: 'grievances', dataName: 'Grievance Files', dataNameFr: 'Dossiers de griefs', sourceSphere: 'community', isRequired: true, purpose: 'Dispute resolution', purposeFr: 'Résolution de conflits' }
    ],
    actions: [
      { actionId: 'file-grievance', actionName: 'File Grievance', actionNameFr: 'Déposer un grief', sphere: 'community' },
      { actionId: 'represent-member', actionName: 'Represent Member', actionNameFr: 'Représenter un membre', sphere: 'community' },
      { actionId: 'attend-negotiation', actionName: 'Attend Negotiation', actionNameFr: 'Assister aux négociations', sphere: 'business' },
      { actionId: 'communicate-members', actionName: 'Communicate with Members', actionNameFr: 'Communiquer avec les membres', sphere: 'community' },
      { actionId: 'track-deadlines', actionName: 'Track Grievance Deadlines', actionNameFr: 'Suivre les délais', sphere: 'personal' }
    ],
    sphereFlows: [
      { flowId: 'flow-grievance-track', flowName: 'Grievance to Tracking', flowNameFr: 'Grief vers Suivi', fromSphere: 'community', toSphere: 'personal', dataTransferred: ['grievance-id', 'deadlines', 'hearing-dates'], trigger: 'Grievance filed', automation: 'automatic' },
      { flowId: 'flow-agreement-reference', flowName: 'Agreement to Grievance', flowNameFr: 'Convention vers Grief', fromSphere: 'government', toSphere: 'community', dataTransferred: ['relevant-articles', 'precedents'], trigger: 'Research', automation: 'manual' }
    ],
    category: 'professional',
    tags: ['union', 'labor', 'grievance', 'representation', 'negotiation']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SCÉNARIOS 41-50: GOUVERNEMENT & CONFORMITÉ
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'scenario-041',
    title: 'Self-Employed Tax Filing',
    titleFr: 'Déclaration fiscale travailleur autonome',
    description: 'Freelancer files taxes with multiple income sources, expenses, deductions',
    descriptionFr: 'Travailleur autonome déclare ses impôts avec multiples revenus, dépenses, déductions',
    userProfile: 'Self-employed professional',
    userProfileFr: 'Professionnel travailleur autonome',
    primarySphere: 'government',
    connectedSpheres: ['business', 'personal'],
    requiredData: [
      { dataId: 'income-sources', dataName: 'All Income Sources', dataNameFr: 'Toutes sources de revenus', sourceSphere: 'business', isRequired: true, purpose: 'Income reporting', purposeFr: 'Déclaration des revenus' },
      { dataId: 'expenses', dataName: 'Business Expenses', dataNameFr: 'Dépenses d\'affaires', sourceSphere: 'business', isRequired: true, purpose: 'Deductions', purposeFr: 'Déductions' },
      { dataId: 'home-office', dataName: 'Home Office Details', dataNameFr: 'Détails bureau à domicile', sourceSphere: 'personal', isRequired: false, purpose: 'Deduction', purposeFr: 'Déduction' }
    ],
    actions: [
      { actionId: 'categorize-expenses', actionName: 'Categorize Expenses', actionNameFr: 'Catégoriser les dépenses', sphere: 'business' },
      { actionId: 'calculate-home-office', actionName: 'Calculate Home Office', actionNameFr: 'Calculer le bureau à domicile', sphere: 'personal' },
      { actionId: 'file-return', actionName: 'File Tax Return', actionNameFr: 'Déposer la déclaration', sphere: 'government' },
      { actionId: 'pay-instalments', actionName: 'Pay Tax Instalments', actionNameFr: 'Payer les acomptes', sphere: 'business' },
      { actionId: 'track-deductions', actionName: 'Track Eligible Deductions', actionNameFr: 'Suivre les déductions admissibles', sphere: 'government' }
    ],
    sphereFlows: [
      { flowId: 'flow-expenses-to-return', flowName: 'Expenses to Tax Return', flowNameFr: 'Dépenses vers Déclaration', fromSphere: 'business', toSphere: 'government', dataTransferred: ['expense-categories', 'totals', 'receipts'], trigger: 'Tax season', automation: 'suggested' },
      { flowId: 'flow-instalment-reminder', flowName: 'Instalment to Calendar', flowNameFr: 'Acompte vers Calendrier', fromSphere: 'government', toSphere: 'personal', dataTransferred: ['amount-due', 'due-date'], trigger: 'Quarterly', automation: 'automatic' }
    ],
    category: 'financial',
    tags: ['taxes', 'self-employed', 'deductions', 'instalments', 'freelance']
  },

  {
    id: 'scenario-042',
    title: 'Professional License Renewal',
    titleFr: 'Renouvellement de licence professionnelle',
    description: 'Professional renews license with CE requirements, fees, documentation',
    descriptionFr: 'Professionnel renouvelle sa licence avec exigences de formation, frais, documentation',
    userProfile: 'Licensed professional',
    userProfileFr: 'Professionnel licencié',
    primarySphere: 'government',
    connectedSpheres: ['business', 'personal', 'community'],
    requiredData: [
      { dataId: 'license-info', dataName: 'Current License', dataNameFr: 'Licence actuelle', sourceSphere: 'government', isRequired: true, purpose: 'Renewal', purposeFr: 'Renouvellement' },
      { dataId: 'ce-credits', dataName: 'CE Credit Record', dataNameFr: 'Dossier de crédits de FC', sourceSphere: 'government', isRequired: true, purpose: 'Eligibility', purposeFr: 'Admissibilité' },
      { dataId: 'insurance', dataName: 'Professional Insurance', dataNameFr: 'Assurance professionnelle', sourceSphere: 'business', isRequired: true, purpose: 'Requirement', purposeFr: 'Exigence' }
    ],
    actions: [
      { actionId: 'check-ce-status', actionName: 'Check CE Status', actionNameFr: 'Vérifier le statut FC', sphere: 'government' },
      { actionId: 'complete-ce', actionName: 'Complete CE Courses', actionNameFr: 'Compléter les cours FC', sphere: 'community' },
      { actionId: 'submit-renewal', actionName: 'Submit Renewal', actionNameFr: 'Soumettre le renouvellement', sphere: 'government' },
      { actionId: 'pay-fees', actionName: 'Pay Renewal Fees', actionNameFr: 'Payer les frais', sphere: 'business' },
      { actionId: 'update-insurance', actionName: 'Update Insurance', actionNameFr: 'Mettre à jour l\'assurance', sphere: 'business' }
    ],
    sphereFlows: [
      { flowId: 'flow-ce-to-renewal', flowName: 'CE Credits to Renewal', flowNameFr: 'Crédits FC vers Renouvellement', fromSphere: 'community', toSphere: 'government', dataTransferred: ['credits-earned', 'categories', 'certificates'], trigger: 'Renewal application', automation: 'automatic' },
      { flowId: 'flow-renewal-expense', flowName: 'Fees to Business Expense', flowNameFr: 'Frais vers Dépense d\'affaires', fromSphere: 'government', toSphere: 'business', dataTransferred: ['fee-amount', 'receipt'], trigger: 'Fee paid', automation: 'suggested' }
    ],
    category: 'administrative',
    tags: ['license', 'renewal', 'ce-credits', 'professional', 'compliance']
  },

  {
    id: 'scenario-043',
    title: 'GST/HST Registration & Filing',
    titleFr: 'Inscription et déclaration TPS/TVH',
    description: 'Business registers for and files GST/HST returns',
    descriptionFr: 'Entreprise s\'inscrit et produit les déclarations de TPS/TVH',
    userProfile: 'Small business owner',
    userProfileFr: 'Propriétaire de petite entreprise',
    primarySphere: 'government',
    connectedSpheres: ['business'],
    requiredData: [
      { dataId: 'gst-number', dataName: 'GST/HST Number', dataNameFr: 'Numéro de TPS/TVH', sourceSphere: 'government', isRequired: true, purpose: 'Compliance', purposeFr: 'Conformité' },
      { dataId: 'sales-data', dataName: 'Sales Data', dataNameFr: 'Données de ventes', sourceSphere: 'business', isRequired: true, purpose: 'Tax collected', purposeFr: 'Taxe perçue' },
      { dataId: 'purchase-data', dataName: 'Purchase Data', dataNameFr: 'Données d\'achats', sourceSphere: 'business', isRequired: true, purpose: 'ITCs', purposeFr: 'CTI' }
    ],
    actions: [
      { actionId: 'register-gst', actionName: 'Register for GST/HST', actionNameFr: 'S\'inscrire à la TPS/TVH', sphere: 'government' },
      { actionId: 'track-collected', actionName: 'Track Tax Collected', actionNameFr: 'Suivre la taxe perçue', sphere: 'business' },
      { actionId: 'track-itc', actionName: 'Track Input Tax Credits', actionNameFr: 'Suivre les CTI', sphere: 'business' },
      { actionId: 'file-return', actionName: 'File GST/HST Return', actionNameFr: 'Produire la déclaration', sphere: 'government' },
      { actionId: 'remit-payment', actionName: 'Remit Payment', actionNameFr: 'Remettre le paiement', sphere: 'government' }
    ],
    sphereFlows: [
      { flowId: 'flow-sales-to-gst', flowName: 'Sales to GST Return', flowNameFr: 'Ventes vers Déclaration TPS', fromSphere: 'business', toSphere: 'government', dataTransferred: ['total-sales', 'tax-collected', 'itc-claimed'], trigger: 'Filing period end', automation: 'suggested' },
      { flowId: 'flow-gst-remittance', flowName: 'GST to Remittance', flowNameFr: 'TPS vers Versement', fromSphere: 'government', toSphere: 'business', dataTransferred: ['net-tax-owing', 'due-date'], trigger: 'Return filed', automation: 'automatic' }
    ],
    category: 'financial',
    tags: ['gst', 'hst', 'sales-tax', 'filing', 'compliance']
  },

  {
    id: 'scenario-044',
    title: 'Trademark Registration',
    titleFr: 'Enregistrement de marque de commerce',
    description: 'Business registers trademark for brand protection',
    descriptionFr: 'Entreprise enregistre une marque de commerce pour protéger sa marque',
    userProfile: 'Business owner',
    userProfileFr: 'Propriétaire d\'entreprise',
    primarySphere: 'government',
    connectedSpheres: ['business', 'design_studio'],
    requiredData: [
      { dataId: 'trademark', dataName: 'Trademark Details', dataNameFr: 'Détails de la marque', sourceSphere: 'design_studio', isRequired: true, purpose: 'Registration', purposeFr: 'Enregistrement' },
      { dataId: 'goods-services', dataName: 'Goods/Services Classification', dataNameFr: 'Classification biens/services', sourceSphere: 'business', isRequired: true, purpose: 'Scope', purposeFr: 'Portée' },
      { dataId: 'search-results', dataName: 'Trademark Search Results', dataNameFr: 'Résultats de recherche', sourceSphere: 'government', isRequired: true, purpose: 'Clearance', purposeFr: 'Vérification' }
    ],
    actions: [
      { actionId: 'conduct-search', actionName: 'Conduct Trademark Search', actionNameFr: 'Effectuer une recherche', sphere: 'government' },
      { actionId: 'prepare-application', actionName: 'Prepare Application', actionNameFr: 'Préparer la demande', sphere: 'government' },
      { actionId: 'file-application', actionName: 'File Application', actionNameFr: 'Déposer la demande', sphere: 'government' },
      { actionId: 'respond-objections', actionName: 'Respond to Objections', actionNameFr: 'Répondre aux objections', sphere: 'government' },
      { actionId: 'maintain-registration', actionName: 'Maintain Registration', actionNameFr: 'Maintenir l\'enregistrement', sphere: 'government' }
    ],
    sphereFlows: [
      { flowId: 'flow-brand-to-tm', flowName: 'Brand Assets to TM Application', flowNameFr: 'Actifs marque vers Demande MC', fromSphere: 'design_studio', toSphere: 'government', dataTransferred: ['logo', 'wordmark', 'description'], trigger: 'Application started', automation: 'manual' },
      { flowId: 'flow-tm-to-business', flowName: 'TM Registration to Business Records', flowNameFr: 'Enregistrement MC vers Dossiers', fromSphere: 'government', toSphere: 'business', dataTransferred: ['registration-number', 'renewal-date'], trigger: 'TM registered', automation: 'automatic' }
    ],
    category: 'legal',
    tags: ['trademark', 'intellectual-property', 'brand', 'registration', 'protection']
  },

  {
    id: 'scenario-045',
    title: 'Workplace Safety Compliance',
    titleFr: 'Conformité santé et sécurité au travail',
    description: 'Employer maintains workplace safety compliance with training, inspections, reporting',
    descriptionFr: 'Employeur maintient la conformité SST avec formation, inspections, rapports',
    userProfile: 'Employer/Safety officer',
    userProfileFr: 'Employeur/Agent de sécurité',
    primarySphere: 'government',
    connectedSpheres: ['business', 'community'],
    requiredData: [
      { dataId: 'safety-program', dataName: 'Safety Program', dataNameFr: 'Programme de sécurité', sourceSphere: 'government', isRequired: true, purpose: 'Compliance', purposeFr: 'Conformité' },
      { dataId: 'training-records', dataName: 'Training Records', dataNameFr: 'Dossiers de formation', sourceSphere: 'community', isRequired: true, purpose: 'Compliance', purposeFr: 'Conformité' },
      { dataId: 'incident-reports', dataName: 'Incident Reports', dataNameFr: 'Rapports d\'incidents', sourceSphere: 'government', isRequired: true, purpose: 'Reporting', purposeFr: 'Déclaration' }
    ],
    actions: [
      { actionId: 'conduct-training', actionName: 'Conduct Safety Training', actionNameFr: 'Donner la formation SST', sphere: 'community' },
      { actionId: 'perform-inspection', actionName: 'Perform Workplace Inspection', actionNameFr: 'Effectuer une inspection', sphere: 'government' },
      { actionId: 'report-incident', actionName: 'Report Workplace Incident', actionNameFr: 'Signaler un incident', sphere: 'government' },
      { actionId: 'update-program', actionName: 'Update Safety Program', actionNameFr: 'Mettre à jour le programme', sphere: 'government' },
      { actionId: 'maintain-records', actionName: 'Maintain Records', actionNameFr: 'Maintenir les dossiers', sphere: 'business' }
    ],
    sphereFlows: [
      { flowId: 'flow-training-compliance', flowName: 'Training to Compliance Record', flowNameFr: 'Formation vers Dossier conformité', fromSphere: 'community', toSphere: 'government', dataTransferred: ['employee', 'training-type', 'date', 'certificate'], trigger: 'Training completed', automation: 'automatic' },
      { flowId: 'flow-incident-report', flowName: 'Incident to Report', flowNameFr: 'Incident vers Rapport', fromSphere: 'business', toSphere: 'government', dataTransferred: ['incident-details', 'injuries', 'corrective-actions'], trigger: 'Incident occurred', automation: 'suggested' }
    ],
    category: 'legal',
    tags: ['safety', 'osha', 'cnesst', 'compliance', 'training', 'incidents']
  },

  {
    id: 'scenario-046',
    title: 'Environmental Permit Application',
    titleFr: 'Demande de permis environnemental',
    description: 'Business applies for environmental permits for operations',
    descriptionFr: 'Entreprise demande des permis environnementaux pour ses opérations',
    userProfile: 'Business with environmental impact',
    userProfileFr: 'Entreprise avec impact environnemental',
    primarySphere: 'government',
    connectedSpheres: ['business'],
    requiredData: [
      { dataId: 'operations-info', dataName: 'Operations Information', dataNameFr: 'Information sur les opérations', sourceSphere: 'business', isRequired: true, purpose: 'Application', purposeFr: 'Demande' },
      { dataId: 'environmental-impact', dataName: 'Environmental Impact Assessment', dataNameFr: 'Évaluation d\'impact environnemental', sourceSphere: 'government', isRequired: true, purpose: 'Permit', purposeFr: 'Permis' },
      { dataId: 'monitoring-plan', dataName: 'Monitoring Plan', dataNameFr: 'Plan de surveillance', sourceSphere: 'government', isRequired: true, purpose: 'Compliance', purposeFr: 'Conformité' }
    ],
    actions: [
      { actionId: 'assess-requirements', actionName: 'Assess Permit Requirements', actionNameFr: 'Évaluer les exigences', sphere: 'government' },
      { actionId: 'prepare-assessment', actionName: 'Prepare Environmental Assessment', actionNameFr: 'Préparer l\'évaluation', sphere: 'government' },
      { actionId: 'submit-application', actionName: 'Submit Permit Application', actionNameFr: 'Soumettre la demande', sphere: 'government' },
      { actionId: 'implement-monitoring', actionName: 'Implement Monitoring', actionNameFr: 'Mettre en œuvre la surveillance', sphere: 'business' },
      { actionId: 'submit-reports', actionName: 'Submit Compliance Reports', actionNameFr: 'Soumettre les rapports', sphere: 'government' }
    ],
    sphereFlows: [
      { flowId: 'flow-ops-to-permit', flowName: 'Operations to Permit Application', flowNameFr: 'Opérations vers Demande de permis', fromSphere: 'business', toSphere: 'government', dataTransferred: ['processes', 'emissions', 'waste'], trigger: 'Permit needed', automation: 'manual' },
      { flowId: 'flow-monitoring-report', flowName: 'Monitoring to Report', flowNameFr: 'Surveillance vers Rapport', fromSphere: 'business', toSphere: 'government', dataTransferred: ['measurements', 'period', 'compliance-status'], trigger: 'Reporting period', automation: 'suggested' }
    ],
    category: 'legal',
    tags: ['environmental', 'permits', 'compliance', 'monitoring', 'assessment']
  },

  {
    id: 'scenario-047',
    title: 'Healthcare Regulatory Compliance',
    titleFr: 'Conformité réglementaire en santé',
    description: 'Healthcare provider maintains regulatory compliance with patient privacy, billing, licensing',
    descriptionFr: 'Prestataire de soins maintient la conformité réglementaire avec vie privée, facturation, licences',
    userProfile: 'Healthcare provider',
    userProfileFr: 'Prestataire de soins de santé',
    primarySphere: 'government',
    connectedSpheres: ['business', 'community'],
    requiredData: [
      { dataId: 'privacy-policies', dataName: 'Privacy Policies', dataNameFr: 'Politiques de confidentialité', sourceSphere: 'government', isRequired: true, purpose: 'HIPAA/PIPEDA compliance', purposeFr: 'Conformité HIPAA/PIPEDA' },
      { dataId: 'licenses', dataName: 'Healthcare Licenses', dataNameFr: 'Licences de santé', sourceSphere: 'government', isRequired: true, purpose: 'Legal operation', purposeFr: 'Opération légale' },
      { dataId: 'billing-compliance', dataName: 'Billing Compliance', dataNameFr: 'Conformité de facturation', sourceSphere: 'business', isRequired: true, purpose: 'Fraud prevention', purposeFr: 'Prévention de la fraude' }
    ],
    actions: [
      { actionId: 'maintain-privacy', actionName: 'Maintain Privacy Compliance', actionNameFr: 'Maintenir la conformité vie privée', sphere: 'government' },
      { actionId: 'conduct-audit', actionName: 'Conduct Compliance Audit', actionNameFr: 'Effectuer un audit', sphere: 'government' },
      { actionId: 'train-staff', actionName: 'Train Staff on Compliance', actionNameFr: 'Former le personnel', sphere: 'community' },
      { actionId: 'report-breach', actionName: 'Report Privacy Breach', actionNameFr: 'Signaler une violation', sphere: 'government' },
      { actionId: 'renew-accreditation', actionName: 'Renew Accreditation', actionNameFr: 'Renouveler l\'accréditation', sphere: 'government' }
    ],
    sphereFlows: [
      { flowId: 'flow-training-compliance', flowName: 'Training to Compliance Record', flowNameFr: 'Formation vers Dossier conformité', fromSphere: 'community', toSphere: 'government', dataTransferred: ['staff-member', 'training-topic', 'completion-date'], trigger: 'Training completed', automation: 'automatic' },
      { flowId: 'flow-audit-findings', flowName: 'Audit to Corrective Actions', flowNameFr: 'Audit vers Actions correctives', fromSphere: 'government', toSphere: 'business', dataTransferred: ['findings', 'recommendations', 'deadlines'], trigger: 'Audit completed', automation: 'suggested' }
    ],
    category: 'legal',
    tags: ['healthcare', 'privacy', 'hipaa', 'compliance', 'accreditation']
  },

  {
    id: 'scenario-048',
    title: 'Food Service License & Inspection',
    titleFr: 'Licence et inspection de service alimentaire',
    description: 'Restaurant maintains food service license with inspections, training, records',
    descriptionFr: 'Restaurant maintient sa licence alimentaire avec inspections, formation, dossiers',
    userProfile: 'Restaurant owner',
    userProfileFr: 'Propriétaire de restaurant',
    primarySphere: 'government',
    connectedSpheres: ['business', 'community'],
    requiredData: [
      { dataId: 'food-license', dataName: 'Food Service License', dataNameFr: 'Licence de service alimentaire', sourceSphere: 'government', isRequired: true, purpose: 'Legal operation', purposeFr: 'Opération légale' },
      { dataId: 'inspection-history', dataName: 'Inspection History', dataNameFr: 'Historique d\'inspections', sourceSphere: 'government', isRequired: true, purpose: 'Compliance', purposeFr: 'Conformité' },
      { dataId: 'food-safety-training', dataName: 'Food Safety Training', dataNameFr: 'Formation salubrité', sourceSphere: 'community', isRequired: true, purpose: 'Requirement', purposeFr: 'Exigence' }
    ],
    actions: [
      { actionId: 'renew-license', actionName: 'Renew Food License', actionNameFr: 'Renouveler la licence', sphere: 'government' },
      { actionId: 'prepare-inspection', actionName: 'Prepare for Inspection', actionNameFr: 'Préparer l\'inspection', sphere: 'business' },
      { actionId: 'train-staff', actionName: 'Train Staff on Food Safety', actionNameFr: 'Former le personnel', sphere: 'community' },
      { actionId: 'maintain-logs', actionName: 'Maintain Temperature Logs', actionNameFr: 'Maintenir les registres de température', sphere: 'business' },
      { actionId: 'address-violations', actionName: 'Address Violations', actionNameFr: 'Corriger les violations', sphere: 'government' }
    ],
    sphereFlows: [
      { flowId: 'flow-training-record', flowName: 'Training to Staff Record', flowNameFr: 'Formation vers Dossier employé', fromSphere: 'community', toSphere: 'government', dataTransferred: ['employee', 'certification', 'expiry'], trigger: 'Certification obtained', automation: 'automatic' },
      { flowId: 'flow-inspection-calendar', flowName: 'Inspection to Calendar', flowNameFr: 'Inspection vers Calendrier', fromSphere: 'government', toSphere: 'personal', dataTransferred: ['inspection-date', 'inspector', 'requirements'], trigger: 'Inspection scheduled', automation: 'automatic' }
    ],
    category: 'legal',
    tags: ['food-service', 'restaurant', 'inspection', 'license', 'food-safety']
  },

  {
    id: 'scenario-049',
    title: 'Accessibility Compliance',
    titleFr: 'Conformité en accessibilité',
    description: 'Organization ensures accessibility compliance for physical and digital spaces',
    descriptionFr: 'Organisation assure la conformité en accessibilité pour espaces physiques et numériques',
    userProfile: 'Compliance officer',
    userProfileFr: 'Agent de conformité',
    primarySphere: 'government',
    connectedSpheres: ['business', 'design_studio'],
    requiredData: [
      { dataId: 'accessibility-standards', dataName: 'Accessibility Standards', dataNameFr: 'Normes d\'accessibilité', sourceSphere: 'government', isRequired: true, purpose: 'Requirements', purposeFr: 'Exigences' },
      { dataId: 'facility-info', dataName: 'Facility Information', dataNameFr: 'Information sur les installations', sourceSphere: 'business', isRequired: true, purpose: 'Assessment', purposeFr: 'Évaluation' },
      { dataId: 'digital-assets', dataName: 'Digital Assets', dataNameFr: 'Actifs numériques', sourceSphere: 'design_studio', isRequired: true, purpose: 'WCAG compliance', purposeFr: 'Conformité WCAG' }
    ],
    actions: [
      { actionId: 'assess-physical', actionName: 'Assess Physical Accessibility', actionNameFr: 'Évaluer l\'accessibilité physique', sphere: 'business' },
      { actionId: 'audit-digital', actionName: 'Audit Digital Accessibility', actionNameFr: 'Auditer l\'accessibilité numérique', sphere: 'design_studio' },
      { actionId: 'create-plan', actionName: 'Create Accessibility Plan', actionNameFr: 'Créer un plan d\'accessibilité', sphere: 'government' },
      { actionId: 'implement-changes', actionName: 'Implement Changes', actionNameFr: 'Mettre en œuvre les changements', sphere: 'business' },
      { actionId: 'report-progress', actionName: 'Report Progress', actionNameFr: 'Rapporter les progrès', sphere: 'government' }
    ],
    sphereFlows: [
      { flowId: 'flow-audit-plan', flowName: 'Audit to Accessibility Plan', flowNameFr: 'Audit vers Plan d\'accessibilité', fromSphere: 'business', toSphere: 'government', dataTransferred: ['barriers-identified', 'remediation-needed', 'timeline'], trigger: 'Audit completed', automation: 'suggested' },
      { flowId: 'flow-digital-compliance', flowName: 'Digital Assets to Compliance Check', flowNameFr: 'Actifs numériques vers Vérification', fromSphere: 'design_studio', toSphere: 'government', dataTransferred: ['wcag-score', 'issues', 'remediation'], trigger: 'Asset published', automation: 'automatic' }
    ],
    category: 'legal',
    tags: ['accessibility', 'ada', 'aoda', 'wcag', 'compliance', 'inclusion']
  },

  {
    id: 'scenario-050',
    title: 'Data Privacy Compliance (GDPR/PIPEDA)',
    titleFr: 'Conformité protection des données (RGPD/PIPEDA)',
    description: 'Organization maintains data privacy compliance with policies, consent, breach response',
    descriptionFr: 'Organisation maintient la conformité en protection des données avec politiques, consentement, réponse aux violations',
    userProfile: 'Privacy officer / DPO',
    userProfileFr: 'Agent de protection des données / DPO',
    primarySphere: 'government',
    connectedSpheres: ['business', 'my_team'],
    requiredData: [
      { dataId: 'privacy-policies', dataName: 'Privacy Policies', dataNameFr: 'Politiques de confidentialité', sourceSphere: 'government', isRequired: true, purpose: 'Compliance', purposeFr: 'Conformité' },
      { dataId: 'data-inventory', dataName: 'Personal Data Inventory', dataNameFr: 'Inventaire des données personnelles', sourceSphere: 'business', isRequired: true, purpose: 'Mapping', purposeFr: 'Cartographie' },
      { dataId: 'consent-records', dataName: 'Consent Records', dataNameFr: 'Registres de consentement', sourceSphere: 'business', isRequired: true, purpose: 'Lawful basis', purposeFr: 'Base légale' }
    ],
    actions: [
      { actionId: 'map-data', actionName: 'Map Personal Data', actionNameFr: 'Cartographier les données', sphere: 'business' },
      { actionId: 'manage-consent', actionName: 'Manage Consent', actionNameFr: 'Gérer le consentement', sphere: 'business' },
      { actionId: 'handle-request', actionName: 'Handle Data Subject Request', actionNameFr: 'Traiter une demande', sphere: 'government' },
      { actionId: 'report-breach', actionName: 'Report Data Breach', actionNameFr: 'Signaler une violation', sphere: 'government' },
      { actionId: 'conduct-dpia', actionName: 'Conduct DPIA', actionNameFr: 'Effectuer une AIPD', sphere: 'government' }
    ],
    sphereFlows: [
      { flowId: 'flow-data-inventory', flowName: 'Systems to Data Map', flowNameFr: 'Systèmes vers Cartographie', fromSphere: 'business', toSphere: 'government', dataTransferred: ['data-categories', 'processing-purposes', 'retention-periods'], trigger: 'Inventory update', automation: 'suggested' },
      { flowId: 'flow-breach-response', flowName: 'Breach to Response', flowNameFr: 'Violation vers Réponse', fromSphere: 'business', toSphere: 'government', dataTransferred: ['breach-details', 'affected-data', 'notification-required'], trigger: 'Breach detected', automation: 'automatic' }
    ],
    category: 'legal',
    tags: ['privacy', 'gdpr', 'pipeda', 'data-protection', 'compliance', 'dpo']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SCÉNARIOS 51-60: ENTERTAINMENT & SOCIAL
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'scenario-051',
    title: 'Planning a Destination Wedding',
    titleFr: 'Planifier un mariage à destination',
    description: 'Couple plans destination wedding with travel, logistics, vendors abroad',
    descriptionFr: 'Couple planifie un mariage à destination avec voyage, logistique, fournisseurs à l\'étranger',
    userProfile: 'Couple planning destination wedding',
    userProfileFr: 'Couple planifiant un mariage à destination',
    primarySphere: 'entertainment',
    connectedSpheres: ['personal', 'business', 'community', 'government'],
    requiredData: [
      { dataId: 'guest-list', dataName: 'Guest List with Travel', dataNameFr: 'Liste d\'invités avec voyage', sourceSphere: 'community', isRequired: true, purpose: 'Coordination', purposeFr: 'Coordination' },
      { dataId: 'vendor-contracts', dataName: 'International Vendor Contracts', dataNameFr: 'Contrats fournisseurs internationaux', sourceSphere: 'business', isRequired: true, purpose: 'Services', purposeFr: 'Services' },
      { dataId: 'legal-requirements', dataName: 'Marriage Legal Requirements', dataNameFr: 'Exigences légales mariage', sourceSphere: 'government', isRequired: true, purpose: 'Legal marriage', purposeFr: 'Mariage légal' }
    ],
    actions: [
      { actionId: 'choose-destination', actionName: 'Choose Destination', actionNameFr: 'Choisir la destination', sphere: 'entertainment' },
      { actionId: 'research-legal', actionName: 'Research Legal Requirements', actionNameFr: 'Rechercher les exigences légales', sphere: 'government' },
      { actionId: 'book-travel', actionName: 'Book Travel Arrangements', actionNameFr: 'Réserver les arrangements de voyage', sphere: 'entertainment' },
      { actionId: 'coordinate-guests', actionName: 'Coordinate Guest Travel', actionNameFr: 'Coordonner le voyage des invités', sphere: 'community' },
      { actionId: 'manage-budget', actionName: 'Manage Wedding Budget', actionNameFr: 'Gérer le budget', sphere: 'business' }
    ],
    sphereFlows: [
      { flowId: 'flow-guest-travel', flowName: 'Guest List to Travel Coordination', flowNameFr: 'Liste invités vers Coordination voyage', fromSphere: 'community', toSphere: 'entertainment', dataTransferred: ['guest-names', 'travel-needs', 'accommodation'], trigger: 'Guest confirmed', automation: 'suggested' },
      { flowId: 'flow-vendor-payment', flowName: 'Vendor to Payment', flowNameFr: 'Fournisseur vers Paiement', fromSphere: 'entertainment', toSphere: 'business', dataTransferred: ['vendor', 'amount', 'currency', 'due-date'], trigger: 'Contract signed', automation: 'automatic' }
    ],
    category: 'event',
    tags: ['wedding', 'destination', 'travel', 'international', 'planning']
  },

  {
    id: 'scenario-052',
    title: 'Organizing a Conference',
    titleFr: 'Organiser une conférence',
    description: 'Event planner organizes professional conference with speakers, sponsors, attendees',
    descriptionFr: 'Organisateur d\'événements organise une conférence professionnelle avec conférenciers, commanditaires, participants',
    userProfile: 'Conference organizer',
    userProfileFr: 'Organisateur de conférence',
    primarySphere: 'entertainment',
    connectedSpheres: ['business', 'community', 'social', 'design_studio'],
    requiredData: [
      { dataId: 'speakers', dataName: 'Speaker Database', dataNameFr: 'Base de données conférenciers', sourceSphere: 'community', isRequired: true, purpose: 'Programming', purposeFr: 'Programmation' },
      { dataId: 'sponsors', dataName: 'Sponsor Packages', dataNameFr: 'Forfaits commanditaires', sourceSphere: 'business', isRequired: true, purpose: 'Revenue', purposeFr: 'Revenus' },
      { dataId: 'attendees', dataName: 'Attendee Registration', dataNameFr: 'Inscriptions participants', sourceSphere: 'entertainment', isRequired: true, purpose: 'Capacity', purposeFr: 'Capacité' }
    ],
    actions: [
      { actionId: 'secure-venue', actionName: 'Secure Venue', actionNameFr: 'Réserver le lieu', sphere: 'entertainment' },
      { actionId: 'recruit-speakers', actionName: 'Recruit Speakers', actionNameFr: 'Recruter les conférenciers', sphere: 'community' },
      { actionId: 'sell-sponsorships', actionName: 'Sell Sponsorships', actionNameFr: 'Vendre les commandites', sphere: 'business' },
      { actionId: 'create-program', actionName: 'Create Program', actionNameFr: 'Créer le programme', sphere: 'entertainment' },
      { actionId: 'promote-event', actionName: 'Promote Event', actionNameFr: 'Promouvoir l\'événement', sphere: 'social' },
      { actionId: 'design-materials', actionName: 'Design Event Materials', actionNameFr: 'Concevoir les matériaux', sphere: 'design_studio' }
    ],
    sphereFlows: [
      { flowId: 'flow-speaker-program', flowName: 'Speaker to Program', flowNameFr: 'Conférencier vers Programme', fromSphere: 'community', toSphere: 'entertainment', dataTransferred: ['speaker-bio', 'session-title', 'requirements'], trigger: 'Speaker confirmed', automation: 'automatic' },
      { flowId: 'flow-registration-revenue', flowName: 'Registration to Revenue', flowNameFr: 'Inscription vers Revenus', fromSphere: 'entertainment', toSphere: 'business', dataTransferred: ['attendee', 'ticket-type', 'amount'], trigger: 'Registration complete', automation: 'automatic' }
    ],
    category: 'event',
    tags: ['conference', 'event', 'speakers', 'sponsors', 'programming']
  },

  {
    id: 'scenario-053',
    title: 'Streaming Content Creator',
    titleFr: 'Créateur de contenu en streaming',
    description: 'Streamer manages live content, subscribers, donations, merchandise',
    descriptionFr: 'Streameur gère le contenu en direct, abonnés, dons, marchandise',
    userProfile: 'Live streamer',
    userProfileFr: 'Streameur en direct',
    primarySphere: 'entertainment',
    connectedSpheres: ['business', 'social', 'community', 'design_studio'],
    requiredData: [
      { dataId: 'streaming-schedule', dataName: 'Streaming Schedule', dataNameFr: 'Horaire de streaming', sourceSphere: 'entertainment', isRequired: true, purpose: 'Consistency', purposeFr: 'Constance' },
      { dataId: 'subscriber-data', dataName: 'Subscriber Data', dataNameFr: 'Données abonnés', sourceSphere: 'community', isRequired: true, purpose: 'Community', purposeFr: 'Communauté' },
      { dataId: 'revenue-streams', dataName: 'Revenue Streams', dataNameFr: 'Sources de revenus', sourceSphere: 'business', isRequired: true, purpose: 'Income', purposeFr: 'Revenus' }
    ],
    actions: [
      { actionId: 'schedule-stream', actionName: 'Schedule Stream', actionNameFr: 'Planifier un stream', sphere: 'entertainment' },
      { actionId: 'go-live', actionName: 'Go Live', actionNameFr: 'Passer en direct', sphere: 'entertainment' },
      { actionId: 'engage-chat', actionName: 'Engage with Chat', actionNameFr: 'Interagir avec le chat', sphere: 'community' },
      { actionId: 'track-donations', actionName: 'Track Donations', actionNameFr: 'Suivre les dons', sphere: 'business' },
      { actionId: 'promote-stream', actionName: 'Promote Stream', actionNameFr: 'Promouvoir le stream', sphere: 'social' },
      { actionId: 'create-overlays', actionName: 'Create Stream Overlays', actionNameFr: 'Créer les overlays', sphere: 'design_studio' }
    ],
    sphereFlows: [
      { flowId: 'flow-stream-announce', flowName: 'Schedule to Social Announcement', flowNameFr: 'Horaire vers Annonce sociale', fromSphere: 'entertainment', toSphere: 'social', dataTransferred: ['stream-title', 'time', 'game'], trigger: 'Stream scheduled', automation: 'suggested' },
      { flowId: 'flow-donations-income', flowName: 'Donations to Income', flowNameFr: 'Dons vers Revenus', fromSphere: 'community', toSphere: 'business', dataTransferred: ['donor', 'amount', 'platform'], trigger: 'Donation received', automation: 'automatic' }
    ],
    category: 'creative',
    tags: ['streaming', 'twitch', 'youtube', 'live', 'subscribers', 'donations']
  },

  {
    id: 'scenario-054',
    title: 'Theater Production Manager',
    titleFr: 'Directeur de production théâtrale',
    description: 'Manages theater production with cast, crew, rehearsals, performances',
    descriptionFr: 'Gère une production théâtrale avec distribution, équipe, répétitions, représentations',
    userProfile: 'Theater production manager',
    userProfileFr: 'Directeur de production théâtrale',
    primarySphere: 'entertainment',
    connectedSpheres: ['community', 'business', 'design_studio', 'social'],
    requiredData: [
      { dataId: 'cast-crew', dataName: 'Cast & Crew', dataNameFr: 'Distribution & Équipe', sourceSphere: 'community', isRequired: true, purpose: 'Production', purposeFr: 'Production' },
      { dataId: 'rehearsal-schedule', dataName: 'Rehearsal Schedule', dataNameFr: 'Horaire des répétitions', sourceSphere: 'entertainment', isRequired: true, purpose: 'Preparation', purposeFr: 'Préparation' },
      { dataId: 'production-budget', dataName: 'Production Budget', dataNameFr: 'Budget de production', sourceSphere: 'business', isRequired: true, purpose: 'Finances', purposeFr: 'Finances' }
    ],
    actions: [
      { actionId: 'cast-show', actionName: 'Cast the Show', actionNameFr: 'Distribuer les rôles', sphere: 'community' },
      { actionId: 'schedule-rehearsals', actionName: 'Schedule Rehearsals', actionNameFr: 'Planifier les répétitions', sphere: 'entertainment' },
      { actionId: 'manage-budget', actionName: 'Manage Production Budget', actionNameFr: 'Gérer le budget', sphere: 'business' },
      { actionId: 'coordinate-tech', actionName: 'Coordinate Technical Elements', actionNameFr: 'Coordonner les éléments techniques', sphere: 'design_studio' },
      { actionId: 'promote-show', actionName: 'Promote the Show', actionNameFr: 'Promouvoir le spectacle', sphere: 'social' },
      { actionId: 'sell-tickets', actionName: 'Sell Tickets', actionNameFr: 'Vendre les billets', sphere: 'business' }
    ],
    sphereFlows: [
      { flowId: 'flow-rehearsal-notify', flowName: 'Rehearsal to Cast Notification', flowNameFr: 'Répétition vers Notification distribution', fromSphere: 'entertainment', toSphere: 'community', dataTransferred: ['date', 'time', 'scenes', 'who-called'], trigger: 'Rehearsal scheduled', automation: 'automatic' },
      { flowId: 'flow-ticket-revenue', flowName: 'Ticket Sales to Revenue', flowNameFr: 'Ventes billets vers Revenus', fromSphere: 'business', toSphere: 'business', dataTransferred: ['performance', 'seats-sold', 'revenue'], trigger: 'Sale completed', automation: 'automatic' }
    ],
    category: 'creative',
    tags: ['theater', 'production', 'cast', 'rehearsals', 'performances']
  },

  {
    id: 'scenario-055',
    title: 'Music Festival Coordinator',
    titleFr: 'Coordonnateur de festival de musique',
    description: 'Coordinates music festival with artists, stages, vendors, logistics',
    descriptionFr: 'Coordonne un festival de musique avec artistes, scènes, vendeurs, logistique',
    userProfile: 'Festival coordinator',
    userProfileFr: 'Coordonnateur de festival',
    primarySphere: 'entertainment',
    connectedSpheres: ['business', 'community', 'government', 'social'],
    requiredData: [
      { dataId: 'artist-lineup', dataName: 'Artist Lineup', dataNameFr: 'Programmation artistique', sourceSphere: 'community', isRequired: true, purpose: 'Programming', purposeFr: 'Programmation' },
      { dataId: 'permits', dataName: 'Event Permits', dataNameFr: 'Permis d\'événement', sourceSphere: 'government', isRequired: true, purpose: 'Legal operation', purposeFr: 'Opération légale' },
      { dataId: 'vendors', dataName: 'Vendor Agreements', dataNameFr: 'Ententes avec vendeurs', sourceSphere: 'business', isRequired: true, purpose: 'Services', purposeFr: 'Services' }
    ],
    actions: [
      { actionId: 'book-artists', actionName: 'Book Artists', actionNameFr: 'Réserver les artistes', sphere: 'community' },
      { actionId: 'obtain-permits', actionName: 'Obtain Permits', actionNameFr: 'Obtenir les permis', sphere: 'government' },
      { actionId: 'coordinate-vendors', actionName: 'Coordinate Vendors', actionNameFr: 'Coordonner les vendeurs', sphere: 'business' },
      { actionId: 'plan-stages', actionName: 'Plan Stage Schedule', actionNameFr: 'Planifier les scènes', sphere: 'entertainment' },
      { actionId: 'market-festival', actionName: 'Market Festival', actionNameFr: 'Marketer le festival', sphere: 'social' },
      { actionId: 'manage-security', actionName: 'Manage Security', actionNameFr: 'Gérer la sécurité', sphere: 'government' }
    ],
    sphereFlows: [
      { flowId: 'flow-artist-schedule', flowName: 'Artist to Stage Schedule', flowNameFr: 'Artiste vers Horaire scène', fromSphere: 'community', toSphere: 'entertainment', dataTransferred: ['artist', 'stage', 'time-slot', 'tech-requirements'], trigger: 'Artist confirmed', automation: 'automatic' },
      { flowId: 'flow-permit-compliance', flowName: 'Permit to Compliance Checklist', flowNameFr: 'Permis vers Liste conformité', fromSphere: 'government', toSphere: 'business', dataTransferred: ['permit-conditions', 'requirements', 'inspections'], trigger: 'Permit issued', automation: 'automatic' }
    ],
    category: 'event',
    tags: ['festival', 'music', 'artists', 'permits', 'vendors', 'logistics']
  },

  {
    id: 'scenario-056',
    title: 'Film Festival Programmer',
    titleFr: 'Programmateur de festival de films',
    description: 'Curates film festival with submissions, selections, screenings, Q&As',
    descriptionFr: 'Programme un festival de films avec soumissions, sélections, projections, Q&R',
    userProfile: 'Film festival programmer',
    userProfileFr: 'Programmateur de festival de films',
    primarySphere: 'entertainment',
    connectedSpheres: ['design_studio', 'community', 'business', 'social'],
    requiredData: [
      { dataId: 'submissions', dataName: 'Film Submissions', dataNameFr: 'Soumissions de films', sourceSphere: 'design_studio', isRequired: true, purpose: 'Selection', purposeFr: 'Sélection' },
      { dataId: 'venues', dataName: 'Screening Venues', dataNameFr: 'Lieux de projection', sourceSphere: 'entertainment', isRequired: true, purpose: 'Screenings', purposeFr: 'Projections' },
      { dataId: 'filmmakers', dataName: 'Filmmaker Database', dataNameFr: 'Base de données cinéastes', sourceSphere: 'community', isRequired: true, purpose: 'Q&As', purposeFr: 'Q&R' }
    ],
    actions: [
      { actionId: 'review-submissions', actionName: 'Review Submissions', actionNameFr: 'Examiner les soumissions', sphere: 'design_studio' },
      { actionId: 'select-films', actionName: 'Select Films', actionNameFr: 'Sélectionner les films', sphere: 'entertainment' },
      { actionId: 'schedule-screenings', actionName: 'Schedule Screenings', actionNameFr: 'Planifier les projections', sphere: 'entertainment' },
      { actionId: 'invite-filmmakers', actionName: 'Invite Filmmakers', actionNameFr: 'Inviter les cinéastes', sphere: 'community' },
      { actionId: 'sell-passes', actionName: 'Sell Festival Passes', actionNameFr: 'Vendre les passes', sphere: 'business' },
      { actionId: 'promote-program', actionName: 'Promote Program', actionNameFr: 'Promouvoir le programme', sphere: 'social' }
    ],
    sphereFlows: [
      { flowId: 'flow-selection-notify', flowName: 'Selection to Filmmaker Notification', flowNameFr: 'Sélection vers Notification cinéaste', fromSphere: 'entertainment', toSphere: 'community', dataTransferred: ['film-title', 'selection-status', 'screening-info'], trigger: 'Selection made', automation: 'automatic' },
      { flowId: 'flow-schedule-social', flowName: 'Schedule to Social Media', flowNameFr: 'Horaire vers Réseaux sociaux', fromSphere: 'entertainment', toSphere: 'social', dataTransferred: ['film', 'date', 'venue', 'synopsis'], trigger: 'Schedule finalized', automation: 'suggested' }
    ],
    category: 'event',
    tags: ['film-festival', 'cinema', 'programming', 'screenings', 'filmmakers']
  },

  {
    id: 'scenario-057',
    title: 'Escape Room Business Owner',
    titleFr: 'Propriétaire d\'entreprise de jeux d\'évasion',
    description: 'Runs escape room business with bookings, games, staff, maintenance',
    descriptionFr: 'Gère une entreprise de jeux d\'évasion avec réservations, jeux, personnel, entretien',
    userProfile: 'Escape room owner',
    userProfileFr: 'Propriétaire de jeux d\'évasion',
    primarySphere: 'entertainment',
    connectedSpheres: ['business', 'community', 'social', 'design_studio'],
    requiredData: [
      { dataId: 'rooms', dataName: 'Room Inventory', dataNameFr: 'Inventaire des salles', sourceSphere: 'entertainment', isRequired: true, purpose: 'Operations', purposeFr: 'Opérations' },
      { dataId: 'bookings', dataName: 'Booking System', dataNameFr: 'Système de réservation', sourceSphere: 'business', isRequired: true, purpose: 'Revenue', purposeFr: 'Revenus' },
      { dataId: 'staff-schedule', dataName: 'Staff Schedule', dataNameFr: 'Horaire du personnel', sourceSphere: 'community', isRequired: true, purpose: 'Operations', purposeFr: 'Opérations' }
    ],
    actions: [
      { actionId: 'manage-bookings', actionName: 'Manage Bookings', actionNameFr: 'Gérer les réservations', sphere: 'business' },
      { actionId: 'schedule-staff', actionName: 'Schedule Game Masters', actionNameFr: 'Planifier les maîtres de jeu', sphere: 'community' },
      { actionId: 'maintain-rooms', actionName: 'Maintain Rooms', actionNameFr: 'Entretenir les salles', sphere: 'entertainment' },
      { actionId: 'design-new-room', actionName: 'Design New Room', actionNameFr: 'Concevoir une nouvelle salle', sphere: 'design_studio' },
      { actionId: 'collect-reviews', actionName: 'Collect Reviews', actionNameFr: 'Collecter les avis', sphere: 'social' }
    ],
    sphereFlows: [
      { flowId: 'flow-booking-staff', flowName: 'Booking to Staff Assignment', flowNameFr: 'Réservation vers Assignation personnel', fromSphere: 'business', toSphere: 'community', dataTransferred: ['room', 'time', 'group-size'], trigger: 'Booking confirmed', automation: 'automatic' },
      { flowId: 'flow-review-social', flowName: 'Review to Social Proof', flowNameFr: 'Avis vers Preuve sociale', fromSphere: 'social', toSphere: 'social', dataTransferred: ['review-text', 'rating', 'room'], trigger: 'Review received', automation: 'suggested' }
    ],
    category: 'professional',
    tags: ['escape-room', 'entertainment', 'bookings', 'games', 'operations']
  },

  {
    id: 'scenario-058',
    title: 'Travel Blogger',
    titleFr: 'Blogueur de voyage',
    description: 'Travel blogger manages trips, content, partnerships, audience',
    descriptionFr: 'Blogueur de voyage gère les voyages, contenu, partenariats, audience',
    userProfile: 'Travel content creator',
    userProfileFr: 'Créateur de contenu voyage',
    primarySphere: 'entertainment',
    connectedSpheres: ['design_studio', 'social', 'business', 'personal'],
    requiredData: [
      { dataId: 'trip-plans', dataName: 'Trip Plans', dataNameFr: 'Plans de voyage', sourceSphere: 'entertainment', isRequired: true, purpose: 'Content planning', purposeFr: 'Planification de contenu' },
      { dataId: 'content-library', dataName: 'Content Library', dataNameFr: 'Bibliothèque de contenu', sourceSphere: 'design_studio', isRequired: true, purpose: 'Publishing', purposeFr: 'Publication' },
      { dataId: 'brand-partnerships', dataName: 'Brand Partnerships', dataNameFr: 'Partenariats de marques', sourceSphere: 'business', isRequired: false, purpose: 'Revenue', purposeFr: 'Revenus' }
    ],
    actions: [
      { actionId: 'plan-trip', actionName: 'Plan Trip', actionNameFr: 'Planifier un voyage', sphere: 'entertainment' },
      { actionId: 'create-content', actionName: 'Create Travel Content', actionNameFr: 'Créer du contenu voyage', sphere: 'design_studio' },
      { actionId: 'publish-content', actionName: 'Publish Content', actionNameFr: 'Publier le contenu', sphere: 'social' },
      { actionId: 'negotiate-partnerships', actionName: 'Negotiate Partnerships', actionNameFr: 'Négocier des partenariats', sphere: 'business' },
      { actionId: 'track-expenses', actionName: 'Track Travel Expenses', actionNameFr: 'Suivre les dépenses', sphere: 'personal' }
    ],
    sphereFlows: [
      { flowId: 'flow-trip-content', flowName: 'Trip to Content Plan', flowNameFr: 'Voyage vers Plan de contenu', fromSphere: 'entertainment', toSphere: 'design_studio', dataTransferred: ['destination', 'activities', 'content-ideas'], trigger: 'Trip planned', automation: 'suggested' },
      { flowId: 'flow-content-social', flowName: 'Content to Social Posts', flowNameFr: 'Contenu vers Publications', fromSphere: 'design_studio', toSphere: 'social', dataTransferred: ['images', 'captions', 'hashtags'], trigger: 'Content ready', automation: 'suggested' }
    ],
    category: 'creative',
    tags: ['travel', 'blogging', 'content', 'partnerships', 'social-media']
  },

  {
    id: 'scenario-059',
    title: 'Gaming Tournament Organizer',
    titleFr: 'Organisateur de tournoi de jeux vidéo',
    description: 'Organizes esports/gaming tournaments with players, brackets, prizes',
    descriptionFr: 'Organise des tournois de jeux vidéo avec joueurs, tableaux, prix',
    userProfile: 'Tournament organizer',
    userProfileFr: 'Organisateur de tournoi',
    primarySphere: 'entertainment',
    connectedSpheres: ['community', 'business', 'social'],
    requiredData: [
      { dataId: 'participants', dataName: 'Tournament Participants', dataNameFr: 'Participants au tournoi', sourceSphere: 'community', isRequired: true, purpose: 'Brackets', purposeFr: 'Tableaux' },
      { dataId: 'prize-pool', dataName: 'Prize Pool', dataNameFr: 'Cagnotte', sourceSphere: 'business', isRequired: true, purpose: 'Incentive', purposeFr: 'Incitatif' },
      { dataId: 'brackets', dataName: 'Tournament Brackets', dataNameFr: 'Tableaux du tournoi', sourceSphere: 'entertainment', isRequired: true, purpose: 'Competition', purposeFr: 'Compétition' }
    ],
    actions: [
      { actionId: 'create-tournament', actionName: 'Create Tournament', actionNameFr: 'Créer un tournoi', sphere: 'entertainment' },
      { actionId: 'register-players', actionName: 'Register Players', actionNameFr: 'Inscrire les joueurs', sphere: 'community' },
      { actionId: 'generate-brackets', actionName: 'Generate Brackets', actionNameFr: 'Générer les tableaux', sphere: 'entertainment' },
      { actionId: 'stream-matches', actionName: 'Stream Matches', actionNameFr: 'Diffuser les matchs', sphere: 'social' },
      { actionId: 'distribute-prizes', actionName: 'Distribute Prizes', actionNameFr: 'Distribuer les prix', sphere: 'business' }
    ],
    sphereFlows: [
      { flowId: 'flow-registration-bracket', flowName: 'Registration to Bracket', flowNameFr: 'Inscription vers Tableau', fromSphere: 'community', toSphere: 'entertainment', dataTransferred: ['player-name', 'seed', 'my_team'], trigger: 'Registration closes', automation: 'automatic' },
      { flowId: 'flow-results-social', flowName: 'Results to Social', flowNameFr: 'Résultats vers Social', fromSphere: 'entertainment', toSphere: 'social', dataTransferred: ['winner', 'score', 'highlights'], trigger: 'Match completed', automation: 'automatic' }
    ],
    category: 'event',
    tags: ['esports', 'gaming', 'tournament', 'brackets', 'competition']
  },

  {
    id: 'scenario-060',
    title: 'Retreat/Workshop Facilitator',
    titleFr: 'Facilitateur de retraites/ateliers',
    description: 'Runs wellness retreats or educational workshops with participants, programs, logistics',
    descriptionFr: 'Anime des retraites de bien-être ou ateliers éducatifs avec participants, programmes, logistique',
    userProfile: 'Retreat facilitator',
    userProfileFr: 'Facilitateur de retraites',
    primarySphere: 'entertainment',
    connectedSpheres: ['business', 'community', 'personal', 'design_studio'],
    requiredData: [
      { dataId: 'participants', dataName: 'Registered Participants', dataNameFr: 'Participants inscrits', sourceSphere: 'community', isRequired: true, purpose: 'Attendance', purposeFr: 'Présence' },
      { dataId: 'program', dataName: 'Retreat Program', dataNameFr: 'Programme de retraite', sourceSphere: 'entertainment', isRequired: true, purpose: 'Schedule', purposeFr: 'Horaire' },
      { dataId: 'venue-meals', dataName: 'Venue & Meals', dataNameFr: 'Lieu & Repas', sourceSphere: 'business', isRequired: true, purpose: 'Logistics', purposeFr: 'Logistique' }
    ],
    actions: [
      { actionId: 'design-program', actionName: 'Design Retreat Program', actionNameFr: 'Concevoir le programme', sphere: 'entertainment' },
      { actionId: 'register-participants', actionName: 'Register Participants', actionNameFr: 'Inscrire les participants', sphere: 'community' },
      { actionId: 'arrange-logistics', actionName: 'Arrange Logistics', actionNameFr: 'Organiser la logistique', sphere: 'business' },
      { actionId: 'prepare-materials', actionName: 'Prepare Materials', actionNameFr: 'Préparer les matériaux', sphere: 'design_studio' },
      { actionId: 'collect-feedback', actionName: 'Collect Feedback', actionNameFr: 'Collecter les commentaires', sphere: 'community' }
    ],
    sphereFlows: [
      { flowId: 'flow-registration-logistics', flowName: 'Registration to Logistics', flowNameFr: 'Inscription vers Logistique', fromSphere: 'community', toSphere: 'business', dataTransferred: ['headcount', 'dietary-needs', 'room-assignments'], trigger: 'Registration closes', automation: 'automatic' },
      { flowId: 'flow-feedback-improvement', flowName: 'Feedback to Program Improvement', flowNameFr: 'Commentaires vers Amélioration', fromSphere: 'community', toSphere: 'entertainment', dataTransferred: ['ratings', 'suggestions', 'testimonials'], trigger: 'Retreat ends', automation: 'suggested' }
    ],
    category: 'event',
    tags: ['retreat', 'workshop', 'wellness', 'facilitation', 'education']
  }

];

// Export count
export const SCENARIOS_31_60_COUNT = SCENARIOS_31_TO_60.length;
