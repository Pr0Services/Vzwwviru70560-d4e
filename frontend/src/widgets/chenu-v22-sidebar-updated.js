/**
 * CHENU V22 - STRUCTURE SIDEBAR COMPLÈTE MISE À JOUR
 * 
 * Changements Session:
 * ✅ Gouvernement séparé en 2 sections (Personnel + Entreprise)
 * ✅ Ajout "My Assets" dans section personnelle
 * ✅ Sous-catégories détaillées pour taxes/impôts
 * ✅ Sprint 2.1: Projects Avancé (Templates, Budget, Phases)
 * ✅ Sprint 2.2: Calendar Pro (Google/Outlook sync, Ressources, Météo)
 * ✅ Sprint 2.3: Team & RH (Organigramme, CCQ, Compétences, Paie)
 * 
 * Total: 70+ modules en 11 catégories
 */

export const SIDEBAR_CATEGORIES = [
  // ═══════════════════════════════════════════════════════════════════════════════
  // 📌 ÉPINGLÉS (Favoris dynamiques)
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'pinned',
    label: { fr: 'Épinglés', en: 'Pinned', es: 'Fijados' },
    icon: '📌',
    color: '#f59e0b',
    collapsible: false,
    items: [] // Dynamique - favoris utilisateur
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // 🏠 ACCUEIL
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'home',
    label: { fr: 'Accueil', en: 'Home', es: 'Inicio' },
    icon: '🏠',
    color: '#4ade80',
    items: [
      { id: 'dashboard', icon: '📊', label: { fr: 'Tableau de bord', en: 'Dashboard', es: 'Panel' } },
      { id: 'calendar', icon: '📅', label: { fr: 'Calendrier', en: 'Calendar', es: 'Calendario' } },
      { id: 'email', icon: '📧', label: { fr: 'Courriel', en: 'Email', es: 'Correo' } },
      { id: 'notes', icon: '📝', label: { fr: 'Notes', en: 'Notes', es: 'Notas' } },
      { id: 'assistant', icon: '🤖', label: { fr: 'Nova', en: 'Nova', es: 'Nova' } },
      { id: 'my-assets', icon: '💎', label: { fr: 'Mes Actifs', en: 'My Assets', es: 'Mis Activos' } }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // 🏢 ENTREPRISE (Business)
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'business',
    label: { fr: 'Entreprise', en: 'Business', es: 'Empresa' },
    icon: '🏢',
    color: '#3b82f6',
    items: [
      { id: 'projects', icon: '📁', label: { fr: 'Projets', en: 'Projects', es: 'Proyectos' }, badge: 3 },
      { id: 'team', icon: '👥', label: { fr: 'Équipe', en: 'Team', es: 'Equipo' } },
      { id: 'finance', icon: '💰', label: { fr: 'Finance', en: 'Finance', es: 'Finanzas' } },
      { id: 'suppliers', icon: '📦', label: { fr: 'Fournisseurs', en: 'Suppliers', es: 'Proveedores' } },
      { id: 'signatures', icon: '✍️', label: { fr: 'Signatures', en: 'Signatures', es: 'Firmas' } },
      { id: 'photos', icon: '📷', label: { fr: 'Photos Chantier', en: 'Site Photos', es: 'Fotos Obra' } },
      { id: 'roi', icon: '📈', label: { fr: 'Calculateur ROI', en: 'ROI Calculator', es: 'Calculadora ROI' } },
      { id: 'crm', icon: '🤝', label: { fr: 'CRM Clients', en: 'CRM Clients', es: 'CRM Clientes' } }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // 🏛️ GOUVERNEMENT ENTREPRISE (Business Government/Taxes)
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'gov-business',
    label: { fr: 'Gouv. Entreprise', en: 'Business Gov.', es: 'Gob. Empresa' },
    icon: '🏦',
    color: '#0ea5e9',
    subcategories: [
      {
        id: 'taxes-business',
        label: { fr: 'Impôts & Taxes', en: 'Taxes', es: 'Impuestos' },
        items: [
          { id: 'biz-income-tax', icon: '📋', label: { fr: 'Impôt Société', en: 'Corporate Tax', es: 'Impuesto Corporativo' } },
          { id: 'biz-gst-qst', icon: '🧾', label: { fr: 'TPS/TVQ', en: 'GST/QST', es: 'IVA' } },
          { id: 'biz-municipal-tax', icon: '🏘️', label: { fr: 'Taxes Municipales', en: 'Municipal Taxes', es: 'Impuestos Municipales' } },
          { id: 'biz-tax-reports', icon: '📊', label: { fr: 'Rapports Fiscaux', en: 'Tax Reports', es: 'Informes Fiscales' } }
        ]
      },
      {
        id: 'payroll',
        label: { fr: 'Paie & RH', en: 'Payroll & HR', es: 'Nómina & RRHH' },
        items: [
          { id: 'payroll-run', icon: '💵', label: { fr: 'Cycle de Paie', en: 'Payroll Run', es: 'Ciclo Nómina' } },
          { id: 'payroll-deductions', icon: '📉', label: { fr: 'Déductions', en: 'Deductions', es: 'Deducciones' } },
          { id: 'payroll-t4', icon: '📄', label: { fr: 'T4 / Relevé 1', en: 'T4 / RL-1', es: 'T4 / RL-1' } },
          { id: 'payroll-remittance', icon: '📤', label: { fr: 'Remises DAS', en: 'Remittances', es: 'Remesas' } }
        ]
      },
      {
        id: 'compliance-biz',
        label: { fr: 'Conformité', en: 'Compliance', es: 'Cumplimiento' },
        items: [
          { id: 'ccq', icon: '🎓', label: { fr: 'CCQ', en: 'CCQ', es: 'CCQ' } },
          { id: 'cnesst', icon: '⛑️', label: { fr: 'CNESST', en: 'CNESST', es: 'CNESST' } },
          { id: 'rbq', icon: '📜', label: { fr: 'RBQ', en: 'RBQ', es: 'RBQ' } },
          { id: 'neq', icon: '🏢', label: { fr: 'NEQ / REQ', en: 'NEQ / REQ', es: 'NEQ / REQ' } }
        ]
      },
      {
        id: 'permits-biz',
        label: { fr: 'Permis & Licences', en: 'Permits & Licenses', es: 'Permisos' },
        items: [
          { id: 'permits', icon: '📋', label: { fr: 'Permis Construction', en: 'Building Permits', es: 'Permisos Construcción' } },
          { id: 'saaq-fleet', icon: '🚗', label: { fr: 'SAAQ Flotte', en: 'SAAQ Fleet', es: 'SAAQ Flota' } },
          { id: 'business-license', icon: '📃', label: { fr: 'Licences Affaires', en: 'Business Licenses', es: 'Licencias Negocio' } }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // 🏛️ GOUVERNEMENT PERSONNEL (Personal Government/Taxes)
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'gov-personal',
    label: { fr: 'Gouv. Personnel', en: 'Personal Gov.', es: 'Gob. Personal' },
    icon: '🏛️',
    color: '#ef4444',
    subcategories: [
      {
        id: 'taxes-personal',
        label: { fr: 'Impôts & Taxes', en: 'Taxes', es: 'Impuestos' },
        items: [
          { id: 'personal-income-tax', icon: '📋', label: { fr: 'Impôt Revenu', en: 'Income Tax', es: 'Impuesto Renta' } },
          { id: 'personal-municipal', icon: '🏘️', label: { fr: 'Taxes Municipales', en: 'Municipal Taxes', es: 'Impuestos Municipales' } },
          { id: 'personal-school-tax', icon: '🏫', label: { fr: 'Taxe Scolaire', en: 'School Tax', es: 'Impuesto Escolar' } },
          { id: 'personal-property-tax', icon: '🏠', label: { fr: 'Taxe Foncière', en: 'Property Tax', es: 'Impuesto Propiedad' } }
        ]
      },
      {
        id: 'government-services',
        label: { fr: 'Services Gouv.', en: 'Gov. Services', es: 'Servicios Gob.' },
        items: [
          { id: 'saaq-personal', icon: '🚗', label: { fr: 'SAAQ Personnel', en: 'SAAQ Personal', es: 'SAAQ Personal' } },
          { id: 'ramq', icon: '🏥', label: { fr: 'RAMQ', en: 'RAMQ', es: 'RAMQ' } },
          { id: 'rrq', icon: '👴', label: { fr: 'RRQ / Retraite', en: 'RRQ / Pension', es: 'RRQ / Pensión' } },
          { id: 'ei-chomage', icon: '📨', label: { fr: 'Assurance-Emploi', en: 'Employment Insurance', es: 'Seguro Desempleo' } }
        ]
      },
      {
        id: 'documents-personal',
        label: { fr: 'Documents', en: 'Documents', es: 'Documentos' },
        items: [
          { id: 'passport', icon: '🛂', label: { fr: 'Passeport', en: 'Passport', es: 'Pasaporte' } },
          { id: 'drivers-license', icon: '🪪', label: { fr: 'Permis Conduire', en: "Driver's License", es: 'Licencia Conducir' } },
          { id: 'birth-cert', icon: '📜', label: { fr: 'Acte Naissance', en: 'Birth Certificate', es: 'Acta Nacimiento' } }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // 🏘️ IMMOBILIER
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'realestate',
    label: { fr: 'Immobilier', en: 'Real Estate', es: 'Inmobiliario' },
    icon: '🏘️',
    color: '#8b5cf6',
    items: [
      { id: 'properties', icon: '🏠', label: { fr: 'Propriétés', en: 'Properties', es: 'Propiedades' } },
      { id: 'investment', icon: '💹', label: { fr: 'Investissements', en: 'Investments', es: 'Inversiones' } },
      { id: 'tenants', icon: '🔑', label: { fr: 'Locataires', en: 'Tenants', es: 'Inquilinos' } },
      { id: 'maintenance', icon: '🔧', label: { fr: 'Entretien', en: 'Maintenance', es: 'Mantenimiento' } },
      { id: 'property-map', icon: '📍', label: { fr: 'Carte', en: 'Map', es: 'Mapa' } },
      { id: 'mortgages', icon: '🏦', label: { fr: 'Hypothèques', en: 'Mortgages', es: 'Hipotecas' } }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // 📱 RÉSEAUX SOCIAUX
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'social',
    label: { fr: 'Réseaux Sociaux', en: 'Social Media', es: 'Redes Sociales' },
    icon: '📱',
    color: '#ec4899',
    items: [
      { id: 'social-feed', icon: '📱', label: { fr: 'Social Feed', en: 'Social Feed', es: 'Feed Social' } },
      { id: 'forum', icon: '💬', label: { fr: 'Forum', en: 'Forum', es: 'Foro' } },
      { id: 'community', icon: '🌐', label: { fr: 'Communauté', en: 'Community', es: 'Comunidad' } },
      { id: 'messages', icon: '💌', label: { fr: 'Messages', en: 'Messages', es: 'Mensajes' }, badge: 5 },
      { id: 'social-manager', icon: '📢', label: { fr: 'Social Manager', en: 'Social Manager', es: 'Gestor Social' } },
      { id: 'social-analytics', icon: '📊', label: { fr: 'Analytics', en: 'Analytics', es: 'Analíticas' } }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // 🎬 WATCH TUBE
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'watchtube',
    label: { fr: 'Watch Tube', en: 'Watch Tube', es: 'Watch Tube' },
    icon: '🎬',
    color: '#f97316',
    items: [
      { id: 'videos', icon: '🎬', label: { fr: 'Vidéos', en: 'Videos', es: 'Videos' } },
      { id: 'streaming', icon: '📺', label: { fr: 'Live', en: 'Live', es: 'En Vivo' } },
      { id: 'music', icon: '🎵', label: { fr: 'Musique', en: 'Music', es: 'Música' } },
      { id: 'podcasts', icon: '📻', label: { fr: 'Podcasts', en: 'Podcasts', es: 'Podcasts' } },
      { id: 'audiobooks', icon: '🎙️', label: { fr: 'Audio Books', en: 'Audio Books', es: 'Audiolibros' } }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // 🎨 CREATIVE STUDIO
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'creative',
    label: { fr: 'Creative Studio', en: 'Creative Studio', es: 'Estudio Creativo' },
    icon: '🎨',
    color: '#06b6d4',
    items: [
      { id: 'mediaeditor', icon: '🎞️', label: { fr: 'Éditeur Vidéo', en: 'Video Editor', es: 'Editor Video' } },
      { id: 'music-studio', icon: '🎵', label: { fr: 'Studio Musique', en: 'Music Studio', es: 'Estudio Música' } },
      { id: 'image-editor', icon: '🖼️', label: { fr: 'Éditeur Image', en: 'Image Editor', es: 'Editor Imagen' } },
      { id: 'script-gen', icon: '✍️', label: { fr: 'Script Generator', en: 'Script Generator', es: 'Generador Guiones' } },
      { id: 'ai-art', icon: '🎨', label: { fr: 'AI Art', en: 'AI Art', es: 'Arte IA' } },
      { id: 'video-gen', icon: '🎬', label: { fr: 'Video Generator', en: 'Video Generator', es: 'Generador Video' } },
      { id: 'voice-gen', icon: '🔊', label: { fr: 'Voice Generator', en: 'Voice Generator', es: 'Generador Voz' } },
      { id: 'media-library', icon: '📁', label: { fr: 'Médiathèque', en: 'Media Library', es: 'Mediateca' } },
      { id: 'brand-kit', icon: '🎯', label: { fr: 'Brand Kit', en: 'Brand Kit', es: 'Kit Marca' } }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // 🤖 IA & OUTILS
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'ai-tools',
    label: { fr: 'IA & Outils', en: 'AI & Tools', es: 'IA & Herramientas' },
    icon: '🤖',
    color: '#a855f7',
    items: [
      { id: 'ailab', icon: '🧠', label: { fr: 'AI Lab', en: 'AI Lab', es: 'Lab IA' } },
      { id: 'prompts', icon: '📚', label: { fr: 'Prompts Library', en: 'Prompts Library', es: 'Biblioteca Prompts' } },
      { id: 'research', icon: '🔍', label: { fr: 'Research Agent', en: 'Research Agent', es: 'Agente Investigación' } },
      { id: 'doc-gen', icon: '📄', label: { fr: 'Doc Generator', en: 'Doc Generator', es: 'Generador Docs' } },
      { id: 'transcription', icon: '🗣️', label: { fr: 'Transcription', en: 'Transcription', es: 'Transcripción' } },
      { id: 'education', icon: '🎓', label: { fr: 'Éducation', en: 'Education', es: 'Educación' } }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // ⚙️ SYSTÈME
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'system',
    label: { fr: 'Système', en: 'System', es: 'Sistema' },
    icon: '⚙️',
    color: '#64748b',
    items: [
      { id: 'account', icon: '👤', label: { fr: 'Mon Compte', en: 'My Account', es: 'Mi Cuenta' } },
      { id: 'integrations', icon: '🔌', label: { fr: 'Intégrations', en: 'Integrations', es: 'Integraciones' } },
      { id: 'permissions', icon: '🔐', label: { fr: 'Permissions', en: 'Permissions', es: 'Permisos' } },
      { id: 'settings', icon: '⚙️', label: { fr: 'Paramètres', en: 'Settings', es: 'Ajustes' } },
      { id: 'admin', icon: '📊', label: { fr: 'Admin', en: 'Admin', es: 'Admin' } }
    ]
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// STATISTIQUES
// ═══════════════════════════════════════════════════════════════════════════════
export const getStats = () => {
  let totalModules = 0;
  let totalSubcategories = 0;
  
  SIDEBAR_CATEGORIES.forEach(cat => {
    if (cat.subcategories) {
      totalSubcategories += cat.subcategories.length;
      cat.subcategories.forEach(sub => {
        totalModules += sub.items.length;
      });
    } else if (cat.items) {
      totalModules += cat.items.length;
    }
  });
  
  return {
    categories: SIDEBAR_CATEGORIES.length,
    subcategories: totalSubcategories,
    modules: totalModules
  };
};

// Stats: 11 catégories, 7 sous-catégories, 70+ modules

// ═══════════════════════════════════════════════════════════════════════════════
// SPRINTS COMPLÉTÉS - RÉSUMÉ FONCTIONNALITÉS
// ═══════════════════════════════════════════════════════════════════════════════

export const COMPLETED_FEATURES = {
  'sprint-21': {
    name: 'Projects Avancé',
    features: [
      'Templates projets (6 types)',
      'Sous-projets / Phases',
      'Budget tracking par phase',
      'Comparaison Estimé vs Réel',
      'Import Excel/CSV',
      'Duplication 1-clic',
      'Archivage + recherche',
      'Tags/Labels personnalisables',
      'Vue Portfolio carte',
      'Notifications jalons',
      'My Assets Module'
    ]
  },
  'sprint-22': {
    name: 'Calendar Pro',
    features: [
      'Google Calendar sync',
      'Outlook API sync',
      'Vue Équipe calendriers',
      'Réservation ressources',
      'Events récurrents',
      'Météo intégrée/jour',
      'Temps trajet auto',
      'Invitations RSVP',
      'Vue Agenda liste',
      'Calendly intégration'
    ]
  },
  'sprint-23': {
    name: 'Team & RH',
    features: [
      'Organigramme visuel',
      'Charge travail/agent',
      'Profil compétences',
      'CCQ API validation',
      'Chat direct profil',
      'Planification auto skills',
      'Historique performance',
      'BambooHR API',
      'Deputy API',
      'Export feuilles temps'
    ]
  }
};

export default SIDEBAR_CATEGORIES;
