// CHE·NU™ Threads Page — All .chenu Threads

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CHENU_COLORS, type Thread, type ThreadType } from '../../types';
import { ThreadListItem, CreateThreadForm } from '../../components/workspace/ThreadPanel';
import { Button, Modal, Tabs, EmptyState } from '../../components/core/UIComponents';

// Mock data
const mockThreads: Thread[] = [
  {
    id: '1',
    user_id: 'u1',
    identity_id: 'i1',
    dataspace_id: null,
    parent_thread_id: null,
    title: 'Q4 Strategic Planning',
    description: 'Discuss Q4 goals and initiatives',
    thread_type: 'discussion',
    status: 'active',
    encoding_level: 'standard',
    token_budget: 5000,
    tokens_used: 2340,
    priority: 1,
    due_date: null,
    tags: ['strategy', 'q4'],
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-15T14:30:00Z',
    resolved_at: null,
  },
  {
    id: '2',
    user_id: 'u1',
    identity_id: 'i1',
    dataspace_id: null,
    parent_thread_id: null,
    title: 'Budget Allocation Decision',
    description: 'Decide on budget allocation for new project',
    thread_type: 'decision',
    status: 'active',
    encoding_level: 'standard',
    token_budget: 2000,
    tokens_used: 890,
    priority: 2,
    due_date: '2024-01-20',
    tags: ['budget', 'decision'],
    created_at: '2024-01-12T09:00:00Z',
    updated_at: '2024-01-14T16:00:00Z',
    resolved_at: null,
  },
  {
    id: '3',
    user_id: 'u1',
    identity_id: 'i1',
    dataspace_id: null,
    parent_thread_id: null,
    title: 'Product Roadmap Review',
    description: 'Review and update product roadmap',
    thread_type: 'review',
    status: 'resolved',
    encoding_level: 'light',
    token_budget: 3000,
    tokens_used: 2800,
    priority: 3,
    due_date: null,
    tags: ['product', 'roadmap'],
    created_at: '2024-01-05T11:00:00Z',
    updated_at: '2024-01-10T10:00:00Z',
    resolved_at: '2024-01-10T10:00:00Z',
  },
];

const ThreadsPage: React.FC = () => {
  const navigate = useNavigate();
  const [threads] = useState<Thread[]>(mockThreads);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'resolved'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);

  const filteredThreads = threads.filter(t => {
    if (activeTab === 'active') return t.status === 'active';
    if (activeTab === 'resolved') return t.status === 'resolved';
    return true;
  });

  const handleCreateThread = async (data: any) => {
    console.log('Creating thread:', data);
    setShowCreateModal(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: CHENU_COLORS.uiSlate,
      padding: '32px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
      }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: CHENU_COLORS.softSand, marginBottom: '4px' }}>
            Threads (.chenu)
          </h1>
          <p style={{ color: CHENU_COLORS.ancientStone, fontSize: '15px' }}>
            Persistent conversations with token budgets and encoding rules
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          + New Thread
        </Button>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'all', label: 'All Threads', icon: '📋' },
          { id: 'active', label: 'Active', icon: '🟢' },
          { id: 'resolved', label: 'Resolved', icon: '✅' },
        ]}
        activeTab={activeTab}
        onChange={(tab) => setActiveTab(tab as typeof activeTab)}
      />

      {/* Thread List */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
      }}>
        {filteredThreads.length > 0 ? (
          filteredThreads.map((thread) => (
            <ThreadListItem
              key={thread.id}
              thread={thread}
              isActive={selectedThread === thread.id}
              onClick={() => navigate(`/threads/${thread.id}`)}
            />
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1' }}>
            <EmptyState
              icon="💬"
              title="No threads found"
              description="Create your first thread to start a persistent conversation"
              action={<Button onClick={() => setShowCreateModal(true)}>Create Thread</Button>}
            />
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Thread"
        size="md"
      >
        <CreateThreadForm
          onSubmit={handleCreateThread}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>
    </div>
  );
};

export default ThreadsPage;
