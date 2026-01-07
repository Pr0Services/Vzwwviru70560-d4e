/**
 * CHE·NU - Nova Panel for Layout
 * Wrapper simplifié pour AppLayout
 */

import React, { useState } from 'react';
import { NovaPanel as NovaPanelCore } from '../nova/NovaPanel';

interface NovaPanelWrapperProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NovaPanel: React.FC<NovaPanelWrapperProps> = ({ isOpen, onClose }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <NovaPanelCore
      isOpen={isOpen}
      isMinimized={isMinimized}
      onClose={onClose}
      onMinimize={() => setIsMinimized(!isMinimized)}
    />
  );
};

export default NovaPanel;
