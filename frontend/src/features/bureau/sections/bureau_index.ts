/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — BUREAU COMPONENTS INDEX V52                     ║
 * ║                    Point d'entrée unique pour toutes les sections            ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * SECTIONS DISPONIBLES (10 total):
 * Dashboard, Notes, Tasks, Projects, Threads, Meetings, Data, Agents, Reports, Budget
 */

// ═══════════════════════════════════════════════════════════════════════════════
// LAYOUT
// ═══════════════════════════════════════════════════════════════════════════════

export * from './BureauLayout';

// ═══════════════════════════════════════════════════════════════════════════════
// SECTIONS STANDARDS
// ═══════════════════════════════════════════════════════════════════════════════

export { default as DashboardSection } from './DashboardSection';
export { default as NotesSection } from './NotesSection';
export { default as TasksSection } from './TasksSection';
export { default as ProjectsSection } from './ProjectsSection';
export { default as ThreadsSection } from './ThreadsSection';
export { default as MeetingsSection } from './MeetingsSection';
export { default as DataSection } from './DataSection';
export { default as AgentsSection } from './AgentsSection';
export { default as ReportsSection } from './ReportsSection';
export { default as BudgetGovernanceSection } from './BudgetGovernanceSection';

// ═══════════════════════════════════════════════════════════════════════════════
// SECTIONS CONNECTÉES (avec stores Zustand)
// ═══════════════════════════════════════════════════════════════════════════════

export { default as ThreadsSectionConnected } from './ThreadsSectionConnected';
export { default as TasksSectionConnected } from './TasksSectionConnected';
export { default as MeetingsSectionConnected } from './MeetingsSectionConnected';
export { default as AgentsSectionConnected } from './AgentsSectionConnected';

// ═══════════════════════════════════════════════════════════════════════════════
// CONTENT ROUTERS
// ═══════════════════════════════════════════════════════════════════════════════

export { BureauContent } from './BureauSections';
export { BureauContentConnected, SECTION_CONFIG } from './BureauContentConnected';

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANTS ADDITIONNELS
// ═══════════════════════════════════════════════════════════════════════════════

export { default as BureauCanonical } from './BureauCanonical';
export { default as ThreadEditor } from './ThreadEditor';
export { default as MeetingEditor } from './MeetingEditor';
