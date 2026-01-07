/**
 * CHE·NU - Dropdown Menu Component
 */

import React, { useState, useRef, useEffect } from 'react';

interface DropdownMenuProps {
  children: React.ReactNode;
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  className?: string;
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

interface DropdownMenuLabelProps {
  children: React.ReactNode;
  className?: string;
}

interface DropdownMenuSeparatorProps {
  className?: string;
}

const DropdownMenuContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({ open: false, setOpen: () => {} });

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
};

export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({ 
  children, 
  asChild 
}) => {
  const { open, setOpen } = React.useContext(DropdownMenuContext);
  
  const handleClick = () => setOpen(!open);
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: handleClick
    });
  }
  
  return (
    <button onClick={handleClick} style={{ cursor: 'pointer' }}>
      {children}
    </button>
  );
};

export const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({ 
  children, 
  align = 'start',
  className 
}) => {
  const { open, setOpen } = React.useContext(DropdownMenuContext);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, setOpen]);
  
  if (!open) return null;
  
  const alignStyles = {
    start: { left: 0 },
    center: { left: '50%', transform: 'translateX(-50%)' },
    end: { right: 0 }
  };
  
  return (
    <div
      ref={ref}
      className={className}
      style={{
        position: 'absolute',
        top: '100%',
        marginTop: '4px',
        minWidth: '180px',
        backgroundColor: '#1f2937',
        border: '1px solid #374151',
        borderRadius: '8px',
        padding: '4px',
        zIndex: 50,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
        ...alignStyles[align]
      }}
    >
      {children}
    </div>
  );
};

export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({ 
  children, 
  onClick,
  disabled,
  className 
}) => {
  const { setOpen } = React.useContext(DropdownMenuContext);
  
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
      setOpen(false);
    }
  };
  
  return (
    <div
      className={className}
      onClick={handleClick}
      style={{
        padding: '8px 12px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        borderRadius: '4px',
        color: disabled ? '#6b7280' : '#f9fafb',
        fontSize: '14px',
        opacity: disabled ? 0.5 : 1,
        transition: 'background-color 0.15s'
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.backgroundColor = '#374151';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {children}
    </div>
  );
};

export const DropdownMenuLabel: React.FC<DropdownMenuLabelProps> = ({ 
  children,
  className 
}) => (
  <div
    className={className}
    style={{
      padding: '8px 12px',
      color: '#9ca3af',
      fontSize: '12px',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }}
  >
    {children}
  </div>
);

export const DropdownMenuSeparator: React.FC<DropdownMenuSeparatorProps> = ({ 
  className 
}) => (
  <div
    className={className}
    style={{
      height: '1px',
      backgroundColor: '#374151',
      margin: '4px 0'
    }}
  />
);

export default DropdownMenu;
