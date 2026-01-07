// =============================================================================
// CHE·NU™ — BUREAU LAYOUT COMPONENT
// Version Finale V52
// Main bureau layout with 6 sections navigation
// =============================================================================

import React from 'react';
import { useNavigationStore } from '../stores/navigation.store';
import { 
  BureauSectionId, 
  BUREAU_SECTIONS, 
  BUREAU_SECTION_LIST,
  getBureauSectionName,
} from '../types/bureau.types';
import { getSphereColor, getSphereIcon, getSphereName } from '../types/canonical.config';

// =============================================================================
// TYPES
// =============================================================================

interface BureauLayoutProps {
  children: React.ReactNode;
}

interface SectionTabProps {
  section: typeof BUREAU_SECTION_LIST[number];
  isActive: boolean;
  onClick: () => void;
}

// =============================================================================
// SECTION TAB COMPONENT
// =============================================================================

const SectionTab: React.FC<SectionTabProps> = ({ section, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      data-testid={section.testId}
      className={`
        flex items-center gap-2 px-4 py-3 rounded-lg transition-all
        ${isActive 
          ? 'bg-sacred-gold/20 text-sacred-gold border border-sacred-gold/30' 
          : 'hover:bg-white/5 text-white/60 hover:text-white/80'
        }
      `}
    >
      <span className="text-lg">{section.icon}</span>
      <span className="text-sm font-medium">{section.nameFr}</span>
      {isActive && (
        <span className="ml-auto w-2 h-2 rounded-full bg-sacred-gold animate-pulse" />
      )}
    </button>
  );
};

// =============================================================================
// BUREAU HEADER
// =============================================================================

const BureauHeader: React.FC = () => {
  const { sphereId, exitBureau, returnToUniverse } = useNavigationStore();
  
  if (!sphereId) return null;
  
  const sphereColor = getSphereColor(sphereId);
  const sphereIcon = getSphereIcon(sphereId);
  const sphereName = getSphereName(sphereId, 'fr');
  
  return (
    <header 
      className="flex items-center justify-between px-6 py-4 border-b border-white/10"
      style={{ borderColor: `${sphereColor}30` }}
    >
      {/* Sphere indicator */}
      <div className="flex items-center gap-3">
        <button
          onClick={returnToUniverse}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          title="Retour à l'univers"
        >
          <span className="text-xl">🌐</span>
        </button>
        
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
          style={{ backgroundColor: `${sphereColor}20`, border: `2px solid ${sphereColor}` }}
        >
          {sphereIcon}
        </div>
        
        <div>
          <h1 className="text-lg font-semibold text-white">{sphereName}</h1>
          <p className="text-xs text-white/50">Bureau • Mode Travail</p>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={exitBureau}
          className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 text-sm transition-colors"
        >
          ← Retour Dashboard
        </button>
      </div>
    </header>
  );
};

// =============================================================================
// BUREAU SIDEBAR (6 SECTIONS)
// =============================================================================

const BureauSidebar: React.FC = () => {
  const { bureauSection, selectSection } = useNavigationStore();
  
  return (
    <aside className="w-64 border-r border-white/10 p-4 flex flex-col gap-2">
      <div className="mb-4">
        <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
          Sections Bureau
        </h2>
        <p className="text-xs text-white/30">6 sections hiérarchiques</p>
      </div>
      
      {BUREAU_SECTION_LIST.map((section) => (
        <SectionTab
          key={section.id}
          section={section}
          isActive={bureauSection === section.id}
          onClick={() => selectSection(section.id)}
        />
      ))}
      
      {/* Nova Assistant */}
      <div className="mt-auto pt-4 border-t border-white/10">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-cenote-turquoise/10 hover:bg-cenote-turquoise/20 transition-colors">
          <span className="text-lg">✨</span>
          <span className="text-sm text-cenote-turquoise">Nova Assistant</span>
        </button>
      </div>
    </aside>
  );
};

// =============================================================================
// BUREAU CONTENT AREA
// =============================================================================

const BureauContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bureauSection } = useNavigationStore();
  const section = bureauSection ? BUREAU_SECTIONS[bureauSection] : null;
  
  return (
    <main className="flex-1 overflow-auto">
      {/* Section header */}
      {section && (
        <div className="px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{section.icon}</span>
            <div>
              <h2 className="text-xl font-semibold text-white">{section.nameFr}</h2>
              <p className="text-sm text-white/50">{section.descriptionFr}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="p-6">
        {children}
      </div>
    </main>
  );
};

// =============================================================================
// MAIN BUREAU LAYOUT
// =============================================================================

export const BureauLayout: React.FC<BureauLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen flex flex-col bg-ui-slate">
      <BureauHeader />
      
      <div className="flex-1 flex overflow-hidden">
        <BureauSidebar />
        <BureauContent>{children}</BureauContent>
      </div>
    </div>
  );
};

// =============================================================================
// BUREAU SECTION COMPONENTS (Placeholders)
// =============================================================================

export const QuickCaptureSection: React.FC = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Quick note input */}
      <div className="bg-white/5 rounded-xl p-4">
        <textarea
          placeholder="Capture rapide (500 car. max)..."
          maxLength={500}
          className="w-full h-32 bg-transparent text-white placeholder-white/30 resize-none outline-none"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-white/30">0/500</span>
          <button className="px-4 py-2 bg-sacred-gold/20 text-sacred-gold rounded-lg text-sm hover:bg-sacred-gold/30 transition-colors">
            ⚡ Capturer
          </button>
        </div>
      </div>
      
      {/* Recent captures */}
      <div className="bg-white/5 rounded-xl p-4">
        <h3 className="text-sm font-medium text-white/60 mb-3">Captures récentes</h3>
        <div className="space-y-2">
          <div className="p-3 bg-white/5 rounded-lg text-sm text-white/70">
            Aucune capture récente
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const ResumeWorkspaceSection: React.FC = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-medium text-white">Reprendre le travail</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {['Récents', 'Épinglés', 'En cours'].map((category) => (
        <div key={category} className="bg-white/5 rounded-xl p-4">
          <h4 className="text-sm font-medium text-white/60 mb-3">{category}</h4>
          <div className="text-sm text-white/40">Aucun élément</div>
        </div>
      ))}
    </div>
  </div>
);

export const ThreadsSection: React.FC = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium text-white">Threads (.chenu)</h3>
      <button className="px-4 py-2 bg-sacred-gold/20 text-sacred-gold rounded-lg text-sm">
        + Nouveau Thread
      </button>
    </div>
    <div className="bg-white/5 rounded-xl p-6 text-center">
      <span className="text-4xl mb-4 block">💬</span>
      <p className="text-white/60">Aucun thread dans cette sphère</p>
    </div>
  </div>
);

export const DataFilesSection: React.FC = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium text-white">Données & Fichiers</h3>
      <button className="px-4 py-2 bg-white/10 text-white/70 rounded-lg text-sm">
        📁 Parcourir
      </button>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {['Documents', 'Images', 'DataSpaces', 'Archives'].map((type) => (
        <div key={type} className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 cursor-pointer transition-colors">
          <span className="text-2xl mb-2 block">📁</span>
          <span className="text-sm text-white/60">{type}</span>
          <span className="text-xs text-white/30 block">0 éléments</span>
        </div>
      ))}
    </div>
  </div>
);

export const ActiveAgentsSection: React.FC = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-medium text-white">Agents Actifs</h3>
    <div className="bg-white/5 rounded-xl p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-cenote-turquoise/20 flex items-center justify-center">
          <span className="text-xl">✨</span>
        </div>
        <div>
          <h4 className="font-medium text-white">Nova</h4>
          <p className="text-sm text-cenote-turquoise">Système • Toujours actif</p>
        </div>
        <span className="ml-auto w-3 h-3 rounded-full bg-green-500 animate-pulse" />
      </div>
      <div className="border-t border-white/10 pt-4">
        <p className="text-sm text-white/50">Aucun autre agent actif dans cette sphère</p>
      </div>
    </div>
  </div>
);

export const MeetingsSection: React.FC = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium text-white">Réunions</h3>
      <button className="px-4 py-2 bg-sacred-gold/20 text-sacred-gold rounded-lg text-sm">
        + Planifier
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white/5 rounded-xl p-4">
        <h4 className="text-sm font-medium text-white/60 mb-3">📅 À venir</h4>
        <p className="text-sm text-white/40">Aucune réunion planifiée</p>
      </div>
      <div className="bg-white/5 rounded-xl p-4">
        <h4 className="text-sm font-medium text-white/60 mb-3">📝 Récentes</h4>
        <p className="text-sm text-white/40">Aucune réunion récente</p>
      </div>
    </div>
  </div>
);

// =============================================================================
// EXPORTS
// =============================================================================

export default BureauLayout;
