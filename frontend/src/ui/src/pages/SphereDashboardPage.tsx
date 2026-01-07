/**
 * ============================================================
 * CHE·NU — UI DASHBOARD — SPHERE DASHBOARD PAGE
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 * 
 * Detailed dashboard view for a single sphere.
 */

import React, { useState } from "react";
import type { RootSphere } from "../adapters/universeAdapter";
import { 
  getSphereLabel, 
  getSphereIcon, 
  getSphereColor,
  getSphereDescription,
  getDomainsForSphere,
  getEnginesForSphere
} from "../adapters/universeAdapter";
import { getToolsForSphere, type Tool } from "../adapters/toolAdapter";
import { getProcessesForSphere, type Process } from "../adapters/processAdapter";
import { getProjectsForSphere, type Project } from "../adapters/projectAdapter";
import { getTemplatesForSphere, type Template } from "../adapters/templateAdapter";
import { getMemoryForSphere, type MemoryEntry } from "../adapters/memoryAdapter";

type TabId = "overview" | "domains" | "tools" | "processes" | "projects" | "templates" | "memory";

interface SphereDashboardPageProps {
  sphere: RootSphere;
  onBack: () => void;
}

export const SphereDashboardPage: React.FC<SphereDashboardPageProps> = ({ sphere, onBack }) => {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  
  const color = getSphereColor(sphere);
  const domains = getDomainsForSphere(sphere);
  const engines = getEnginesForSphere(sphere);
  const tools = getToolsForSphere(sphere);
  const processes = getProcessesForSphere(sphere);
  const projects = getProjectsForSphere(sphere);
  const templates = getTemplatesForSphere(sphere);
  const memory = getMemoryForSphere(sphere);

  const tabs: { id: TabId; label: string; count: number; icon: string }[] = [
    { id: "overview", label: "Overview", count: 0, icon: "📊" },
    { id: "domains", label: "Domains", count: domains.length, icon: "🗂️" },
    { id: "tools", label: "Tools", count: tools.length, icon: "🔧" },
    { id: "processes", label: "Processes", count: processes.length, icon: "⚙️" },
    { id: "projects", label: "Projects", count: projects.length, icon: "📁" },
    { id: "templates", label: "Templates", count: templates.length, icon: "📋" },
    { id: "memory", label: "Memory", count: memory.length, icon: "🧠" }
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={{
        ...styles.header,
        borderBottomColor: color
      }}>
        <div style={styles.headerLeft}>
          <button style={styles.backButton} onClick={onBack}>
            ← Back to Universe
          </button>
          <div style={styles.headerTitle}>
            <span style={{
              ...styles.sphereIcon,
              backgroundColor: color + "20"
            }}>
              {getSphereIcon(sphere)}
            </span>
            <div>
              <h1 style={styles.title}>{getSphereLabel(sphere)}</h1>
              <span style={styles.sphereId}>{sphere}</span>
            </div>
          </div>
        </div>
        <div style={styles.headerRight}>
          <span style={{
            ...styles.statusBadge,
            backgroundColor: color + "20",
            color: color
          }}>
            ● Active
          </span>
          <span style={styles.badge}>🔒 Read-Only</span>
        </div>
      </div>

      {/* Description */}
      <p style={styles.description}>{getSphereDescription(sphere)}</p>

      {/* Quick Stats */}
      <div style={styles.quickStats}>
        <QuickStat label="Domains" value={domains.length} color={color} />
        <QuickStat label="Engines" value={engines.length} color={color} />
        <QuickStat label="Tools" value={tools.length} color={color} />
        <QuickStat label="Processes" value={processes.length} color={color} />
        <QuickStat label="Projects" value={projects.length} color={color} />
        <QuickStat label="Templates" value={templates.length} color={color} />
      </div>

      {/* Tabs Navigation */}
      <div style={styles.tabsNav}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            style={{
              ...styles.tabButton,
              ...(activeTab === tab.id ? {
                backgroundColor: color + "15",
                borderBottomColor: color,
                color: color
              } : {})
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span style={{
                ...styles.tabCount,
                backgroundColor: activeTab === tab.id ? color : "#E5E5E5",
                color: activeTab === tab.id ? "#FFF" : "#666"
              }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={styles.tabContent}>
        {activeTab === "overview" && (
          <OverviewTab 
            sphere={sphere} 
            color={color}
            domains={domains}
            engines={engines}
            tools={tools}
            processes={processes}
            projects={projects}
          />
        )}
        {activeTab === "domains" && (
          <DomainsTab domains={domains} color={color} />
        )}
        {activeTab === "tools" && (
          <ToolsTab tools={tools} color={color} />
        )}
        {activeTab === "processes" && (
          <ProcessesTab processes={processes} color={color} />
        )}
        {activeTab === "projects" && (
          <ProjectsTab projects={projects} color={color} />
        )}
        {activeTab === "templates" && (
          <TemplatesTab templates={templates} color={color} />
        )}
        {activeTab === "memory" && (
          <MemoryTab memory={memory} color={color} />
        )}
      </div>
    </div>
  );
};

// Quick Stat Component
const QuickStat: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div style={styles.quickStatCard}>
    <span style={{
      ...styles.quickStatValue,
      color: color
    }}>
      {value}
    </span>
    <span style={styles.quickStatLabel}>{label}</span>
  </div>
);

// Overview Tab
const OverviewTab: React.FC<{
  sphere: RootSphere;
  color: string;
  domains: string[];
  engines: string[];
  tools: Tool[];
  processes: Process[];
  projects: Project[];
}> = ({ sphere, color, domains, engines, tools, processes, projects }) => (
  <div style={styles.overviewGrid}>
    {/* Domains Card */}
    <div style={styles.overviewCard}>
      <h3 style={styles.overviewCardTitle}>
        <span>🗂️</span> Domains
      </h3>
      <div style={styles.overviewList}>
        {domains.slice(0, 5).map(domain => (
          <div key={domain} style={styles.overviewListItem}>
            <span style={{
              ...styles.dot,
              backgroundColor: color
            }} />
            {domain}
          </div>
        ))}
        {domains.length > 5 && (
          <span style={styles.moreLink}>+{domains.length - 5} more</span>
        )}
      </div>
    </div>

    {/* Engines Card */}
    <div style={styles.overviewCard}>
      <h3 style={styles.overviewCardTitle}>
        <span>⚙️</span> Active Engines
      </h3>
      <div style={styles.overviewList}>
        {engines.slice(0, 5).map(engine => (
          <div key={engine} style={styles.overviewListItem}>
            <span style={{
              ...styles.dot,
              backgroundColor: color
            }} />
            {engine}
          </div>
        ))}
        {engines.length > 5 && (
          <span style={styles.moreLink}>+{engines.length - 5} more</span>
        )}
      </div>
    </div>

    {/* Recent Projects Card */}
    <div style={styles.overviewCard}>
      <h3 style={styles.overviewCardTitle}>
        <span>📁</span> Recent Projects
      </h3>
      <div style={styles.overviewList}>
        {projects.slice(0, 4).map(project => (
          <div key={project.id} style={styles.projectItem}>
            <div style={styles.projectHeader}>
              <span style={styles.projectName}>{project.name}</span>
              <span style={{
                ...styles.projectStatus,
                backgroundColor: project.status === "active" ? "#3F724920" : "#E5E5E5",
                color: project.status === "active" ? "#3F7249" : "#666"
              }}>
                {project.status}
              </span>
            </div>
            <div style={styles.projectProgress}>
              <div style={{
                ...styles.projectProgressBar,
                width: `${project.progress}%`,
                backgroundColor: color
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Activity Summary */}
    <div style={styles.overviewCard}>
      <h3 style={styles.overviewCardTitle}>
        <span>📊</span> Activity Summary
      </h3>
      <div style={styles.activitySummary}>
        <div style={styles.activityRow}>
          <span>Tools Available</span>
          <span style={styles.activityValue}>{tools.length}</span>
        </div>
        <div style={styles.activityRow}>
          <span>Active Processes</span>
          <span style={styles.activityValue}>{processes.filter(p => p.status === "running").length}</span>
        </div>
        <div style={styles.activityRow}>
          <span>Active Projects</span>
          <span style={styles.activityValue}>{projects.filter(p => p.status === "active").length}</span>
        </div>
        <div style={styles.activityRow}>
          <span>Completed Projects</span>
          <span style={styles.activityValue}>{projects.filter(p => p.status === "completed").length}</span>
        </div>
      </div>
    </div>
  </div>
);

// Domains Tab
const DomainsTab: React.FC<{ domains: string[]; color: string }> = ({ domains, color }) => (
  <div style={styles.gridList}>
    {domains.map(domain => (
      <div key={domain} style={styles.domainCard}>
        <span style={{
          ...styles.domainIcon,
          backgroundColor: color + "20"
        }}>
          🗂️
        </span>
        <span style={styles.domainName}>{domain}</span>
      </div>
    ))}
  </div>
);

// Tools Tab
const ToolsTab: React.FC<{ tools: Tool[]; color: string }> = ({ tools, color }) => (
  <div style={styles.tableContainer}>
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Tool</th>
          <th style={styles.th}>Category</th>
          <th style={styles.th}>Status</th>
          <th style={styles.th}>Description</th>
        </tr>
      </thead>
      <tbody>
        {tools.map(tool => (
          <tr key={tool.id}>
            <td style={styles.td}>
              <div style={styles.toolCell}>
                <span style={styles.toolIcon}>{tool.icon}</span>
                <span style={styles.toolName}>{tool.name}</span>
              </div>
            </td>
            <td style={styles.td}>
              <span style={styles.categoryBadge}>{tool.category}</span>
            </td>
            <td style={styles.td}>
              <span style={{
                ...styles.statusDot,
                backgroundColor: tool.status === "active" ? "#3F7249" : "#CCC"
              }} />
              {tool.status}
            </td>
            <td style={styles.tdDesc}>{tool.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Processes Tab
const ProcessesTab: React.FC<{ processes: Process[]; color: string }> = ({ processes, color }) => (
  <div style={styles.processGrid}>
    {processes.map(process => (
      <div key={process.id} style={styles.processCard}>
        <div style={styles.processHeader}>
          <span style={styles.processIcon}>{process.icon}</span>
          <div>
            <span style={styles.processName}>{process.name}</span>
            <span style={{
              ...styles.processStatus,
              backgroundColor: process.status === "running" ? "#3F724920" : 
                             process.status === "paused" ? "#D8B26A20" : "#E5E5E5",
              color: process.status === "running" ? "#3F7249" : 
                     process.status === "paused" ? "#D8B26A" : "#666"
            }}>
              {process.status}
            </span>
          </div>
        </div>
        <p style={styles.processDesc}>{process.description}</p>
        <div style={styles.processProgress}>
          <div style={{
            ...styles.processProgressBar,
            width: `${process.progress}%`,
            backgroundColor: color
          }} />
        </div>
        <span style={styles.processProgressText}>{process.progress}% complete</span>
      </div>
    ))}
  </div>
);

// Projects Tab
const ProjectsTab: React.FC<{ projects: Project[]; color: string }> = ({ projects, color }) => (
  <div style={styles.projectsGrid}>
    {projects.map(project => (
      <div key={project.id} style={styles.projectCard}>
        <div style={styles.projectCardHeader}>
          <h4 style={styles.projectCardTitle}>{project.name}</h4>
          <span style={{
            ...styles.projectCardStatus,
            backgroundColor: project.status === "active" ? "#3F724920" : 
                           project.status === "completed" ? "#3EB4A220" : "#E5E5E5",
            color: project.status === "active" ? "#3F7249" : 
                   project.status === "completed" ? "#3EB4A2" : "#666"
          }}>
            {project.status}
          </span>
        </div>
        <p style={styles.projectCardDesc}>{project.description}</p>
        <div style={styles.projectCardMeta}>
          <span>📅 {project.startDate}</span>
          <span>👥 {project.team} members</span>
        </div>
        <div style={styles.projectCardProgress}>
          <div style={styles.projectCardProgressHeader}>
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <div style={styles.projectCardProgressBar}>
            <div style={{
              ...styles.projectCardProgressFill,
              width: `${project.progress}%`,
              backgroundColor: color
            }} />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Templates Tab
const TemplatesTab: React.FC<{ templates: Template[]; color: string }> = ({ templates, color }) => (
  <div style={styles.templatesGrid}>
    {templates.map(template => (
      <div key={template.id} style={styles.templateCard}>
        <div style={styles.templateHeader}>
          <span style={{
            ...styles.templateIcon,
            backgroundColor: color + "20"
          }}>
            {template.icon}
          </span>
          <span style={styles.templateCategory}>{template.category}</span>
        </div>
        <h4 style={styles.templateName}>{template.name}</h4>
        <p style={styles.templateDesc}>{template.description}</p>
        <div style={styles.templateMeta}>
          <span>📄 {template.fields} fields</span>
          <span>🔄 Used {template.usageCount} times</span>
        </div>
      </div>
    ))}
  </div>
);

// Memory Tab
const MemoryTab: React.FC<{ memory: MemoryEntry[]; color: string }> = ({ memory, color }) => (
  <div style={styles.memoryContainer}>
    <div style={styles.memoryHeader}>
      <span style={styles.memoryNote}>
        🔒 Memory entries are read-only and external. No persistent state is stored.
      </span>
    </div>
    <div style={styles.memoryList}>
      {memory.map(entry => (
        <div key={entry.id} style={styles.memoryCard}>
          <div style={styles.memoryCardHeader}>
            <span style={{
              ...styles.memoryType,
              backgroundColor: color + "20",
              color: color
            }}>
              {entry.type}
            </span>
            <span style={styles.memoryDate}>{entry.timestamp}</span>
          </div>
          <h4 style={styles.memoryTitle}>{entry.title}</h4>
          <p style={styles.memoryContent}>{entry.content}</p>
          <div style={styles.memoryTags}>
            {entry.tags.map(tag => (
              <span key={tag} style={styles.memoryTag}>#{tag}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: "1400px"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: "20px",
    borderBottom: "3px solid",
    marginBottom: "16px"
  },
  headerLeft: {},
  backButton: {
    background: "none",
    border: "none",
    color: "#8D8371",
    cursor: "pointer",
    fontSize: "13px",
    padding: "0",
    marginBottom: "12px"
  },
  headerTitle: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  sphereIcon: {
    fontSize: "28px",
    padding: "12px",
    borderRadius: "12px"
  },
  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: 700,
    color: "#1E1F22"
  },
  sphereId: {
    fontSize: "12px",
    color: "#8D8371"
  },
  headerRight: {
    display: "flex",
    gap: "8px"
  },
  statusBadge: {
    padding: "6px 14px",
    borderRadius: "16px",
    fontSize: "12px",
    fontWeight: 600
  },
  badge: {
    padding: "6px 14px",
    backgroundColor: "#3F724920",
    color: "#3F7249",
    borderRadius: "16px",
    fontSize: "12px",
    fontWeight: 600
  },
  description: {
    margin: "0 0 24px 0",
    fontSize: "14px",
    color: "#666",
    lineHeight: 1.6,
    maxWidth: "700px"
  },
  quickStats: {
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gap: "12px",
    marginBottom: "24px"
  },
  quickStatCard: {
    textAlign: "center" as const,
    padding: "16px",
    backgroundColor: "#FFFFFF",
    borderRadius: "10px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    border: "1px solid #E5E5E5"
  },
  quickStatValue: {
    display: "block",
    fontSize: "28px",
    fontWeight: 700
  },
  quickStatLabel: {
    display: "block",
    fontSize: "11px",
    color: "#8D8371",
    marginTop: "4px"
  },
  tabsNav: {
    display: "flex",
    gap: "4px",
    borderBottom: "1px solid #E5E5E5",
    marginBottom: "24px"
  },
  tabButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "12px 16px",
    background: "none",
    border: "none",
    borderBottom: "2px solid transparent",
    cursor: "pointer",
    fontSize: "13px",
    color: "#666",
    transition: "all 0.2s"
  },
  tabCount: {
    padding: "2px 8px",
    borderRadius: "10px",
    fontSize: "11px",
    fontWeight: 600
  },
  tabContent: {
    minHeight: "400px"
  },
  // Overview Tab Styles
  overviewGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px"
  },
  overviewCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    border: "1px solid #E5E5E5"
  },
  overviewCardTitle: {
    margin: "0 0 16px 0",
    fontSize: "15px",
    fontWeight: 600,
    color: "#1E1F22",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  overviewList: {},
  overviewListItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 0",
    fontSize: "13px",
    color: "#444",
    borderBottom: "1px solid #F0F0F0"
  },
  dot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%"
  },
  moreLink: {
    display: "block",
    marginTop: "8px",
    fontSize: "12px",
    color: "#8D8371"
  },
  projectItem: {
    padding: "10px 0",
    borderBottom: "1px solid #F0F0F0"
  },
  projectHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px"
  },
  projectName: {
    fontSize: "13px",
    fontWeight: 500,
    color: "#1E1F22"
  },
  projectStatus: {
    padding: "2px 8px",
    borderRadius: "8px",
    fontSize: "10px",
    fontWeight: 600
  },
  projectProgress: {
    height: "4px",
    backgroundColor: "#E5E5E5",
    borderRadius: "2px",
    overflow: "hidden"
  },
  projectProgressBar: {
    height: "100%",
    borderRadius: "2px",
    transition: "width 0.3s"
  },
  activitySummary: {},
  activityRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    fontSize: "13px",
    color: "#444",
    borderBottom: "1px solid #F0F0F0"
  },
  activityValue: {
    fontWeight: 600,
    color: "#1E1F22"
  },
  // Domains Tab
  gridList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "12px"
  },
  domainCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px",
    backgroundColor: "#FFFFFF",
    borderRadius: "10px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    border: "1px solid #E5E5E5"
  },
  domainIcon: {
    padding: "8px",
    borderRadius: "8px",
    fontSize: "16px"
  },
  domainName: {
    fontSize: "13px",
    fontWeight: 500,
    color: "#1E1F22"
  },
  // Tools Tab
  tableContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    border: "1px solid #E5E5E5"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const
  },
  th: {
    textAlign: "left" as const,
    padding: "14px 16px",
    fontSize: "11px",
    fontWeight: 600,
    color: "#8D8371",
    textTransform: "uppercase" as const,
    borderBottom: "1px solid #E5E5E5",
    backgroundColor: "#FAFAFA"
  },
  td: {
    padding: "14px 16px",
    fontSize: "13px",
    color: "#444",
    borderBottom: "1px solid #F0F0F0"
  },
  tdDesc: {
    padding: "14px 16px",
    fontSize: "12px",
    color: "#666",
    borderBottom: "1px solid #F0F0F0",
    maxWidth: "300px"
  },
  toolCell: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  toolIcon: {
    fontSize: "16px"
  },
  toolName: {
    fontWeight: 500,
    color: "#1E1F22"
  },
  categoryBadge: {
    padding: "4px 10px",
    backgroundColor: "#F0F0F0",
    borderRadius: "12px",
    fontSize: "11px",
    color: "#666"
  },
  statusDot: {
    display: "inline-block",
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    marginRight: "6px"
  },
  // Processes Tab
  processGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "16px"
  },
  processCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    border: "1px solid #E5E5E5"
  },
  processHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px"
  },
  processIcon: {
    fontSize: "20px"
  },
  processName: {
    display: "block",
    fontSize: "14px",
    fontWeight: 600,
    color: "#1E1F22"
  },
  processStatus: {
    padding: "2px 8px",
    borderRadius: "8px",
    fontSize: "10px",
    fontWeight: 600
  },
  processDesc: {
    margin: "0 0 12px 0",
    fontSize: "12px",
    color: "#666",
    lineHeight: 1.5
  },
  processProgress: {
    height: "6px",
    backgroundColor: "#E5E5E5",
    borderRadius: "3px",
    overflow: "hidden",
    marginBottom: "6px"
  },
  processProgressBar: {
    height: "100%",
    borderRadius: "3px"
  },
  processProgressText: {
    fontSize: "11px",
    color: "#8D8371"
  },
  // Projects Tab
  projectsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "20px"
  },
  projectCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    border: "1px solid #E5E5E5"
  },
  projectCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px"
  },
  projectCardTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: 600,
    color: "#1E1F22"
  },
  projectCardStatus: {
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: 600
  },
  projectCardDesc: {
    margin: "0 0 16px 0",
    fontSize: "13px",
    color: "#666",
    lineHeight: 1.5
  },
  projectCardMeta: {
    display: "flex",
    gap: "16px",
    marginBottom: "16px",
    fontSize: "12px",
    color: "#8D8371"
  },
  projectCardProgress: {},
  projectCardProgressHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "6px",
    fontSize: "12px",
    color: "#666"
  },
  projectCardProgressBar: {
    height: "8px",
    backgroundColor: "#E5E5E5",
    borderRadius: "4px",
    overflow: "hidden"
  },
  projectCardProgressFill: {
    height: "100%",
    borderRadius: "4px"
  },
  // Templates Tab
  templatesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "16px"
  },
  templateCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    border: "1px solid #E5E5E5"
  },
  templateHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px"
  },
  templateIcon: {
    padding: "8px",
    borderRadius: "8px",
    fontSize: "18px"
  },
  templateCategory: {
    fontSize: "11px",
    color: "#8D8371"
  },
  templateName: {
    margin: "0 0 8px 0",
    fontSize: "14px",
    fontWeight: 600,
    color: "#1E1F22"
  },
  templateDesc: {
    margin: "0 0 12px 0",
    fontSize: "12px",
    color: "#666",
    lineHeight: 1.5
  },
  templateMeta: {
    display: "flex",
    gap: "12px",
    fontSize: "11px",
    color: "#8D8371"
  },
  // Memory Tab
  memoryContainer: {},
  memoryHeader: {
    marginBottom: "20px"
  },
  memoryNote: {
    display: "inline-block",
    padding: "10px 16px",
    backgroundColor: "#FFF8E6",
    borderRadius: "8px",
    fontSize: "12px",
    color: "#7A593A",
    border: "1px solid #D8B26A40"
  },
  memoryList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "16px"
  },
  memoryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    border: "1px solid #E5E5E5"
  },
  memoryCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px"
  },
  memoryType: {
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: 600
  },
  memoryDate: {
    fontSize: "11px",
    color: "#8D8371"
  },
  memoryTitle: {
    margin: "0 0 8px 0",
    fontSize: "14px",
    fontWeight: 600,
    color: "#1E1F22"
  },
  memoryContent: {
    margin: "0 0 12px 0",
    fontSize: "12px",
    color: "#666",
    lineHeight: 1.5
  },
  memoryTags: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap" as const
  },
  memoryTag: {
    fontSize: "11px",
    color: "#8D8371"
  }
};

export default SphereDashboardPage;
