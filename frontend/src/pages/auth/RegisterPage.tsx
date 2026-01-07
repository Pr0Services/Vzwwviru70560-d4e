// CHE·NU™ Register Page — User Registration

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores';
import { authService } from '../../services/api';
import { CHENU_COLORS } from '../../types';
import { isValidEmail, isValidPassword } from '../../utils';

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CHENU_COLORS.uiSlate,
    padding: '24px',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    backgroundColor: '#111113',
    borderRadius: '20px',
    padding: '48px 40px',
    border: `1px solid ${CHENU_COLORS.sacredGold}22`,
  },
  logo: {
    textAlign: 'center' as const,
    marginBottom: '8px',
  },
  logoText: {
    fontSize: '40px',
    fontWeight: 'bold',
    color: CHENU_COLORS.sacredGold,
  },
  subtitle: {
    textAlign: 'center' as const,
    color: CHENU_COLORS.ancientStone,
    fontSize: '14px',
    marginBottom: '40px',
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
    fontSize: '12px',
    fontWeight: 600,
    color: CHENU_COLORS.ancientStone,
    textTransform: 'uppercase' as const,
  },
  input: {
    padding: '14px 16px',
    borderRadius: '10px',
    border: `1px solid ${CHENU_COLORS.ancientStone}44`,
    backgroundColor: '#0a0a0b',
    color: CHENU_COLORS.softSand,
    fontSize: '15px',
    outline: 'none',
  },
  button: {
    padding: '16px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: CHENU_COLORS.sacredGold,
    color: '#000',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '8px',
  },
  error: {
    padding: '12px 16px',
    borderRadius: '8px',
    backgroundColor: '#e74c3c22',
    border: '1px solid #e74c3c44',
    color: '#e74c3c',
    fontSize: '14px',
  },
  passwordHints: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
    marginTop: '4px',
  },
  hint: (valid: boolean) => ({
    color: valid ? CHENU_COLORS.jungleEmerald : CHENU_COLORS.ancientStone,
  }),
  footer: {
    marginTop: '32px',
    textAlign: 'center' as const,
    color: CHENU_COLORS.ancientStone,
    fontSize: '14px',
  },
  link: {
    color: CHENU_COLORS.cenoteTurquoise,
    textDecoration: 'none',
    fontWeight: 500,
  },
  terms: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
    textAlign: 'center' as const,
    marginTop: '16px',
    lineHeight: 1.5,
  },
};

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const passwordValidation = isValidPassword(password);
  const passwordsMatch = password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!passwordValidation.valid) {
      setError('Password does not meet requirements');
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.register({ 
        email, 
        password, 
        display_name: displayName 
      });
      login(result.user, result.tokens.access_token, result.tokens.refresh_token);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <span style={styles.logoText}>CHE·NU™</span>
        </div>
        <p style={styles.subtitle}>Create your account</p>

        <form style={styles.form} onSubmit={handleSubmit}>
          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              style={styles.input}
              placeholder="John Doe"
              required
              autoFocus
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="you@example.com"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••••••"
              required
            />
            {password && (
              <div style={styles.passwordHints}>
                <span style={styles.hint(password.length >= 8)}>✓ 8+ characters </span>
                <span style={styles.hint(/[A-Z]/.test(password))}>✓ Uppercase </span>
                <span style={styles.hint(/[a-z]/.test(password))}>✓ Lowercase </span>
                <span style={styles.hint(/[0-9]/.test(password))}>✓ Number</span>
              </div>
            )}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                ...styles.input,
                borderColor: confirmPassword && !passwordsMatch ? '#e74c3c' : undefined,
              }}
              placeholder="••••••••••••"
              required
            />
          </div>

          <button
            type="submit"
            style={{ ...styles.button, opacity: isLoading ? 0.7 : 1 }}
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.terms}>
          By creating an account, you agree to our{' '}
          <Link to="/terms" style={styles.link}>Terms of Service</Link>
          {' '}and{' '}
          <Link to="/privacy" style={styles.link}>Privacy Policy</Link>
        </p>

        <div style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
