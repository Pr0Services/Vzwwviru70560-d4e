// CHE·NU™ Encoding System — Core IP Encoding Layer
// Encoding happens ALWAYS BEFORE AI execution
// Purpose: reduce tokens, clarify intent, enforce scope, improve efficiency

import React, { useState } from 'react';
import { CHENU_COLORS } from '../../types';

// ============================================================
// TYPES
// ============================================================

interface EncodingRule {
  id: string;
  code: string;
  name: string;
  description: string;
  category: 'compression' | 'intent' | 'scope' | 'context' | 'security';
  status: 'active' | 'inactive' | 'testing';
  compression_ratio: number;
  quality_score: number;
  usage_count: number;
}

interface EncodingSession {
  id: string;
  input_text: string;
  encoded_text: string;
  input_tokens: number;
  encoded_tokens: number;
  compression_ratio: number;
  quality_score: number;
  rules_applied: string[];
  timestamp: string;
}

interface EncodingStats {
  total_sessions: number;
  tokens_saved: number;
  avg_compression: number;
  avg_quality: number;
}

// ============================================================
// MOCK DATA
// ============================================================

const mockRules: EncodingRule[] = [
  { id: 'r1', code: 'COMP_ABBREV', name: 'Abbreviation Compression', description: 'Converts common phrases to standardized abbreviations', category: 'compression', status: 'active', compression_ratio: 0.72, quality_score: 0.95, usage_count: 1234 },
  { id: 'r2', code: 'INTENT_EXTRACT', name: 'Intent Extraction', description: 'Extracts core intent from verbose instructions', category: 'intent', status: 'active', compression_ratio: 0.65, quality_score: 0.92, usage_count: 987 },
  { id: 'r3', code: 'SCOPE_BOUND', name: 'Scope Boundary', description: 'Adds explicit scope markers to queries', category: 'scope', status: 'active', compression_ratio: 1.05, quality_score: 0.98, usage_count: 756 },
  { id: 'r4', code: 'CTX_INJECT', name: 'Context Injection', description: 'Injects relevant context automatically', category: 'context', status: 'active', compression_ratio: 1.15, quality_score: 0.94, usage_count: 654 },
  { id: 'r5', code: 'SEC_REDACT', name: 'Security Redaction', description: 'Redacts sensitive information before processing', category: 'security', status: 'active', compression_ratio: 0.98, quality_score: 0.99, usage_count: 432 },
  { id: 'r6', code: 'STRUCT_NORM', name: 'Structure Normalization', description: 'Normalizes input structure for consistent processing', category: 'compression', status: 'testing', compression_ratio: 0.78, quality_score: 0.88, usage_count: 123 },
];

const mockSessions: EncodingSession[] = [
  {
    id: 's1',
    input_text: 'Can you please help me analyze this quarterly financial report and provide a comprehensive summary of the key performance indicators including revenue growth, profit margins, and operational efficiency metrics?',
    encoded_text: '[ANALYZE:Q_FIN_REPORT][OUT:SUMMARY(KPI:revenue,margin,ops)]',
    input_tokens: 38,
    encoded_tokens: 12,
    compression_ratio: 0.32,
    quality_score: 0.94,
    rules_applied: ['COMP_ABBREV', 'INTENT_EXTRACT'],
    timestamp: '2024-01-15T14:30:00Z',
  },
  {
    id: 's2',
    input_text: 'I need you to search through all my business documents and find any mentions of the Johnson partnership agreement',
    encoded_text: '[SEARCH:SPHERE(business).DOCS][QUERY:"Johnson partnership agreement"]',
    input_tokens: 22,
    encoded_tokens: 10,
    compression_ratio: 0.45,
    quality_score: 0.97,
    rules_applied: ['SCOPE_BOUND', 'INTENT_EXTRACT'],
    timestamp: '2024-01-15T14:15:00Z',
  },
];

const mockStats: EncodingStats = {
  total_sessions: 2456,
  tokens_saved: 45678,
  avg_compression: 0.42,
  avg_quality: 0.94,
};

// ============================================================
// STYLES
// ============================================================

const styles = {
  container: {
    padding: '24px',
    backgroundColor: CHENU_COLORS.uiSlate,
    minHeight: '100vh',
  },
  header: {
    marginBottom: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: CHENU_COLORS.softSand,
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    color: CHENU_COLORS.ancientStone,
  },

  // Notice
  notice: {
    padding: '16px 20px',
    backgroundColor: CHENU_COLORS.sacredGold + '11',
    borderRadius: '12px',
    border: `1px solid ${CHENU_COLORS.sacredGold}33`,
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  noticeIcon: {
    fontSize: '24px',
  },
  noticeText: {
    fontSize: '13px',
    color: CHENU_COLORS.softSand,
    lineHeight: 1.5,
  },

  // Stats Grid
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '24px',
  },
  statCard: {
    padding: '20px',
    backgroundColor: '#111113',
    borderRadius: '12px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
    textAlign: 'center' as const,
  },
  statValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: CHENU_COLORS.softSand,
  },
  statLabel: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
    marginTop: '4px',
  },

  // Encoder Demo
  encoderSection: {
    backgroundColor: '#111113',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  encoderTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    marginBottom: '16px',
  },
  encoderGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 60px 1fr',
    gap: '16px',
    alignItems: 'stretch',
  },
  textArea: {
    width: '100%',
    height: '120px',
    padding: '12px',
    backgroundColor: '#0a0a0b',
    border: `1px solid ${CHENU_COLORS.ancientStone}33`,
    borderRadius: '8px',
    color: CHENU_COLORS.softSand,
    fontSize: '13px',
    resize: 'none' as const,
    fontFamily: 'inherit',
  },
  encodedArea: {
    width: '100%',
    height: '120px',
    padding: '12px',
    backgroundColor: '#0a0a0b',
    border: `1px solid ${CHENU_COLORS.jungleEmerald}33`,
    borderRadius: '8px',
    color: CHENU_COLORS.jungleEmerald,
    fontSize: '13px',
    fontFamily: 'monospace',
    resize: 'none' as const,
  },
  encodeArrow: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  arrowButton: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: CHENU_COLORS.sacredGold,
    border: 'none',
    color: '#000',
    fontSize: '18px',
    cursor: 'pointer',
  },
  compressionBadge: (ratio: number) => ({
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 'bold',
    backgroundColor: ratio < 0.5 ? CHENU_COLORS.jungleEmerald + '22' : CHENU_COLORS.sacredGold + '22',
    color: ratio < 0.5 ? CHENU_COLORS.jungleEmerald : CHENU_COLORS.sacredGold,
  }),
  tokenCount: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
    marginTop: '8px',
  },

  // Rules Section
  rulesSection: {
    marginBottom: '24px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  rulesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  ruleCard: {
    padding: '16px',
    backgroundColor: '#111113',
    borderRadius: '10px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  ruleHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px',
  },
  ruleCode: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    fontFamily: 'monospace',
    marginBottom: '4px',
  },
  ruleName: {
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  ruleStatus: (status: string) => {
    const colors: Record<string, string> = {
      active: CHENU_COLORS.jungleEmerald,
      inactive: CHENU_COLORS.ancientStone,
      testing: CHENU_COLORS.cenoteTurquoise,
    };
    return {
      padding: '3px 8px',
      borderRadius: '4px',
      fontSize: '10px',
      fontWeight: 600,
      backgroundColor: colors[status] + '22',
      color: colors[status],
      textTransform: 'uppercase' as const,
    };
  },
  ruleDescription: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
    marginBottom: '12px',
  },
  ruleStats: {
    display: 'flex',
    gap: '16px',
    paddingTop: '12px',
    borderTop: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  ruleStat: {
    textAlign: 'center' as const,
  },
  ruleStatValue: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: CHENU_COLORS.softSand,
  },
  ruleStatLabel: {
    fontSize: '10px',
    color: CHENU_COLORS.ancientStone,
  },
  categoryBadge: (category: string) => {
    const colors: Record<string, string> = {
      compression: CHENU_COLORS.sacredGold,
      intent: CHENU_COLORS.cenoteTurquoise,
      scope: CHENU_COLORS.jungleEmerald,
      context: '#9b59b6',
      security: '#e74c3c',
    };
    return {
      padding: '2px 6px',
      borderRadius: '4px',
      fontSize: '9px',
      fontWeight: 600,
      backgroundColor: colors[category] + '22',
      color: colors[category],
      textTransform: 'uppercase' as const,
      marginLeft: '8px',
    };
  },

  // Sessions Table
  sessionsSection: {
    marginBottom: '24px',
  },
  sessionsTable: {
    width: '100%',
    backgroundColor: '#111113',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  tableHeader: {
    backgroundColor: '#0a0a0b',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left' as const,
    fontSize: '11px',
    fontWeight: 600,
    color: CHENU_COLORS.ancientStone,
    textTransform: 'uppercase' as const,
  },
  td: {
    padding: '12px 16px',
    fontSize: '13px',
    color: CHENU_COLORS.softSand,
    borderTop: `1px solid ${CHENU_COLORS.ancientStone}11`,
  },
  codeCell: {
    fontFamily: 'monospace',
    fontSize: '11px',
    color: CHENU_COLORS.jungleEmerald,
    maxWidth: '300px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const EncodingSystem: React.FC = () => {
  const [rules] = useState<EncodingRule[]>(mockRules);
  const [sessions] = useState<EncodingSession[]>(mockSessions);
  const [stats] = useState<EncodingStats>(mockStats);
  const [inputText, setInputText] = useState('');
  const [encodedText, setEncodedText] = useState('');
  const [compressionRatio, setCompressionRatio] = useState<number | null>(null);

  const handleEncode = () => {
    // Simplified encoding demo
    if (!inputText) return;
    
    // Mock encoding process
    const words = inputText.split(' ');
    const encoded = `[INTENT:${words.slice(0, 3).join('_').toUpperCase()}][QUERY:"${words.slice(3, 8).join(' ')}"]`;
    setEncodedText(encoded);
    
    const inputTokens = Math.ceil(inputText.length / 4);
    const outputTokens = Math.ceil(encoded.length / 4);
    setCompressionRatio(outputTokens / inputTokens);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>⚡ Encoding System</h1>
        <p style={styles.subtitle}>Core IP — Encoding Layer for AI Execution Optimization</p>
      </div>

      {/* Notice */}
      <div style={styles.notice}>
        <span style={styles.noticeIcon}>🔐</span>
        <span style={styles.noticeText}>
          <strong>Encoding is CHE·NU's CORE IP.</strong> It happens ALWAYS BEFORE AI execution.
          Purpose: reduce token usage, clarify intent, enforce scope, and improve agent efficiency.
          Encoding is reversible for humans and compatible with all agents.
        </span>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.total_sessions.toLocaleString()}</div>
          <div style={styles.statLabel}>Total Sessions</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.tokens_saved.toLocaleString()}</div>
          <div style={styles.statLabel}>Tokens Saved</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{Math.round(stats.avg_compression * 100)}%</div>
          <div style={styles.statLabel}>Avg Compression</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{Math.round(stats.avg_quality * 100)}%</div>
          <div style={styles.statLabel}>Quality Score</div>
        </div>
      </div>

      {/* Encoder Demo */}
      <div style={styles.encoderSection}>
        <div style={styles.encoderTitle}>🧪 Encoding Playground</div>
        <div style={styles.encoderGrid}>
          <div>
            <textarea
              style={styles.textArea}
              placeholder="Enter your natural language input..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <div style={styles.tokenCount}>
              {inputText ? `~${Math.ceil(inputText.length / 4)} tokens` : 'Input tokens'}
            </div>
          </div>
          <div style={styles.encodeArrow}>
            <button style={styles.arrowButton} onClick={handleEncode}>→</button>
            {compressionRatio !== null && (
              <span style={styles.compressionBadge(compressionRatio)}>
                {Math.round(compressionRatio * 100)}%
              </span>
            )}
          </div>
          <div>
            <textarea
              style={styles.encodedArea}
              placeholder="Encoded output will appear here..."
              value={encodedText}
              readOnly
            />
            <div style={styles.tokenCount}>
              {encodedText ? `~${Math.ceil(encodedText.length / 4)} tokens` : 'Output tokens'}
            </div>
          </div>
        </div>
      </div>

      {/* Encoding Rules */}
      <div style={styles.rulesSection}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTitle}>Encoding Rules</span>
          <button style={{ padding: '8px 16px', borderRadius: '6px', border: `1px solid ${CHENU_COLORS.sacredGold}`, backgroundColor: 'transparent', color: CHENU_COLORS.sacredGold, fontSize: '12px', cursor: 'pointer' }}>
            + Add Rule
          </button>
        </div>
        <div style={styles.rulesGrid}>
          {rules.map(rule => (
            <div key={rule.id} style={styles.ruleCard}>
              <div style={styles.ruleHeader}>
                <div>
                  <div style={styles.ruleCode}>{rule.code}</div>
                  <div style={styles.ruleName}>
                    {rule.name}
                    <span style={styles.categoryBadge(rule.category)}>{rule.category}</span>
                  </div>
                </div>
                <span style={styles.ruleStatus(rule.status)}>{rule.status}</span>
              </div>
              <div style={styles.ruleDescription}>{rule.description}</div>
              <div style={styles.ruleStats}>
                <div style={styles.ruleStat}>
                  <div style={styles.ruleStatValue}>{Math.round(rule.compression_ratio * 100)}%</div>
                  <div style={styles.ruleStatLabel}>Compression</div>
                </div>
                <div style={styles.ruleStat}>
                  <div style={styles.ruleStatValue}>{Math.round(rule.quality_score * 100)}%</div>
                  <div style={styles.ruleStatLabel}>Quality</div>
                </div>
                <div style={styles.ruleStat}>
                  <div style={styles.ruleStatValue}>{rule.usage_count}</div>
                  <div style={styles.ruleStatLabel}>Uses</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Sessions */}
      <div style={styles.sessionsSection}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTitle}>Recent Encoding Sessions</span>
        </div>
        <table style={styles.sessionsTable}>
          <thead style={styles.tableHeader}>
            <tr>
              <th style={styles.th}>Input</th>
              <th style={styles.th}>Encoded</th>
              <th style={styles.th}>Ratio</th>
              <th style={styles.th}>Quality</th>
              <th style={styles.th}>Rules</th>
              <th style={styles.th}>Time</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map(session => (
              <tr key={session.id}>
                <td style={{ ...styles.td, maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {session.input_text}
                </td>
                <td style={{ ...styles.td, ...styles.codeCell }}>{session.encoded_text}</td>
                <td style={styles.td}>
                  <span style={styles.compressionBadge(session.compression_ratio)}>
                    {Math.round(session.compression_ratio * 100)}%
                  </span>
                </td>
                <td style={styles.td}>{Math.round(session.quality_score * 100)}%</td>
                <td style={styles.td}>{session.rules_applied.length} rules</td>
                <td style={styles.td}>{formatTime(session.timestamp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EncodingSystem;
