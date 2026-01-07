/**
 * CHE·NU - XR Scene List Panel
 * Panneau latéral liste des scènes
 */

import React from 'react';

interface XRSceneListPanelProps {
  onSceneSelect?: (sceneId: string) => void;
}

export const XRSceneListPanel: React.FC<XRSceneListPanelProps> = ({
  onSceneSelect
}) => {
  return (
    <div style={{
      width: '280px',
      backgroundColor: '#1f2937',
      padding: '16px',
      borderRadius: '8px'
    }}>
      <h3 style={{ color: '#f9fafb', marginBottom: '12px' }}>Scènes XR</h3>
      <div style={{ color: '#9ca3af', fontSize: '13px' }}>
        Liste des scènes disponibles
      </div>
    </div>
  );
};

export default XRSceneListPanel;
