/**
 * CHE·NU™ Email Verification Components V72
 * 
 * React components for email verification and password reset:
 * - Email verification page
 * - Password reset request
 * - Password reset form
 * - Email preferences
 * 
 * @version V72.0
 * @phase Phase 2 - Authentication
 */

import React, { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface EmailResponse {
  success: boolean;
  message: string;
  data?: Record<string, any>;
}

interface EmailPreferences {
  marketing: boolean;
  product_updates: boolean;
  security_alerts: boolean;
  login_alerts: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// API CLIENT
// ═══════════════════════════════════════════════════════════════════════════

const API_BASE = '/api/v2/email';

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.detail || 'Request failed');
  }
  
  return data;
}

export const emailAPI = {
  // Verification
  sendVerification: (email: string) =>
    apiRequest<EmailResponse>('/verification/send', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  
  verifyEmail: (token: string) =>
    apiRequest<EmailResponse>('/verification/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),
  
  getVerificationStatus: () =>
    apiRequest<EmailResponse>('/verification/status'),
  
  // Password Reset
  requestPasswordReset: (email: string) =>
    apiRequest<EmailResponse>('/password-reset/request', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  
  verifyResetToken: (token: string) =>
    apiRequest<EmailResponse>('/password-reset/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),
  
  resetPassword: (token: string, newPassword: string) =>
    apiRequest<EmailResponse>('/password-reset/reset', {
      method: 'POST',
      body: JSON.stringify({ token, new_password: newPassword }),
    }),
  
  // Preferences
  getPreferences: () =>
    apiRequest<{ success: boolean; preferences: EmailPreferences }>('/preferences'),
  
  updatePreferences: (preferences: EmailPreferences) =>
    apiRequest<{ success: boolean; preferences: EmailPreferences }>('/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    }),
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTS - EMAIL VERIFICATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Email Verification Banner
 * Shows when user's email is not verified
 */
export const EmailVerificationBanner: React.FC<{
  email: string;
  onResend?: () => void;
}> = ({ email, onResend }) => {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  
  const handleResend = async () => {
    setSending(true);
    setError('');
    
    try {
      await emailAPI.sendVerification(email);
      setSent(true);
      onResend?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send email');
    } finally {
      setSending(false);
    }
  };
  
  return (
    <div style={{
      padding: '12px 16px',
      backgroundColor: '#fef3c7',
      borderBottom: '1px solid #f59e0b',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '8px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '20px' }}>⚠️</span>
        <span style={{ color: '#92400e', fontSize: '14px' }}>
          Please verify your email address ({email})
        </span>
      </div>
      
      {error && (
        <span style={{ color: '#dc2626', fontSize: '14px' }}>{error}</span>
      )}
      
      {sent ? (
        <span style={{ color: '#059669', fontSize: '14px' }}>
          ✓ Verification email sent!
        </span>
      ) : (
        <button
          onClick={handleResend}
          disabled={sending}
          style={{
            padding: '6px 12px',
            backgroundColor: '#f59e0b',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: sending ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            opacity: sending ? 0.7 : 1,
          }}
        >
          {sending ? 'Sending...' : 'Resend verification email'}
        </button>
      )}
    </div>
  );
};

/**
 * Email Verification Page
 * Handles token verification from URL
 */
export const EmailVerificationPage: React.FC<{
  onSuccess?: () => void;
  onError?: (error: string) => void;
}> = ({ onSuccess, onError }) => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    const verifyToken = async () => {
      // Get token from URL
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('No verification token provided');
        onError?.('No verification token provided');
        return;
      }
      
      try {
        const result = await emailAPI.verifyEmail(token);
        setStatus('success');
        setMessage(result.message);
        onSuccess?.();
      } catch (err) {
        setStatus('error');
        const errorMsg = err instanceof Error ? err.message : 'Verification failed';
        setMessage(errorMsg);
        onError?.(errorMsg);
      }
    };
    
    verifyToken();
  }, [onSuccess, onError]);
  
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      backgroundColor: '#f5f5f5',
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '48px',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}>
        {status === 'loading' && (
          <>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid #e5e7eb',
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 24px',
            }} />
            <h2 style={{ margin: '0 0 8px', color: '#1a1a1a' }}>
              Verifying your email...
            </h2>
            <p style={{ color: '#666', margin: 0 }}>
              Please wait a moment
            </p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#d1fae5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '32px',
            }}>
              ✓
            </div>
            <h2 style={{ margin: '0 0 8px', color: '#059669' }}>
              Email Verified!
            </h2>
            <p style={{ color: '#666', margin: '0 0 24px' }}>
              {message}
            </p>
            <a
              href="/login"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: '#3b82f6',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: 500,
              }}
            >
              Continue to Login
            </a>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '32px',
            }}>
              ✗
            </div>
            <h2 style={{ margin: '0 0 8px', color: '#dc2626' }}>
              Verification Failed
            </h2>
            <p style={{ color: '#666', margin: '0 0 24px' }}>
              {message}
            </p>
            <a
              href="/login"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: '#6b7280',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: 500,
              }}
            >
              Back to Login
            </a>
          </>
        )}
      </div>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTS - PASSWORD RESET
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Forgot Password Form
 * Request password reset email
 */
export const ForgotPasswordForm: React.FC<{
  onBack?: () => void;
}> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await emailAPI.requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  };
  
  if (sent) {
    return (
      <div style={{
        maxWidth: '400px',
        margin: '0 auto',
        padding: '48px 24px',
        textAlign: 'center',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#dbeafe',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          fontSize: '32px',
        }}>
          ✉️
        </div>
        <h2 style={{ margin: '0 0 8px', color: '#1a1a1a' }}>
          Check your email
        </h2>
        <p style={{ color: '#666', margin: '0 0 24px' }}>
          If an account exists with <strong>{email}</strong>, we've sent a password reset link.
        </p>
        <p style={{ color: '#888', fontSize: '14px', margin: '0 0 24px' }}>
          Didn't receive the email? Check your spam folder or try again in a few minutes.
        </p>
        <button
          onClick={() => { setSent(false); setEmail(''); }}
          style={{
            padding: '12px 24px',
            backgroundColor: 'transparent',
            color: '#3b82f6',
            border: '1px solid #3b82f6',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          Try another email
        </button>
      </div>
    );
  }
  
  return (
    <div style={{
      maxWidth: '400px',
      margin: '0 auto',
      padding: '48px 24px',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ margin: '0 0 8px', color: '#1a1a1a' }}>
          Forgot your password?
        </h2>
        <p style={{ color: '#666', margin: 0 }}>
          Enter your email and we'll send you a reset link
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{
            padding: '12px',
            backgroundColor: '#fee2e2',
            borderRadius: '8px',
            color: '#dc2626',
            marginBottom: '16px',
            fontSize: '14px',
          }}>
            {error}
          </div>
        )}
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            marginBottom: '6px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#374151',
          }}>
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box',
            }}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !email}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 500,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            marginBottom: '16px',
          }}
        >
          {loading ? 'Sending...' : 'Send reset link'}
        </button>
        
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'transparent',
              color: '#6b7280',
              border: 'none',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            ← Back to login
          </button>
        )}
      </form>
    </div>
  );
};

/**
 * Reset Password Form
 * Set new password with token
 */
export const ResetPasswordForm: React.FC<{
  onSuccess?: () => void;
}> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenEmail, setTokenEmail] = useState('');
  
  // Get token from URL
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token') || '';
  
  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError('No reset token provided');
        setValidating(false);
        return;
      }
      
      try {
        const result = await emailAPI.verifyResetToken(token);
        setTokenEmail(result.data?.email || '');
        setValidating(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Invalid or expired token');
        setValidating(false);
      }
    };
    
    validateToken();
  }, [token]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await emailAPI.resetPassword(token, password);
      setSuccess(true);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset failed');
    } finally {
      setLoading(false);
    }
  };
  
  // Loading state
  if (validating) {
    return (
      <div style={{
        maxWidth: '400px',
        margin: '0 auto',
        padding: '48px 24px',
        textAlign: 'center',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #e5e7eb',
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 24px',
        }} />
        <p style={{ color: '#666' }}>Validating reset link...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
  
  // Invalid token
  if (error && !password) {
    return (
      <div style={{
        maxWidth: '400px',
        margin: '0 auto',
        padding: '48px 24px',
        textAlign: 'center',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#fee2e2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          fontSize: '32px',
        }}>
          ✗
        </div>
        <h2 style={{ margin: '0 0 8px', color: '#dc2626' }}>
          Invalid Reset Link
        </h2>
        <p style={{ color: '#666', margin: '0 0 24px' }}>
          {error}
        </p>
        <a
          href="/forgot-password"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#3b82f6',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 500,
          }}
        >
          Request new reset link
        </a>
      </div>
    );
  }
  
  // Success
  if (success) {
    return (
      <div style={{
        maxWidth: '400px',
        margin: '0 auto',
        padding: '48px 24px',
        textAlign: 'center',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#d1fae5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          fontSize: '32px',
        }}>
          ✓
        </div>
        <h2 style={{ margin: '0 0 8px', color: '#059669' }}>
          Password Reset!
        </h2>
        <p style={{ color: '#666', margin: '0 0 24px' }}>
          Your password has been successfully reset.
        </p>
        <a
          href="/login"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#3b82f6',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 500,
          }}
        >
          Continue to Login
        </a>
      </div>
    );
  }
  
  // Reset form
  return (
    <div style={{
      maxWidth: '400px',
      margin: '0 auto',
      padding: '48px 24px',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ margin: '0 0 8px', color: '#1a1a1a' }}>
          Reset your password
        </h2>
        {tokenEmail && (
          <p style={{ color: '#666', margin: 0 }}>
            for <strong>{tokenEmail}</strong>
          </p>
        )}
      </div>
      
      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{
            padding: '12px',
            backgroundColor: '#fee2e2',
            borderRadius: '8px',
            color: '#dc2626',
            marginBottom: '16px',
            fontSize: '14px',
          }}>
            {error}
          </div>
        )}
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            marginBottom: '6px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#374151',
          }}>
            New password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            placeholder="••••••••"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box',
            }}
          />
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#888' }}>
            Must be at least 8 characters
          </p>
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            marginBottom: '6px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#374151',
          }}>
            Confirm new password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="••••••••"
            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${confirmPassword && password !== confirmPassword ? '#dc2626' : '#d1d5db'}`,
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box',
            }}
          />
          {confirmPassword && password !== confirmPassword && (
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#dc2626' }}>
              Passwords do not match
            </p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={loading || !password || password !== confirmPassword}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 500,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading || !password || password !== confirmPassword ? 0.7 : 1,
          }}
        >
          {loading ? 'Resetting...' : 'Reset password'}
        </button>
      </form>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTS - EMAIL PREFERENCES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Email Preferences Settings
 */
export const EmailPreferencesSettings: React.FC = () => {
  const [preferences, setPreferences] = useState<EmailPreferences>({
    marketing: true,
    product_updates: true,
    security_alerts: true,
    login_alerts: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  
  // Load preferences
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const result = await emailAPI.getPreferences();
        setPreferences(result.preferences);
      } catch (err) {
        setError('Failed to load preferences');
      } finally {
        setLoading(false);
      }
    };
    
    loadPreferences();
  }, []);
  
  const handleToggle = async (key: keyof EmailPreferences) => {
    // Security alerts cannot be disabled
    if (key === 'security_alerts') return;
    
    const newPreferences = {
      ...preferences,
      [key]: !preferences[key],
    };
    
    setPreferences(newPreferences);
    setSaving(true);
    setSaved(false);
    setError('');
    
    try {
      await emailAPI.updatePreferences(newPreferences);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError('Failed to save preferences');
      // Revert
      setPreferences(preferences);
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: '#666' }}>
        Loading preferences...
      </div>
    );
  }
  
  const preferencesConfig = [
    {
      key: 'security_alerts' as const,
      label: 'Security alerts',
      description: 'Important security notifications (cannot be disabled)',
      disabled: true,
    },
    {
      key: 'login_alerts' as const,
      label: 'Login alerts',
      description: 'Get notified when someone logs into your account',
      disabled: false,
    },
    {
      key: 'product_updates' as const,
      label: 'Product updates',
      description: 'New features and improvements',
      disabled: false,
    },
    {
      key: 'marketing' as const,
      label: 'Marketing emails',
      description: 'Tips, offers, and news from CHE·NU',
      disabled: false,
    },
  ];
  
  return (
    <div style={{ maxWidth: '600px' }}>
      <h3 style={{ margin: '0 0 8px', color: '#1a1a1a' }}>
        Email Preferences
      </h3>
      <p style={{ margin: '0 0 24px', color: '#666', fontSize: '14px' }}>
        Choose which emails you'd like to receive
      </p>
      
      {error && (
        <div style={{
          padding: '12px',
          backgroundColor: '#fee2e2',
          borderRadius: '8px',
          color: '#dc2626',
          marginBottom: '16px',
          fontSize: '14px',
        }}>
          {error}
        </div>
      )}
      
      {saved && (
        <div style={{
          padding: '12px',
          backgroundColor: '#d1fae5',
          borderRadius: '8px',
          color: '#059669',
          marginBottom: '16px',
          fontSize: '14px',
        }}>
          ✓ Preferences saved
        </div>
      )}
      
      <div style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        overflow: 'hidden',
      }}>
        {preferencesConfig.map((pref, index) => (
          <div
            key={pref.key}
            style={{
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: index < preferencesConfig.length - 1 ? '1px solid #e5e7eb' : 'none',
              opacity: pref.disabled ? 0.7 : 1,
            }}
          >
            <div>
              <div style={{ fontWeight: 500, color: '#1a1a1a', marginBottom: '2px' }}>
                {pref.label}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                {pref.description}
              </div>
            </div>
            
            <button
              onClick={() => handleToggle(pref.key)}
              disabled={pref.disabled || saving}
              style={{
                width: '48px',
                height: '28px',
                borderRadius: '14px',
                border: 'none',
                backgroundColor: preferences[pref.key] ? '#3b82f6' : '#d1d5db',
                position: 'relative',
                cursor: pref.disabled ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#fff',
                position: 'absolute',
                top: '2px',
                left: preferences[pref.key] ? '22px' : '2px',
                transition: 'left 0.2s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  EmailVerificationBanner,
  EmailVerificationPage,
  ForgotPasswordForm,
  ResetPasswordForm,
  EmailPreferencesSettings,
  emailAPI,
};
