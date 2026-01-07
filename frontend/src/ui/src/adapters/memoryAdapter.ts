/**
 * ============================================================
 * CHE·NU — UI DASHBOARD — MEMORY ADAPTER
 * SAFE · READ-ONLY · MOCK DATA
 * ============================================================
 */

import type { RootSphere } from "./universeAdapter";

// Mock Memory Summary
export interface MockMemorySummary {
  id: string;
  sphere: RootSphere;
  domain: string;
  type: "fact" | "preference" | "event" | "note" | "reference";
  preview: string;
  createdAt: number;
}

// Memory counts per sphere
const SPHERE_MEMORY_COUNTS: Record<RootSphere, number> = {
  Personal: 45,
  Business: 67,
  Creative: 32,
  Scholar: 89,
  SocialNetworkMedia: 28,
  Community: 41,
  XRImmersive: 23,
  MyTeam: 35,
  AILab: 52,
  Entertainment: 19
};

// Generate mock memory records for a sphere
export function getMemoryForSphere(sphere: RootSphere): MockMemorySummary[] {
  const types: MockMemorySummary["type"][] = ["fact", "preference", "event", "note", "reference"];
  const count = Math.min(SPHERE_MEMORY_COUNTS[sphere] || 10, 5); // Limit to 5 for display
  
  const memories: MockMemorySummary[] = [];
  
  for (let i = 0; i < count; i++) {
    memories.push({
      id: `mem_${sphere.toLowerCase()}_${i}`,
      sphere,
      domain: "General",
      type: types[i % types.length],
      preview: getMemoryPreview(sphere, types[i % types.length]),
      createdAt: Date.now() - Math.floor(Math.random() * 86400000 * 30)
    });
  }
  
  return memories;
}

// Get memory preview text
function getMemoryPreview(sphere: RootSphere, type: MockMemorySummary["type"]): string {
  const previews: Record<string, Record<string, string>> = {
    Personal: {
      fact: "Daily water intake goal: 8 glasses",
      preference: "Prefers morning workouts",
      event: "Started meditation practice",
      note: "Track sleep quality weekly",
      reference: "Health guidelines doc linked"
    },
    Business: {
      fact: "Q4 revenue target: $2.5M",
      preference: "Weekly status meetings preferred",
      event: "New supplier onboarded",
      note: "Review pricing strategy",
      reference: "SOP documentation linked"
    },
    Creative: {
      fact: "Brand colors: Gold, Emerald, Turquoise",
      preference: "Minimalist design approach",
      event: "Design system v2 launched",
      note: "Explore new typography",
      reference: "Style guide linked"
    },
    Scholar: {
      fact: "Thesis deadline: June 2025",
      preference: "Morning study sessions",
      event: "Literature review completed",
      note: "Schedule advisor meeting",
      reference: "Research database linked"
    },
    default: {
      fact: "General fact recorded",
      preference: "User preference noted",
      event: "Activity logged",
      note: "Important note saved",
      reference: "Reference material linked"
    }
  };
  
  const spherePreviews = previews[sphere] || previews.default;
  return spherePreviews[type] || "Memory record";
}

// Get memory count for sphere
export function getMemoryCount(sphere: RootSphere): number {
  return SPHERE_MEMORY_COUNTS[sphere] || 0;
}

// Get memory by type counts
export function getMemoryTypeCounts(sphere: RootSphere): Record<MockMemorySummary["type"], number> {
  const total = SPHERE_MEMORY_COUNTS[sphere] || 0;
  return {
    fact: Math.floor(total * 0.25),
    preference: Math.floor(total * 0.15),
    event: Math.floor(total * 0.20),
    note: Math.floor(total * 0.30),
    reference: Math.floor(total * 0.10)
  };
}

// Format memory type
export function formatMemoryType(type: MockMemorySummary["type"]): string {
  const labels: Record<MockMemorySummary["type"], string> = {
    fact: "📌 Fact",
    preference: "⭐ Preference",
    event: "📅 Event",
    note: "📝 Note",
    reference: "🔗 Reference"
  };
  return labels[type] || type;
}

// Format memory date
export function formatMemoryDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
