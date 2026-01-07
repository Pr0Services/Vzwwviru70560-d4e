/**
 * ============================================================
 * CHE·NU — UI DASHBOARD — PROCESS ADAPTER
 * SAFE · READ-ONLY · MOCK DATA
 * ============================================================
 */

import type { RootSphere } from "./universeAdapter";

// Mock Process Summary
export interface MockProcessSummary {
  id: string;
  name: string;
  sphere: RootSphere;
  domain: string;
  type: "model" | "chain" | "profile";
  stepsCount: number;
  description: string;
}

// Process definitions per sphere
const SPHERE_PROCESSES: Record<RootSphere, MockProcessSummary[]> = {
  Personal: [
    { id: "proc_morning_routine", name: "Morning Routine", sphere: "Personal", domain: "Habits & Routines", type: "model", stepsCount: 5, description: "Morning routine process" },
    { id: "proc_health_check", name: "Health Check Flow", sphere: "Personal", domain: "Health & Wellbeing", type: "model", stepsCount: 4, description: "Health assessment process" },
    { id: "proc_budget_review", name: "Budget Review", sphere: "Personal", domain: "Personal Finance", type: "chain", stepsCount: 6, description: "Monthly budget review chain" },
    { id: "proc_wellness_profile", name: "Wellness Profile", sphere: "Personal", domain: "Health & Wellbeing", type: "profile", stepsCount: 8, description: "Complete wellness profile" }
  ],
  Business: [
    { id: "proc_project_lifecycle", name: "Project Lifecycle", sphere: "Business", domain: "Operations", type: "chain", stepsCount: 8, description: "Full project lifecycle chain" },
    { id: "proc_invoice_flow", name: "Invoice Processing", sphere: "Business", domain: "Business Finance", type: "model", stepsCount: 5, description: "Invoice processing flow" },
    { id: "proc_construction_phase", name: "Construction Phases", sphere: "Business", domain: "Construction / Industrial", type: "chain", stepsCount: 10, description: "Construction phase management" },
    { id: "proc_supply_chain", name: "Supply Chain Model", sphere: "Business", domain: "Supply & Logistics", type: "model", stepsCount: 7, description: "Supply chain process" }
  ],
  Creative: [
    { id: "proc_design_sprint", name: "Design Sprint", sphere: "Creative", domain: "Design", type: "chain", stepsCount: 5, description: "Design sprint process" },
    { id: "proc_creative_review", name: "Creative Review", sphere: "Creative", domain: "Art & Visual", type: "model", stepsCount: 4, description: "Creative review cycle" },
    { id: "proc_media_production", name: "Media Production", sphere: "Creative", domain: "Media Creation", type: "chain", stepsCount: 7, description: "Full production workflow" }
  ],
  Scholar: [
    { id: "proc_research_method", name: "Research Methodology", sphere: "Scholar", domain: "Research", type: "profile", stepsCount: 8, description: "Research methodology profile" },
    { id: "proc_paper_writing", name: "Paper Writing", sphere: "Scholar", domain: "Academic Writing", type: "chain", stepsCount: 6, description: "Academic paper workflow" },
    { id: "proc_study_plan", name: "Study Planning", sphere: "Scholar", domain: "Study & Learning", type: "model", stepsCount: 5, description: "Study plan creation" }
  ],
  SocialNetworkMedia: [
    { id: "proc_content_pipeline", name: "Content Pipeline", sphere: "SocialNetworkMedia", domain: "Posts & Content", type: "chain", stepsCount: 6, description: "Content creation to publish" },
    { id: "proc_engagement_cycle", name: "Engagement Cycle", sphere: "SocialNetworkMedia", domain: "Comments & Engagement", type: "model", stepsCount: 4, description: "Engagement management" }
  ],
  Community: [
    { id: "proc_event_lifecycle", name: "Event Lifecycle", sphere: "Community", domain: "Events & Gatherings", type: "chain", stepsCount: 7, description: "Event planning to execution" },
    { id: "proc_moderation_flow", name: "Moderation Flow", sphere: "Community", domain: "Forum / Reddit-like", type: "model", stepsCount: 5, description: "Content moderation process" }
  ],
  XRImmersive: [
    { id: "proc_scene_creation", name: "Scene Creation", sphere: "XRImmersive", domain: "XR Scene", type: "chain", stepsCount: 8, description: "XR scene creation workflow" },
    { id: "proc_avatar_design", name: "Avatar Design", sphere: "XRImmersive", domain: "Avatar Creation", type: "model", stepsCount: 6, description: "Avatar design process" }
  ],
  MyTeam: [
    { id: "proc_task_delegation", name: "Task Delegation", sphere: "MyTeam", domain: "Delegation", type: "model", stepsCount: 4, description: "Task delegation workflow" },
    { id: "proc_team_sync", name: "Team Sync", sphere: "MyTeam", domain: "Coordination", type: "model", stepsCount: 5, description: "Team synchronization process" }
  ],
  AILab: [
    { id: "proc_experiment_design", name: "Experiment Design", sphere: "AILab", domain: "Experiment Design", type: "profile", stepsCount: 7, description: "Experiment design profile" },
    { id: "proc_model_testing", name: "Model Testing", sphere: "AILab", domain: "Test Rig", type: "chain", stepsCount: 6, description: "Model testing workflow" }
  ],
  Entertainment: [
    { id: "proc_content_curation", name: "Content Curation", sphere: "Entertainment", domain: "Video Streaming Platform", type: "model", stepsCount: 5, description: "Content curation process" },
    { id: "proc_live_event", name: "Live Event Flow", sphere: "Entertainment", domain: "Live Events", type: "chain", stepsCount: 8, description: "Live event management" }
  ]
};

// Get processes for sphere
export function getProcessesForSphere(sphere: RootSphere): MockProcessSummary[] {
  return SPHERE_PROCESSES[sphere] || [];
}

// Get processes by type
export function getProcessesByType(sphere: RootSphere, type: MockProcessSummary["type"]): MockProcessSummary[] {
  return getProcessesForSphere(sphere).filter(p => p.type === type);
}

// Get processes count
export function getProcessesCount(sphere: RootSphere): number {
  return getProcessesForSphere(sphere).length;
}

// Format process type
export function formatProcessType(type: MockProcessSummary["type"]): string {
  const labels: Record<MockProcessSummary["type"], string> = {
    model: "📋 Model",
    chain: "⛓️ Chain",
    profile: "📊 Profile"
  };
  return labels[type] || type;
}
