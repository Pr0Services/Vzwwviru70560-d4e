/**
 * CHE·NU - XR Scene Card List
 * Liste des scènes XR sous forme de cartes
 */

import React from 'react';

interface XRScene {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
}

interface XRSceneCardListProps {
  scenes?: XRScene[];
  onSelect?: (scene: XRScene) => void;
}

export const XRSceneCardList: React.FC<XRSceneCardListProps> = ({
  scenes = [],
  onSelect
}) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '16px',
      padding: '16px'
    }}>
      {scenes.map(scene => (
        <div
          key={scene.id}
          onClick={() => onSelect?.(scene)}
          style={{
            padding: '16px',
            backgroundColor: '#374151',
            borderRadius: '12px',
            cursor: 'pointer'
          }}
        >
          <div style={{ color: '#f9fafb', fontWeight: 500 }}>{scene.name}</div>
          {scene.description && (
            <div style={{ color: '#9ca3af', fontSize: '13px', marginTop: '4px' }}>
              {scene.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default XRSceneCardList;
