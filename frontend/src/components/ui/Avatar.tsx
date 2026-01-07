/**
 * CHE·NU — Avatar Component
 */

import React from 'react';

const COLORS = {
  sage: '#3F7249',
  sand: '#D8B26A',
  border: '#2A3530',
};

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away' | 'busy';
}

const sizeMap = {
  sm: 28,
  md: 36,
  lg: 48,
  xl: 64,
};

const statusColors = {
  online: '#4ADE80',
  offline: '#888888',
  away: '#F39C12',
  busy: '#FF6B6B',
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  status,
}) => {
  const dimension = sizeMap[size];
  const initials = name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div style={{
        width: dimension,
        height: dimension,
        borderRadius: '50%',
        background: src 
          ? `url(${src}) center/cover`
          : `linear-gradient(135deg, ${COLORS.sage} 0%, ${COLORS.sand} 100%)`,
        border: `2px solid ${COLORS.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: dimension * 0.4,
        fontWeight: 600,
      }}>
        {!src && initials}
      </div>
      {status && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: dimension * 0.3,
          height: dimension * 0.3,
          borderRadius: '50%',
          background: statusColors[status],
          border: '2px solid #151A18',
        }} />
      )}
    </div>
  );
};

export default Avatar;
