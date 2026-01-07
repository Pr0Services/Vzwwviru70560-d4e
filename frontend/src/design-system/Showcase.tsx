// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU DESIGN SYSTEM — SHOWCASE PAGE
// Demo page showing all design system components
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react';

// Import all design system components
// In a real app: import { ... } from '@/design-system';

// =============================================================================
// SHOWCASE SECTIONS
// =============================================================================

/**
 * Section wrapper for showcase
 */
function ShowcaseSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
        {title}
      </h2>
      {description && (
        <p className="text-[var(--color-text-secondary)] mb-6">{description}</p>
      )}
      <div className="space-y-6">{children}</div>
    </section>
  );
}

/**
 * Component example wrapper
 */
function Example({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border-subtle)]">
      <h3 className="text-sm font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}

// =============================================================================
// MAIN SHOWCASE COMPONENT
// =============================================================================

export function DesignSystemShowcase() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border-subtle)]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold">
                C
              </div>
              <div>
                <h1 className="text-xl font-bold">CHE·NU Design System</h1>
                <p className="text-xs text-[var(--color-text-tertiary)]">
                  v1.0.0 · Refined Industrial
                </p>
              </div>
            </div>

            {/* Theme toggle placeholder */}
            <button className="p-2 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* =================================================================== */}
        {/* COLORS SECTION */}
        {/* =================================================================== */}
        <ShowcaseSection
          title="🎨 Palette de couleurs"
          description="Les couleurs primaires du design system CHE·NU"
        >
          <Example title="Couleurs primitives">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {/* Copper */}
              <div>
                <div className="h-20 rounded-lg bg-gradient-to-br from-[#E8C4A8] via-[#CD7F4E] to-[#8B5A2B]" />
                <p className="mt-2 text-sm font-medium">Copper</p>
                <p className="text-xs text-[var(--color-text-tertiary)]">#CD7F4E</p>
              </div>
              {/* Steel */}
              <div>
                <div className="h-20 rounded-lg bg-gradient-to-br from-[#B0C4DE] via-[#6B83A3] to-[#4A6178]" />
                <p className="mt-2 text-sm font-medium">Steel Blue</p>
                <p className="text-xs text-[var(--color-text-tertiary)]">#6B83A3</p>
              </div>
              {/* Forest */}
              <div>
                <div className="h-20 rounded-lg bg-gradient-to-br from-[#90C9A7] via-[#4F8A60] to-[#2D5A3D]" />
                <p className="mt-2 text-sm font-medium">Forest Green</p>
                <p className="text-xs text-[var(--color-text-tertiary)]">#4F8A60</p>
              </div>
              {/* Rust */}
              <div>
                <div className="h-20 rounded-lg bg-gradient-to-br from-[#F5B5A8] via-[#E86252] to-[#B84C3E]" />
                <p className="mt-2 text-sm font-medium">Rust Red</p>
                <p className="text-xs text-[var(--color-text-tertiary)]">#E86252</p>
              </div>
              {/* Slate */}
              <div>
                <div className="h-20 rounded-lg bg-gradient-to-br from-[#A8A29E] via-[#78716C] to-[#44403C]" />
                <p className="mt-2 text-sm font-medium">Warm Gray</p>
                <p className="text-xs text-[var(--color-text-tertiary)]">#78716C</p>
              </div>
            </div>
          </Example>

          <Example title="Sphères (accents contextuels)">
            <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
              {[
                { name: 'Personal', color: '#6B83A3' },
                { name: 'Business', color: '#CD7F4E' },
                { name: 'Creative', color: '#9333EA' },
                { name: 'Scholar', color: '#4F8A60' },
                { name: 'AI Lab', color: '#F59E0B' },
                { name: 'My Team', color: '#14B8A6' },
                { name: 'XR', color: '#8B5CF6' },
              ].map((sphere) => (
                <div key={sphere.name} className="text-center">
                  <div
                    className="w-12 h-12 mx-auto rounded-full shadow-lg"
                    style={{ backgroundColor: sphere.color }}
                  />
                  <p className="mt-2 text-xs font-medium">{sphere.name}</p>
                </div>
              ))}
            </div>
          </Example>
        </ShowcaseSection>

        {/* =================================================================== */}
        {/* TYPOGRAPHY SECTION */}
        {/* =================================================================== */}
        <ShowcaseSection
          title="✏️ Typographie"
          description="Hiérarchie typographique et familles de polices"
        >
          <Example title="Familles de polices">
            <div className="space-y-4">
              <div>
                <p className="text-xs text-[var(--color-text-tertiary)] mb-1">Display — Playfair Display</p>
                <p className="text-4xl font-serif">CHE·NU Construction</p>
              </div>
              <div>
                <p className="text-xs text-[var(--color-text-tertiary)] mb-1">Heading — DM Sans</p>
                <p className="text-2xl font-semibold">Gestion de projets intelligente</p>
              </div>
              <div>
                <p className="text-xs text-[var(--color-text-tertiary)] mb-1">Body — Source Sans 3</p>
                <p className="text-base">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--color-text-tertiary)] mb-1">Mono — JetBrains Mono</p>
                <p className="font-mono text-sm bg-[var(--color-bg-subtle)] px-3 py-2 rounded">
                  const agent = new Agent('Nova', 'L0');
                </p>
              </div>
            </div>
          </Example>
        </ShowcaseSection>

        {/* =================================================================== */}
        {/* BUTTONS SECTION */}
        {/* =================================================================== */}
        <ShowcaseSection
          title="🔘 Boutons"
          description="Tous les variants et états des boutons"
        >
          <Example title="Variants">
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 rounded-lg bg-[var(--color-brand-primary)] text-white font-medium hover:opacity-90 transition-opacity">
                Primary
              </button>
              <button className="px-4 py-2 rounded-lg bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] font-medium hover:bg-[var(--color-bg-hover)] transition-colors border border-[var(--color-border-default)]">
                Secondary
              </button>
              <button className="px-4 py-2 rounded-lg text-[var(--color-text-secondary)] font-medium hover:bg-[var(--color-bg-subtle)] transition-colors">
                Ghost
              </button>
              <button className="px-4 py-2 rounded-lg bg-[var(--color-status-error)] text-white font-medium hover:opacity-90 transition-opacity">
                Danger
              </button>
              <button className="px-4 py-2 rounded-lg bg-[var(--color-status-success)] text-white font-medium hover:opacity-90 transition-opacity">
                Success
              </button>
            </div>
          </Example>

          <Example title="Tailles">
            <div className="flex flex-wrap items-center gap-3">
              <button className="px-2 py-1 text-xs rounded bg-[var(--color-brand-primary)] text-white">
                XS
              </button>
              <button className="px-3 py-1.5 text-sm rounded-md bg-[var(--color-brand-primary)] text-white">
                Small
              </button>
              <button className="px-4 py-2 text-sm rounded-lg bg-[var(--color-brand-primary)] text-white">
                Medium
              </button>
              <button className="px-5 py-2.5 text-base rounded-lg bg-[var(--color-brand-primary)] text-white">
                Large
              </button>
              <button className="px-6 py-3 text-lg rounded-xl bg-[var(--color-brand-primary)] text-white">
                XL
              </button>
            </div>
          </Example>

          <Example title="États">
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 rounded-lg bg-[var(--color-brand-primary)] text-white font-medium">
                Normal
              </button>
              <button className="px-4 py-2 rounded-lg bg-[var(--color-brand-primary)] text-white font-medium ring-2 ring-[var(--color-brand-primary)] ring-offset-2">
                Focus
              </button>
              <button className="px-4 py-2 rounded-lg bg-[var(--color-brand-primary)] text-white font-medium opacity-50 cursor-not-allowed">
                Disabled
              </button>
              <button className="px-4 py-2 rounded-lg bg-[var(--color-brand-primary)] text-white font-medium flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading
              </button>
            </div>
          </Example>
        </ShowcaseSection>

        {/* =================================================================== */}
        {/* INPUTS SECTION */}
        {/* =================================================================== */}
        <ShowcaseSection
          title="📝 Inputs"
          description="Champs de formulaire et contrôles"
        >
          <Example title="Text Inputs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                  Label
                </label>
                <input
                  type="text"
                  placeholder="Placeholder"
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                  Avec erreur
                </label>
                <input
                  type="text"
                  defaultValue="Valeur invalide"
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-status-error)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-status-error)]"
                />
                <p className="mt-1 text-xs text-[var(--color-status-error)]">
                  Message d'erreur
                </p>
              </div>
            </div>
          </Example>

          <Example title="Checkboxes & Radios">
            <div className="flex gap-8">
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded" defaultChecked />
                  <span className="text-sm">Option 1</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  <span className="text-sm">Option 2</span>
                </label>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="radio" className="w-4 h-4" defaultChecked />
                  <span className="text-sm">Choix A</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="radio" className="w-4 h-4" />
                  <span className="text-sm">Choix B</span>
                </label>
              </div>
            </div>
          </Example>
        </ShowcaseSection>

        {/* =================================================================== */}
        {/* CARDS SECTION */}
        {/* =================================================================== */}
        <ShowcaseSection
          title="🃏 Cards"
          description="Conteneurs de contenu"
        >
          <Example title="Variants">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Default */}
              <div className="p-4 bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-xl">
                <h3 className="font-semibold">Default</h3>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                  Carte avec bordure subtile
                </p>
              </div>
              {/* Elevated */}
              <div className="p-4 bg-[var(--color-bg-secondary)] rounded-xl shadow-lg">
                <h3 className="font-semibold">Elevated</h3>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                  Carte avec ombre portée
                </p>
              </div>
              {/* Interactive */}
              <div className="p-4 bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-xl hover:border-[var(--color-brand-primary)] hover:shadow-md cursor-pointer transition-all">
                <h3 className="font-semibold">Interactive</h3>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                  Carte cliquable
                </p>
              </div>
            </div>
          </Example>
        </ShowcaseSection>

        {/* =================================================================== */}
        {/* BADGES SECTION */}
        {/* =================================================================== */}
        <ShowcaseSection
          title="🏷️ Badges"
          description="Tags et indicateurs de statut"
        >
          <Example title="Status Badges">
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                Info
              </span>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                Success
              </span>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
                Warning
              </span>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                Error
              </span>
            </div>
          </Example>

          <Example title="Agent Level Badges">
            <div className="flex gap-3">
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                L0
              </span>
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                L1
              </span>
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                L2
              </span>
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                L3
              </span>
            </div>
          </Example>
        </ShowcaseSection>

        {/* =================================================================== */}
        {/* AVATARS SECTION */}
        {/* =================================================================== */}
        <ShowcaseSection
          title="👤 Avatars"
          description="Représentation des utilisateurs et agents"
        >
          <Example title="Tailles">
            <div className="flex items-end gap-3">
              {['xs', 'sm', 'md', 'lg', 'xl', '2xl'].map((size, i) => (
                <div
                  key={size}
                  className={`
                    rounded-full bg-gradient-to-br from-[var(--color-brand-primary)] to-[#8B5A2B]
                    flex items-center justify-center text-white font-semibold
                    ${size === 'xs' ? 'w-6 h-6 text-xs' : ''}
                    ${size === 'sm' ? 'w-8 h-8 text-xs' : ''}
                    ${size === 'md' ? 'w-10 h-10 text-sm' : ''}
                    ${size === 'lg' ? 'w-12 h-12 text-base' : ''}
                    ${size === 'xl' ? 'w-16 h-16 text-lg' : ''}
                    ${size === '2xl' ? 'w-24 h-24 text-2xl' : ''}
                  `}
                >
                  JD
                </div>
              ))}
            </div>
          </Example>

          <Example title="Agent Avatar">
            <div className="flex gap-6">
              {/* Agent Avatar avec status */}
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  NO
                </div>
                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                  0
                </span>
                <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white" />
              </div>
              
              {/* Autre agent */}
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white text-xl font-bold shadow-lg animate-pulse">
                  FN
                </div>
                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                  1
                </span>
                <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-blue-500 border-2 border-white animate-pulse" />
              </div>
            </div>
          </Example>
        </ShowcaseSection>

        {/* =================================================================== */}
        {/* STATS SECTION */}
        {/* =================================================================== */}
        <ShowcaseSection
          title="📊 Stats & KPIs"
          description="Affichage de métriques et indicateurs"
        >
          <Example title="Stat Cards">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border-subtle)]">
                <p className="text-sm text-[var(--color-text-secondary)]">Revenus</p>
                <p className="text-2xl font-bold mt-1">$45,231</p>
                <p className="text-xs text-green-500 mt-1">↑ +12.5%</p>
              </div>
              <div className="p-4 bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border-subtle)]">
                <p className="text-sm text-[var(--color-text-secondary)]">Projets actifs</p>
                <p className="text-2xl font-bold mt-1">23</p>
                <p className="text-xs text-green-500 mt-1">↑ +3 ce mois</p>
              </div>
              <div className="p-4 bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border-subtle)]">
                <p className="text-sm text-[var(--color-text-secondary)]">Tâches complétées</p>
                <p className="text-2xl font-bold mt-1">847</p>
                <p className="text-xs text-amber-500 mt-1">→ 0%</p>
              </div>
              <div className="p-4 bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border-subtle)]">
                <p className="text-sm text-[var(--color-text-secondary)]">Agents actifs</p>
                <p className="text-2xl font-bold mt-1">168</p>
                <p className="text-xs text-green-500 mt-1">↑ 100% opérationnels</p>
              </div>
            </div>
          </Example>
        </ShowcaseSection>

        {/* =================================================================== */}
        {/* FOOTER */}
        {/* =================================================================== */}
        <footer className="mt-16 pt-8 border-t border-[var(--color-border-subtle)] text-center">
          <p className="text-sm text-[var(--color-text-tertiary)]">
            CHE·NU Design System v1.0.0
          </p>
          <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
            Pro-Service Construction © 2024-2025
          </p>
        </footer>
      </main>
    </div>
  );
}

export default DesignSystemShowcase;
