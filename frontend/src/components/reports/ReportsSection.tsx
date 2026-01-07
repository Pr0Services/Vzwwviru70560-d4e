/**
 * CHE·NU™ - REPORTS SECTION
 * 
 * Reports / History - Bureau Section 9
 * Displays reports, activity timeline, and analytics
 */

import React, { useState, useCallback } from 'react';
import { 
  useReportStore, 
  useReports, 
  useActivities,
  Report,
  ActivityEntry,
  ReportType,
  ActivityType,
} from '../../stores/reportStore';
import { SPHERES, SphereId } from '../../config/spheres.config';

// ═══════════════════════════════════════════════════════════════
// ACTIVITY TIMELINE
// ═══════════════════════════════════════════════════════════════

interface ActivityTimelineProps {
  activities: ActivityEntry[];
  showSphere?: boolean;
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities, showSphere = true }) => {
  const getActivityIcon = (type: ActivityType): string => {
    const icons: Record<ActivityType, string> = {
      create: '➕',
      update: '✏️',
      delete: '🗑️',
      view: '👁️',
      execute: '⚡',
      share: '🔗',
      comment: '💬',
      decision: '✅',
      governance: '🔒',
    };
    return icons[type] || '📋';
  };

  const getActivityColor = (type: ActivityType): string => {
    const colors: Record<ActivityType, string> = {
      create: '#3F7249',
      update: '#D8B26A',
      delete: '#e74c3c',
      view: '#3EB4A2',
      execute: '#9b59b6',
      share: '#3498db',
      comment: '#f39c12',
      decision: '#2ecc71',
      governance: '#8D8371',
    };
    return colors[type] || '#666';
  };

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="activity-timeline">
      {activities.length === 0 ? (
        <div className="empty-state">
          <span>📋</span>
          <p>No activity yet</p>
        </div>
      ) : (
        activities.map((activity, index) => {
          const sphere = SPHERES[activity.sphereId];
          return (
            <div key={activity.id} className="activity-item">
              <div className="activity-line">
                {index < activities.length - 1 && <div className="connector" />}
              </div>
              <div 
                className="activity-icon" 
                style={{ backgroundColor: `${getActivityColor(activity.type)}20`, color: getActivityColor(activity.type) }}
              >
                {getActivityIcon(activity.type)}
              </div>
              <div className="activity-content">
                <div className="activity-header">
                  <span className="activity-action">{activity.action}</span>
                  <span className="activity-time">{formatTime(activity.timestamp)}</span>
                </div>
                <p className="activity-description">{activity.description}</p>
                <div className="activity-meta">
                  {showSphere && (
                    <span className="meta-sphere" style={{ color: sphere.color }}>
                      {sphere.icon} {sphere.name}
                    </span>
                  )}
                  <span className="meta-entity">{activity.entityType}</span>
                  {activity.tokensUsed && (
                    <span className="meta-tokens">{activity.tokensUsed} tokens</span>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}

      <style>{`
        .activity-timeline {
          display: flex;
          flex-direction: column;
        }

        .empty-state {
          text-align: center;
          padding: 48px;
          color: #666;
        }

        .empty-state span {
          font-size: 48px;
          display: block;
          margin-bottom: 12px;
          opacity: 0.5;
        }

        .activity-item {
          display: flex;
          gap: 12px;
          padding: 12px 0;
          position: relative;
        }

        .activity-line {
          position: relative;
          width: 20px;
        }

        .connector {
          position: absolute;
          left: 50%;
          top: 44px;
          bottom: -12px;
          width: 2px;
          background: #222;
          transform: translateX(-50%);
        }

        .activity-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
        }

        .activity-content {
          flex: 1;
          min-width: 0;
        }

        .activity-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .activity-action {
          font-weight: 600;
          color: #fff;
          font-size: 13px;
        }

        .activity-time {
          font-size: 11px;
          color: #666;
        }

        .activity-description {
          margin: 0 0 8px;
          font-size: 12px;
          color: #888;
          line-height: 1.4;
        }

        .activity-meta {
          display: flex;
          gap: 12px;
          font-size: 11px;
        }

        .meta-sphere {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .meta-entity {
          color: #555;
          text-transform: capitalize;
        }

        .meta-tokens {
          color: #D8B26A;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// REPORT CARD
// ═══════════════════════════════════════════════════════════════

interface ReportCardProps {
  report: Report;
  onClick?: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onClick }) => {
  const sphere = SPHERES[report.sphereId];
  
  const typeIcons: Record<ReportType, string> = {
    activity: '📊',
    performance: '📈',
    financial: '💰',
    governance: '🔒',
    token_usage: '🪙',
    agent_performance: '🤖',
    custom: '📋',
  };

  const statusColors: Record<string, string> = {
    draft: '#666',
    generating: '#f39c12',
    ready: '#3F7249',
    scheduled: '#3EB4A2',
    archived: '#555',
  };

  return (
    <div className="report-card" onClick={onClick}>
      <div className="report-header">
        <span className="report-type-icon">{typeIcons[report.type]}</span>
        <div className="report-info">
          <h3>{report.title}</h3>
          <span className="report-type">{report.type.replace('_', ' ')}</span>
        </div>
        <span 
          className="report-status" 
          style={{ backgroundColor: `${statusColors[report.status]}20`, color: statusColors[report.status] }}
        >
          {report.status}
        </span>
      </div>

      {report.summary && (
        <p className="report-summary">{report.summary}</p>
      )}

      {report.metrics.length > 0 && (
        <div className="report-metrics">
          {report.metrics.slice(0, 3).map((metric) => (
            <div key={metric.id} className="metric-item">
              <span className="metric-value">{metric.value.toLocaleString()}</span>
              <span className="metric-name">{metric.name}</span>
              {metric.change !== undefined && (
                <span className={`metric-change ${metric.trend}`}>
                  {metric.change > 0 ? '+' : ''}{metric.changePercent}%
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="report-footer">
        <span className="report-sphere" style={{ color: sphere.color }}>
          {sphere.icon} {sphere.name}
        </span>
        <span className="report-date">
          {new Date(report.updatedAt).toLocaleDateString()}
        </span>
      </div>

      <style>{`
        .report-card {
          background: #111;
          border: 1px solid #222;
          border-radius: 12px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .report-card:hover {
          border-color: #333;
          background: #151515;
        }

        .report-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .report-type-icon {
          font-size: 24px;
        }

        .report-info {
          flex: 1;
        }

        .report-info h3 {
          margin: 0;
          font-size: 14px;
          color: #fff;
        }

        .report-type {
          font-size: 11px;
          color: #666;
          text-transform: capitalize;
        }

        .report-status {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .report-summary {
          font-size: 12px;
          color: #888;
          margin: 0 0 12px;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .report-metrics {
          display: flex;
          gap: 16px;
          margin-bottom: 12px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
        }

        .metric-item {
          flex: 1;
          text-align: center;
        }

        .metric-value {
          display: block;
          font-size: 18px;
          font-weight: 700;
          color: #D8B26A;
        }

        .metric-name {
          display: block;
          font-size: 10px;
          color: #666;
          margin-top: 2px;
        }

        .metric-change {
          display: block;
          font-size: 10px;
          margin-top: 2px;
        }

        .metric-change.up {
          color: #3F7249;
        }

        .metric-change.down {
          color: #e74c3c;
        }

        .metric-change.stable {
          color: #666;
        }

        .report-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 12px;
          border-top: 1px solid #222;
        }

        .report-sphere {
          font-size: 11px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .report-date {
          font-size: 11px;
          color: #555;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN REPORTS SECTION
// ═══════════════════════════════════════════════════════════════

interface ReportsSectionProps {
  sphereId?: SphereId;
}

export const ReportsSection: React.FC<ReportsSectionProps> = ({ sphereId }) => {
  const reports = useReports();
  const activities = useActivities(50);
  const { generateReport, isGenerating, getActivitySummary } = useReportStore();
  
  const [activeTab, setActiveTab] = useState<'reports' | 'activity' | 'analytics'>('activity');
  const [selectedType, setSelectedType] = useState<ReportType | 'all'>('all');

  const filteredReports = reports.filter((r) => 
    (!sphereId || r.sphereId === sphereId) &&
    (selectedType === 'all' || r.type === selectedType)
  );

  const filteredActivities = sphereId 
    ? activities.filter((a) => a.sphereId === sphereId)
    : activities;

  const summary = getActivitySummary(sphereId);

  const handleGenerateReport = useCallback(async (type: ReportType) => {
    if (!sphereId) return;
    await generateReport(type, sphereId);
  }, [sphereId, generateReport]);

  return (
    <div className="reports-section">
      <header className="section-header">
        <div className="header-info">
          <h2>📊 Reports & History</h2>
          <p>Activity tracking, reports, and analytics</p>
        </div>
        <div className="header-stats">
          <div className="stat">
            <span className="stat-value">{summary.totalActivities}</span>
            <span className="stat-label">Activities</span>
          </div>
          <div className="stat">
            <span className="stat-value">{reports.length}</span>
            <span className="stat-label">Reports</span>
          </div>
        </div>
      </header>

      <nav className="section-tabs">
        <button 
          className={activeTab === 'activity' ? 'active' : ''} 
          onClick={() => setActiveTab('activity')}
        >
          📋 Activity
        </button>
        <button 
          className={activeTab === 'reports' ? 'active' : ''} 
          onClick={() => setActiveTab('reports')}
        >
          📊 Reports
        </button>
        <button 
          className={activeTab === 'analytics' ? 'active' : ''} 
          onClick={() => setActiveTab('analytics')}
        >
          📈 Analytics
        </button>
      </nav>

      <div className="section-content">
        {activeTab === 'activity' && (
          <ActivityTimeline activities={filteredActivities} showSphere={!sphereId} />
        )}

        {activeTab === 'reports' && (
          <>
            <div className="reports-toolbar">
              <select 
                value={selectedType} 
                onChange={(e) => setSelectedType(e.target.value as ReportType | 'all')}
                className="type-filter"
              >
                <option value="all">All Types</option>
                <option value="activity">Activity</option>
                <option value="performance">Performance</option>
                <option value="token_usage">Token Usage</option>
                <option value="governance">Governance</option>
              </select>
              
              {sphereId && (
                <div className="generate-buttons">
                  <button 
                    onClick={() => handleGenerateReport('activity')}
                    disabled={isGenerating}
                  >
                    {isGenerating ? '⏳' : '➕'} Generate Report
                  </button>
                </div>
              )}
            </div>

            <div className="reports-grid">
              {filteredReports.length === 0 ? (
                <div className="empty-state">
                  <span>📊</span>
                  <h3>No reports yet</h3>
                  <p>Generate a report to see insights</p>
                </div>
              ) : (
                filteredReports.map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))
              )}
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-dashboard">
            <div className="analytics-grid">
              <div className="analytics-card">
                <h4>Activity by Type</h4>
                <div className="type-bars">
                  {Object.entries(summary.byType)
                    .filter(([, count]) => count > 0)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([type, count]) => (
                      <div key={type} className="type-bar-item">
                        <span className="type-name">{type}</span>
                        <div className="type-bar">
                          <div 
                            className="type-fill" 
                            style={{ width: `${(count / summary.totalActivities) * 100}%` }}
                          />
                        </div>
                        <span className="type-count">{count}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="analytics-card">
                <h4>Top Contributors</h4>
                <div className="contributors-list">
                  {summary.topActors.map((actor, i) => (
                    <div key={actor.actorId} className="contributor-item">
                      <span className="rank">#{i + 1}</span>
                      <span className="name">{actor.actorId}</span>
                      <span className="count">{actor.count} actions</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .reports-section {
          background: #0a0a0a;
          border-radius: 16px;
          overflow: hidden;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          background: #111;
          border-bottom: 1px solid #222;
        }

        .header-info h2 {
          margin: 0 0 4px;
          color: #D8B26A;
          font-size: 18px;
        }

        .header-info p {
          margin: 0;
          color: #666;
          font-size: 13px;
        }

        .header-stats {
          display: flex;
          gap: 24px;
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: 24px;
          font-weight: 700;
          color: #D8B26A;
        }

        .stat-label {
          font-size: 11px;
          color: #666;
        }

        .section-tabs {
          display: flex;
          background: #0d0d0d;
          border-bottom: 1px solid #222;
        }

        .section-tabs button {
          flex: 1;
          padding: 14px;
          background: transparent;
          border: none;
          color: #666;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .section-tabs button:hover {
          background: rgba(255, 255, 255, 0.02);
          color: #888;
        }

        .section-tabs button.active {
          background: rgba(216, 178, 106, 0.1);
          color: #D8B26A;
        }

        .section-content {
          padding: 24px;
        }

        .reports-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .type-filter {
          background: #111;
          border: 1px solid #222;
          border-radius: 8px;
          padding: 10px 14px;
          color: #fff;
          font-size: 13px;
        }

        .generate-buttons button {
          padding: 10px 20px;
          background: linear-gradient(135deg, #D8B26A, #7A593A);
          border: none;
          border-radius: 8px;
          color: #1a1a1a;
          font-weight: 600;
          cursor: pointer;
        }

        .generate-buttons button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .reports-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 16px;
        }

        .empty-state {
          text-align: center;
          padding: 48px;
          color: #666;
          grid-column: 1 / -1;
        }

        .empty-state span {
          font-size: 48px;
          display: block;
          margin-bottom: 12px;
          opacity: 0.5;
        }

        .empty-state h3 {
          color: #888;
          margin: 0 0 8px;
        }

        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .analytics-card {
          background: #111;
          border: 1px solid #222;
          border-radius: 12px;
          padding: 20px;
        }

        .analytics-card h4 {
          color: #888;
          font-size: 12px;
          text-transform: uppercase;
          margin: 0 0 16px;
        }

        .type-bar-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .type-name {
          width: 80px;
          font-size: 12px;
          color: #888;
          text-transform: capitalize;
        }

        .type-bar {
          flex: 1;
          height: 8px;
          background: #222;
          border-radius: 4px;
          overflow: hidden;
        }

        .type-fill {
          height: 100%;
          background: linear-gradient(90deg, #D8B26A, #3EB4A2);
        }

        .type-count {
          width: 40px;
          font-size: 12px;
          color: #666;
          text-align: right;
        }

        .contributor-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid #1a1a1a;
        }

        .contributor-item .rank {
          color: #D8B26A;
          font-weight: 600;
          font-size: 12px;
        }

        .contributor-item .name {
          flex: 1;
          color: #ccc;
          font-size: 13px;
        }

        .contributor-item .count {
          color: #666;
          font-size: 12px;
        }

        @media (max-width: 768px) {
          .analytics-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ReportsSection;
