import React, { useState, CSSProperties } from 'react';
import { useKnowledgeThreads } from './KnowledgeThreadsContext';
import { THREAD_TYPES, THREAD_AGENTS, THREAD_NEVER_FROM } from './presets';
import { ThreadType, ThreadEndpoint } from './types';

const styles: Record<string, CSSProperties> = {
  container: { fontFamily: 'system-ui, sans-serif', padding: 20, maxWidth: 1000, margin: '0 auto' },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginBottom: 16 },
  title: { fontSize: 16, fontWeight: 600, color: '#1f2937', margin: '0 0 12px 0' },
  button: { padding: '8px 16px', fontSize: 13, fontWeight: 500, border: 'none', borderRadius: 8, cursor: 'pointer' },
};

export function ThreadTypeSelector() {
  const { state, setTypeFilter, toggleTypeVisibility } = useKnowledgeThreads();
  
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>🔗 Thread Types</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {THREAD_TYPES.map(t => (
          <button key={t.type} onClick={() => toggleTypeVisibility(t.type)}
            style={{ padding: 12, borderRadius: 8, border: 'none', cursor: 'pointer', textAlign: 'center',
              background: state.visualization.type_toggle[t.type] ? '#06B6D4' : '#f3f4f6',
              color: state.visualization.type_toggle[t.type] ? '#fff' : '#374151' }}>
            <div style={{ fontSize: 24 }}>{t.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 600 }}>{t.name}</div>
            <div style={{ fontSize: 9, opacity: 0.8 }}>{t.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function CreateThreadPanel() {
  const { addThread, state } = useKnowledgeThreads();
  const [type, setType] = useState<ThreadType>('reference');
  const [reason, setReason] = useState('');
  
  const handleCreate = () => {
    if (!reason.trim()) { alert('Reason is REQUIRED - no silent threads!'); return; }
    const source: ThreadEndpoint = { id: `src_${Date.now()}`, object_type: 'artifact', title: 'Source Object' };
    const target: ThreadEndpoint = { id: `tgt_${Date.now()}`, object_type: 'artifact', title: 'Target Object' };
    addThread(type, source, target, reason);
    setReason('');
  };
  
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>➕ Create Thread</h3>
      <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 12 }}>Thread = POINTER, not narrative. Reason REQUIRED.</p>
      
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 11, color: '#6b7280', display: 'block', marginBottom: 4 }}>Type</label>
        <select value={type} onChange={e => setType(e.target.value as ThreadType)}
          style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' }}>
          {THREAD_TYPES.map(t => <option key={t.type} value={t.type}>{t.icon} {t.name}</option>)}
        </select>
      </div>
      
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 11, color: '#6b7280', display: 'block', marginBottom: 4 }}>Reason (REQUIRED)</label>
        <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Explicit reason for this connection..."
          style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e5e7eb', minHeight: 60, resize: 'vertical' }} />
      </div>
      
      <button onClick={handleCreate} style={{ ...styles.button, background: '#06B6D4', color: '#fff', width: '100%' }}>
        Create Thread
      </button>
      
      {state.error && (
        <div style={{ marginTop: 8, padding: 8, background: '#FEE2E2', borderRadius: 6, fontSize: 11, color: '#DC2626' }}>
          ⚠️ {state.error}
        </div>
      )}
    </div>
  );
}

export function ThreadsList() {
  const { state, getFilteredThreads, unlinkThread, selectThread } = useKnowledgeThreads();
  const threads = getFilteredThreads();
  
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>📋 Threads ({threads.length})</h3>
      
      {threads.length === 0 ? (
        <div style={{ padding: 20, textAlign: 'center', color: '#9CA3AF' }}>No threads yet</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
          {threads.map(t => (
            <div key={t.id} onClick={() => selectThread(t.id)}
              style={{ padding: 10, background: state.selected_thread === t.id ? '#CFFAFE' : '#f9fafb',
                borderRadius: 6, border: state.selected_thread === t.id ? '2px solid #06B6D4' : '1px solid #e5e7eb', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>
                  {THREAD_TYPES.find(tt => tt.type === t.type)?.icon} {t.type.toUpperCase()}
                </span>
                <button onClick={(e) => { e.stopPropagation(); unlinkThread(t.id); }}
                  style={{ ...styles.button, fontSize: 9, padding: '2px 6px', background: '#FEE2E2', color: '#DC2626' }}>
                  Unlink
                </button>
              </div>
              <div style={{ fontSize: 10, color: '#374151', marginTop: 4 }}>
                <strong>Reason:</strong> {t.reason}
              </div>
              <div style={{ fontSize: 9, color: '#6b7280', marginTop: 2 }}>
                {t.source.object_type} → {t.target.object_type} | {t.visibility}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ThreadAgentsPanel() {
  return (
    <div style={styles.card}>
      <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>🤖 Thread Agents</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {THREAD_AGENTS.map(agent => (
          <div key={agent.type} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8, background: '#CFFAFE', borderRadius: 6 }}>
            <span style={{ fontSize: 20 }}>{agent.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600 }}>{agent.name}</div>
              <div style={{ fontSize: 9, color: '#6b7280' }}>{agent.responsibility}</div>
            </div>
            <span style={{ fontSize: 8, color: '#0891B2' }}>⚠️ {agent.constraint}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ThreadRulesPanel() {
  return (
    <div style={styles.card}>
      <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>🛡️ Thread Rules</h4>
      <div style={{ marginBottom: 12, fontSize: 11, fontWeight: 600, color: '#DC2626' }}>❌ Threads NEVER from:</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {THREAD_NEVER_FROM.map(item => (
          <span key={item} style={{ padding: '2px 8px', background: '#FEE2E2', color: '#991B1B', borderRadius: 4, fontSize: 9 }}>{item}</span>
        ))}
      </div>
    </div>
  );
}

export function KnowledgeThreadsDashboard() {
  return (
    <div style={styles.container}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>🔗 CHE·NU Knowledge Threads</h1>
      <p style={{ color: '#6b7280', marginBottom: 20 }}>Thread = POINTER, not narrative • Link facts, never interpret</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
        <div>
          <ThreadTypeSelector />
          <CreateThreadPanel />
          <ThreadsList />
        </div>
        <div>
          <ThreadAgentsPanel />
          <ThreadRulesPanel />
        </div>
      </div>
    </div>
  );
}
