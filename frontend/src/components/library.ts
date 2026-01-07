// CHE·NU™ Complete Component Library
// Governed Intelligence Operating System
// Version 1.0.0 - 125K Build

// ============================================================
// CHE·NU™ CORE IDENTITY
// ============================================================
// CHE·NU is NOT a chatbot, NOT a productivity app, NOT a crypto platform
// CHE·NU is a GOVERNED INTELLIGENCE OPERATING SYSTEM
// Governance is empowerment, not restriction

// ============================================================
// 8 SPHERES (FROZEN - NON-NEGOTIABLE)
// ============================================================
// 1. Personal 🏠
// 2. Business 💼
// 3. Government & Institutions 🏛️
// 4. Studio de création 🎨
// 5. Community 👥
// 6. Social & Media 📱
// 7. Entertainment 🎬
// 8. My Team 🤝

// ============================================================
// 10 BUREAU SECTIONS (NON-NEGOTIABLE)
// ============================================================
// 1. Dashboard
// 2. Notes
// 3. Tasks
// 4. Projects
// 5. Threads (.chenu)
// 6. Meetings
// 7. Data / Database
// 8. Agents
// 9. Reports / History
// 10. Budget & Governance

// ============================================================
// BRAND COLORS
// ============================================================
export const CHENU_COLORS = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
} as const;

// ============================================================
// CORE COMPONENTS
// ============================================================
export * from './core/UIComponents';
export * from './core/EncodingSystem';
export * from './core/NovaPanel';
export * from './core/NovaChatInterface';

// ============================================================
// BUREAU COMPONENTS
// ============================================================
export * from './bureau/DashboardSection';
export * from './bureau/NotesSection';
export * from './bureau/TasksSection';
export * from './bureau/ProjectsSection';
export * from './bureau/ThreadsSection';
export * from './bureau/MeetingsSection';
export * from './bureau/DataSection';
export * from './bureau/AgentsSection';
export * from './bureau/ReportsSection';
export * from './bureau/BudgetGovernanceSection';
export * from './bureau/BureauSections';

// ============================================================
// SPHERE COMPONENTS
// ============================================================
export * from './spheres/SphereComponents';

// ============================================================
// AGENT COMPONENTS
// ============================================================
export * from './agents/AgentComponents';
export * from './agents/Orchestrator';

// ============================================================
// WORKSPACE COMPONENTS
// ============================================================
export * from './workspace/Workspace';
export * from './workspace/WorkspaceLayout';
export * from './workspace/ThreadPanel';

// ============================================================
// UI COMPONENTS LIBRARY
// ============================================================

// Modal System
export * from './Modal/Modal';
export * from './modals/ModalSystem';

// Toast & Notifications
export * from './Toast/Toast';
export * from './Notifications/Notifications';
export * from './notifications/NotificationSystem';

// Navigation
export * from './Navigation/Navigation';
export * from './layout/NavigationLayout';

// Forms
export * from './Form/FormBuilder';
export * from './forms/FormComponents';

// Data Display
export * from './DataGrid/DataGrid';
export * from './DataTable/DataTable';
export * from './data/DataTable';
export * from './TreeView/TreeView';

// Charts & Analytics
export * from './Charts/Charts';
export * from './charts/ChartComponents';
export * from './Analytics/DashboardAnalytics';

// Rich Text
export * from './RichTextEditor/RichTextEditor';
export * from './ui/RichTextEditor';

// Tabs & Accordion
export * from './TabsAccordion/TabsAccordion';

// Command Bar
export * from './CommandBar/CommandBar';

// Drag & Drop
export * from './DragDrop/DragDrop';

// Floating UI
export * from './FloatingUI/FloatingUI';

// Sliders & Range
export * from './SliderRange/SliderRange';

// Avatar & Badges
export * from './Avatar/Avatar';
export * from './AvatarBadge/AvatarBadge';

// File Upload
export * from './FileUpload/FileUpload';

// Stepper & Wizard
export * from './Stepper/Stepper';
export * from './StepperWizard/StepperWizard';

// Loading States
export * from './Loading/Loading';

// Date & Time
export * from './DateTimePicker/DateTimePicker';
export * from './Calendar/Calendar';
export * from './Timeline/Timeline';

// Search
export * from './Search/Search';

// Kanban
export * from './Kanban/KanbanBoard';

// Settings
export * from './Settings/SettingsPanel';

// Projects
export * from './Projects/ProjectManagement';

// Agents
export * from './Agents/AgentManagement';

// Reports
export * from './Reports/ReportsHistory';

// Budget
export * from './Budget/BudgetGovernance';

// Threads & Meetings
export * from './ThreadsMeetings/ThreadsMeetingsSystem';

// ============================================================
// LAYOUT COMPONENTS
// ============================================================
export * from './mobile/MobileLayouts';
export * from './theme/ThemeSystem';

// ============================================================
// THREAD SYSTEM
// ============================================================
export * from './threads/ThreadDetailView';
export * from './features/threads/ThreadSystem';

// ============================================================
// VERSION & BUILD INFO
// ============================================================
export const CHENU_VERSION = '1.0.0';
export const CHENU_BUILD = '125K';
export const CHENU_CODENAME = 'GOVERNED_INTELLIGENCE';

// ============================================================
// CORE PRINCIPLES (MEMORY PROMPT)
// ============================================================
export const CHENU_PRINCIPLES = {
  // Context, not features
  CONTEXT_FIRST: 'CHE·NU operates by CONTEXT (Spheres), not by features',
  
  // Separation creates intelligence
  SEPARATION: 'Separation creates intelligence',
  
  // Governance is empowerment
  GOVERNANCE: 'Governance is ALWAYS enforced before execution',
  
  // Tokens are NOT crypto
  TOKENS: 'CHE·NU Tokens are INTERNAL utility credits, NOT cryptocurrency',
  
  // Nova is SYSTEM intelligence
  NOVA: 'Nova is the SYSTEM intelligence, always present, NEVER a hired agent',
  
  // Encoding is Core IP
  ENCODING: 'Encoding reduces token usage, clarifies intent, enforces scope',
  
  // User Orchestrator is hired
  ORCHESTRATOR: 'User Orchestrator is hired by user, executes tasks, respects governance',
  
  // Bureau structure NEVER changes
  BUREAU: 'Each SPHERE opens a BUREAU with EXACTLY 6 sections',
  
  // No feature dumping
  SIMPLICITY: 'Fewer visible elements = higher cognitive power',
  
  // Ethics first
  ETHICS: 'CHE·NU does NOT sell attention, does NOT sell user data',
} as const;

// ============================================================
// SPHERE DEFINITIONS
// ============================================================
export const CHENU_SPHERES = [
  { id: 'personal', name: 'Personal', icon: '🏠', color: '#805AD5' },
  { id: 'business', name: 'Business', icon: '💼', color: '#3182CE' },
  { id: 'government', name: 'Government & Institutions', icon: '🏛️', color: '#DD6B20' },
  { id: 'design_studio', name: 'Studio de création', icon: '🎨', color: '#D53F8C' },
  { id: 'community', name: 'Community', icon: '👥', color: '#38A169' },
  { id: 'social', name: 'Social & Media', icon: '📱', color: '#00B5D8' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#E53E3E' },
  { id: 'my_team', name: 'My Team', icon: '🤝', color: '#D8B26A' },
] as const;

// ============================================================
// BUREAU SECTIONS
// ============================================================
export const CHENU_BUREAU_SECTIONS = [
  { id: 'dashboard', name: 'Dashboard', icon: '📊', order: 1 },
  { id: 'notes', name: 'Notes', icon: '📝', order: 2 },
  { id: 'tasks', name: 'Tasks', icon: '✅', order: 3 },
  { id: 'projects', name: 'Projects', icon: '📁', order: 4 },
  { id: 'threads', name: 'Threads (.chenu)', icon: '💬', order: 5 },
  { id: 'meetings', name: 'Meetings', icon: '📅', order: 6 },
  { id: 'data', name: 'Data / Database', icon: '🗄️', order: 7 },
  { id: 'agents', name: 'Agents', icon: '🤖', order: 8 },
  { id: 'reports', name: 'Reports / History', icon: '📈', order: 9 },
  { id: 'budget', name: 'Budget & Governance', icon: '⚖️', order: 10 },
] as const;

// ============================================================
// TYPE EXPORTS
// ============================================================
export type SphereId = typeof CHENU_SPHERES[number]['id'];
export type BureauSectionId = typeof CHENU_BUREAU_SECTIONS[number]['id'];
export type ChenuColor = keyof typeof CHENU_COLORS;

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
export function getSphereById(id: SphereId) {
  return CHENU_SPHERES.find(s => s.id === id);
}

export function getBureauSectionById(id: BureauSectionId) {
  return CHENU_BUREAU_SECTIONS.find(s => s.id === id);
}

export function getChenuColor(colorName: ChenuColor): string {
  return CHENU_COLORS[colorName];
}

// ============================================================
// DEFAULT EXPORT
// ============================================================
export default {
  version: CHENU_VERSION,
  build: CHENU_BUILD,
  codename: CHENU_CODENAME,
  colors: CHENU_COLORS,
  spheres: CHENU_SPHERES,
  bureauSections: CHENU_BUREAU_SECTIONS,
  principles: CHENU_PRINCIPLES,
};
