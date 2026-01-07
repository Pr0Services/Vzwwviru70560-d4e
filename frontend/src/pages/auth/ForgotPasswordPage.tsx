// CHE·NU™ Forgot Password Page

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CHENU_COLORS } from '../../types';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitted(true);
    setIsLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: CHENU_COLORS.uiSlate,
      padding: '24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: '#111113',
        borderRadius: '20px',
        padding: '48px 40px',
        border: `1px solid ${CHENU_COLORS.sacredGold}22`,
      }}>
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '40px', fontWeight: 'bold', color: CHENU_COLORS.sacredGold }}>
            CHE·NU™
          </span>
        </div>
        <p style={{ textAlign: 'center', color: CHENU_COLORS.ancientStone, fontSize: '14px', marginBottom: '40px' }}>
          Reset your password
        </p>

        {isSubmitted ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
            <h3 style={{ color: CHENU_COLORS.softSand, marginBottom: '12px' }}>Check your email</h3>
            <p style={{ color: CHENU_COLORS.ancientStone, fontSize: '14px', marginBottom: '24px' }}>
              We've sent password reset instructions to {email}
            </p>
            <Link to="/login" style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: CHENU_COLORS.sacredGold,
              color: '#000',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600,
            }}>
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: CHENU_COLORS.ancientStone,
                marginBottom: '8px',
                textTransform: 'uppercase',
              }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: `1px solid ${CHENU_COLORS.ancientStone}44`,
                  backgroundColor: '#0a0a0b',
                  color: CHENU_COLORS.softSand,
                  fontSize: '15px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                placeholder="you@example.com"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: CHENU_COLORS.sacredGold,
                color: '#000',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <Link to="/login" style={{
                color: CHENU_COLORS.cenoteTurquoise,
                textDecoration: 'none',
                fontSize: '14px',
              }}>
                ← Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
