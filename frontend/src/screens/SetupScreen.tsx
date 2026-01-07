/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ — SETUP SCREEN                                         ║
 * ║              First-Time Configuration & Admin Account Creation              ║
 * ║              GOUVERNANCE > EXÉCUTION                                        ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * This screen appears ONLY on first launch.
 * Creates the admin account and initializes the system.
 */

import React, { useState, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface AdminAccountData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  organizationName: string;
  language: 'fr' | 'en';
  acceptTerms: boolean;
}

interface SetupScreenProps {
  onSetupComplete: (adminData: AdminAccountData) => void;
}

type SetupStep = 'welcome' | 'admin' | 'organization' | 'preferences' | 'complete';

// ═══════════════════════════════════════════════════════════════════════════════
// COLORS
// ═══════════════════════════════════════════════════════════════════════════════

const COLORS = {
  bgPrimary: '#0D1117',
  bgSurface: '#1E1F22',
  bgElevated: '#2D2D30',
  sacredGold: '#D8B26A',
  cenoteTurquoise: '#3EB4A2',
  jungleEmerald: '#3F7249',
  earthEmber: '#7A593A',
  textPrimary: '#E9E4D6',
  textSecondary: '#8D8371',
  error: '#EF4444',
  success: '#22C55E',
  border: '#333333',
};

// ═══════════════════════════════════════════════════════════════════════════════
// SETUP SCREEN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function SetupScreen({ onSetupComplete }: SetupScreenProps) {
  const [step, setStep] = useState<SetupStep>('welcome');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<AdminAccountData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    language: 'fr',
    acceptTerms: false,
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════

  const updateField = useCallback((field: keyof AdminAccountData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field changes
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const validateStep = useCallback((currentStep: SetupStep): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 'admin') {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'Prénom requis';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Nom requis';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email requis';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Email invalide';
      }
      if (!formData.password) {
        newErrors.password = 'Mot de passe requis';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Minimum 8 caractères';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
    }

    if (currentStep === 'organization') {
      if (!formData.organizationName.trim()) {
        newErrors.organizationName = 'Nom d\'organisation requis';
      }
    }

    if (currentStep === 'preferences') {
      if (!formData.acceptTerms) {
        newErrors.acceptTerms = 'Vous devez accepter les conditions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const nextStep = useCallback(() => {
    if (!validateStep(step)) return;

    const steps: SetupStep[] = ['welcome', 'admin', 'organization', 'preferences', 'complete'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  }, [step, validateStep]);

  const prevStep = useCallback(() => {
    const steps: SetupStep[] = ['welcome', 'admin', 'organization', 'preferences', 'complete'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  }, [step]);

  const handleComplete = useCallback(async () => {
    if (!validateStep('preferences')) return;

    setIsLoading(true);
    
    try {
      // Simulate API call to create admin account
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store setup completion flag
      localStorage.setItem('chenu-setup-complete', 'true');
      localStorage.setItem('chenu-admin-email', formData.email);
      
      setStep('complete');
      
      // Wait a moment then complete
      setTimeout(() => {
        onSetupComplete(formData);
      }, 2000);
      
    } catch (error) {
      setErrors({ general: 'Erreur lors de la création du compte' });
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateStep, onSetupComplete]);

  // ═══════════════════════════════════════════════════════════════════════════
  // STEP RENDERS
  // ═══════════════════════════════════════════════════════════════════════════

  const renderWelcome = () => (
    <div style={styles.stepContent}>
      <div style={styles.welcomeIcon}>◆</div>
      <h1 style={styles.welcomeTitle}>Bienvenue sur CHE·NU™</h1>
      <p style={styles.welcomeSubtitle}>Governed Intelligence Operating System</p>
      
      <div style={styles.featureList}>
        <div style={styles.feature}>
          <span style={styles.featureIcon}>🏛️</span>
          <div>
            <strong>9 Sphères de vie</strong>
            <p>Organisation intelligente par contexte</p>
          </div>
        </div>
        <div style={styles.feature}>
          <span style={styles.featureIcon}>✧</span>
          <div>
            <strong>Nova - Intelligence Système</strong>
            <p>Votre assistant gouverné</p>
          </div>
        </div>
        <div style={styles.feature}>
          <span style={styles.featureIcon}>⬡</span>
          <div>
            <strong>Tokens d'Intelligence</strong>
            <p>Budget et gouvernance transparents</p>
          </div>
        </div>
      </div>

      <p style={styles.setupNote}>
        Configurons votre compte administrateur pour commencer.
      </p>

      <button style={styles.primaryButton} onClick={nextStep}>
        Commencer la configuration
      </button>
    </div>
  );

  const renderAdminForm = () => (
    <div style={styles.stepContent}>
      <h2 style={styles.stepTitle}>Créer le compte Administrateur</h2>
      <p style={styles.stepDescription}>
        Ce compte aura un accès complet au système CHE·NU™
      </p>

      <div style={styles.formGrid}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Prénom *</label>
          <input
            type="text"
            style={{
              ...styles.input,
              borderColor: errors.firstName ? COLORS.error : COLORS.border,
            }}
            value={formData.firstName}
            onChange={(e) => updateField('firstName', e.target.value)}
            placeholder="Votre prénom"
          />
          {errors.firstName && <span style={styles.errorText}>{errors.firstName}</span>}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Nom *</label>
          <input
            type="text"
            style={{
              ...styles.input,
              borderColor: errors.lastName ? COLORS.error : COLORS.border,
            }}
            value={formData.lastName}
            onChange={(e) => updateField('lastName', e.target.value)}
            placeholder="Votre nom"
          />
          {errors.lastName && <span style={styles.errorText}>{errors.lastName}</span>}
        </div>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Email *</label>
        <input
          type="email"
          style={{
            ...styles.input,
            borderColor: errors.email ? COLORS.error : COLORS.border,
          }}
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          placeholder="admin@example.com"
        />
        {errors.email && <span style={styles.errorText}>{errors.email}</span>}
      </div>

      <div style={styles.formGrid}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Mot de passe *</label>
          <input
            type="password"
            style={{
              ...styles.input,
              borderColor: errors.password ? COLORS.error : COLORS.border,
            }}
            value={formData.password}
            onChange={(e) => updateField('password', e.target.value)}
            placeholder="Minimum 8 caractères"
          />
          {errors.password && <span style={styles.errorText}>{errors.password}</span>}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Confirmer *</label>
          <input
            type="password"
            style={{
              ...styles.input,
              borderColor: errors.confirmPassword ? COLORS.error : COLORS.border,
            }}
            value={formData.confirmPassword}
            onChange={(e) => updateField('confirmPassword', e.target.value)}
            placeholder="Répéter le mot de passe"
          />
          {errors.confirmPassword && <span style={styles.errorText}>{errors.confirmPassword}</span>}
        </div>
      </div>

      <div style={styles.buttonRow}>
        <button style={styles.secondaryButton} onClick={prevStep}>
          ← Retour
        </button>
        <button style={styles.primaryButton} onClick={nextStep}>
          Continuer →
        </button>
      </div>
    </div>
  );

  const renderOrganization = () => (
    <div style={styles.stepContent}>
      <h2 style={styles.stepTitle}>Votre Organisation</h2>
      <p style={styles.stepDescription}>
        Configurez le contexte principal de CHE·NU™
      </p>

      <div style={styles.formGroup}>
        <label style={styles.label}>Nom de l'organisation *</label>
        <input
          type="text"
          style={{
            ...styles.input,
            borderColor: errors.organizationName ? COLORS.error : COLORS.border,
          }}
          value={formData.organizationName}
          onChange={(e) => updateField('organizationName', e.target.value)}
          placeholder="Ma Compagnie Inc."
        />
        {errors.organizationName && <span style={styles.errorText}>{errors.organizationName}</span>}
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Langue préférée</label>
        <div style={styles.languageSelector}>
          <button
            style={{
              ...styles.langButton,
              ...(formData.language === 'fr' ? styles.langButtonActive : {}),
            }}
            onClick={() => updateField('language', 'fr')}
          >
            🇫🇷 Français
          </button>
          <button
            style={{
              ...styles.langButton,
              ...(formData.language === 'en' ? styles.langButtonActive : {}),
            }}
            onClick={() => updateField('language', 'en')}
          >
            🇬🇧 English
          </button>
        </div>
      </div>

      <div style={styles.infoBox}>
        <span style={styles.infoIcon}>ℹ️</span>
        <p>
          Vous pourrez ajouter d'autres utilisateurs et organisations plus tard 
          depuis le panneau d'administration.
        </p>
      </div>

      <div style={styles.buttonRow}>
        <button style={styles.secondaryButton} onClick={prevStep}>
          ← Retour
        </button>
        <button style={styles.primaryButton} onClick={nextStep}>
          Continuer →
        </button>
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div style={styles.stepContent}>
      <h2 style={styles.stepTitle}>Finalisation</h2>
      <p style={styles.stepDescription}>
        Vérifiez vos informations et acceptez les conditions
      </p>

      <div style={styles.summaryBox}>
        <h3 style={styles.summaryTitle}>Résumé</h3>
        <div style={styles.summaryItem}>
          <span>Administrateur:</span>
          <strong>{formData.firstName} {formData.lastName}</strong>
        </div>
        <div style={styles.summaryItem}>
          <span>Email:</span>
          <strong>{formData.email}</strong>
        </div>
        <div style={styles.summaryItem}>
          <span>Organisation:</span>
          <strong>{formData.organizationName}</strong>
        </div>
        <div style={styles.summaryItem}>
          <span>Langue:</span>
          <strong>{formData.language === 'fr' ? 'Français' : 'English'}</strong>
        </div>
      </div>

      <div style={styles.termsBox}>
        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={formData.acceptTerms}
            onChange={(e) => updateField('acceptTerms', e.target.checked)}
            style={styles.checkbox}
          />
          <span>
            J'accepte les{' '}
            <a href="#terms" style={styles.link}>conditions d'utilisation</a>
            {' '}et la{' '}
            <a href="#privacy" style={styles.link}>politique de confidentialité</a>
          </span>
        </label>
        {errors.acceptTerms && <span style={styles.errorText}>{errors.acceptTerms}</span>}
      </div>

      {errors.general && (
        <div style={styles.errorBox}>
          {errors.general}
        </div>
      )}

      <div style={styles.buttonRow}>
        <button style={styles.secondaryButton} onClick={prevStep}>
          ← Retour
        </button>
        <button 
          style={{
            ...styles.primaryButton,
            opacity: isLoading ? 0.7 : 1,
          }} 
          onClick={handleComplete}
          disabled={isLoading}
        >
          {isLoading ? 'Création en cours...' : 'Créer le compte Admin ✓'}
        </button>
      </div>
    </div>
  );

  const renderComplete = () => (
    <div style={styles.stepContent}>
      <div style={styles.successIcon}>✓</div>
      <h2 style={styles.successTitle}>Configuration terminée!</h2>
      <p style={styles.successText}>
        Votre compte administrateur a été créé avec succès.
      </p>
      
      <div style={styles.credentialsBox}>
        <p><strong>Email:</strong> {formData.email}</p>
        <p><strong>Organisation:</strong> {formData.organizationName}</p>
      </div>

      <div style={styles.loadingDots}>
        <span>Redirection vers CHE·NU</span>
        <span className="dots">...</span>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // PROGRESS INDICATOR
  // ═══════════════════════════════════════════════════════════════════════════

  const steps: SetupStep[] = ['welcome', 'admin', 'organization', 'preferences', 'complete'];
  const currentIndex = steps.indexOf(step);
  const progress = ((currentIndex) / (steps.length - 1)) * 100;

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div style={styles.container}>
      {/* Progress Bar */}
      <div style={styles.progressContainer}>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>
        <div style={styles.stepIndicators}>
          {['Bienvenue', 'Admin', 'Organisation', 'Préférences', 'Terminé'].map((label, i) => (
            <div 
              key={label} 
              style={{
                ...styles.stepDot,
                ...(i <= currentIndex ? styles.stepDotActive : {}),
              }}
            >
              <span style={styles.stepNumber}>{i < currentIndex ? '✓' : i + 1}</span>
              <span style={styles.stepLabel}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={styles.contentWrapper}>
        {step === 'welcome' && renderWelcome()}
        {step === 'admin' && renderAdminForm()}
        {step === 'organization' && renderOrganization()}
        {step === 'preferences' && renderPreferences()}
        {step === 'complete' && renderComplete()}
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <span style={styles.footerLogo}>◆ CHE·NU™</span>
        <span style={styles.footerText}>Governed Intelligence Operating System</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: COLORS.bgPrimary,
    display: 'flex',
    flexDirection: 'column',
  },
  progressContainer: {
    padding: '24px 48px',
    borderBottom: `1px solid ${COLORS.border}`,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.bgElevated,
    borderRadius: 2,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.sacredGold,
    transition: 'width 0.3s ease',
  },
  stepIndicators: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  stepDot: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    opacity: 0.4,
    transition: 'opacity 0.3s',
  },
  stepDotActive: {
    opacity: 1,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    backgroundColor: COLORS.bgSurface,
    border: `2px solid ${COLORS.sacredGold}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 700,
    color: COLORS.sacredGold,
  },
  stepLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  contentWrapper: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  stepContent: {
    maxWidth: 520,
    width: '100%',
  },
  welcomeIcon: {
    fontSize: 80,
    color: COLORS.sacredGold,
    textAlign: 'center',
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 700,
    color: COLORS.sacredGold,
    textAlign: 'center',
    margin: 0,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    margin: 0,
    marginBottom: 48,
  },
  featureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    marginBottom: 32,
  },
  feature: {
    display: 'flex',
    gap: 16,
    padding: 16,
    backgroundColor: COLORS.bgSurface,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  featureIcon: {
    fontSize: 28,
  },
  setupNote: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: COLORS.textPrimary,
    margin: 0,
    marginBottom: 8,
  },
  stepDescription: {
    color: COLORS.textSecondary,
    margin: 0,
    marginBottom: 32,
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: COLORS.bgSurface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 8,
    color: COLORS.textPrimary,
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  errorText: {
    display: 'block',
    fontSize: 12,
    color: COLORS.error,
    marginTop: 4,
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 32,
    gap: 16,
  },
  primaryButton: {
    padding: '14px 28px',
    backgroundColor: COLORS.cenoteTurquoise,
    border: 'none',
    borderRadius: 8,
    color: '#000',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'transform 0.2s, opacity 0.2s',
  },
  secondaryButton: {
    padding: '14px 28px',
    backgroundColor: 'transparent',
    border: `1px solid ${COLORS.border}`,
    borderRadius: 8,
    color: COLORS.textSecondary,
    fontSize: 14,
    cursor: 'pointer',
  },
  languageSelector: {
    display: 'flex',
    gap: 12,
  },
  langButton: {
    flex: 1,
    padding: '12px 16px',
    backgroundColor: COLORS.bgSurface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 8,
    color: COLORS.textSecondary,
    fontSize: 14,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  langButtonActive: {
    borderColor: COLORS.sacredGold,
    color: COLORS.sacredGold,
    backgroundColor: 'rgba(216, 178, 106, 0.1)',
  },
  infoBox: {
    display: 'flex',
    gap: 12,
    padding: 16,
    backgroundColor: 'rgba(62, 180, 162, 0.1)',
    borderRadius: 8,
    marginTop: 24,
  },
  infoIcon: {
    fontSize: 20,
  },
  summaryBox: {
    padding: 24,
    backgroundColor: COLORS.bgSurface,
    borderRadius: 12,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: COLORS.textSecondary,
    margin: 0,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: `1px solid ${COLORS.border}`,
    color: COLORS.textSecondary,
  },
  termsBox: {
    marginBottom: 24,
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    color: COLORS.textSecondary,
    fontSize: 14,
    cursor: 'pointer',
  },
  checkbox: {
    width: 20,
    height: 20,
    marginTop: 2,
  },
  link: {
    color: COLORS.cenoteTurquoise,
    textDecoration: 'none',
  },
  errorBox: {
    padding: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: `1px solid ${COLORS.error}`,
    borderRadius: 8,
    color: COLORS.error,
    marginBottom: 16,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    backgroundColor: COLORS.success,
    color: '#fff',
    fontSize: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: COLORS.textPrimary,
    textAlign: 'center',
    margin: 0,
    marginBottom: 8,
  },
  successText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  credentialsBox: {
    padding: 20,
    backgroundColor: COLORS.bgSurface,
    borderRadius: 12,
    textAlign: 'center',
    marginBottom: 24,
  },
  loadingDots: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  footer: {
    padding: 24,
    borderTop: `1px solid ${COLORS.border}`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  footerLogo: {
    color: COLORS.sacredGold,
    fontWeight: 700,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
};

export default SetupScreen;
