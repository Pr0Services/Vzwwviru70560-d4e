// CHE·NU™ Bureau Components — Complete 10-Section Implementation

import React, { useState, useEffect } from 'react';
import type { Thread, Message, Decision, Agent, Meeting, DataSpace, MemoryItem, BureauSection } from '../../types';
import { CHENU_COLORS } from '../../types';

// ============================================================
// SHARED STYLES
// ============================================================

const cardStyle: React.CSSProperties = {
  backgroundColor: '#111113',
  borderRadius: '12px',
  padding: '20px',
  border: `1px solid ${CHENU_COLORS.ancientStone}22`,
  marginBottom: '16px',
};

const titleStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 600,
  color: CHENU_COLORS.softSand,
  marginBottom: '12px',
};

const buttonStyle: React.CSSProperties = {
  padding: '10px 16px',
  borderRadius: '6px',
  border: 'none',
  backgroundColor: CHENU_COLORS.sacredGold,
  color: '#000',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
};

const listItemStyle: React.CSSProperties = {
  padding: '12px 16px',
  backgroundColor: '#0a0a0b',
  borderRadius: '8px',
  marginBottom: '8px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

// ============================================================
// 1. DASHBOARD SECTION
// ============================================================

export const DashboardSection: React.FC = () => {
  const stats = [
    { label: 'Active Threads', value: 12, color: CHENU_COLORS.cenoteTurquoise, icon: '💬' },
    { label: 'Tokens Used Today', value: 2450, color: CHENU_COLORS.sacredGold, icon: '⚡' },
    { label: 'Pending Decisions', value: 3, color: CHENU_COLORS.jungleEmerald, icon: '⏳' },
    { label: 'Active Agents', value: 5, color: CHENU_COLORS.earthEmber, icon: '🤖' },
  ];

  const recentActivity = [
    { type: 'thread', title: 'Project Planning Discussion', time: '2 min ago' },
    { type: 'decision', title: 'Budget Approval Required', time: '15 min ago' },
    { type: 'meeting', title: 'Team Standup', time: '1 hour ago' },
  ];

  return (
    <div>
      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {stats.map((stat, idx) => (
          <div key={idx} style={{
            ...cardStyle,
            borderLeft: `4px solid ${stat.color}`,
            marginBottom: 0,
          }}>
            <p style={{ fontSize: '12px', color: CHENU_COLORS.ancientStone, marginBottom: '4px' }}>
              {stat.icon} {stat.label}
            </p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: stat.color }}>
              {stat.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div style={cardStyle}>
        <h3 style={titleStyle}>Recent Activity</h3>
        {recentActivity.map((activity, idx) => (
          <div key={idx} style={listItemStyle}>
            <div>
              <p style={{ color: CHENU_COLORS.softSand, fontSize: '14px' }}>{activity.title}</p>
              <p style={{ color: CHENU_COLORS.ancientStone, fontSize: '12px' }}>{activity.type}</p>
            </div>
            <span style={{ color: CHENU_COLORS.ancientStone, fontSize: '12px' }}>{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// 2. NOTES SECTION
// ============================================================

export const NotesSection: React.FC = () => {
  const [notes, setNotes] = useState([
    { id: '1', title: 'Project Ideas', content: 'Explore AI integration options...', updated: '2024-01-15' },
    { id: '2', title: 'Meeting Notes', content: 'Key decisions from today...', updated: '2024-01-14' },
    { id: '3', title: 'Research Links', content: 'https://docs.chenu.ai/...', updated: '2024-01-13' },
  ]);
  const [newNote, setNewNote] = useState('');

  return (
    <div>
      <div style={{ ...cardStyle, display: 'flex', gap: '12px' }}>
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Quick note..."
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: '8px',
            border: `1px solid ${CHENU_COLORS.ancientStone}44`,
            backgroundColor: '#0a0a0b',
            color: CHENU_COLORS.softSand,
            fontSize: '14px',
          }}
        />
        <button style={buttonStyle}>+ Add Note</button>
      </div>

      <div style={cardStyle}>
        <h3 style={titleStyle}>📝 Your Notes</h3>
        {notes.map((note) => (
          <div key={note.id} style={{ ...listItemStyle, flexDirection: 'column', alignItems: 'flex-start' }}>
            <p style={{ color: CHENU_COLORS.softSand, fontSize: '14px', fontWeight: 600 }}>{note.title}</p>
            <p style={{ color: CHENU_COLORS.ancientStone, fontSize: '13px', marginTop: '4px' }}>{note.content}</p>
            <p style={{ color: CHENU_COLORS.ancientStone, fontSize: '11px', marginTop: '8px' }}>Updated: {note.updated}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// 3. TASKS SECTION
// ============================================================

export const TasksSection: React.FC = () => {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Review Q4 projections', status: 'in_progress', priority: 'high', due: '2024-01-20' },
    { id: '2', title: 'Prepare investor deck', status: 'todo', priority: 'high', due: '2024-01-22' },
    { id: '3', title: 'Update documentation', status: 'done', priority: 'medium', due: '2024-01-15' },
    { id: '4', title: 'Schedule team sync', status: 'todo', priority: 'low', due: '2024-01-25' },
  ]);

  const priorityColors = { high: '#e74c3c', medium: CHENU_COLORS.sacredGold, low: CHENU_COLORS.cenoteTurquoise };
  const statusLabels = { todo: '⬜ To Do', in_progress: '🔄 In Progress', done: '✅ Done' };

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '12px' }}>
        <button style={buttonStyle}>+ New Task</button>
        <button style={{ ...buttonStyle, backgroundColor: 'transparent', color: CHENU_COLORS.softSand, border: `1px solid ${CHENU_COLORS.ancientStone}44` }}>
          Filter
        </button>
      </div>

      <div style={cardStyle}>
        <h3 style={titleStyle}>✅ Tasks</h3>
        {tasks.map((task) => (
          <div key={task.id} style={listItemStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ 
                width: '8px', height: '8px', borderRadius: '50%', 
                backgroundColor: priorityColors[task.priority as keyof typeof priorityColors] 
              }} />
              <div>
                <p style={{ 
                  color: CHENU_COLORS.softSand, fontSize: '14px',
                  textDecoration: task.status === 'done' ? 'line-through' : 'none'
                }}>{task.title}</p>
                <p style={{ color: CHENU_COLORS.ancientStone, fontSize: '12px' }}>Due: {task.due}</p>
              </div>
            </div>
            <span style={{ fontSize: '12px', color: CHENU_COLORS.ancientStone }}>
              {statusLabels[task.status as keyof typeof statusLabels]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// 4. PROJECTS SECTION
// ============================================================

export const ProjectsSection: React.FC = () => {
  const projects = [
    { id: '1', name: 'CHE·NU Platform', progress: 75, status: 'active', threads: 24, tasks: 48 },
    { id: '2', name: 'Mobile App v2', progress: 40, status: 'active', threads: 8, tasks: 16 },
    { id: '3', name: 'API Documentation', progress: 90, status: 'active', threads: 5, tasks: 12 },
  ];

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <button style={buttonStyle}>+ New Project</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {projects.map((project) => (
          <div key={project.id} style={cardStyle}>
            <h4 style={{ color: CHENU_COLORS.softSand, fontSize: '16px', marginBottom: '12px' }}>{project.name}</h4>
            
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', color: CHENU_COLORS.ancientStone }}>Progress</span>
                <span style={{ fontSize: '12px', color: CHENU_COLORS.sacredGold }}>{project.progress}%</span>
              </div>
              <div style={{ height: '6px', backgroundColor: '#0a0a0b', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${project.progress}%`, height: '100%', backgroundColor: CHENU_COLORS.sacredGold, borderRadius: '3px' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <span style={{ fontSize: '12px', color: CHENU_COLORS.ancientStone }}>💬 {project.threads} threads</span>
              <span style={{ fontSize: '12px', color: CHENU_COLORS.ancientStone }}>✅ {project.tasks} tasks</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// 5. THREADS SECTION (.chenu)
// ============================================================

export const ThreadsSection: React.FC = () => {
  const threads: Partial<Thread>[] = [
    { id: '1', title: 'Q4 Strategy Discussion', thread_type: 'discussion', status: 'active', tokens_used: 1250, token_budget: 5000 },
    { id: '2', title: 'Budget Allocation Decision', thread_type: 'decision', status: 'active', tokens_used: 800, token_budget: 2000 },
    { id: '3', title: 'Product Roadmap Review', thread_type: 'review', status: 'resolved', tokens_used: 2100, token_budget: 3000 },
  ];

  const typeColors = {
    discussion: CHENU_COLORS.cenoteTurquoise,
    decision: CHENU_COLORS.sacredGold,
    review: CHENU_COLORS.jungleEmerald,
    task: CHENU_COLORS.earthEmber,
    brainstorm: '#9b59b6',
    meeting: '#3498db',
  };

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button style={buttonStyle}>+ New Thread (.chenu)</button>
        <div style={{ display: 'flex', gap: '8px' }}>
          {Object.entries(typeColors).slice(0, 4).map(([type, color]) => (
            <span key={type} style={{ 
              padding: '4px 12px', 
              backgroundColor: `${color}22`, 
              color, 
              borderRadius: '12px',
              fontSize: '12px',
              textTransform: 'capitalize',
            }}>
              {type}
            </span>
          ))}
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={titleStyle}>💬 Active Threads</h3>
        {threads.map((thread) => (
          <div key={thread.id} style={{ ...listItemStyle, cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ 
                padding: '4px 8px', 
                backgroundColor: `${typeColors[thread.thread_type as keyof typeof typeColors]}22`,
                color: typeColors[thread.thread_type as keyof typeof typeColors],
                borderRadius: '4px',
                fontSize: '11px',
                textTransform: 'uppercase',
              }}>
                {thread.thread_type}
              </span>
              <div>
                <p style={{ color: CHENU_COLORS.softSand, fontSize: '14px' }}>{thread.title}</p>
                <p style={{ color: CHENU_COLORS.ancientStone, fontSize: '12px' }}>
                  {thread.tokens_used?.toLocaleString()} / {thread.token_budget?.toLocaleString()} tokens
                </p>
              </div>
            </div>
            <span style={{ 
              padding: '4px 8px',
              backgroundColor: thread.status === 'active' ? CHENU_COLORS.jungleEmerald + '22' : CHENU_COLORS.ancientStone + '22',
              color: thread.status === 'active' ? CHENU_COLORS.jungleEmerald : CHENU_COLORS.ancientStone,
              borderRadius: '4px',
              fontSize: '11px',
            }}>
              {thread.status}
            </span>
          </div>
        ))}
      </div>

      <div style={{ ...cardStyle, backgroundColor: CHENU_COLORS.sacredGold + '11', borderColor: CHENU_COLORS.sacredGold + '33' }}>
        <p style={{ color: CHENU_COLORS.sacredGold, fontSize: '14px' }}>
          💡 <strong>Threads (.chenu)</strong> are first-class objects with persistent context, token budgets, and encoding rules. 
          All decisions and history are auditable.
        </p>
      </div>
    </div>
  );
};

// ============================================================
// 6. MEETINGS SECTION
// ============================================================

export const MeetingsSection: React.FC = () => {
  const meetings: Partial<Meeting>[] = [
    { id: '1', title: 'Weekly Team Standup', meeting_type: 'standup', scheduled_at: '2024-01-16T09:00:00Z', duration_minutes: 30, status: 'scheduled' },
    { id: '2', title: 'Client Review', meeting_type: 'client', scheduled_at: '2024-01-16T14:00:00Z', duration_minutes: 60, status: 'scheduled' },
    { id: '3', title: 'Sprint Planning', meeting_type: 'my_team', scheduled_at: '2024-01-17T10:00:00Z', duration_minutes: 90, status: 'scheduled' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <button style={buttonStyle}>+ Schedule Meeting</button>
      </div>

      <div style={cardStyle}>
        <h3 style={titleStyle}>📅 Upcoming Meetings</h3>
        {meetings.map((meeting) => (
          <div key={meeting.id} style={listItemStyle}>
            <div>
              <p style={{ color: CHENU_COLORS.softSand, fontSize: '14px' }}>{meeting.title}</p>
              <p style={{ color: CHENU_COLORS.ancientStone, fontSize: '12px' }}>
                {new Date(meeting.scheduled_at!).toLocaleString()} • {meeting.duration_minutes} min
              </p>
            </div>
            <span style={{ 
              padding: '4px 8px',
              backgroundColor: CHENU_COLORS.cenoteTurquoise + '22',
              color: CHENU_COLORS.cenoteTurquoise,
              borderRadius: '4px',
              fontSize: '11px',
            }}>
              {meeting.meeting_type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// 7. DATA SECTION
// ============================================================

export const DataSection: React.FC = () => {
  const dataspaces: Partial<DataSpace>[] = [
    { id: '1', name: 'Project Documents', dataspace_type: 'project', path: '/projects/chenu' },
    { id: '2', name: 'Financial Records', dataspace_type: 'folder', path: '/finance/2024' },
    { id: '3', name: 'Templates', dataspace_type: 'template', path: '/templates' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <button style={buttonStyle}>+ New DataSpace</button>
      </div>

      <div style={cardStyle}>
        <h3 style={titleStyle}>🗄️ DataSpaces</h3>
        {dataspaces.map((ds) => (
          <div key={ds.id} style={listItemStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '20px' }}>📁</span>
              <div>
                <p style={{ color: CHENU_COLORS.softSand, fontSize: '14px' }}>{ds.name}</p>
                <p style={{ color: CHENU_COLORS.ancientStone, fontSize: '12px' }}>{ds.path}</p>
              </div>
            </div>
            <span style={{ color: CHENU_COLORS.ancientStone, fontSize: '12px' }}>{ds.dataspace_type}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// 8. AGENTS SECTION
// ============================================================

export const AgentsSection: React.FC = () => {
  const agents: Partial<Agent>[] = [
    { id: '1', code: 'NOVA', name_en: 'Nova', agent_level: 'L0', agent_type: 'orchestrator', is_active: true, is_system: true },
    { id: '2', code: 'DOC_ANALYZER', name_en: 'Document Analyzer', agent_level: 'L2', agent_type: 'specialist', is_active: true },
    { id: '3', code: 'TASK_PLANNER', name_en: 'Task Planner', agent_level: 'L2', agent_type: 'specialist', is_active: true },
    { id: '4', code: 'MEETING_PREP', name_en: 'Meeting Prep', agent_level: 'L3', agent_type: 'support', is_active: false },
  ];

  const levelColors = { L0: CHENU_COLORS.sacredGold, L1: CHENU_COLORS.cenoteTurquoise, L2: CHENU_COLORS.jungleEmerald, L3: CHENU_COLORS.ancientStone };

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '8px' }}>
        {['L0', 'L1', 'L2', 'L3'].map((level) => (
          <span key={level} style={{ 
            padding: '6px 12px', 
            backgroundColor: `${levelColors[level as keyof typeof levelColors]}22`,
            color: levelColors[level as keyof typeof levelColors],
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
          }}>
            {level}
          </span>
        ))}
      </div>

      <div style={cardStyle}>
        <h3 style={titleStyle}>🤖 Available Agents</h3>
        {agents.map((agent) => (
          <div key={agent.id} style={listItemStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ 
                padding: '4px 8px',
                backgroundColor: `${levelColors[agent.agent_level as keyof typeof levelColors]}22`,
                color: levelColors[agent.agent_level as keyof typeof levelColors],
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 600,
              }}>
                {agent.agent_level}
              </span>
              <div>
                <p style={{ color: CHENU_COLORS.softSand, fontSize: '14px' }}>
                  {agent.name_en} {agent.is_system && <span style={{ color: CHENU_COLORS.sacredGold }}>★</span>}
                </p>
                <p style={{ color: CHENU_COLORS.ancientStone, fontSize: '12px' }}>{agent.code} • {agent.agent_type}</p>
              </div>
            </div>
            <span style={{ 
              width: '8px', height: '8px', borderRadius: '50%',
              backgroundColor: agent.is_active ? CHENU_COLORS.jungleEmerald : CHENU_COLORS.ancientStone
            }} />
          </div>
        ))}
      </div>

      <div style={{ ...cardStyle, backgroundColor: '#0a0a0b' }}>
        <p style={{ color: CHENU_COLORS.ancientStone, fontSize: '13px' }}>
          ⚠️ <strong>Law 7:</strong> No Self-Directed Agent Learning — Agents cannot take autonomous actions. All executions are governed.
        </p>
      </div>
    </div>
  );
};

// ============================================================
// 9. REPORTS SECTION
// ============================================================

export const ReportsSection: React.FC = () => {
  const reports = [
    { id: '1', title: 'Weekly Summary', type: 'summary', date: '2024-01-14', status: 'generated' },
    { id: '2', title: 'Token Usage Report', type: 'usage', date: '2024-01-13', status: 'generated' },
    { id: '3', title: 'Decision Audit', type: 'audit', date: '2024-01-10', status: 'generated' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <button style={buttonStyle}>Generate Report</button>
      </div>

      <div style={cardStyle}>
        <h3 style={titleStyle}>📈 Reports & History</h3>
        {reports.map((report) => (
          <div key={report.id} style={listItemStyle}>
            <div>
              <p style={{ color: CHENU_COLORS.softSand, fontSize: '14px' }}>{report.title}</p>
              <p style={{ color: CHENU_COLORS.ancientStone, fontSize: '12px' }}>{report.date} • {report.type}</p>
            </div>
            <button style={{ ...buttonStyle, padding: '6px 12px', fontSize: '12px' }}>View</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// 10. BUDGET & GOVERNANCE SECTION
// ============================================================

export const BudgetSection: React.FC = () => {
  const budget = { allocated: 10000, used: 7550, remaining: 2450 };
  const transactions = [
    { id: '1', description: 'Thread: Q4 Strategy', amount: -250, date: '2024-01-15 14:30' },
    { id: '2', description: 'Agent: Document Analyzer', amount: -120, date: '2024-01-15 10:15' },
    { id: '3', description: 'Monthly Allocation', amount: 5000, date: '2024-01-01 00:00' },
  ];

  return (
    <div>
      {/* Budget Overview */}
      <div style={{ ...cardStyle, borderLeft: `4px solid ${CHENU_COLORS.sacredGold}` }}>
        <h3 style={titleStyle}>💰 Token Budget</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
          <div>
            <p style={{ fontSize: '12px', color: CHENU_COLORS.ancientStone }}>Allocated</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: CHENU_COLORS.softSand }}>{budget.allocated.toLocaleString()}</p>
          </div>
          <div>
            <p style={{ fontSize: '12px', color: CHENU_COLORS.ancientStone }}>Used</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: CHENU_COLORS.sacredGold }}>{budget.used.toLocaleString()}</p>
          </div>
          <div>
            <p style={{ fontSize: '12px', color: CHENU_COLORS.ancientStone }}>Remaining</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: CHENU_COLORS.jungleEmerald }}>{budget.remaining.toLocaleString()}</p>
          </div>
        </div>

        <div style={{ height: '12px', backgroundColor: '#0a0a0b', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ 
            width: `${(budget.used / budget.allocated) * 100}%`, 
            height: '100%', 
            backgroundColor: CHENU_COLORS.sacredGold,
            borderRadius: '6px'
          }} />
        </div>
      </div>

      {/* Transactions */}
      <div style={cardStyle}>
        <h3 style={titleStyle}>📊 Recent Transactions</h3>
        {transactions.map((tx) => (
          <div key={tx.id} style={listItemStyle}>
            <div>
              <p style={{ color: CHENU_COLORS.softSand, fontSize: '14px' }}>{tx.description}</p>
              <p style={{ color: CHENU_COLORS.ancientStone, fontSize: '12px' }}>{tx.date}</p>
            </div>
            <span style={{ 
              color: tx.amount > 0 ? CHENU_COLORS.jungleEmerald : CHENU_COLORS.earthEmber,
              fontSize: '14px',
              fontWeight: 600,
            }}>
              {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Governance Notice */}
      <div style={{ ...cardStyle, backgroundColor: CHENU_COLORS.cenoteTurquoise + '11', borderColor: CHENU_COLORS.cenoteTurquoise + '33' }}>
        <h4 style={{ color: CHENU_COLORS.cenoteTurquoise, fontSize: '14px', marginBottom: '8px' }}>🛡️ Governance Principles</h4>
        <ul style={{ color: CHENU_COLORS.softSand, fontSize: '13px', paddingLeft: '20px', margin: 0 }}>
          <li>Tokens are INTERNAL utility credits — NOT cryptocurrency</li>
          <li>All usage is tracked, auditable, and reversible</li>
          <li>Budget limits are enforced before execution</li>
          <li>User controls cost at every step</li>
        </ul>
      </div>
    </div>
  );
};

// ============================================================
// SECTION ROUTER
// ============================================================

export const BureauContent: React.FC<{ section: BureauSection }> = ({ section }) => {
  const sectionComponents: Record<BureauSection, React.FC> = {
    dashboard: DashboardSection,
    notes: NotesSection,
    tasks: TasksSection,
    projects: ProjectsSection,
    threads: ThreadsSection,
    meetings: MeetingsSection,
    data: DataSection,
    agents: AgentsSection,
    reports: ReportsSection,
    budget: BudgetSection,
  };

  const Component = sectionComponents[section] || DashboardSection;
  return <Component />;
};

export default BureauContent;
