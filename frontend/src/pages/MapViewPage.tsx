// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU™ — MAP VIEW PAGE
// Page principale avec la vue 360° du Campus Ceiba
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CeibaMapView360, { Sphere, SPHERES } from '../components/navigation/CeibaMapView360';

const MapViewPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSphereSelect = useCallback((sphere: Sphere) => {
    console.log('Sphere selected:', sphere.name);
    // La navigation est gérée dans le composant CeibaMapView360
  }, []);

  const handleNovaSelect = useCallback(() => {
    console.log('Nova selected');
    // La navigation est gérée dans le composant CeibaMapView360
  }, []);

  return (
    <div style={styles.page}>
      {/* Header avec retour */}
      <header style={styles.header}>
        <button 
          style={styles.backBtn}
          onClick={() => navigate(-1)}
        >
          ← Retour
        </button>
        <div style={styles.titleContainer}>
          <h1 style={styles.title}>CHE·NU</h1>
          <span style={styles.subtitle}>CAMPUS MAP</span>
        </div>
        <div style={styles.spacer} />
      </header>

      {/* Map View 360 */}
      <CeibaMapView360
        onSphereSelect={handleSphereSelect}
        onNovaSelect={handleNovaSelect}
        autoRotate={false}
        showLegend={true}
      />

      {/* Instructions */}
      <div style={styles.instructions}>
        <span style={styles.instructionIcon}>🖱️</span>
        <span>Glissez pour tourner</span>
        <span style={styles.separator}>•</span>
        <span style={styles.instructionIcon}>👆</span>
        <span>Cliquez sur une sphère pour l'explorer</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    position: 'relative',
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: '15px 25px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'linear-gradient(180deg, rgba(3,5,8,0.95) 0%, transparent 100%)',
    zIndex: 150,
    pointerEvents: 'none',
  },
  backBtn: {
    padding: '8px 16px',
    background: 'rgba(30, 35, 45, 0.9)',
    border: '1px solid rgba(216, 178, 106, 0.3)',
    borderRadius: 20,
    color: '#D8B26A',
    fontSize: '0.75rem',
    fontWeight: 500,
    cursor: 'pointer',
    pointerEvents: 'auto',
    backdropFilter: 'blur(10px)',
  },
  titleContainer: {
    textAlign: 'center',
  },
  title: {
    fontSize: '1.3rem',
    fontWeight: 300,
    letterSpacing: '0.4em',
    color: '#D8B26A',
    margin: 0,
    textShadow: '0 0 30px rgba(216, 178, 106, 0.5)',
  },
  subtitle: {
    fontSize: '0.6rem',
    color: '#8D8371',
    letterSpacing: '0.2em',
  },
  spacer: {
    width: 80,
  },
  instructions: {
    position: 'absolute',
    bottom: 30,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 25px',
    background: 'rgba(15, 20, 30, 0.85)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(216, 178, 106, 0.2)',
    borderRadius: 25,
    fontSize: '0.75rem',
    color: '#8D8371',
    zIndex: 90,
  },
  instructionIcon: {
    color: '#D8B26A',
  },
  separator: {
    opacity: 0.5,
  },
};

export default MapViewPage;
