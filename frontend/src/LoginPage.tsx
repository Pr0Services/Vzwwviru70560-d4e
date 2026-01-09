/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V75 — LOGIN PAGE
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { Navigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    
    if (!email || !password) {
      setLocalError('Veuillez remplir tous les champs');
      return;
    }
    
    try {
      await login(email, password);
    } catch (err: any) {
      setLocalError(err.message || 'Erreur de connexion');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%)',
      padding: '1rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '1rem',
        border: '1px solid rgba(216, 178, 106, 0.3)',
        padding: '2rem',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>🔱</div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: '#D8B26A',
            margin: 0
          }}>
            CHE·NU™
          </h1>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.6)', 
            marginTop: '0.5rem',
            fontSize: '0.875rem'
          }}>
            Governed Intelligence Operating System
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Error Display */}
          {(localError || error) && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '0.5rem',
              padding: '0.75rem 1rem',
              marginBottom: '1rem',
              color: '#ef4444',
              fontSize: '0.875rem'
            }}>
              ⚠️ {localError || error}
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '0.5rem',
              fontSize: '0.875rem'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jo@chenu.dev"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '0.5rem',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '0.5rem',
              fontSize: '0.875rem'
            }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '0.5rem',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.875rem 1rem',
              background: isLoading 
                ? 'rgba(216, 178, 106, 0.5)' 
                : 'linear-gradient(135deg, #D8B26A 0%, #B8963A 100%)',
              border: 'none',
              borderRadius: '0.5rem',
              color: '#1a1a2e',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: isLoading ? 'wait' : 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
          >
            {isLoading ? '⏳ Connexion...' : '🔐 Se connecter'}
          </button>
        </form>

        {/* Dev Hint */}
        <div style={{
          marginTop: '1.5rem',
          padding: '0.75rem 1rem',
          background: 'rgba(216, 178, 106, 0.1)',
          border: '1px solid rgba(216, 178, 106, 0.2)',
          borderRadius: '0.5rem',
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.6)',
          textAlign: 'center'
        }}>
          💡 Mode Dev: Utilisez n'importe quel email/mot de passe
        </div>

        {/* Governance Footer */}
        <div style={{
          marginTop: '2rem',
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.4)',
          fontSize: '0.75rem'
        }}>
          🛡️ GOUVERNANCE {'>'} EXÉCUTION
          <br />
          <span style={{ color: '#D8B26A' }}>V75</span> — © 2025 Pro Service
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
