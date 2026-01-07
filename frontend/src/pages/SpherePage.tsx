/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V68 — SPHERE PAGE                                 ║
 * ║                    Page Bureau pour chaque Sphère                             ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * NOTE: Cette page est rendue dans le main-workspace de l'AppShell
 * Le header sphère et les tabs bureau sont intégrés ici
 */

import React from 'react';
import { useSphere } from '../providers/SphereProvider';
import { BureauLayoutCanonical } from '../components/bureau-canonical';
import { BureauSectionId } from '../constants/CANON';

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function SpherePage() {
  const { currentSphere, currentSection, sections, navigateToSection } = useSphere();
  
  // Loading state
  if (!currentSphere) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#D8B26A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#8D8371]">Chargement de la sphère...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SPHERE HEADER (mini, dans le workspace) */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <header 
        className="border-b border-[#2A2B2E] px-4 py-2 flex items-center justify-between"
        style={{ 
          background: `linear-gradient(135deg, ${currentSphere.color}08 0%, transparent 100%)` 
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{currentSphere.icon}</span>
          <div>
            <h1 
              className="text-sm font-semibold"
              style={{ color: currentSphere.color }}
              data-testid="sphere-header"
            >
              {currentSphere.name}
            </h1>
          </div>
        </div>
      </header>
      
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* BUREAU TABS - 6 Sections */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <nav 
        className="border-b border-[#2A2B2E] px-4 flex"
        data-testid="bureau-tabs"
      >
        {sections.map((section) => {
          const isActive = currentSection?.id === section.id;
          
          return (
            <button
              key={section.id}
              onClick={() => navigateToSection(section.id as BureauSectionId)}
              data-testid={`section-tab-${section.id}`}
              className={`
                px-3 py-2 text-sm font-medium border-b-2 transition-all
                ${isActive
                  ? 'text-[#D8B26A] border-[#D8B26A]'
                  : 'text-[#5A5B5E] border-transparent hover:text-[#8D8371] hover:border-[#3A3B3E]'
                }
              `}
            >
              <span className="mr-1.5">{section.icon}</span>
              <span className="hidden sm:inline">{section.name}</span>
            </button>
          );
        })}
      </nav>
      
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* BUREAU CONTENT */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 overflow-auto">
        <BureauLayoutCanonical />
      </div>
    </div>
  );
}

export default SpherePage;
