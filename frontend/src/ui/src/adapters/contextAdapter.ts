/**
 * ============================================================
 * CHE·NU — UI DASHBOARD — CONTEXT ADAPTER
 * SAFE · READ-ONLY · MOCK DATA
 * ============================================================
 */

import type { RootSphere } from "./universeAdapter";
import { getDomainsForSphere, getEnginesForSphere } from "./universeAdapter";

// Mock Context Snapshot
export interface MockContextSnapshot {
  id: string;
  sphere: RootSphere;
  domain: string;
  engines: string[];
  threads: unknown[];
  memoryRecords: number;
  tools: number;
  toolsets: number;
  toolchains: number;
  pipelines: number;
  processes: number;
  processChains: number;
  processProfiles: number;
  createdAt: number;
  meta: Record<string, any>;
}

// Generate mock context for a sphere
export function getMockContextForSphere(sphere: RootSphere): MockContextSnapshot {
  const domains = getDomainsForSphere(sphere);
  const engines = getEnginesForSphere(sphere);
  
  return {
    id: `ctx_mock_${sphere.toLowerCase()}`,
    sphere,
    domain: domains[0] || "General",
    engines: engines.slice(0, 3),
    threads: [],
    memoryRecords: Math.floor(Math.random() * 50) + 10,
    tools: Math.floor(Math.random() * 20) + 5,
    toolsets: Math.floor(Math.random() * 5) + 1,
    toolchains: Math.floor(Math.random() * 3) + 1,
    pipelines: Math.floor(Math.random() * 4) + 1,
    processes: Math.floor(Math.random() * 15) + 3,
    processChains: Math.floor(Math.random() * 5) + 1,
    processProfiles: Math.floor(Math.random() * 3) + 1,
    createdAt: Date.now() - Math.floor(Math.random() * 86400000 * 30),
    meta: { safe: true, mockData: true }
  };
}

// Get context summary stats
export function getContextStats(context: MockContextSnapshot): {
  totalTools: number;
  totalProcesses: number;
  totalMemory: number;
  enginesActive: number;
} {
  return {
    totalTools: context.tools + context.toolsets + context.toolchains + context.pipelines,
    totalProcesses: context.processes + context.processChains + context.processProfiles,
    totalMemory: context.memoryRecords,
    enginesActive: context.engines.length
  };
}

// Format context for display
export function formatContextDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
