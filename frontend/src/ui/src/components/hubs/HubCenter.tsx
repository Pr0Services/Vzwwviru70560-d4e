/**
 * CHE·NU™ — Hub Center Component
 * 
 * Le Hub Center est TOUJOURS VISIBLE et contient:
 * - Logo CHE·NU
 * - Contexte actuel (sphère / projet / thread)
 * - État système
 * - Indicateurs de gouvernance
 * 
 * ⚠️ NOT a content area - purely informational
 */

'use client';

import React from 'react';
import { useChenuStore } from '../../hooks/useChenuStore';
import { XRModeToggle } from '../XRModeToggle';
import { getSphereById } from '../../config/spheres.config';

interface HubCenterProps {
  className?: string;
}

export function HubCenter({ className = '' }: HubCenterProps) {
  const { 
    selectedSphereId, 
    hubCenter,
    pipelineStage 
  } = useChenuStore();
  
  const currentSphere = getSphereById(selectedSphereId as any);
  const isPipelineActive = pipelineStage !== 'IDLE' && pipelineStage !== 'COMPLETED' && pipelineStage !== 'FAILED';

  return (
    <header 
      className={`
        hub-center
        h-[60px] 
        bg-gradient-to-r from-[#1E1F22] via-[#2A2B2F] to-[#1E1F22]
        border-b border-[#3A3B3F]
        flex items-center justify-between 
        px-4
        ${className}
      `}
    >
      {/* ═══════════════════════════════════════════════════════════════
          LOGO CHE·NU — Toujours visible
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-3">
        <div 
          className="
            w-10 h-10 
            rounded-xl 
            bg-gradient-to-br from-[#D8B26A] to-[#8D8371] 
            flex items-center justify-center
            shadow-lg shadow-[#D8B26A]/20
            cursor-pointer
            hover:scale-105 transition-transform
          "
          title="CHE·NU™ — Governed Intelligence OS"
        >
          <span className="text-white font-bold text-sm tracking-tight">C·N</span>
        </div>
        <div className="hidden sm:flex flex-col">
          <span className="font-semibold text-lg text-[#E9E4D6] leading-tight">CHE·NU</span>
          <span className="text-[10px] text-[#8D8371] uppercase tracking-wider">Governed AI</span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          CONTEXTE ACTUEL — Sphère / Projet / Thread
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-4">
        {/* Sphère Active */}
        {currentSphere && (
          <div 
            className="
              flex items-center gap-2 
              px-3 py-1.5 
              rounded-lg
              border border-opacity-30
              cursor-pointer
              hover:bg-opacity-30 transition-colors
            "
            style={{ 
              backgroundColor: `${currentSphere.color}15`,
              borderColor: currentSphere.color,
            }}
          >
            <span className="text-lg">{currentSphere.emoji}</span>
            <div className="flex flex-col">
              <span 
                className="font-medium text-sm leading-tight"
                style={{ color: currentSphere.color }}
              >
                {currentSphere.nameFr}
              </span>
              {hubCenter.currentProjectId && (
                <span className="text-[10px] text-[#8D8371]">
                  Projet: {hubCenter.currentProjectId.slice(0, 8)}...
                </span>
              )}
            </div>
          </div>
        )}

        {/* Séparateur */}
        <div className="w-px h-8 bg-[#3A3B3F]" />

        {/* État Système */}
        <div 
          className={`
            flex items-center gap-2 
            px-3 py-1.5 
            rounded-lg
            ${hubCenter.systemStatus === 'ok' 
              ? 'bg-green-500/10' 
              : hubCenter.systemStatus === 'warning'
              ? 'bg-yellow-500/10'
              : 'bg-red-500/10'
            }
          `}
        >
          <div 
            className={`
              w-2 h-2 rounded-full 
              ${hubCenter.systemStatus === 'ok' 
                ? 'bg-green-500 animate-pulse' 
                : hubCenter.systemStatus === 'warning'
                ? 'bg-yellow-500 animate-pulse'
                : 'bg-red-500 animate-pulse'
              }
            `} 
          />
          <span 
            className={`
              text-xs font-medium
              ${hubCenter.systemStatus === 'ok' 
                ? 'text-green-400' 
                : hubCenter.systemStatus === 'warning'
                ? 'text-yellow-400'
                : 'text-red-400'
              }
            `}
          >
            {hubCenter.systemStatus === 'ok' ? 'Système OK' : 
             hubCenter.systemStatus === 'warning' ? 'Attention' : 'Erreur'}
          </span>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            INDICATEURS GOUVERNANCE
            ═══════════════════════════════════════════════════════════════ */}
        <div className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-[#2A2B2F] rounded-lg">
          {/* Gouverné */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px]">🔒</span>
            <span className="text-[10px] text-[#8D8371]">Gouverné</span>
          </div>
          
          {/* Tokens */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px]">📊</span>
            <span className="text-[10px] text-[#8D8371]">
              {hubCenter.governanceIndicators.tokensUsed.toLocaleString()} tokens
            </span>
          </div>

          {/* Budget */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px]">💰</span>
            <span className="text-[10px] text-[#D8B26A]">
              {hubCenter.governanceIndicators.budgetRemaining.toLocaleString()} restants
            </span>
          </div>

          {/* Pipeline Active */}
          {isPipelineActive && (
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] text-blue-400">
                Pipeline: {pipelineStage}
              </span>
            </div>
          )}

          {/* Scope Lock */}
          {hubCenter.governanceIndicators.scopeLock && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px]">🎯</span>
              <span className="text-[10px] text-purple-400">
                {hubCenter.governanceIndicators.scopeLock}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          ACTIONS — XR Mode + User Menu
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-3">
        {/* XR Mode Toggle */}
        <XRModeToggle />
        
        {/* Notifications */}
        <button 
          className="
            w-9 h-9 
            rounded-full 
            bg-[#2A2B2F] 
            flex items-center justify-center 
            hover:bg-[#3A3B3F] 
            transition-colors
            relative
          "
          title="Notifications"
        >
          <span className="text-sm">🔔</span>
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center">
            3
          </span>
        </button>

        {/* User Menu */}
        <button 
          className="
            w-9 h-9 
            rounded-full 
            bg-gradient-to-br from-[#D8B26A] to-[#7A593A]
            flex items-center justify-center 
            hover:opacity-90 
            transition-opacity
            shadow-md
          "
          title="Mon compte"
        >
          <span className="text-white text-sm font-semibold">JR</span>
        </button>
      </div>
    </header>
  );
}

/**
 * Version Mobile du Hub Center
 * Plus compact mais garde les infos essentielles
 */
export function HubCenterMobile({ className = '' }: HubCenterProps) {
  const { selectedSphereId, hubCenter, pipelineStage } = useChenuStore();
  const currentSphere = getSphereById(selectedSphereId as any);
  const isPipelineActive = pipelineStage !== 'IDLE' && pipelineStage !== 'COMPLETED' && pipelineStage !== 'FAILED';

  return (
    <header 
      className={`
        hub-center-mobile
        h-[56px] 
        bg-gradient-to-r from-[#1E1F22] via-[#2A2B2F] to-[#1E1F22]
        border-b border-[#3A3B3F]
        flex items-center justify-between 
        px-3
        ${className}
      `}
    >
      {/* Logo compact */}
      <div 
        className="
          w-8 h-8 
          rounded-lg 
          bg-gradient-to-br from-[#D8B26A] to-[#8D8371] 
          flex items-center justify-center
          shadow-md
        "
      >
        <span className="text-white font-bold text-xs">C·N</span>
      </div>

      {/* Contexte compact */}
      {currentSphere && (
        <div 
          className="
            flex items-center gap-1.5 
            px-2 py-1 
            rounded-md
          "
          style={{ backgroundColor: `${currentSphere.color}20` }}
        >
          <span>{currentSphere.emoji}</span>
          <span 
            className="font-medium text-xs"
            style={{ color: currentSphere.color }}
          >
            {currentSphere.nameFr}
          </span>
          {isPipelineActive && (
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse ml-1" />
          )}
        </div>
      )}

      {/* État + Actions */}
      <div className="flex items-center gap-2">
        <div 
          className={`
            w-2 h-2 rounded-full 
            ${hubCenter.systemStatus === 'ok' ? 'bg-green-500' : 
              hubCenter.systemStatus === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}
          `} 
        />
        <XRModeToggle compact />
      </div>
    </header>
  );
}

export default HubCenter;
