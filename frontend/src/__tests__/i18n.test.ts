// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU™ — INTERNATIONALIZATION (I18N) TESTS
// Sprint 8: Tests for multi-language support
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';

// ═══════════════════════════════════════════════════════════════════════════════
// SUPPORTED LANGUAGES
// ═══════════════════════════════════════════════════════════════════════════════

const SUPPORTED_LANGUAGES = ['en', 'fr', 'es', 'de', 'pt', 'ja', 'zh'] as const;
const DEFAULT_LANGUAGE = 'en';

type Language = typeof SUPPORTED_LANGUAGES[number];

// ═══════════════════════════════════════════════════════════════════════════════
// TRANSLATION KEYS
// ═══════════════════════════════════════════════════════════════════════════════

const TRANSLATION_KEYS = {
  // System
  'system.name': 'CHE·NU',
  'system.tagline': 'Governed Intelligence Operating System',
  
  // Spheres
  'sphere.personal': true,
  'sphere.business': true,
  'sphere.government': true,
  'sphere.creative': true,
  'sphere.community': true,
  'sphere.social': true,
  'sphere.entertainment': true,
  'sphere.team': true,
  'sphere.scholar': true,
  
  // Bureau Sections
  'bureau.quick_capture': true,
  'bureau.resume_workspace': true,
  'bureau.threads': true,
  'bureau.data_files': true,
  'bureau.active_agents': true,
  'bureau.meetings': true,
  
  // Nova
  'nova.name': true,
  'nova.greeting': true,
  'nova.guidance': true,
  
  // Governance
  'governance.budget': true,
  'governance.approval_required': true,
  'governance.law': true,
  
  // Common
  'common.save': true,
  'common.cancel': true,
  'common.delete': true,
  'common.confirm': true,
  'common.loading': true,
  'common.error': true,
  'common.success': true,
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK TRANSLATIONS
// ═══════════════════════════════════════════════════════════════════════════════

const translations: Record<Language, Record<string, string>> = {
  en: {
    'system.name': 'CHE·NU',
    'system.tagline': 'Governed Intelligence Operating System',
    'sphere.personal': 'Personal',
    'sphere.business': 'Business',
    'sphere.government': 'Government & Institutions',
    'sphere.creative': 'Creative Studio',
    'sphere.community': 'Community',
    'sphere.social': 'Social & Media',
    'sphere.entertainment': 'Entertainment',
    'sphere.team': 'My Team',
    'sphere.scholar': 'Scholar',
    'bureau.quick_capture': 'Quick Capture',
    'bureau.resume_workspace': 'Resume Workspace',
    'bureau.threads': 'Threads',
    'bureau.data_files': 'Data Files',
    'bureau.active_agents': 'Active Agents',
    'bureau.meetings': 'Meetings',
    'nova.name': 'Nova',
    'nova.greeting': 'Hello! How can I help you today?',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
  },
  fr: {
    'system.name': 'CHE·NU',
    'system.tagline': 'Système d\'exploitation à intelligence gouvernée',
    'sphere.personal': 'Personnel',
    'sphere.business': 'Affaires',
    'sphere.government': 'Gouvernement & Institutions',
    'sphere.creative': 'Studio de création',
    'sphere.community': 'Communauté',
    'sphere.social': 'Social & Médias',
    'sphere.entertainment': 'Divertissement',
    'sphere.team': 'Mon Équipe',
    'sphere.scholar': 'Académique',
    'bureau.quick_capture': 'Capture rapide',
    'bureau.resume_workspace': 'Espace de travail',
    'bureau.threads': 'Fils de discussion',
    'bureau.data_files': 'Fichiers de données',
    'bureau.active_agents': 'Agents actifs',
    'bureau.meetings': 'Réunions',
    'nova.name': 'Nova',
    'nova.greeting': 'Bonjour ! Comment puis-je vous aider ?',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
  },
  es: {
    'system.name': 'CHE·NU',
    'system.tagline': 'Sistema Operativo de Inteligencia Gobernada',
    'sphere.personal': 'Personal',
    'sphere.business': 'Negocios',
    'sphere.scholar': 'Académico',
    'nova.name': 'Nova',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
  },
  de: {
    'system.name': 'CHE·NU',
    'sphere.personal': 'Persönlich',
    'sphere.business': 'Geschäft',
    'sphere.scholar': 'Gelehrter',
    'nova.name': 'Nova',
    'common.save': 'Speichern',
  },
  pt: {
    'system.name': 'CHE·NU',
    'sphere.personal': 'Pessoal',
    'sphere.scholar': 'Acadêmico',
    'nova.name': 'Nova',
  },
  ja: {
    'system.name': 'CHE·NU',
    'sphere.personal': 'パーソナル',
    'sphere.scholar': '学術',
    'nova.name': 'ノヴァ',
  },
  zh: {
    'system.name': 'CHE·NU',
    'sphere.personal': '个人',
    'sphere.scholar': '学术',
    'nova.name': '诺瓦',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// I18N HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function t(key: string, lang: Language = DEFAULT_LANGUAGE): string {
  return translations[lang]?.[key] || translations[DEFAULT_LANGUAGE]?.[key] || key;
}

function hasTranslation(key: string, lang: Language): boolean {
  return key in (translations[lang] || {});
}

function getAvailableLanguages(): readonly Language[] {
  return SUPPORTED_LANGUAGES;
}

function isRTL(lang: Language): boolean {
  const rtlLanguages = ['ar', 'he', 'fa'];
  return rtlLanguages.includes(lang);
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUPPORTED LANGUAGES TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Supported Languages', () => {
  it('should have English as default language', () => {
    expect(DEFAULT_LANGUAGE).toBe('en');
  });

  it('should support at least 5 languages', () => {
    expect(SUPPORTED_LANGUAGES.length).toBeGreaterThanOrEqual(5);
  });

  it('should support English', () => {
    expect(SUPPORTED_LANGUAGES).toContain('en');
  });

  it('should support French', () => {
    expect(SUPPORTED_LANGUAGES).toContain('fr');
  });

  it('should support Spanish', () => {
    expect(SUPPORTED_LANGUAGES).toContain('es');
  });

  it('should support Japanese', () => {
    expect(SUPPORTED_LANGUAGES).toContain('ja');
  });

  it('should support Chinese', () => {
    expect(SUPPORTED_LANGUAGES).toContain('zh');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TRANSLATION FUNCTION TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Translation Function', () => {
  it('should return English translation by default', () => {
    expect(t('sphere.personal')).toBe('Personal');
  });

  it('should return French translation when specified', () => {
    expect(t('sphere.personal', 'fr')).toBe('Personnel');
  });

  it('should fallback to English for missing translations', () => {
    // German might not have all translations
    expect(t('bureau.meetings', 'de')).toBe('Meetings');
  });

  it('should return key if no translation exists', () => {
    expect(t('nonexistent.key')).toBe('nonexistent.key');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SPHERE TRANSLATION TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Sphere Translations', () => {
  const sphereKeys = [
    'sphere.personal',
    'sphere.business',
    'sphere.government',
    'sphere.creative',
    'sphere.community',
    'sphere.social',
    'sphere.entertainment',
    'sphere.team',
    'sphere.scholar',
  ];

  it('should have translations for all 9 spheres in English', () => {
    sphereKeys.forEach(key => {
      expect(hasTranslation(key, 'en')).toBe(true);
    });
  });

  it('should have translations for all 9 spheres in French', () => {
    sphereKeys.forEach(key => {
      expect(hasTranslation(key, 'fr')).toBe(true);
    });
  });

  it('should translate Scholar sphere correctly', () => {
    expect(t('sphere.scholar', 'en')).toBe('Scholar');
    expect(t('sphere.scholar', 'fr')).toBe('Académique');
    expect(t('sphere.scholar', 'es')).toBe('Académico');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// BUREAU SECTION TRANSLATION TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Bureau Section Translations', () => {
  const bureauKeys = [
    'bureau.quick_capture',
    'bureau.resume_workspace',
    'bureau.threads',
    'bureau.data_files',
    'bureau.active_agents',
    'bureau.meetings',
  ];

  it('should have translations for all 6 sections in English', () => {
    bureauKeys.forEach(key => {
      expect(hasTranslation(key, 'en')).toBe(true);
    });
  });

  it('should have translations for all 6 sections in French', () => {
    bureauKeys.forEach(key => {
      expect(hasTranslation(key, 'fr')).toBe(true);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// NOVA TRANSLATION TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Nova Translations', () => {
  it('should translate Nova name (stays Nova in most languages)', () => {
    expect(t('nova.name', 'en')).toBe('Nova');
    expect(t('nova.name', 'fr')).toBe('Nova');
  });

  it('should translate Nova name in Japanese', () => {
    expect(t('nova.name', 'ja')).toBe('ノヴァ');
  });

  it('should translate Nova name in Chinese', () => {
    expect(t('nova.name', 'zh')).toBe('诺瓦');
  });

  it('should translate Nova greeting', () => {
    expect(t('nova.greeting', 'en')).toContain('Hello');
    expect(t('nova.greeting', 'fr')).toContain('Bonjour');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SYSTEM NAME TRANSLATION TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('System Name Translations', () => {
  it('should keep CHE·NU unchanged in all languages', () => {
    SUPPORTED_LANGUAGES.forEach(lang => {
      expect(t('system.name', lang)).toBe('CHE·NU');
    });
  });

  it('should translate tagline', () => {
    expect(t('system.tagline', 'en')).toContain('Governed Intelligence');
    expect(t('system.tagline', 'fr')).toContain('intelligence gouvernée');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// COMMON TRANSLATIONS TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Common Translations', () => {
  it('should translate Save button', () => {
    expect(t('common.save', 'en')).toBe('Save');
    expect(t('common.save', 'fr')).toBe('Enregistrer');
    expect(t('common.save', 'es')).toBe('Guardar');
    expect(t('common.save', 'de')).toBe('Speichern');
  });

  it('should translate Cancel button', () => {
    expect(t('common.cancel', 'en')).toBe('Cancel');
    expect(t('common.cancel', 'fr')).toBe('Annuler');
  });

  it('should translate Delete button', () => {
    expect(t('common.delete', 'en')).toBe('Delete');
    expect(t('common.delete', 'fr')).toBe('Supprimer');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// RTL SUPPORT TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('RTL Language Support', () => {
  it('should identify RTL languages correctly', () => {
    // None of our current supported languages are RTL
    SUPPORTED_LANGUAGES.forEach(lang => {
      expect(isRTL(lang)).toBe(false);
    });
  });

  it('should return false for LTR languages', () => {
    expect(isRTL('en')).toBe(false);
    expect(isRTL('fr')).toBe(false);
    expect(isRTL('es')).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TRANSLATION KEY COMPLETENESS TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Translation Key Completeness', () => {
  it('should have system keys', () => {
    expect(TRANSLATION_KEYS['system.name']).toBeDefined();
    expect(TRANSLATION_KEYS['system.tagline']).toBeDefined();
  });

  it('should have all 9 sphere keys', () => {
    const sphereKeys = Object.keys(TRANSLATION_KEYS).filter(k => k.startsWith('sphere.'));
    expect(sphereKeys.length).toBe(9);
  });

  it('should have all 6 bureau section keys', () => {
    const bureauKeys = Object.keys(TRANSLATION_KEYS).filter(k => k.startsWith('bureau.'));
    expect(bureauKeys.length).toBe(6);
  });

  it('should have Nova keys', () => {
    const novaKeys = Object.keys(TRANSLATION_KEYS).filter(k => k.startsWith('nova.'));
    expect(novaKeys.length).toBeGreaterThanOrEqual(3);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// UNICODE HANDLING TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Unicode Handling', () => {
  it('should handle Japanese characters', () => {
    const japanese = t('sphere.personal', 'ja');
    expect(japanese).toBe('パーソナル');
    expect(japanese.length).toBeGreaterThan(0);
  });

  it('should handle Chinese characters', () => {
    const chinese = t('sphere.personal', 'zh');
    expect(chinese).toBe('个人');
    expect(chinese.length).toBeGreaterThan(0);
  });

  it('should handle French accents', () => {
    const french = t('sphere.creative', 'fr');
    expect(french).toContain('création');
  });

  it('should handle German umlauts', () => {
    const german = t('sphere.personal', 'de');
    expect(german).toBe('Persönlich');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// MEMORY PROMPT I18N COMPLIANCE
// ═══════════════════════════════════════════════════════════════════════════════

describe('Memory Prompt I18N Compliance', () => {
  it('should have translations for all 9 spheres', () => {
    const sphereCount = Object.keys(TRANSLATION_KEYS).filter(k => k.startsWith('sphere.')).length;
    expect(sphereCount).toBe(9);
  });

  it('should have translations for all 6 bureau sections', () => {
    const bureauCount = Object.keys(TRANSLATION_KEYS).filter(k => k.startsWith('bureau.')).length;
    expect(bureauCount).toBe(6);
  });

  it('should keep CHE·NU brand name consistent', () => {
    SUPPORTED_LANGUAGES.forEach(lang => {
      expect(t('system.name', lang)).toBe('CHE·NU');
    });
  });

  it('should keep Nova name recognizable', () => {
    // Nova should be "Nova" or a phonetic equivalent
    expect(t('nova.name', 'en')).toBe('Nova');
    expect(t('nova.name', 'fr')).toBe('Nova');
  });
});
