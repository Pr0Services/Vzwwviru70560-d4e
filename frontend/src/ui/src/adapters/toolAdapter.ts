/**
 * ============================================================
 * CHE·NU — UI DASHBOARD — TOOL ADAPTER
 * SAFE · READ-ONLY · MOCK DATA
 * ============================================================
 */

import type { RootSphere } from "./universeAdapter";

// Mock Tool Summary
export interface MockToolSummary {
  id: string;
  name: string;
  sphere: RootSphere;
  domain: string;
  type: "tool" | "toolset" | "toolchain" | "pipeline";
  description: string;
  enginesCount: number;
}

// Tool definitions per sphere
const SPHERE_TOOLS: Record<RootSphere, MockToolSummary[]> = {
  Personal: [
    { id: "tool_health_tracker", name: "Health Tracker", sphere: "Personal", domain: "Health & Wellbeing", type: "tool", description: "Track health metrics", enginesCount: 2 },
    { id: "tool_habit_builder", name: "Habit Builder", sphere: "Personal", domain: "Habits & Routines", type: "tool", description: "Create and track habits", enginesCount: 1 },
    { id: "tool_budget_planner", name: "Budget Planner", sphere: "Personal", domain: "Personal Finance", type: "tool", description: "Plan and track budgets", enginesCount: 1 },
    { id: "toolset_wellness", name: "Wellness Toolset", sphere: "Personal", domain: "Health & Wellbeing", type: "toolset", description: "Complete wellness tools", enginesCount: 3 },
    { id: "pipeline_routine", name: "Daily Routine Pipeline", sphere: "Personal", domain: "Life Organization", type: "pipeline", description: "Automate daily routines", enginesCount: 2 }
  ],
  Business: [
    { id: "tool_invoice_gen", name: "Invoice Generator", sphere: "Business", domain: "Business Finance", type: "tool", description: "Generate invoices", enginesCount: 1 },
    { id: "tool_project_tracker", name: "Project Tracker", sphere: "Business", domain: "Operations", type: "tool", description: "Track project progress", enginesCount: 2 },
    { id: "tool_inventory_mgr", name: "Inventory Manager", sphere: "Business", domain: "Supply & Logistics", type: "tool", description: "Manage inventory", enginesCount: 2 },
    { id: "toolchain_construction", name: "Construction Toolchain", sphere: "Business", domain: "Construction / Industrial", type: "toolchain", description: "Full construction workflow", enginesCount: 4 },
    { id: "pipeline_operations", name: "Operations Pipeline", sphere: "Business", domain: "Operations", type: "pipeline", description: "Streamline operations", enginesCount: 3 }
  ],
  Creative: [
    { id: "tool_color_palette", name: "Color Palette Generator", sphere: "Creative", domain: "Design", type: "tool", description: "Generate color palettes", enginesCount: 1 },
    { id: "tool_moodboard", name: "Moodboard Creator", sphere: "Creative", domain: "Concept & Ideation", type: "tool", description: "Create moodboards", enginesCount: 1 },
    { id: "tool_storyboard", name: "Storyboard Tool", sphere: "Creative", domain: "Media Creation", type: "tool", description: "Create storyboards", enginesCount: 1 },
    { id: "toolset_design", name: "Design Toolset", sphere: "Creative", domain: "Design", type: "toolset", description: "Complete design tools", enginesCount: 3 }
  ],
  Scholar: [
    { id: "tool_citation_gen", name: "Citation Generator", sphere: "Scholar", domain: "Academic Writing", type: "tool", description: "Generate citations", enginesCount: 1 },
    { id: "tool_note_taker", name: "Note Taker", sphere: "Scholar", domain: "Study & Learning", type: "tool", description: "Take structured notes", enginesCount: 1 },
    { id: "tool_research_org", name: "Research Organizer", sphere: "Scholar", domain: "Research", type: "tool", description: "Organize research", enginesCount: 2 },
    { id: "toolchain_paper", name: "Paper Writing Toolchain", sphere: "Scholar", domain: "Academic Writing", type: "toolchain", description: "Full paper workflow", enginesCount: 3 }
  ],
  SocialNetworkMedia: [
    { id: "tool_post_scheduler", name: "Post Scheduler", sphere: "SocialNetworkMedia", domain: "Posts & Content", type: "tool", description: "Schedule posts", enginesCount: 1 },
    { id: "tool_analytics", name: "Analytics Dashboard", sphere: "SocialNetworkMedia", domain: "Influence & Analytics", type: "tool", description: "Track engagement", enginesCount: 2 },
    { id: "tool_content_calendar", name: "Content Calendar", sphere: "SocialNetworkMedia", domain: "Posts & Content", type: "tool", description: "Plan content", enginesCount: 1 }
  ],
  Community: [
    { id: "tool_forum_mod", name: "Forum Moderator", sphere: "Community", domain: "Forum / Reddit-like", type: "tool", description: "Moderate forums", enginesCount: 2 },
    { id: "tool_event_planner", name: "Event Planner", sphere: "Community", domain: "Events & Gatherings", type: "tool", description: "Plan events", enginesCount: 1 },
    { id: "tool_announcement", name: "Announcement Tool", sphere: "Community", domain: "Public Announcements", type: "tool", description: "Create announcements", enginesCount: 1 }
  ],
  XRImmersive: [
    { id: "tool_scene_builder", name: "Scene Builder", sphere: "XRImmersive", domain: "XR Scene", type: "tool", description: "Build XR scenes", enginesCount: 3 },
    { id: "tool_avatar_creator", name: "Avatar Creator", sphere: "XRImmersive", domain: "Avatar Creation", type: "tool", description: "Create avatars", enginesCount: 2 },
    { id: "toolchain_world", name: "World Building Toolchain", sphere: "XRImmersive", domain: "World Building", type: "toolchain", description: "Build virtual worlds", enginesCount: 4 }
  ],
  MyTeam: [
    { id: "tool_task_assigner", name: "Task Assigner", sphere: "MyTeam", domain: "Delegation", type: "tool", description: "Assign tasks", enginesCount: 1 },
    { id: "tool_team_calendar", name: "Team Calendar", sphere: "MyTeam", domain: "Coordination", type: "tool", description: "Coordinate schedules", enginesCount: 1 },
    { id: "tool_collab_board", name: "Collaboration Board", sphere: "MyTeam", domain: "Collaboration", type: "tool", description: "Collaborate in real-time", enginesCount: 2 }
  ],
  AILab: [
    { id: "tool_prompt_tester", name: "Prompt Tester", sphere: "AILab", domain: "Test Rig", type: "tool", description: "Test AI prompts", enginesCount: 2 },
    { id: "tool_model_explorer", name: "Model Explorer", sphere: "AILab", domain: "Model Exploration", type: "tool", description: "Explore AI models", enginesCount: 2 },
    { id: "toolchain_experiment", name: "Experiment Toolchain", sphere: "AILab", domain: "Experiment Design", type: "toolchain", description: "Run experiments", enginesCount: 3 }
  ],
  Entertainment: [
    { id: "tool_playlist_gen", name: "Playlist Generator", sphere: "Entertainment", domain: "Video Streaming Platform", type: "tool", description: "Generate playlists", enginesCount: 1 },
    { id: "tool_game_tracker", name: "Game Progress Tracker", sphere: "Entertainment", domain: "Games & Play", type: "tool", description: "Track game progress", enginesCount: 1 },
    { id: "tool_stream_manager", name: "Stream Manager", sphere: "Entertainment", domain: "Live Events", type: "tool", description: "Manage streams", enginesCount: 2 }
  ]
};

// Get tools for sphere
export function getToolsForSphere(sphere: RootSphere): MockToolSummary[] {
  return SPHERE_TOOLS[sphere] || [];
}

// Get tools by type
export function getToolsByType(sphere: RootSphere, type: MockToolSummary["type"]): MockToolSummary[] {
  return getToolsForSphere(sphere).filter(t => t.type === type);
}

// Get tools count
export function getToolsCount(sphere: RootSphere): number {
  return getToolsForSphere(sphere).length;
}

// Format tool type
export function formatToolType(type: MockToolSummary["type"]): string {
  const labels: Record<MockToolSummary["type"], string> = {
    tool: "🔧 Tool",
    toolset: "🧰 Toolset",
    toolchain: "⛓️ Toolchain",
    pipeline: "🔄 Pipeline"
  };
  return labels[type] || type;
}
