/**
 * CHE·NU™ - REPORTS STORE
 * 
 * Reports / History - Bureau Section 9
 * Tracks all activities, generates reports, maintains audit history
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SphereId } from '../config/spheres.config';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface Report {
  id: string;
  title: string;
  description: string;
  type: ReportType;
  sphereId: SphereId;
  
  // Content
  sections: ReportSection[];
  summary: string;
  insights: ReportInsight[];
  
  // Data
  dataSource: DataSource[];
  metrics: ReportMetric[];
  charts: ChartConfig[];
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  status: ReportStatus;
  
  // Scheduling
  schedule?: ReportSchedule;
  lastGeneratedAt?: string;
  
  // Sharing
  visibility: 'private' | 'my_team' | 'sphere' | 'public';
  sharedWith: string[];
}

export type ReportType = 
  | 'activity'
  | 'performance'
  | 'financial'
  | 'governance'
  | 'token_usage'
  | 'agent_performance'
  | 'custom';

export type ReportStatus = 'draft' | 'generating' | 'ready' | 'scheduled' | 'archived';

export interface ReportSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'chart' | 'table' | 'metric' | 'timeline';
  order: number;
  data?: unknown;
}

export interface ReportInsight {
  id: string;
  type: 'positive' | 'negative' | 'neutral' | 'warning';
  title: string;
  description: string;
  metric?: string;
  change?: number;
}

export interface DataSource {
  type: 'threads' | 'tokens' | 'agents' | 'meetings' | 'tasks' | 'dataspace';
  id?: string;
  dateRange?: { start: string; end: string };
}

export interface ReportMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  change?: number;
  changePercent?: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ChartConfig {
  id: string;
  type: 'line' | 'bar' | 'pie' | 'area' | 'gauge';
  title: string;
  data: unknown;
  options?: unknown;
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  recipients: string[];
}

// Activity/History Types
export interface ActivityEntry {
  id: string;
  type: ActivityType;
  action: string;
  description: string;
  sphereId: SphereId;
  entityType: string;
  entityId: string;
  actorId: string;
  actorName: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
  tokensUsed?: number;
}

export type ActivityType = 
  | 'create'
  | 'update'
  | 'delete'
  | 'view'
  | 'execute'
  | 'share'
  | 'comment'
  | 'decision'
  | 'governance';

// ═══════════════════════════════════════════════════════════════
// STORE STATE & ACTIONS
// ═══════════════════════════════════════════════════════════════

interface ReportState {
  // State
  reports: Record<string, Report>;
  activities: ActivityEntry[];
  activeReportId: string | null;
  isGenerating: boolean;
  
  // Report CRUD
  createReport: (data: CreateReportInput) => Report;
  getReport: (id: string) => Report | undefined;
  updateReport: (id: string, data: Partial<Report>) => void;
  deleteReport: (id: string) => void;
  
  // Report Generation
  generateReport: (type: ReportType, sphereId: SphereId, options?: GenerateOptions) => Promise<Report>;
  scheduleReport: (reportId: string, schedule: ReportSchedule) => void;
  
  // Navigation
  setActiveReport: (id: string | null) => void;
  getReportsBySphere: (sphereId: SphereId) => Report[];
  getReportsByType: (type: ReportType) => Report[];
  
  // Activity/History
  logActivity: (activity: Omit<ActivityEntry, 'id' | 'timestamp'>) => void;
  getActivities: (filters?: ActivityFilters) => ActivityEntry[];
  getActivitiesBySphere: (sphereId: SphereId, limit?: number) => ActivityEntry[];
  getActivitiesByEntity: (entityType: string, entityId: string) => ActivityEntry[];
  clearOldActivities: (olderThan: string) => void;
  
  // Analytics
  getActivitySummary: (sphereId?: SphereId) => ActivitySummary;
  getTokenUsageSummary: (sphereId?: SphereId) => TokenUsageSummary;
}

interface CreateReportInput {
  title: string;
  description?: string;
  type: ReportType;
  sphereId: SphereId;
  dataSources?: DataSource[];
}

interface GenerateOptions {
  dateRange?: { start: string; end: string };
  includeInsights?: boolean;
  includeCharts?: boolean;
}

interface ActivityFilters {
  sphereId?: SphereId;
  type?: ActivityType;
  entityType?: string;
  actorId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

interface ActivitySummary {
  totalActivities: number;
  byType: Record<ActivityType, number>;
  bySphere: Record<SphereId, number>;
  topActors: { actorId: string; count: number }[];
  recentTrend: 'increasing' | 'decreasing' | 'stable';
}

interface TokenUsageSummary {
  totalUsed: number;
  byAgent: { agentId: string; tokens: number }[];
  bySphere: { sphereId: SphereId; tokens: number }[];
  dailyAverage: number;
  trend: number; // percentage change
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

const generateId = () => `rpt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// ═══════════════════════════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════════════════════════

export const useReportStore = create<ReportState>()(
  persist(
    (set, get) => ({
      // Initial State
      reports: {},
      activities: [],
      activeReportId: null,
      isGenerating: false,

      // ─────────────────────────────────────────────────────────
      // Report CRUD
      // ─────────────────────────────────────────────────────────
      createReport: (data: CreateReportInput): Report => {
        const id = generateId();
        const now = new Date().toISOString();
        
        const report: Report = {
          id,
          title: data.title,
          description: data.description || '',
          type: data.type,
          sphereId: data.sphereId,
          sections: [],
          summary: '',
          insights: [],
          dataSource: data.dataSources || [],
          metrics: [],
          charts: [],
          createdAt: now,
          updatedAt: now,
          createdBy: 'current_user',
          status: 'draft',
          visibility: 'private',
          sharedWith: [],
        };

        set((state) => ({
          reports: { ...state.reports, [id]: report },
        }));

        get().logActivity({
          type: 'create',
          action: 'Created report',
          description: `Created report "${data.title}"`,
          sphereId: data.sphereId,
          entityType: 'report',
          entityId: id,
          actorId: 'current_user',
          actorName: 'You',
        });

        return report;
      },

      getReport: (id: string): Report | undefined => {
        return get().reports[id];
      },

      updateReport: (id: string, data: Partial<Report>): void => {
        set((state) => {
          const report = state.reports[id];
          if (!report) return state;
          
          return {
            reports: {
              ...state.reports,
              [id]: { ...report, ...data, updatedAt: new Date().toISOString() },
            },
          };
        });
      },

      deleteReport: (id: string): void => {
        set((state) => {
          const { [id]: deleted, ...remaining } = state.reports;
          return {
            reports: remaining,
            activeReportId: state.activeReportId === id ? null : state.activeReportId,
          };
        });
      },

      // ─────────────────────────────────────────────────────────
      // Report Generation
      // ─────────────────────────────────────────────────────────
      generateReport: async (type: ReportType, sphereId: SphereId, options?: GenerateOptions): Promise<Report> => {
        set({ isGenerating: true });

        // Simulate report generation
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const reportTitles: Record<ReportType, string> = {
          activity: 'Activity Report',
          performance: 'Performance Report',
          financial: 'Financial Report',
          governance: 'Governance Report',
          token_usage: 'Token Usage Report',
          agent_performance: 'Agent Performance Report',
          custom: 'Custom Report',
        };

        const report = get().createReport({
          title: `${reportTitles[type]} - ${new Date().toLocaleDateString()}`,
          type,
          sphereId,
        });

        // Add generated content
        const insights: ReportInsight[] = [
          {
            id: 'ins_1',
            type: 'positive',
            title: 'Productivity Up',
            description: 'Task completion rate increased by 15%',
            metric: 'completion_rate',
            change: 15,
          },
          {
            id: 'ins_2',
            type: 'neutral',
            title: 'Token Usage Stable',
            description: 'Token consumption remains within budget',
            metric: 'token_usage',
          },
        ];

        const metrics: ReportMetric[] = [
          { id: 'm1', name: 'Tasks Completed', value: 42, unit: 'tasks', change: 8, changePercent: 23, trend: 'up' },
          { id: 'm2', name: 'Tokens Used', value: 12500, unit: 'tokens', change: -500, changePercent: -4, trend: 'down' },
          { id: 'm3', name: 'Threads Active', value: 15, unit: 'threads', change: 3, changePercent: 25, trend: 'up' },
          { id: 'm4', name: 'Meetings Held', value: 8, unit: 'meetings', change: 0, changePercent: 0, trend: 'stable' },
        ];

        get().updateReport(report.id, {
          insights,
          metrics,
          summary: `This ${type} report covers activity from the ${sphereId} sphere. Overall performance is trending positively with increased task completion and stable token usage.`,
          status: 'ready',
          lastGeneratedAt: new Date().toISOString(),
        });

        set({ isGenerating: false });
        return get().reports[report.id];
      },

      scheduleReport: (reportId: string, schedule: ReportSchedule): void => {
        get().updateReport(reportId, { schedule, status: 'scheduled' });
      },

      // ─────────────────────────────────────────────────────────
      // Navigation
      // ─────────────────────────────────────────────────────────
      setActiveReport: (id: string | null): void => {
        set({ activeReportId: id });
      },

      getReportsBySphere: (sphereId: SphereId): Report[] => {
        return Object.values(get().reports).filter((r) => r.sphereId === sphereId);
      },

      getReportsByType: (type: ReportType): Report[] => {
        return Object.values(get().reports).filter((r) => r.type === type);
      },

      // ─────────────────────────────────────────────────────────
      // Activity/History
      // ─────────────────────────────────────────────────────────
      logActivity: (activity: Omit<ActivityEntry, 'id' | 'timestamp'>): void => {
        const entry: ActivityEntry = {
          ...activity,
          id: `act_${Date.now()}`,
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          activities: [entry, ...state.activities].slice(0, 1000), // Keep last 1000
        }));
      },

      getActivities: (filters?: ActivityFilters): ActivityEntry[] => {
        let result = [...get().activities];

        if (filters) {
          if (filters.sphereId) result = result.filter((a) => a.sphereId === filters.sphereId);
          if (filters.type) result = result.filter((a) => a.type === filters.type);
          if (filters.entityType) result = result.filter((a) => a.entityType === filters.entityType);
          if (filters.actorId) result = result.filter((a) => a.actorId === filters.actorId);
          if (filters.startDate) result = result.filter((a) => a.timestamp >= filters.startDate!);
          if (filters.endDate) result = result.filter((a) => a.timestamp <= filters.endDate!);
          if (filters.limit) result = result.slice(0, filters.limit);
        }

        return result;
      },

      getActivitiesBySphere: (sphereId: SphereId, limit = 50): ActivityEntry[] => {
        return get().getActivities({ sphereId, limit });
      },

      getActivitiesByEntity: (entityType: string, entityId: string): ActivityEntry[] => {
        return get().activities.filter(
          (a) => a.entityType === entityType && a.entityId === entityId
        );
      },

      clearOldActivities: (olderThan: string): void => {
        set((state) => ({
          activities: state.activities.filter((a) => a.timestamp >= olderThan),
        }));
      },

      // ─────────────────────────────────────────────────────────
      // Analytics
      // ─────────────────────────────────────────────────────────
      getActivitySummary: (sphereId?: SphereId): ActivitySummary => {
        const activities = sphereId 
          ? get().getActivitiesBySphere(sphereId, 1000)
          : get().activities;

        const byType: Record<ActivityType, number> = {
          create: 0, update: 0, delete: 0, view: 0,
          execute: 0, share: 0, comment: 0, decision: 0, governance: 0,
        };

        const bySphere: Record<string, number> = {};
        const actorCounts: Record<string, number> = {};

        activities.forEach((a) => {
          byType[a.type] = (byType[a.type] || 0) + 1;
          bySphere[a.sphereId] = (bySphere[a.sphereId] || 0) + 1;
          actorCounts[a.actorId] = (actorCounts[a.actorId] || 0) + 1;
        });

        const topActors = Object.entries(actorCounts)
          .map(([actorId, count]) => ({ actorId, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        return {
          totalActivities: activities.length,
          byType,
          bySphere: bySphere as Record<SphereId, number>,
          topActors,
          recentTrend: 'stable',
        };
      },

      getTokenUsageSummary: (sphereId?: SphereId): TokenUsageSummary => {
        const activities = sphereId
          ? get().getActivitiesBySphere(sphereId, 1000)
          : get().activities;

        const withTokens = activities.filter((a) => a.tokensUsed);
        const totalUsed = withTokens.reduce((sum, a) => sum + (a.tokensUsed || 0), 0);

        return {
          totalUsed,
          byAgent: [],
          bySphere: [],
          dailyAverage: Math.round(totalUsed / 30),
          trend: 5,
        };
      },
    }),
    {
      name: 'chenu-reports-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        reports: state.reports,
        activities: state.activities.slice(0, 500),
      }),
    }
  )
);

// ═══════════════════════════════════════════════════════════════
// SELECTORS
// ═══════════════════════════════════════════════════════════════

export const useReports = () => useReportStore((state) => Object.values(state.reports));
export const useActivities = (limit?: number) => useReportStore((state) => 
  limit ? state.activities.slice(0, limit) : state.activities
);
export const useIsGenerating = () => useReportStore((state) => state.isGenerating);

export default useReportStore;
