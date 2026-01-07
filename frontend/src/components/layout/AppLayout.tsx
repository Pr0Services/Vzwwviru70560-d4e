/**
 * CHE·NU — App Layout
 */

import React from 'react';
import { MainNavigation } from '../navigation/MainNavigation';
import { Header } from '../navigation/Header';
import { NovaPanel } from '../nova/NovaPanel';
import { ToastContainer } from '../notifications/ToastContainer';

const COLORS = { bg: '#0D1210' };

interface AppLayoutProps {
  children: React.ReactNode;
  currentPath: string;
  enabledSpheres: string[];
  notifications: unknown[];
  userName: string;
  userAvatar?: string;
  breadcrumbs: { label: string; path?: string; icon?: string }[];
  novaOpen: boolean;
  novaMinimized: boolean;
  onNavigate: (path: string) => void;
  onNovaOpen: () => void;
  onNovaClose: () => void;
  onNovaMinimize: () => void;
  onNotificationClick: (id: string) => void;
  onProfileClick: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children, currentPath, enabledSpheres, notifications, userName, userAvatar, breadcrumbs,
  novaOpen, novaMinimized, onNavigate, onNovaOpen, onNovaClose, onNovaMinimize, onNotificationClick, onProfileClick,
}) => {
  return (
    <div style={{ minHeight: '100vh', background: COLORS.bg, fontFamily: "'Inter', sans-serif" }}>
      <MainNavigation currentPath={currentPath} enabledSpheres={enabledSpheres} notifications={notifications.filter(n => !n.read).length} onNavigate={onNavigate} onNovaOpen={onNovaOpen} />
      <Header breadcrumbs={breadcrumbs} notifications={notifications} userName={userName} userAvatar={userAvatar} onNavigate={onNavigate} onNotificationClick={onNotificationClick} onProfileClick={onProfileClick} />
      <main style={{ marginLeft: 260, paddingTop: 60, minHeight: 'calc(100vh - 60px)' }}>{children}</main>
      <NovaPanel isOpen={novaOpen} isMinimized={novaMinimized} onClose={onNovaClose} onMinimize={onNovaMinimize} />
      <ToastContainer />
    </div>
  );
};

export default AppLayout;
