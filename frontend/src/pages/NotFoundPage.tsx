// CHE·NU™ Not Found Page — 404 Error

import React from 'react';
import { Link } from 'react-router-dom';
import { CHENU_COLORS } from '../types';

const NotFoundPage: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: CHENU_COLORS.uiSlate,
      padding: '24px',
      textAlign: 'center',
    }}>
      <div style={{ marginBottom: '24px' }}>
        <span style={{ fontSize: '80px' }}>🔍</span>
      </div>
      
      <h1 style={{
        fontSize: '120px',
        fontWeight: 'bold',
        color: CHENU_COLORS.sacredGold,
        margin: 0,
        lineHeight: 1,
      }}>
        404
      </h1>
      
      <h2 style={{
        fontSize: '24px',
        fontWeight: 600,
        color: CHENU_COLORS.softSand,
        marginTop: '16px',
        marginBottom: '8px',
      }}>
        Page Not Found
      </h2>
      
      <p style={{
        color: CHENU_COLORS.ancientStone,
        fontSize: '16px',
        maxWidth: '400px',
        marginBottom: '32px',
      }}>
        The page you're looking for doesn't exist or has been moved. 
        Let's get you back on track.
      </p>

      <div style={{ display: 'flex', gap: '16px' }}>
        <Link
          to="/"
          style={{
            padding: '14px 28px',
            borderRadius: '10px',
            backgroundColor: CHENU_COLORS.sacredGold,
            color: '#000',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '15px',
            transition: 'all 0.2s ease',
          }}
        >
          Go to Dashboard
        </Link>
        
        <Link
          to="/sphere/personal"
          style={{
            padding: '14px 28px',
            borderRadius: '10px',
            backgroundColor: 'transparent',
            border: `1px solid ${CHENU_COLORS.ancientStone}44`,
            color: CHENU_COLORS.softSand,
            textDecoration: 'none',
            fontWeight: 500,
            fontSize: '15px',
            transition: 'all 0.2s ease',
          }}
        >
          Personal Sphere
        </Link>
      </div>

      <div style={{
        marginTop: '64px',
        padding: '20px',
        backgroundColor: '#111113',
        borderRadius: '12px',
        border: `1px solid ${CHENU_COLORS.ancientStone}22`,
        maxWidth: '500px',
      }}>
        <p style={{ color: CHENU_COLORS.cenoteTurquoise, fontSize: '14px', marginBottom: '8px' }}>
          💡 Looking for something specific?
        </p>
        <p style={{ color: CHENU_COLORS.ancientStone, fontSize: '13px' }}>
          Try navigating through your spheres using the sidebar, or ask Nova for help finding what you need.
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
