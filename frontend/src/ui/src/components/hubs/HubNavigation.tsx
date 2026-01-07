/**
 * CHE·NU™ — Hub Navigation (Bottom)
 * 
 * Hub de sélection contextuelle.
 * Contient:
 * - 🌐 Les 10 Sphères
 * - 📁 Explorer (fichiers, dataspaces)
 * - 🔍 Recherche globale
 * - 📜 Historique
 * - 🥽 XR Mode Toggle
 * 
 * Context switching ONLY — pas d'exécution ici
 */

'use client';

import React, { useState } from 'react';
import { useChenuStore } from '../../hooks/useChenuStore';
import { SPHERES, XR_MODE, getSphereById } from '../../config/spheres.config';

type NavigationMode = 'spheres' | 'explorer' | 'search' | 'history';

interface HubNavigationProps {
  className?: string;
  expanded?: boolean;
}

export function HubNavigation({ className = '', expanded = false }: HubNavigationProps) {
  const [mode, setMode] = useState<NavigationMode>('spheres');
  const [searchQuery, setSearchQuery] = useState('');
  const { selectedSphereId, setSelectedSphere, xr } = useChenuStore();

  const currentSphere = getSphereById(selectedSphereId as any);

  return (
    <nav 
      className={`
        hub-navigation
        ${expanded ? 'h-[200px]' : 'h-[120px]'}
        bg-gradient-to-t from-[#1A1B1E] to-[#1E1F22]
        border-t border-[#3A3B3F]
        flex flex-col
        ${className}
      `}
    >
      {/* ═══════════════════════════════════════════════════════════════
          MODE SELECTOR
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#3A3B3F]/50">
        <div className="flex gap-2">
          {[
            { id: 'spheres' as const, emoji: '🌐', label: 'Sphères' },
            { id: 'explorer' as const, emoji: '📁', label: 'Explorer' },
            { id: 'search' as const, emoji: '🔍', label: 'Recherche' },
            { id: 'history' as const, emoji: '📜', label: 'Historique' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setMode(item.id)}
              className={`
                px-3 py-1.5 rounded-lg
                text-xs font-medium
                flex items-center gap-1.5
                transition-all
                ${mode === item.id 
                  ? 'bg-[#D8B26A]/20 text-[#D8B26A]' 
                  : 'text-[#8D8371] hover:bg-[#2A2B2F]'
                }
              `}
            >
              <span>{item.emoji}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Current Sphere Indicator */}
        {currentSphere && (
          <div 
            className="flex items-center gap-2 px-2 py-1 rounded"
            style={{ backgroundColor: `${currentSphere.color}15` }}
          >
            <span className="text-sm">{currentSphere.emoji}</span>
            <span 
              className="text-xs font-medium"
              style={{ color: currentSphere.color }}
            >
              {currentSphere.nameFr}
            </span>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          CONTENT AREA
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 overflow-hidden">
        
        {/* ───────────────────────────────────────────────────────────
            SPHERES MODE — Les 10 Sphères
            ─────────────────────────────────────────────────────────── */}
        {mode === 'spheres' && (
          <div className="h-full px-4 py-2 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {SPHERES.map(sphere => (
                <button
                  key={sphere.id}
                  onClick={() => setSelectedSphere(sphere.id)}
                  className={`
                    flex flex-col items-center
                    p-2 rounded-xl
                    min-w-[70px]
                    transition-all
                    ${selectedSphereId === sphere.id 
                      ? 'bg-opacity-20 scale-105 shadow-lg' 
                      : 'hover:bg-opacity-10 hover:scale-102'
                    }
                  `}
                  style={{ 
                    backgroundColor: selectedSphereId === sphere.id 
                      ? `${sphere.color}30` 
                      : 'transparent',
                    boxShadow: selectedSphereId === sphere.id 
                      ? `0 4px 20px ${sphere.color}30` 
                      : 'none',
                  }}
                >
                  {/* Sphere Icon */}
                  <div 
                    className={`
                      w-10 h-10 rounded-full
                      flex items-center justify-center
                      text-xl
                      transition-transform
                      ${selectedSphereId === sphere.id ? 'scale-110' : ''}
                    `}
                    style={{ 
                      backgroundColor: `${sphere.color}20`,
                      border: selectedSphereId === sphere.id 
                        ? `2px solid ${sphere.color}` 
                        : '2px solid transparent',
                    }}
                  >
                    {sphere.emoji}
                  </div>
                  
                  {/* Sphere Name */}
                  <span 
                    className={`
                      text-[10px] mt-1 font-medium
                      max-w-[60px] truncate
                      ${selectedSphereId === sphere.id 
                        ? '' 
                        : 'text-[#8D8371]'
                      }
                    `}
                    style={{ 
                      color: selectedSphereId === sphere.id 
                        ? sphere.color 
                        : undefined 
                    }}
                  >
                    {sphere.nameFr.split(' ')[0]}
                  </span>
                </button>
              ))}

              {/* XR MODE TOGGLE — Pas une sphère! */}
              <button
                onClick={() => {/* Toggle XR */}}
                className={`
                  flex flex-col items-center
                  p-2 rounded-xl
                  min-w-[70px]
                  border-2 border-dashed
                  transition-all
                  ${xr.enabled 
                    ? 'border-[#8EC8FF] bg-[#8EC8FF]/10' 
                    : 'border-[#3A3B3F] hover:border-[#8EC8FF]/50'
                  }
                `}
              >
                <div 
                  className={`
                    w-10 h-10 rounded-full
                    flex items-center justify-center
                    text-xl
                    ${xr.enabled ? 'animate-pulse' : ''}
                  `}
                  style={{ backgroundColor: '#8EC8FF20' }}
                >
                  {XR_MODE.emoji}
                </div>
                <span 
                  className="text-[10px] mt-1 font-medium"
                  style={{ color: xr.enabled ? '#8EC8FF' : '#8D8371' }}
                >
                  XR Mode
                </span>
                <span className="text-[8px] text-[#8D8371]">
                  {xr.supported ? (xr.enabled ? 'ACTIF' : 'TOGGLE') : 'N/A'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────
            EXPLORER MODE
            ─────────────────────────────────────────────────────────── */}
        {mode === 'explorer' && (
          <div className="h-full px-4 py-2 flex gap-4">
            {/* DataSpaces */}
            <div className="flex-1">
              <div className="text-[10px] text-[#8D8371] mb-2">DataSpaces</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 p-1.5 rounded bg-[#2A2B2F] text-xs text-[#E9E4D6]">
                  📁 Documents
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded hover:bg-[#2A2B2F] text-xs text-[#8D8371]">
                  📁 Projets
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded hover:bg-[#2A2B2F] text-xs text-[#8D8371]">
                  📁 Partagés
                </div>
              </div>
            </div>

            {/* Recent Files */}
            <div className="flex-1">
              <div className="text-[10px] text-[#8D8371] mb-2">Fichiers Récents</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 p-1.5 rounded hover:bg-[#2A2B2F] text-xs text-[#8D8371]">
                  📄 rapport.md
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded hover:bg-[#2A2B2F] text-xs text-[#8D8371]">
                  📊 budget.xlsx
                </div>
              </div>
            </div>

            {/* Platforms */}
            <div className="flex-1">
              <div className="text-[10px] text-[#8D8371] mb-2">Plateformes</div>
              <div className="flex gap-2">
                <div className="p-2 rounded bg-[#2A2B2F] text-lg" title="Google Drive">
                  🔗
                </div>
                <div className="p-2 rounded bg-[#2A2B2F] text-lg" title="Dropbox">
                  📦
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────
            SEARCH MODE
            ─────────────────────────────────────────────────────────── */}
        {mode === 'search' && (
          <div className="h-full px-4 py-2">
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Rechercher dans CHE·NU..."
                className="
                  flex-1 
                  bg-[#2A2B2F] 
                  border border-[#3A3B3F] 
                  rounded-lg 
                  px-3 py-2 
                  text-xs text-[#E9E4D6]
                  placeholder:text-[#8D8371]
                  focus:outline-none focus:border-[#D8B26A]
                "
              />
              <button className="px-4 py-2 bg-[#D8B26A] rounded-lg text-xs text-white font-medium">
                Chercher
              </button>
            </div>
            <div className="text-[10px] text-[#8D8371]">
              Recherche dans: Documents, Threads, Agents, DataSpaces
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────
            HISTORY MODE
            ─────────────────────────────────────────────────────────── */}
        {mode === 'history' && (
          <div className="h-full px-4 py-2 overflow-y-auto">
            <div className="space-y-1">
              {[
                { time: 'Il y a 5 min', action: 'Analyse document', sphere: '💼' },
                { time: 'Il y a 15 min', action: 'Thread créé', sphere: '🏠' },
                { time: 'Il y a 1h', action: 'Agent engagé', sphere: '🤖' },
              ].map((item, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-3 p-2 rounded hover:bg-[#2A2B2F] cursor-pointer"
                >
                  <span className="text-lg">{item.sphere}</span>
                  <div className="flex-1">
                    <div className="text-xs text-[#E9E4D6]">{item.action}</div>
                    <div className="text-[10px] text-[#8D8371]">{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default HubNavigation;
