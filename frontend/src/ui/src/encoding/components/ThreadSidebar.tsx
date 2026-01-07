/**
 * CHE·NU Thread Sidebar Component
 * List and manage threads
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  ChenuThread,
  ThreadSummary,
  filterThreads,
  sortThreads,
} from '../../../../sdk/core/encoding';
import { ThreadSearch, ThreadQuery } from './ThreadSearch';

interface ThreadSidebarProps {
  threads: ThreadSummary[];
  onSelect: (thread: ThreadSummary) => void;
  onRefresh?: () => void;
  loading?: boolean;
  selectedId?: string;
  sphereId?: string;
}

export const ThreadSidebar: React.FC<ThreadSidebarProps> = ({
  threads,
  onSelect,
  onRefresh,
  loading = false,
  selectedId,
  sphereId,
}) => {
  const [query, setQuery] = useState<ThreadQuery>({ text: '' });

  // Filter and sort threads
  const filteredThreads = useMemo(() => {
    let result = [...threads];

    // Apply filters
    if (query.text) {
      const q = query.text.toLowerCase();
      result = result.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.sphereId?.toLowerCase().includes(q)
      );
    }

    if (query.sphereId) {
      result = result.filter((t) => t.sphereId === query.sphereId);
    }

    if (query.state) {
      result = result.filter((t) => t.state === query.state);
    }

    // Sort by updated_at desc
    result.sort((a, b) => 
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );

    return result;
  }, [threads, query]);

  const getStateColor = (state: string): string => {
    const colors: Record<string, string> = {
      draft: '#9ca3af',
      analyzed: '#3b82f6',
      proposed: '#f59e0b',
      accepted: '#22c55e',
      executed: '#8b5cf6',
      archived: '#6b7280',
    };
    return colors[state] || '#9ca3af';
  };

  const getEQSColor = (eqs: number): string => {
    if (eqs >= 80) return '#22c55e';
    if (eqs >= 60) return '#84cc16';
    if (eqs >= 40) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div
      style={{
        width: 280,
        borderRight: '1px solid #e0e0e0',
        background: '#fafafa',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <span style={{ fontWeight: 600 }}>📁 Threads</span>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#666' }}>
            {filteredThreads.length}/{threads.length}
          </span>
          <button
            onClick={onRefresh}
            disabled={loading}
            style={{
              padding: '4px 8px',
              fontSize: 12,
              border: '1px solid #ddd',
              borderRadius: 4,
              background: '#fff',
              cursor: loading ? 'wait' : 'pointer',
            }}
          >
            {loading ? '...' : '↻'}
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '8px 12px', borderBottom: '1px solid #e0e0e0' }}>
        <ThreadSearch onChange={setQuery} />
      </div>

      {/* List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 8,
        }}
      >
        {filteredThreads.length === 0 && !loading && (
          <div
            style={{
              padding: 16,
              textAlign: 'center',
              fontSize: 12,
              color: '#999',
            }}
          >
            {threads.length === 0 ? 'Aucun thread' : 'Aucun résultat'}
          </div>
        )}

        {filteredThreads.map((thread) => (
          <button
            key={thread.id}
            onClick={() => onSelect(thread)}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              padding: 12,
              marginBottom: 6,
              border: selectedId === thread.id 
                ? '2px solid #3b82f6' 
                : '1px solid #e0e0e0',
              borderRadius: 6,
              background: selectedId === thread.id ? '#eff6ff' : '#fff',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {/* Thread ID */}
            <div
              style={{
                fontWeight: 600,
                fontSize: 12,
                marginBottom: 4,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {thread.id}
            </div>

            {/* Meta row */}
            <div
              style={{
                display: 'flex',
                gap: 8,
                fontSize: 11,
                color: '#666',
                flexWrap: 'wrap',
              }}
            >
              {/* State badge */}
              <span
                style={{
                  padding: '2px 6px',
                  background: getStateColor(thread.state),
                  borderRadius: 4,
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 500,
                }}
              >
                {thread.state}
              </span>

              {/* EQS */}
              <span
                style={{
                  padding: '2px 6px',
                  background: '#f5f5f5',
                  borderRadius: 4,
                  color: getEQSColor(thread.eqs),
                  fontWeight: 600,
                }}
              >
                EQS {thread.eqs}
              </span>

              {/* Versions */}
              <span style={{ color: '#999' }}>
                v{thread.versions}
              </span>

              {/* Sphere */}
              {thread.sphereId && (
                <span style={{ color: '#999' }}>
                  {thread.sphereId}
                </span>
              )}
            </div>

            {/* Date */}
            <div
              style={{
                marginTop: 4,
                fontSize: 10,
                color: '#999',
              }}
            >
              {formatDate(thread.updated_at)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // Less than 1 hour
  if (diff < 3600000) {
    const mins = Math.floor(diff / 60000);
    return `Il y a ${mins} min`;
  }
  
  // Less than 24 hours
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `Il y a ${hours}h`;
  }
  
  // Same year
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString('fr-CA', { month: 'short', day: 'numeric' });
  }
  
  return date.toLocaleDateString('fr-CA');
}

export default ThreadSidebar;
