// CHE·NU™ Thread Detail Page — Individual Thread View

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CHENU_COLORS, type Thread, type Message, type Decision } from '../../types';
import ThreadPanel from '../../components/workspace/ThreadPanel';
import { Button } from '../../components/core/UIComponents';

// Mock data
const mockThread: Thread = {
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
};

const mockMessages: Message[] = [
  {
    id: 'm1',
    thread_id: '1',
    user_id: 'u1',
    agent_id: null,
    role: 'user',
    content: "Let's start planning our Q4 strategy. What are the key priorities we should focus on?",
    content_encoded: null,
    encoding_applied: false,
    encoding_savings: 0,
    tokens_used: 25,
    metadata: {},
    created_at: '2024-01-10T10:00:00Z',
  },
  {
    id: 'm2',
    thread_id: '1',
    user_id: null,
    agent_id: 'nova',
    role: 'assistant',
    content: "Based on your business sphere data and previous discussions, I recommend focusing on: 1) Revenue growth targets, 2) Product expansion, 3) Team scaling. Would you like me to elaborate on any of these areas?",
    content_encoded: "Based biz sphere data prev disc, rec focus: 1) Rev growth tgt 2) Prod exp 3) Team scale. Elaborate?",
    encoding_applied: true,
    encoding_savings: 28,
    tokens_used: 45,
    metadata: {},
    created_at: '2024-01-10T10:01:00Z',
  },
  {
    id: 'm3',
    thread_id: '1',
    user_id: 'u1',
    agent_id: null,
    role: 'user',
    content: "Yes, let's dive deeper into revenue growth. What are realistic targets given our current trajectory?",
    content_encoded: null,
    encoding_applied: false,
    encoding_savings: 0,
    tokens_used: 22,
    metadata: {},
    created_at: '2024-01-10T10:05:00Z',
  },
];

const mockDecisions: Decision[] = [
  {
    id: 'd1',
    thread_id: '1',
    user_id: 'u1',
    decision_type: 'choice',
    title: 'Q4 Revenue Target',
    description: 'Select the revenue growth target for Q4',
    options: [
      { id: 'opt1', label: 'Conservative (15% growth)', description: 'Lower risk, achievable' },
      { id: 'opt2', label: 'Moderate (25% growth)', description: 'Balanced approach' },
      { id: 'opt3', label: 'Aggressive (40% growth)', description: 'High effort required' },
    ],
    selected_option: null,
    rationale: null,
    status: 'pending',
    decided_at: null,
    created_at: '2024-01-12T10:00:00Z',
  },
];

const ThreadDetailPage: React.FC = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const navigate = useNavigate();
  
  const [thread] = useState<Thread>(mockThread);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [decisions, setDecisions] = useState<Decision[]>(mockDecisions);

  const handleSendMessage = async (content: string, applyEncoding: boolean) => {
    const newMessage: Message = {
      id: `m${Date.now()}`,
      thread_id: thread.id,
      user_id: 'u1',
      agent_id: null,
      role: 'user',
      content,
      content_encoded: null,
      encoding_applied: false,
      encoding_savings: 0,
      tokens_used: Math.ceil(content.length / 4),
      metadata: {},
      created_at: new Date().toISOString(),
    };
    setMessages([...messages, newMessage]);

    // Simulate Nova response
    setTimeout(() => {
      const novaResponse: Message = {
        id: `m${Date.now() + 1}`,
        thread_id: thread.id,
        user_id: null,
        agent_id: 'nova',
        role: 'assistant',
        content: `I understand your point about "${content.slice(0, 30)}...". Let me analyze this within your governance rules and provide actionable recommendations.`,
        content_encoded: applyEncoding ? 'Understood. Analyzing w/ gov rules. Providing rec.' : null,
        encoding_applied: applyEncoding,
        encoding_savings: applyEncoding ? 35 : 0,
        tokens_used: 40,
        metadata: {},
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, novaResponse]);
    }, 1000);
  };

  const handleDecide = async (decisionId: string, optionId: string) => {
    setDecisions(decisions.map(d => {
      if (d.id === decisionId) {
        const selectedOption = d.options.find(o => o.id === optionId) || null;
        return {
          ...d,
          selected_option: selectedOption,
          status: 'decided' as const,
          decided_at: new Date().toISOString(),
        };
      }
      return d;
    }));
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: CHENU_COLORS.uiSlate,
    }}>
      {/* Sidebar - Thread Info */}
      <div style={{
        width: '300px',
        backgroundColor: '#0a0a0b',
        borderRight: `1px solid ${CHENU_COLORS.ancientStone}22`,
        padding: '24px',
      }}>
        <Button variant="ghost" onClick={() => navigate(-1)} style={{ marginBottom: '24px' }}>
          ← Back
        </Button>

        <h2 style={{ color: CHENU_COLORS.softSand, fontSize: '18px', marginBottom: '8px' }}>
          {thread.title}
        </h2>
        <p style={{ color: CHENU_COLORS.ancientStone, fontSize: '13px', marginBottom: '24px' }}>
          {thread.description}
        </p>

        <div style={{ marginBottom: '24px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
          }}>
            <span style={{ color: CHENU_COLORS.ancientStone, fontSize: '12px' }}>Token Usage</span>
            <span style={{ color: CHENU_COLORS.sacredGold, fontSize: '12px' }}>
              {thread.tokens_used.toLocaleString()} / {thread.token_budget.toLocaleString()}
            </span>
          </div>
          <div style={{
            height: '8px',
            backgroundColor: '#111113',
            borderRadius: '4px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${(thread.tokens_used / thread.token_budget) * 100}%`,
              height: '100%',
              backgroundColor: CHENU_COLORS.sacredGold,
              borderRadius: '4px',
            }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: CHENU_COLORS.ancientStone, fontSize: '12px' }}>Type</span>
            <span style={{ color: CHENU_COLORS.softSand, fontSize: '12px', textTransform: 'capitalize' }}>
              {thread.thread_type}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: CHENU_COLORS.ancientStone, fontSize: '12px' }}>Encoding</span>
            <span style={{ color: CHENU_COLORS.softSand, fontSize: '12px', textTransform: 'capitalize' }}>
              {thread.encoding_level}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: CHENU_COLORS.ancientStone, fontSize: '12px' }}>Status</span>
            <span style={{ 
              color: thread.status === 'active' ? CHENU_COLORS.jungleEmerald : CHENU_COLORS.ancientStone, 
              fontSize: '12px', 
              textTransform: 'capitalize' 
            }}>
              {thread.status}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: CHENU_COLORS.ancientStone, fontSize: '12px' }}>Messages</span>
            <span style={{ color: CHENU_COLORS.softSand, fontSize: '12px' }}>
              {messages.length}
            </span>
          </div>
        </div>

        {thread.tags.length > 0 && (
          <div style={{ marginTop: '24px' }}>
            <p style={{ color: CHENU_COLORS.ancientStone, fontSize: '12px', marginBottom: '8px' }}>Tags</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {thread.tags.map((tag, idx) => (
                <span key={idx} style={{
                  padding: '4px 10px',
                  backgroundColor: '#111113',
                  borderRadius: '12px',
                  fontSize: '11px',
                  color: CHENU_COLORS.softSand,
                }}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Thread Panel */}
      <div style={{ flex: 1, padding: '24px' }}>
        <ThreadPanel
          thread={thread}
          messages={messages}
          decisions={decisions}
          onSendMessage={handleSendMessage}
          onDecide={handleDecide}
        />
      </div>
    </div>
  );
};

export default ThreadDetailPage;
