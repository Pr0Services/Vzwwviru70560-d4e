/**
 * ============================================================
 * CHE·NU — UI DASHBOARD — TEMPLATE ADAPTER
 * SAFE · READ-ONLY · MOCK DATA
 * ============================================================
 */

import type { RootSphere } from "./universeAdapter";

// Mock Template Summary
export interface MockTemplateSummary {
  id: string;
  name: string;
  sphere: RootSphere;
  domain: string;
  category: "document" | "form" | "report" | "workflow" | "layout" | "structure";
  sectionsCount: number;
  isPublic: boolean;
}

// Template definitions per sphere
const SPHERE_TEMPLATES: Record<RootSphere, MockTemplateSummary[]> = {
  Personal: [
    { id: "tpl_health_overview", name: "Health Overview", sphere: "Personal", domain: "Health & Wellbeing", category: "document", sectionsCount: 5, isPublic: true },
    { id: "tpl_habit_tracker", name: "Habit Tracker", sphere: "Personal", domain: "Habits & Routines", category: "form", sectionsCount: 8, isPublic: true },
    { id: "tpl_budget_report", name: "Budget Report", sphere: "Personal", domain: "Personal Finance", category: "report", sectionsCount: 6, isPublic: false },
    { id: "tpl_life_plan", name: "Life Plan Structure", sphere: "Personal", domain: "Life Organization", category: "structure", sectionsCount: 10, isPublic: true }
  ],
  Business: [
    { id: "tpl_project_brief", name: "Project Brief", sphere: "Business", domain: "Operations", category: "document", sectionsCount: 7, isPublic: true },
    { id: "tpl_invoice", name: "Invoice Template", sphere: "Business", domain: "Business Finance", category: "form", sectionsCount: 5, isPublic: true },
    { id: "tpl_construction_report", name: "Construction Report", sphere: "Business", domain: "Construction / Industrial", category: "report", sectionsCount: 12, isPublic: false },
    { id: "tpl_ops_workflow", name: "Operations Workflow", sphere: "Business", domain: "Operations", category: "workflow", sectionsCount: 8, isPublic: true }
  ],
  Creative: [
    { id: "tpl_design_brief", name: "Design Brief", sphere: "Creative", domain: "Design", category: "document", sectionsCount: 6, isPublic: true },
    { id: "tpl_storyboard", name: "Storyboard Layout", sphere: "Creative", domain: "Media Creation", category: "layout", sectionsCount: 4, isPublic: true },
    { id: "tpl_creative_workflow", name: "Creative Workflow", sphere: "Creative", domain: "Art & Visual", category: "workflow", sectionsCount: 7, isPublic: true }
  ],
  Scholar: [
    { id: "tpl_research_paper", name: "Research Paper", sphere: "Scholar", domain: "Research", category: "document", sectionsCount: 8, isPublic: true },
    { id: "tpl_study_plan", name: "Study Plan", sphere: "Scholar", domain: "Study & Learning", category: "structure", sectionsCount: 6, isPublic: true },
    { id: "tpl_literature_review", name: "Literature Review", sphere: "Scholar", domain: "Academic Writing", category: "document", sectionsCount: 5, isPublic: true }
  ],
  SocialNetworkMedia: [
    { id: "tpl_content_calendar", name: "Content Calendar", sphere: "SocialNetworkMedia", domain: "Posts & Content", category: "structure", sectionsCount: 4, isPublic: true },
    { id: "tpl_analytics_report", name: "Analytics Report", sphere: "SocialNetworkMedia", domain: "Influence & Analytics", category: "report", sectionsCount: 7, isPublic: false }
  ],
  Community: [
    { id: "tpl_forum_structure", name: "Forum Structure", sphere: "Community", domain: "Forum / Reddit-like", category: "structure", sectionsCount: 6, isPublic: true },
    { id: "tpl_event_plan", name: "Event Plan", sphere: "Community", domain: "Events & Gatherings", category: "document", sectionsCount: 8, isPublic: true },
    { id: "tpl_guidelines", name: "Community Guidelines", sphere: "Community", domain: "Groups & Pages", category: "document", sectionsCount: 5, isPublic: true }
  ],
  XRImmersive: [
    { id: "tpl_scene_layout", name: "Scene Layout", sphere: "XRImmersive", domain: "XR Scene", category: "layout", sectionsCount: 6, isPublic: true },
    { id: "tpl_avatar_spec", name: "Avatar Specification", sphere: "XRImmersive", domain: "Avatar Creation", category: "structure", sectionsCount: 8, isPublic: true }
  ],
  MyTeam: [
    { id: "tpl_role_doc", name: "Role Documentation", sphere: "MyTeam", domain: "Team Roles", category: "document", sectionsCount: 5, isPublic: false },
    { id: "tpl_meeting_agenda", name: "Meeting Agenda", sphere: "MyTeam", domain: "Coordination", category: "form", sectionsCount: 4, isPublic: true }
  ],
  AILab: [
    { id: "tpl_experiment_design", name: "Experiment Design", sphere: "AILab", domain: "Experiment Design", category: "structure", sectionsCount: 7, isPublic: true },
    { id: "tpl_test_report", name: "Test Report", sphere: "AILab", domain: "Test Rig", category: "report", sectionsCount: 6, isPublic: false }
  ],
  Entertainment: [
    { id: "tpl_catalog_structure", name: "Catalog Structure", sphere: "Entertainment", domain: "Video Streaming Platform", category: "structure", sectionsCount: 5, isPublic: true },
    { id: "tpl_game_design", name: "Game Design Doc", sphere: "Entertainment", domain: "Games & Play", category: "document", sectionsCount: 10, isPublic: true }
  ]
};

// Get templates for sphere
export function getTemplatesForSphere(sphere: RootSphere): MockTemplateSummary[] {
  return SPHERE_TEMPLATES[sphere] || [];
}

// Get templates by category
export function getTemplatesByCategory(sphere: RootSphere, category: MockTemplateSummary["category"]): MockTemplateSummary[] {
  return getTemplatesForSphere(sphere).filter(t => t.category === category);
}

// Get templates count
export function getTemplatesCount(sphere: RootSphere): number {
  return getTemplatesForSphere(sphere).length;
}

// Format template category
export function formatTemplateCategory(category: MockTemplateSummary["category"]): string {
  const labels: Record<MockTemplateSummary["category"], string> = {
    document: "📄 Document",
    form: "📝 Form",
    report: "📊 Report",
    workflow: "🔄 Workflow",
    layout: "📐 Layout",
    structure: "🏗️ Structure"
  };
  return labels[category] || category;
}
