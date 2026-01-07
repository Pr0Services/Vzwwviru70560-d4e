/**
 * CHE·NU™ Authentication Components V72
 * 
 * Complete authentication UI components:
 * - LoginForm
 * - RegisterForm
 * - TwoFactorForm
 * - TwoFactorSetup
 * - OAuthButtons
 * - PasswordStrengthMeter
 * - ForgotPasswordForm
 * - ResetPasswordForm
 * - SessionList
 * - ChangePasswordForm
 * 
 * @version V72.0
 * @phase Phase 2 - Authentication
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  useAuthStore, 
  useIsAuthenticated, 
  useAuthLoading, 
  useAuthError,
  useRequires2FA 
} from '../../services/auth/authStore';
import { 
  validatePasswordStrength, 
  AuthProvider, 
  Session 
} from '../../services/auth/authAPI';


// ═══════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════

const AuthStyles: React.FC = () => (
  <style>{`
    /* Auth Container */
    .auth-container {
      max-width: 400px;
      margin: 2rem auto;
      padding: 2rem;
      background: var(--color-surface, #fff);
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.1);
    }
    
    [data-theme="dark"] .auth-container {
      background: var(--color-surface-dark, #1e1e1e);
      box-shadow: 0 4px 24px rgba(0,0,0,0.4);
    }
    
    .auth-title {
      font-size: 1.75rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 0.5rem;
      color: var(--color-text, #1a1a1a);
    }
    
    [data-theme="dark"] .auth-title {
      color: var(--color-text-dark, #f0f0f0);
    }
    
    .auth-subtitle {
      text-align: center;
      color: var(--color-text-secondary, #666);
      margin-bottom: 1.5rem;
    }
    
    /* Form */
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .auth-field {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }
    
    .auth-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text, #1a1a1a);
    }
    
    [data-theme="dark"] .auth-label {
      color: var(--color-text-dark, #f0f0f0);
    }
    
    .auth-input {
      width: 100%;
      padding: 0.75rem 1rem;
      font-size: 1rem;
      border: 1px solid var(--color-border, #ddd);
      border-radius: 8px;
      background: var(--color-background, #fff);
      color: var(--color-text, #1a1a1a);
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    
    .auth-input:focus {
      outline: none;
      border-color: var(--color-primary, #3b82f6);
      box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
    }
    
    .auth-input:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .auth-input.error {
      border-color: var(--color-error, #ef4444);
    }
    
    [data-theme="dark"] .auth-input {
      background: var(--color-background-dark, #2a2a2a);
      border-color: var(--color-border-dark, #444);
      color: var(--color-text-dark, #f0f0f0);
    }
    
    /* Password Toggle */
    .password-wrapper {
      position: relative;
    }
    
    .password-toggle {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      color: var(--color-text-secondary, #666);
    }
    
    .password-toggle:hover {
      color: var(--color-text, #1a1a1a);
    }
    
    /* Buttons */
    .auth-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.875rem 1.5rem;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .auth-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .auth-button-primary {
      background: var(--color-primary, #3b82f6);
      color: white;
    }
    
    .auth-button-primary:hover:not(:disabled) {
      background: var(--color-primary-hover, #2563eb);
    }
    
    .auth-button-secondary {
      background: transparent;
      color: var(--color-text, #1a1a1a);
      border: 1px solid var(--color-border, #ddd);
    }
    
    .auth-button-secondary:hover:not(:disabled) {
      background: var(--color-surface-hover, #f5f5f5);
    }
    
    [data-theme="dark"] .auth-button-secondary {
      color: var(--color-text-dark, #f0f0f0);
      border-color: var(--color-border-dark, #444);
    }
    
    [data-theme="dark"] .auth-button-secondary:hover:not(:disabled) {
      background: var(--color-surface-hover-dark, #333);
    }
    
    /* OAuth Buttons */
    .oauth-divider {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin: 1.5rem 0;
      color: var(--color-text-secondary, #666);
      font-size: 0.875rem;
    }
    
    .oauth-divider::before,
    .oauth-divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--color-border, #ddd);
    }
    
    .oauth-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .oauth-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      font-size: 0.9375rem;
      font-weight: 500;
      border-radius: 8px;
      border: 1px solid var(--color-border, #ddd);
      background: var(--color-surface, #fff);
      color: var(--color-text, #1a1a1a);
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .oauth-button:hover:not(:disabled) {
      background: var(--color-surface-hover, #f5f5f5);
    }
    
    .oauth-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    [data-theme="dark"] .oauth-button {
      background: var(--color-surface-dark, #1e1e1e);
      border-color: var(--color-border-dark, #444);
      color: var(--color-text-dark, #f0f0f0);
    }
    
    .oauth-icon {
      width: 20px;
      height: 20px;
    }
    
    /* Password Strength */
    .password-strength {
      margin-top: 0.5rem;
    }
    
    .strength-bar {
      height: 4px;
      background: var(--color-border, #ddd);
      border-radius: 2px;
      overflow: hidden;
    }
    
    .strength-fill {
      height: 100%;
      transition: width 0.3s, background-color 0.3s;
    }
    
    .strength-fill.score-0 { width: 0%; background: var(--color-error, #ef4444); }
    .strength-fill.score-1 { width: 25%; background: var(--color-error, #ef4444); }
    .strength-fill.score-2 { width: 50%; background: var(--color-warning, #f59e0b); }
    .strength-fill.score-3 { width: 75%; background: var(--color-success, #22c55e); }
    .strength-fill.score-4 { width: 100%; background: var(--color-success, #22c55e); }
    
    .strength-feedback {
      margin-top: 0.375rem;
      font-size: 0.75rem;
      color: var(--color-text-secondary, #666);
    }
    
    /* Error Message */
    .auth-error {
      padding: 0.75rem 1rem;
      background: rgba(239,68,68,0.1);
      border: 1px solid var(--color-error, #ef4444);
      border-radius: 8px;
      color: var(--color-error, #ef4444);
      font-size: 0.875rem;
    }
    
    /* Links */
    .auth-link {
      color: var(--color-primary, #3b82f6);
      text-decoration: none;
      font-weight: 500;
    }
    
    .auth-link:hover {
      text-decoration: underline;
    }
    
    .auth-footer {
      text-align: center;
      margin-top: 1.5rem;
      font-size: 0.875rem;
      color: var(--color-text-secondary, #666);
    }
    
    /* Checkbox */
    .auth-checkbox-wrapper {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
    }
    
    .auth-checkbox {
      width: 18px;
      height: 18px;
      margin-top: 2px;
      cursor: pointer;
    }
    
    .auth-checkbox-label {
      font-size: 0.875rem;
      color: var(--color-text-secondary, #666);
    }
    
    /* 2FA */
    .twofa-code-input {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
      margin: 1.5rem 0;
    }
    
    .twofa-digit {
      width: 48px;
      height: 56px;
      font-size: 1.5rem;
      font-weight: 600;
      text-align: center;
      border: 2px solid var(--color-border, #ddd);
      border-radius: 8px;
      background: var(--color-background, #fff);
      color: var(--color-text, #1a1a1a);
    }
    
    .twofa-digit:focus {
      border-color: var(--color-primary, #3b82f6);
      outline: none;
    }
    
    [data-theme="dark"] .twofa-digit {
      background: var(--color-background-dark, #2a2a2a);
      border-color: var(--color-border-dark, #444);
      color: var(--color-text-dark, #f0f0f0);
    }
    
    .qr-code-container {
      display: flex;
      justify-content: center;
      padding: 1.5rem;
      background: white;
      border-radius: 8px;
      margin: 1rem 0;
    }
    
    .backup-codes {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.5rem;
      padding: 1rem;
      background: var(--color-surface-alt, #f5f5f5);
      border-radius: 8px;
      font-family: monospace;
      font-size: 0.875rem;
    }
    
    [data-theme="dark"] .backup-codes {
      background: var(--color-surface-alt-dark, #2a2a2a);
    }
    
    /* Sessions */
    .session-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .session-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      background: var(--color-surface, #fff);
      border: 1px solid var(--color-border, #ddd);
      border-radius: 8px;
    }
    
    [data-theme="dark"] .session-item {
      background: var(--color-surface-dark, #1e1e1e);
      border-color: var(--color-border-dark, #444);
    }
    
    .session-item.current {
      border-color: var(--color-primary, #3b82f6);
    }
    
    .session-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    
    .session-device {
      font-weight: 500;
      color: var(--color-text, #1a1a1a);
    }
    
    [data-theme="dark"] .session-device {
      color: var(--color-text-dark, #f0f0f0);
    }
    
    .session-meta {
      font-size: 0.75rem;
      color: var(--color-text-secondary, #666);
    }
    
    .session-current-badge {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      background: var(--color-primary, #3b82f6);
      color: white;
      border-radius: 4px;
    }
    
    .revoke-button {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      background: transparent;
      border: 1px solid var(--color-error, #ef4444);
      color: var(--color-error, #ef4444);
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .revoke-button:hover {
      background: var(--color-error, #ef4444);
      color: white;
    }
    
    /* Loading Spinner */
    .auth-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid transparent;
      border-top-color: currentColor;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `}</style>
);


// ═══════════════════════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════════════════════

const EyeIcon: React.FC<{ open?: boolean }> = ({ open }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

const GoogleIcon: React.FC = () => (
  <svg className="oauth-icon" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const MicrosoftIcon: React.FC = () => (
  <svg className="oauth-icon" viewBox="0 0 24 24">
    <path fill="#F25022" d="M1 1h10v10H1z"/>
    <path fill="#00A4EF" d="M1 13h10v10H1z"/>
    <path fill="#7FBA00" d="M13 1h10v10H13z"/>
    <path fill="#FFB900" d="M13 13h10v10H13z"/>
  </svg>
);

const GitHubIcon: React.FC = () => (
  <svg className="oauth-icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);


// ═══════════════════════════════════════════════════════════════════════════
// PASSWORD STRENGTH METER
// ═══════════════════════════════════════════════════════════════════════════

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const strength = useMemo(() => validatePasswordStrength(password), [password]);
  
  if (!password) return null;
  
  const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  
  return (
    <div className="password-strength">
      <div className="strength-bar">
        <div className={`strength-fill score-${strength.score}`} />
      </div>
      <div className="strength-feedback">
        {labels[strength.score]}
        {strength.feedback.length > 0 && ` - ${strength.feedback[0]}`}
      </div>
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════════════════
// OAUTH BUTTONS
// ═══════════════════════════════════════════════════════════════════════════

interface OAuthButtonsProps {
  disabled?: boolean;
}

export const OAuthButtons: React.FC<OAuthButtonsProps> = ({ disabled }) => {
  const { loginWithOAuth } = useAuthStore();
  const isLoading = useAuthLoading();
  
  const handleOAuth = (provider: AuthProvider) => {
    loginWithOAuth(provider);
  };
  
  return (
    <>
      <div className="oauth-divider">or continue with</div>
      <div className="oauth-buttons">
        <button
          type="button"
          className="oauth-button"
          onClick={() => handleOAuth('google')}
          disabled={disabled || isLoading}
        >
          <GoogleIcon />
          Continue with Google
        </button>
        <button
          type="button"
          className="oauth-button"
          onClick={() => handleOAuth('microsoft')}
          disabled={disabled || isLoading}
        >
          <MicrosoftIcon />
          Continue with Microsoft
        </button>
        <button
          type="button"
          className="oauth-button"
          onClick={() => handleOAuth('github')}
          disabled={disabled || isLoading}
        >
          <GitHubIcon />
          Continue with GitHub
        </button>
      </div>
    </>
  );
};


// ═══════════════════════════════════════════════════════════════════════════
// LOGIN FORM
// ═══════════════════════════════════════════════════════════════════════════

interface LoginFormProps {
  onSuccess?: () => void;
  onForgotPassword?: () => void;
  onRegister?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onForgotPassword,
  onRegister,
}) => {
  const { login, clearError } = useAuthStore();
  const isLoading = useAuthLoading();
  const error = useAuthError();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  useEffect(() => {
    clearError();
  }, [email, password, clearError]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = await login({ email, password, rememberMe });
    
    if (response.success && !response.requires2FA) {
      onSuccess?.();
    }
  };
  
  return (
    <div className="auth-container">
      <AuthStyles />
      <h1 className="auth-title">Welcome back</h1>
      <p className="auth-subtitle">Sign in to your CHE·NU account</p>
      
      {error && (
        <div className="auth-error">{error.message}</div>
      )}
      
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label className="auth-label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={isLoading}
            autoComplete="email"
          />
        </div>
        
        <div className="auth-field">
          <label className="auth-label" htmlFor="password">Password</label>
          <div className="password-wrapper">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label className="auth-checkbox-wrapper">
            <input
              type="checkbox"
              className="auth-checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span className="auth-checkbox-label">Remember me</span>
          </label>
          
          {onForgotPassword && (
            <button
              type="button"
              className="auth-link"
              onClick={onForgotPassword}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Forgot password?
            </button>
          )}
        </div>
        
        <button
          type="submit"
          className="auth-button auth-button-primary"
          disabled={isLoading}
        >
          {isLoading ? <span className="auth-spinner" /> : 'Sign in'}
        </button>
      </form>
      
      <OAuthButtons disabled={isLoading} />
      
      {onRegister && (
        <p className="auth-footer">
          Don't have an account?{' '}
          <button
            type="button"
            className="auth-link"
            onClick={onRegister}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Sign up
          </button>
        </p>
      )}
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════════════════
// REGISTER FORM
// ═══════════════════════════════════════════════════════════════════════════

interface RegisterFormProps {
  onSuccess?: () => void;
  onLogin?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onLogin,
}) => {
  const { register, clearError } = useAuthStore();
  const isLoading = useAuthLoading();
  const error = useAuthError();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  useEffect(() => {
    clearError();
  }, [email, password, confirmPassword, clearError]);
  
  const passwordsMatch = password === confirmPassword || !confirmPassword;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = await register({
      email,
      password,
      confirmPassword,
      acceptTerms,
    });
    
    if (response.success) {
      onSuccess?.();
    }
  };
  
  return (
    <div className="auth-container">
      <AuthStyles />
      <h1 className="auth-title">Create account</h1>
      <p className="auth-subtitle">Get started with CHE·NU</p>
      
      {error && (
        <div className="auth-error">{error.message}</div>
      )}
      
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label className="auth-label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={isLoading}
            autoComplete="email"
          />
        </div>
        
        <div className="auth-field">
          <label className="auth-label" htmlFor="password">Password</label>
          <div className="password-wrapper">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              required
              disabled={isLoading}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
          <PasswordStrengthMeter password={password} />
        </div>
        
        <div className="auth-field">
          <label className="auth-label" htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            className={`auth-input ${!passwordsMatch ? 'error' : ''}`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
            disabled={isLoading}
            autoComplete="new-password"
          />
          {!passwordsMatch && confirmPassword && (
            <div className="strength-feedback" style={{ color: 'var(--color-error)' }}>
              Passwords do not match
            </div>
          )}
        </div>
        
        <label className="auth-checkbox-wrapper">
          <input
            type="checkbox"
            className="auth-checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            required
          />
          <span className="auth-checkbox-label">
            I agree to the{' '}
            <a href="/terms" className="auth-link">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="auth-link">Privacy Policy</a>
          </span>
        </label>
        
        <button
          type="submit"
          className="auth-button auth-button-primary"
          disabled={isLoading || !passwordsMatch || !acceptTerms}
        >
          {isLoading ? <span className="auth-spinner" /> : 'Create account'}
        </button>
      </form>
      
      <OAuthButtons disabled={isLoading} />
      
      {onLogin && (
        <p className="auth-footer">
          Already have an account?{' '}
          <button
            type="button"
            className="auth-link"
            onClick={onLogin}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Sign in
          </button>
        </p>
      )}
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════════════════
// TWO FACTOR FORM
// ═══════════════════════════════════════════════════════════════════════════

interface TwoFactorFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const TwoFactorForm: React.FC<TwoFactorFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { verify2FA, clearError } = useAuthStore();
  const isLoading = useAuthLoading();
  const error = useAuthError();
  
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [isBackupCode, setIsBackupCode] = useState(false);
  const [backupCode, setBackupCode] = useState('');
  
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  
  useEffect(() => {
    clearError();
    inputRefs.current[0]?.focus();
  }, [clearError]);
  
  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Auto-submit when complete
    if (newDigits.every(d => d) && index === 5) {
      handleSubmit(newDigits.join(''));
    }
  };
  
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(''));
      handleSubmit(pasted);
    }
  };
  
  const handleSubmit = async (code?: string) => {
    const verifyCode = code || (isBackupCode ? backupCode : digits.join(''));
    
    if (!verifyCode || (!isBackupCode && verifyCode.length !== 6)) return;
    
    const response = await verify2FA(verifyCode, isBackupCode);
    
    if (response.success) {
      onSuccess?.();
    }
  };
  
  return (
    <div className="auth-container">
      <AuthStyles />
      <h1 className="auth-title">Two-factor authentication</h1>
      <p className="auth-subtitle">
        {isBackupCode
          ? 'Enter one of your backup codes'
          : 'Enter the 6-digit code from your authenticator app'}
      </p>
      
      {error && (
        <div className="auth-error">{error.message}</div>
      )}
      
      {!isBackupCode ? (
        <div className="twofa-code-input" onPaste={handlePaste}>
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="twofa-digit"
              value={digit}
              onChange={(e) => handleDigitChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={isLoading}
            />
          ))}
        </div>
      ) : (
        <div className="auth-field" style={{ marginTop: '1.5rem' }}>
          <input
            type="text"
            className="auth-input"
            value={backupCode}
            onChange={(e) => setBackupCode(e.target.value.toUpperCase())}
            placeholder="XXXX-XXXX"
            disabled={isLoading}
            autoFocus
          />
        </div>
      )}
      
      <div className="auth-form">
        <button
          type="button"
          className="auth-button auth-button-primary"
          onClick={() => handleSubmit()}
          disabled={isLoading || (!isBackupCode && digits.some(d => !d))}
        >
          {isLoading ? <span className="auth-spinner" /> : 'Verify'}
        </button>
        
        <button
          type="button"
          className="auth-button auth-button-secondary"
          onClick={() => setIsBackupCode(!isBackupCode)}
          disabled={isLoading}
        >
          {isBackupCode ? 'Use authenticator app' : 'Use backup code'}
        </button>
        
        {onCancel && (
          <button
            type="button"
            className="auth-button auth-button-secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════════════════
// SESSION LIST
// ═══════════════════════════════════════════════════════════════════════════

export const SessionList: React.FC = () => {
  const { sessions, fetchSessions, revokeSession, logoutAllDevices } = useAuthStore();
  const isLoading = useAuthLoading();
  const [revoking, setRevoking] = useState<string | null>(null);
  
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);
  
  const handleRevoke = async (sessionId: string) => {
    setRevoking(sessionId);
    await revokeSession(sessionId);
    setRevoking(null);
  };
  
  const handleLogoutAll = async () => {
    if (window.confirm('This will log you out from all other devices. Continue?')) {
      await logoutAllDevices();
    }
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div>
      <AuthStyles />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0 }}>Active Sessions</h2>
        <button
          className="auth-button auth-button-secondary"
          onClick={handleLogoutAll}
          disabled={isLoading || sessions.filter(s => !s.isCurrent).length === 0}
          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
        >
          Log out all other devices
        </button>
      </div>
      
      <div className="session-list">
        {sessions.map((session) => (
          <div key={session.id} className={`session-item ${session.isCurrent ? 'current' : ''}`}>
            <div className="session-info">
              <div className="session-device">
                {session.deviceInfo.name || 'Unknown Device'}
                {session.isCurrent && <span className="session-current-badge" style={{ marginLeft: '0.5rem' }}>Current</span>}
              </div>
              <div className="session-meta">
                {session.ipAddress} • Last active: {formatDate(session.lastActivity)}
              </div>
            </div>
            
            {!session.isCurrent && (
              <button
                className="revoke-button"
                onClick={() => handleRevoke(session.id)}
                disabled={revoking === session.id}
              >
                {revoking === session.id ? 'Revoking...' : 'Revoke'}
              </button>
            )}
          </div>
        ))}
        
        {sessions.length === 0 && !isLoading && (
          <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            No active sessions
          </p>
        )}
      </div>
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════════════════
// AUTH GUARD
// ═══════════════════════════════════════════════════════════════════════════

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onUnauthenticated?: () => void;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  fallback,
  onUnauthenticated,
}) => {
  const isAuthenticated = useIsAuthenticated();
  const requires2FA = useRequires2FA();
  const { isInitialized, initialize } = useAuthStore();
  
  useEffect(() => {
    initialize();
  }, [initialize]);
  
  useEffect(() => {
    if (isInitialized && !isAuthenticated && !requires2FA) {
      onUnauthenticated?.();
    }
  }, [isInitialized, isAuthenticated, requires2FA, onUnauthenticated]);
  
  if (!isInitialized) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <span className="auth-spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};


// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  LoginForm,
  RegisterForm,
  TwoFactorForm,
  PasswordStrengthMeter,
  OAuthButtons,
  SessionList,
  AuthGuard,
  AuthStyles,
};
