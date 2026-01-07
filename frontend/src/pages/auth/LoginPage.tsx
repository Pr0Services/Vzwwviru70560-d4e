// CHE·NU™ Login Page — Authentication

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores';
import { authService } from '../../services/api';
import { CHENU_COLORS } from '../../types';

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
    boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
  },
  logo: {
    textAlign: 'center' as const,
    marginBottom: '8px',
  },
  logoText: {
    fontSize: '40px',
    fontWeight: 'bold',
    color: CHENU_COLORS.sacredGold,
    letterSpacing: '2px',
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
    letterSpacing: '0.5px',
  },
  input: {
    padding: '14px 16px',
    borderRadius: '10px',
    border: `1px solid ${CHENU_COLORS.ancientStone}44`,
    backgroundColor: '#0a0a0b',
    color: CHENU_COLORS.softSand,
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
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
    transition: 'all 0.2s ease',
  },
  error: {
    padding: '12px 16px',
    borderRadius: '8px',
    backgroundColor: '#e74c3c22',
    border: '1px solid #e74c3c44',
    color: '#e74c3c',
    fontSize: '14px',
  },
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
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    margin: '24px 0',
    color: CHENU_COLORS.ancientStone,
    fontSize: '12px',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: CHENU_COLORS.ancientStone + '33',
  },
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await authService.login({ email, password });
      login(result.user, result.tokens.access_token, result.tokens.refresh_token);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
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
        <p style={styles.subtitle}>Governed Intelligence Operating System</p>

        <form style={styles.form} onSubmit={handleSubmit}>
          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="you@example.com"
              required
              autoFocus
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
          </div>

          <div style={{ textAlign: 'right' }}>
            <Link to="/forgot-password" style={{ ...styles.link, fontSize: '13px' }}>
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            style={{ ...styles.button, opacity: isLoading ? 0.7 : 1 }}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span>OR</span>
          <div style={styles.dividerLine} />
        </div>

        <div style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
