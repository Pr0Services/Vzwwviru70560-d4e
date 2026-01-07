// CHE·NU™ Component Library Index
// Complete export of all UI components for CHE·NU™ platform
// Governed Intelligence Operating System

// ============================================================
// CORE COMPONENTS
// ============================================================

export * from './core';
export * from './bureau';
export * from './spheres/SphereComponents';
export * from './agents';
export * from './workspace';

// ============================================================
// UI COMPONENTS
// ============================================================

export * from './Modal/Modal';
export * from './Toast/Toast';
export * from './TabsAccordion/TabsAccordion';
export * from './CommandBar/CommandBar';
export * from './DragDrop/DragDrop';
export * from './DataGrid/DataGrid';
export * from './RichTextEditor/RichTextEditor';
export * from './FloatingUI/FloatingUI';
export * from './SliderRange/SliderRange';
export * from './Notifications/Notifications';
export * from './AvatarBadge/AvatarBadge';
export * from './TreeView/TreeView';
export * from './Charts/Charts';
export * from './FileUpload/FileUpload';
export * from './Stepper/Stepper';
export * from './StepperWizard/StepperWizard';
export * from './Loading/Loading';
export * from './DateTimePicker/DateTimePicker';
export * from './Search/Search';
export * from './Avatar/Avatar';
export * from './Navigation/Navigation';
export * from './Form/FormBuilder';

// ============================================================
// ADVANCED COMPONENTS
// ============================================================

export * from './Kanban/KanbanBoard';
export * from './Calendar/Calendar';
export * from './Timeline/Timeline';
export * from './Settings/SettingsPanel';
export * from './Analytics/DashboardAnalytics';
export * from './Projects/ProjectManagement';
export * from './Agents/AgentManagement';

// ============================================================
// LAYOUT COMPONENTS
// ============================================================

export * from './layout/NavigationLayout';
export * from './mobile/MobileLayouts';
export * from './theme/ThemeSystem';

// ============================================================
// CHE·NU™ 8 SPHERES
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
// CHE·NU™ 10 BUREAU SECTIONS
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
// CHE·NU™ BRAND COLORS
// ============================================================

export const CHENU_BRAND_COLORS = {
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
// VERSION
// ============================================================

export const CHENU_VERSION = '1.0.0';
export const CHENU_BUILD = '120K';
