/**
 * CHE·NU™ - Command Palette
 */
import React, { useState } from 'react';

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  return isOpen ? <div className="command-palette">Cmd+K</div> : null;
};
