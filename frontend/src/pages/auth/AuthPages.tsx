// CHE·NU™ Authentication Pages — Login & Register
// Complete authentication flow with governance consent

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CHENU_COLORS } from '../../types';

// ============================================================
// STYLES
// ============================================================

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    backgroundColor: CHENU_COLORS.uiSlate,
  },
  leftPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    padding: '48px',
    background: `linear-gradient(135deg, #0a0a0b 0%, ${CHENU_COLORS.uiSlate} 100%)`,
  },
  brandSection: {
    textAlign: 'center' as const,
    marginBottom: '48px',
  },
  logo: {
    fontSize: '64px',
    marginBottom: '24px',
  },
  brandName: {
    fontSize: '42px',
    fontWeight: 'bold',
    color: CHENU_COLORS.softSand,
    marginBottom: '8px',
    letterSpacing: '4px',
  },
  brandTagline: {
    fontSize: '16px',
    color: CHENU_COLORS.sacredGold,
    fontWeight: 500,
  },
  features: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
    maxWidth: '400px',
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 20px',
    backgroundColor: '#111113',
    borderRadius: '12px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  featureIcon: {
    fontSize: '24px',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    marginBottom: '2px',
  },
  featureDesc: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  
  // Right Panel (Form)
  rightPanel: {
    width: '500px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    padding: '48px',
    backgroundColor: '#0a0a0b',
    borderLeft: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  formHeader: {
    marginBottom: '32px',
  },
  formTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: CHENU_COLORS.softSand,
    marginBottom: '8px',
  },
  formSubtitle: {
    fontSize: '14px',
    color: CHENU_COLORS.ancientStone,
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 500,
    color: CHENU_COLORS.softSand,
  },
  input: {
    padding: '14px 16px',
    backgroundColor: '#111113',
    border: `1px solid ${CHENU_COLORS.ancientStone}33`,
    borderRadius: '10px',
    color: CHENU_COLORS.softSand,
    fontSize: '14px',
    transition: 'border-color 0.2s ease',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    fontSize: '12px',
    color: '#e74c3c',
  },
  checkbox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#111113',
    borderRadius: '10px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  checkboxInput: {
    width: '20px',
    height: '20px',
    marginTop: '2px',
    accentColor: CHENU_COLORS.sacredGold,
  },
  checkboxLabel: {
    flex: 1,
  },
  checkboxTitle: {
    fontSize: '13px',
    fontWeight: 500,
    color: CHENU_COLORS.softSand,
    marginBottom: '4px',
  },
  checkboxDesc: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
    lineHeight: 1.5,
  },
  submitButton: {
    padding: '16px',
    backgroundColor: CHENU_COLORS.sacredGold,
    border: 'none',
    borderRadius: '10px',
    color: '#000',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity 0.2s ease',
    marginTop: '8px',
  },
  submitButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    margin: '24px 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: CHENU_COLORS.ancientStone + '33',
  },
  dividerText: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  socialButtons: {
    display: 'flex',
    gap: '12px',
  },
  socialButton: {
    flex: 1,
    padding: '14px',
    backgroundColor: '#111113',
    border: `1px solid ${CHENU_COLORS.ancientStone}33`,
    borderRadius: '10px',
    color: CHENU_COLORS.softSand,
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  switchLink: {
    textAlign: 'center' as const,
    marginTop: '24px',
    fontSize: '14px',
    color: CHENU_COLORS.ancientStone,
  },
  link: {
    color: CHENU_COLORS.sacredGold,
    cursor: 'pointer',
    fontWeight: 500,
  },
  
  // Governance Notice
  governanceNotice: {
    padding: '16px',
    backgroundColor: CHENU_COLORS.cenoteTurquoise + '11',
    borderRadius: '10px',
    border: `1px solid ${CHENU_COLORS.cenoteTurquoise}33`,
    marginBottom: '24px',
  },
  governanceTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: CHENU_COLORS.cenoteTurquoise,
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  governanceText: {
    fontSize: '12px',
    color: CHENU_COLORS.softSand,
    lineHeight: 1.6,
  },
};

// ============================================================
// LOGIN COMPONENT
// ============================================================

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email && password) {
        navigate('/');
      } else {
        setError('Please enter your email and password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Panel - Brand */}
      <div style={styles.leftPanel}>
        <div style={styles.brandSection}>
          <div style={styles.logo}>🏠</div>
          <h1 style={styles.brandName}>CHE·NU</h1>
          <p style={styles.brandTagline}>Governed Intelligence Operating System</p>
        </div>
        
        <div style={styles.features}>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>🌐</span>
            <div style={styles.featureText}>
              <div style={styles.featureTitle}>8 Life Spheres</div>
              <div style={styles.featureDesc}>Organize your life by context, not features</div>
            </div>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>⚖️</span>
            <div style={styles.featureText}>
              <div style={styles.featureTitle}>10 Laws of Governance</div>
              <div style={styles.featureDesc}>Your data, your rules, always enforced</div>
            </div>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>🌟</span>
            <div style={styles.featureText}>
              <div style={styles.featureTitle}>Nova Intelligence</div>
              <div style={styles.featureDesc}>AI that guides, never controls</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div style={styles.rightPanel}>
        <div style={styles.formHeader}>
          <h2 style={styles.formTitle}>Welcome back</h2>
          <p style={styles.formSubtitle}>Sign in to your CHE·NU workspace</p>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              style={styles.input}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              style={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div style={styles.errorText}>{error}</div>}

          <button
            type="submit"
            style={{
              ...styles.submitButton,
              ...(loading ? styles.submitButtonDisabled : {}),
            }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>or continue with</span>
          <div style={styles.dividerLine} />
        </div>

        <div style={styles.socialButtons}>
          <button style={styles.socialButton}>
            <span>G</span> Google
          </button>
          <button style={styles.socialButton}>
            <span>🍎</span> Apple
          </button>
        </div>

        <p style={styles.switchLink}>
          Don't have an account?{' '}
          <span style={styles.link} onClick={() => navigate('/register')}>
            Create one
          </span>
        </p>
      </div>
    </div>
  );
};

// ============================================================
// REGISTER COMPONENT
// ============================================================

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [consents, setConsents] = useState({
    terms: false,
    governance: false,
    dataProcessing: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleConsent = (field: string, value: boolean) => {
    setConsents({ ...consents, [field]: value });
  };

  const isValid = formData.name && formData.email && formData.password && 
                  formData.password === formData.confirmPassword &&
                  consents.terms && consents.governance && consents.dataProcessing;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!consents.terms || !consents.governance || !consents.dataProcessing) {
      setError('Please accept all required consents');
      return;
    }

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate('/');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Panel - Brand */}
      <div style={styles.leftPanel}>
        <div style={styles.brandSection}>
          <div style={styles.logo}>🏠</div>
          <h1 style={styles.brandName}>CHE·NU</h1>
          <p style={styles.brandTagline}>Governed Intelligence Operating System</p>
        </div>
        
        <div style={styles.features}>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>🔐</span>
            <div style={styles.featureText}>
              <div style={styles.featureTitle}>Data Sovereignty</div>
              <div style={styles.featureDesc}>You own your data. Always.</div>
            </div>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>💰</span>
            <div style={styles.featureText}>
              <div style={styles.featureTitle}>Token Economy</div>
              <div style={styles.featureDesc}>Transparent AI costs, no surprises</div>
            </div>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>🤖</span>
            <div style={styles.featureText}>
              <div style={styles.featureTitle}>AI Agents</div>
              <div style={styles.featureDesc}>Hire agents that respect your rules</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div style={styles.rightPanel}>
        <div style={styles.formHeader}>
          <h2 style={styles.formTitle}>Create your workspace</h2>
          <p style={styles.formSubtitle}>Start your governed intelligence journey</p>
        </div>

        {/* Governance Notice */}
        <div style={styles.governanceNotice}>
          <div style={styles.governanceTitle}>
            <span>⚖️</span> Governance First
          </div>
          <div style={styles.governanceText}>
            CHE·NU operates under 10 Laws of Memory Governance. Your consent is required 
            before any AI processing. You maintain full control over your data at all times.
          </div>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              style={styles.input}
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              style={styles.input}
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              style={styles.input}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              style={styles.input}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
            />
          </div>

          {/* Consent Checkboxes */}
          <div style={styles.checkbox}>
            <input
              type="checkbox"
              style={styles.checkboxInput}
              checked={consents.terms}
              onChange={(e) => handleConsent('terms', e.target.checked)}
            />
            <div style={styles.checkboxLabel}>
              <div style={styles.checkboxTitle}>Terms of Service</div>
              <div style={styles.checkboxDesc}>
                I accept the CHE·NU Terms of Service and Privacy Policy
              </div>
            </div>
          </div>

          <div style={styles.checkbox}>
            <input
              type="checkbox"
              style={styles.checkboxInput}
              checked={consents.governance}
              onChange={(e) => handleConsent('governance', e.target.checked)}
            />
            <div style={styles.checkboxLabel}>
              <div style={styles.checkboxTitle}>10 Laws of Governance</div>
              <div style={styles.checkboxDesc}>
                I understand and accept the 10 Laws of Memory Governance that protect my data sovereignty
              </div>
            </div>
          </div>

          <div style={styles.checkbox}>
            <input
              type="checkbox"
              style={styles.checkboxInput}
              checked={consents.dataProcessing}
              onChange={(e) => handleConsent('dataProcessing', e.target.checked)}
            />
            <div style={styles.checkboxLabel}>
              <div style={styles.checkboxTitle}>Data Processing Consent</div>
              <div style={styles.checkboxDesc}>
                I consent to AI processing of my data within my defined scope and budget limits (Law 1: Consent Primacy)
              </div>
            </div>
          </div>

          {error && <div style={styles.errorText}>{error}</div>}

          <button
            type="submit"
            style={{
              ...styles.submitButton,
              ...(!isValid || loading ? styles.submitButtonDisabled : {}),
            }}
            disabled={!isValid || loading}
          >
            {loading ? 'Creating workspace...' : 'Create Workspace'}
          </button>
        </form>

        <p style={styles.switchLink}>
          Already have an account?{' '}
          <span style={styles.link} onClick={() => navigate('/login')}>
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default { LoginPage, RegisterPage };
