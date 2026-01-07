/**
 * ============================================================
 * CHE·NU — UI DASHBOARD — PROJECT ADAPTER
 * SAFE · READ-ONLY · MOCK DATA
 * ============================================================
 */

import type { RootSphere } from "./universeAdapter";

// Mock Project Summary
export interface MockProjectSummary {
  id: string;
  name: string;
  sphere: RootSphere;
  domain: string;
  status: "draft" | "active" | "paused" | "completed" | "archived";
  missionsCount: number;
  phasesCount: number;
  progress: number;
}

// Project definitions per sphere
const SPHERE_PROJECTS: Record<RootSphere, MockProjectSummary[]> = {
  Personal: [
    { id: "proj_fitness_2024", name: "2024 Fitness Goals", sphere: "Personal", domain: "Health & Wellbeing", status: "active", missionsCount: 4, phasesCount: 12, progress: 45 },
    { id: "proj_budget_master", name: "Budget Mastery", sphere: "Personal", domain: "Personal Finance", status: "active", missionsCount: 3, phasesCount: 9, progress: 60 },
    { id: "proj_morning_routine", name: "Morning Routine Optimization", sphere: "Personal", domain: "Habits & Routines", status: "completed", missionsCount: 2, phasesCount: 6, progress: 100 }
  ],
  Business: [
    { id: "proj_q4_expansion", name: "Q4 Expansion Plan", sphere: "Business", domain: "Operations", status: "active", missionsCount: 5, phasesCount: 20, progress: 35 },
    { id: "proj_warehouse", name: "Warehouse Optimization", sphere: "Business", domain: "Supply & Logistics", status: "active", missionsCount: 3, phasesCount: 12, progress: 70 },
    { id: "proj_construction_a", name: "Building Project Alpha", sphere: "Business", domain: "Construction / Industrial", status: "active", missionsCount: 6, phasesCount: 24, progress: 25 }
  ],
  Creative: [
    { id: "proj_brand_refresh", name: "Brand Refresh", sphere: "Creative", domain: "Design", status: "active", missionsCount: 4, phasesCount: 16, progress: 55 },
    { id: "proj_video_series", name: "Video Series Production", sphere: "Creative", domain: "Media Creation", status: "active", missionsCount: 5, phasesCount: 15, progress: 40 }
  ],
  Scholar: [
    { id: "proj_thesis", name: "Master's Thesis", sphere: "Scholar", domain: "Research", status: "active", missionsCount: 4, phasesCount: 16, progress: 30 },
    { id: "proj_certification", name: "Professional Certification", sphere: "Scholar", domain: "Study & Learning", status: "active", missionsCount: 3, phasesCount: 9, progress: 65 }
  ],
  SocialNetworkMedia: [
    { id: "proj_content_2024", name: "2024 Content Strategy", sphere: "SocialNetworkMedia", domain: "Posts & Content", status: "active", missionsCount: 4, phasesCount: 12, progress: 50 },
    { id: "proj_engagement", name: "Engagement Growth", sphere: "SocialNetworkMedia", domain: "Influence & Analytics", status: "active", missionsCount: 3, phasesCount: 9, progress: 40 }
  ],
  Community: [
    { id: "proj_community_hub", name: "Community Hub Launch", sphere: "Community", domain: "Groups & Pages", status: "active", missionsCount: 4, phasesCount: 16, progress: 60 },
    { id: "proj_forum_v2", name: "Forum Platform V2", sphere: "Community", domain: "Forum / Reddit-like", status: "draft", missionsCount: 5, phasesCount: 20, progress: 10 }
  ],
  XRImmersive: [
    { id: "proj_vr_office", name: "VR Office Space", sphere: "XRImmersive", domain: "XR Scene", status: "active", missionsCount: 3, phasesCount: 12, progress: 45 },
    { id: "proj_avatar_system", name: "Avatar System V3", sphere: "XRImmersive", domain: "Avatar Creation", status: "active", missionsCount: 4, phasesCount: 16, progress: 35 }
  ],
  MyTeam: [
    { id: "proj_team_structure", name: "Team Restructure", sphere: "MyTeam", domain: "Team Roles", status: "completed", missionsCount: 2, phasesCount: 8, progress: 100 },
    { id: "proj_collab_tools", name: "Collaboration Tools Rollout", sphere: "MyTeam", domain: "Collaboration", status: "active", missionsCount: 3, phasesCount: 9, progress: 75 }
  ],
  AILab: [
    { id: "proj_model_eval", name: "Model Evaluation Suite", sphere: "AILab", domain: "Test Rig", status: "active", missionsCount: 4, phasesCount: 16, progress: 55 },
    { id: "proj_sandbox_v2", name: "Sandbox Environment V2", sphere: "AILab", domain: "Sandbox", status: "active", missionsCount: 3, phasesCount: 12, progress: 40 }
  ],
  Entertainment: [
    { id: "proj_streaming_platform", name: "Streaming Platform Launch", sphere: "Entertainment", domain: "Video Streaming Platform", status: "active", missionsCount: 6, phasesCount: 24, progress: 50 },
    { id: "proj_game_night", name: "Game Night System", sphere: "Entertainment", domain: "Games & Play", status: "completed", missionsCount: 2, phasesCount: 8, progress: 100 }
  ]
};

// Get projects for sphere
export function getProjectsForSphere(sphere: RootSphere): MockProjectSummary[] {
  return SPHERE_PROJECTS[sphere] || [];
}

// Get projects by status
export function getProjectsByStatus(sphere: RootSphere, status: MockProjectSummary["status"]): MockProjectSummary[] {
  return getProjectsForSphere(sphere).filter(p => p.status === status);
}

// Get active projects count
export function getActiveProjectsCount(sphere: RootSphere): number {
  return getProjectsByStatus(sphere, "active").length;
}

// Get total projects count
export function getProjectsCount(sphere: RootSphere): number {
  return getProjectsForSphere(sphere).length;
}

// Format project status
export function formatProjectStatus(status: MockProjectSummary["status"]): string {
  const labels: Record<MockProjectSummary["status"], string> = {
    draft: "📝 Draft",
    active: "▶️ Active",
    paused: "⏸️ Paused",
    completed: "✅ Completed",
    archived: "📦 Archived"
  };
  return labels[status] || status;
}

// Get status color
export function getStatusColor(status: MockProjectSummary["status"]): string {
  const colors: Record<MockProjectSummary["status"], string> = {
    draft: "#8D8371",
    active: "#3F7249",
    paused: "#D8B26A",
    completed: "#3EB4A2",
    archived: "#7A593A"
  };
  return colors[status] || "#8D8371";
}
