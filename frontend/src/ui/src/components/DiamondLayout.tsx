/**
 * CHE·NU™ — Diamond Layout Principal
 * 
 * Layout qui assemble les 4 Hubs:
 * - HUB CENTER (top): Logo, contexte, gouvernance
 * - HUB LEFT: Communication (Nova, Agents, Messages, Email)
 * - HUB RIGHT: Workspace (Documents, Browser, Projets)
 * - HUB BOTTOM: Navigation (10 Sphères, Explorer, Search, History)
 * 
 * Architecture Patent: Multi-Hub permanent
 */

'use client';

import React from 'react';
import { HubCenter } from './hubs/HubCenter';
import { HubCommunication } from './hubs/HubCommunication';
import { HubNavigation } from './hubs/HubNavigation';
import { HubWorkspace } from './hubs/HubWorkspace';

interface DiamondLayoutProps {
  children?: React.ReactNode;
}

export function DiamondLayout({ children }: DiamondLayoutProps) {
  return (
    <div className="chenu-diamond-layout h-screen w-screen flex flex-col bg-[#1E1F22] overflow-hidden">
      {/* ═══════════════════════════════════════════════════════════════
          HUB CENTER — Top Bar (60px)
          Logo, contexte actuel, état système, indicateurs gouvernance
          TOUJOURS VISIBLE
          ═══════════════════════════════════════════════════════════════ */}
      <HubCenter />

      {/* ═══════════════════════════════════════════════════════════════
          MAIN AREA — Left + Right Hubs
          Communication (280px) | Workspace (flex-1)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex overflow-hidden">
        {/* HUB LEFT — Communication (280px)
            Nova, Agents, Messages, Email
            NO AI EXECUTION HERE */}
        <HubCommunication />

        {/* HUB RIGHT — Workspace (flex-1)
            Documents, Browser, Projets
            ALL AI EXECUTION HAPPENS HERE via Governed Pipeline */}
        <HubWorkspace />
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          HUB BOTTOM — Navigation Bar (120-200px)
          10 Sphères, Explorer, Search, History, XR Toggle
          TOUJOURS VISIBLE
          ═══════════════════════════════════════════════════════════════ */}
      <HubNavigation />
    </div>
  );
}

/**
 * Version Mobile du Diamond Layout
 * 
 * Sur mobile:
 * - Hub Center = Header permanent (56px)
 * - Hubs collapse en tabs
 * - Communication toujours accessible
 * - Workspace full-screen quand actif
 * - Navigation contextuelle (bottom tab bar)
 */
export function DiamondLayoutMobile() {
  const [activeHub, setActiveHub] = React.useState<'communication' | 'navigation' | 'workspace'>('navigation');

  return (
    <div className="chenu-diamond-mobile h-screen w-screen flex flex-col bg-[#1E1F22] overflow-hidden">
      {/* Hub Center Mobile — Header permanent */}
      <div className="flex-shrink-0">
        {/* Importer HubCenterMobile ici */}
      </div>

      {/* Main Content — Un seul hub visible à la fois */}
      <div className="flex-1 overflow-hidden">
        {activeHub === 'communication' && (
          <div className="h-full">
            {/* HubCommunication adapté mobile */}
          </div>
        )}
        
        {activeHub === 'navigation' && (
          <div className="h-full">
            {/* HubNavigation adapté mobile */}
          </div>
        )}
        
        {activeHub === 'workspace' && (
          <div className="h-full">
            {/* HubWorkspace adapté mobile - FULL SCREEN */}
          </div>
        )}
      </div>

      {/* Bottom Tab Bar (60px) */}
      <div className="flex-shrink-0 h-[60px] bg-[#1A1B1E] border-t border-[#3A3B3F]">
        <div className="flex h-full">
          {[
            { id: 'communication' as const, emoji: '💬', label: 'Communication' },
            { id: 'navigation' as const, emoji: '🧭', label: 'Navigation' },
            { id: 'workspace' as const, emoji: '💼', label: 'Workspace' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveHub(tab.id)}
              className={`
                flex-1 flex flex-col items-center justify-center gap-0.5
                transition-colors
                ${activeHub === tab.id 
                  ? 'text-[#D8B26A]' 
                  : 'text-[#8D8371]'
                }
              `}
            >
              <span className="text-xl">{tab.emoji}</span>
              <span className="text-[10px]">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DiamondLayout;
