// CHE·NU™ Dashboard Page — Main Overview

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigationStore, useAuthStore, useBudgetStore } from '../../stores';
import { CHENU_COLORS, SPHERE_ICONS, SPHERE_COLORS, BUREAU_SECTIONS, type SphereCode } from '../../types';
import { GridSphereNav, SphereCard } from '../../components/spheres/SphereComponents';
import NovaPanel, { NovaTrigger } from '../../components/core/NovaPanel';
import { StatCard, Card } from '../../components/core/UIComponents';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const { currentSphere, setCurrentSphere, novaOpen, toggleNova } = useNavigationStore();
  const budget = useBudgetStore();

  const [recentActivity] = useState([
    { type: 'thread', title: 'Q4 Strategy Discussion', sphere: 'business', time: '5 min ago' },
    { type: 'decision', title: 'Budget Approval', sphere: 'business', time: '1 hour ago' },
    { type: 'meeting', title: 'Team Standup', sphere: 'team', time: '3 hours ago' },
    { type: 'task', title: 'Review Documentation', sphere: 'personal', time: 'Yesterday' },
  ]);

  const sphereStats: Record<SphereCode, { threads: number; tasks: number; tokens: number }> = {
    personal: { threads: 8, tasks: 12, tokens: 1200 },
    business: { threads: 15, tasks: 24, tokens: 3400 },
    government: { threads: 3, tasks: 5, tokens: 450 },
    studio: { threads: 6, tasks: 8, tokens: 890 },
    community: { threads: 4, tasks: 6, tokens: 320 },
    social: { threads: 2, tasks: 3, tokens: 150 },
    entertainment: { threads: 1, tasks: 2, tokens: 80 },
    team: { threads: 5, tasks: 10, tokens: 1060 },
  };

  const handleSphereSelect = (sphere: SphereCode) => {
    setCurrentSphere(sphere);
    navigate(`/sphere/${sphere}`);
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: CHENU_COLORS.uiSlate,
    }}>
      {/* Sidebar */}
      <div style={{
        width: '80px',
        backgroundColor: '#0a0a0b',
        borderRight: `1px solid ${CHENU_COLORS.ancientStone}22`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 0',
      }}>
        <div style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: CHENU_COLORS.sacredGold,
          marginBottom: '32px',
        }}>
          C
        </div>
        
        {(Object.keys(SPHERE_ICONS) as SphereCode[]).map((code) => (
          <button
            key={code}
            onClick={() => handleSphereSelect(code)}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: currentSphere === code ? SPHERE_COLORS[code] : 'transparent',
              cursor: 'pointer',
              fontSize: '20px',
              marginBottom: '8px',
              opacity: currentSphere === code ? 1 : 0.6,
              transition: 'all 0.2s ease',
            }}
          >
            {SPHERE_ICONS[code]}
          </button>
        ))}
        
        <div style={{ flex: 1 }} />
        
        <button
          onClick={toggleNova}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            border: 'none',
            backgroundColor: novaOpen ? CHENU_COLORS.cenoteTurquoise : 'transparent',
            cursor: 'pointer',
            fontSize: '20px',
            opacity: novaOpen ? 1 : 0.6,
          }}
        >
          ✨
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '32px' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
        }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: CHENU_COLORS.softSand, marginBottom: '4px' }}>
              Welcome back, {user?.display_name?.split(' ')[0] || 'User'}
            </h1>
            <p style={{ color: CHENU_COLORS.ancientStone, fontSize: '15px' }}>
              Here's what's happening across your spheres
            </p>
          </div>
          <div style={{
            padding: '12px 20px',
            backgroundColor: '#111113',
            borderRadius: '12px',
            border: `1px solid ${CHENU_COLORS.ancientStone}22`,
          }}>
            <p style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone, marginBottom: '4px' }}>Token Budget</p>
            <p style={{ fontSize: '18px', fontWeight: 600, color: CHENU_COLORS.sacredGold }}>
              {budget.totalRemaining.toLocaleString()} / {budget.totalAllocated.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          <StatCard label="Active Threads" value={44} icon="💬" color={CHENU_COLORS.cenoteTurquoise} />
          <StatCard label="Pending Tasks" value={70} icon="✅" color={CHENU_COLORS.sacredGold} />
          <StatCard label="Decisions Required" value={5} icon="⚡" color={CHENU_COLORS.earthEmber} />
          <StatCard label="Tokens Used Today" value="2.4K" icon="🔥" color={CHENU_COLORS.jungleEmerald} />
        </div>

        {/* Spheres Grid */}
        <Card title="Your Spheres" subtitle="Navigate between contexts">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '16px' }}>
            {(Object.keys(SPHERE_ICONS) as SphereCode[]).map((code) => (
              <SphereCard
                key={code}
                sphere={code}
                stats={sphereStats[code]}
                onClick={() => handleSphereSelect(code)}
              />
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <div style={{ marginTop: '24px' }}>
          <Card title="Recent Activity" subtitle="Latest actions across all spheres">
            {recentActivity.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  backgroundColor: '#0a0a0b',
                  borderRadius: '8px',
                  marginTop: idx > 0 ? '8px' : '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '16px' }}>
                    {SPHERE_ICONS[item.sphere as SphereCode]}
                  </span>
                  <div>
                    <p style={{ color: CHENU_COLORS.softSand, fontSize: '14px' }}>{item.title}</p>
                    <p style={{ color: CHENU_COLORS.ancientStone, fontSize: '12px' }}>{item.type}</p>
                  </div>
                </div>
                <span style={{ color: CHENU_COLORS.ancientStone, fontSize: '12px' }}>{item.time}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* Nova Panel */}
      <NovaPanel
        isOpen={novaOpen}
        onClose={toggleNova}
        context={{ sphere: currentSphere, section: 'dashboard', recentActions: [] }}
        onNavigate={(sphere, section) => navigate(`/sphere/${sphere}/${section}`)}
      />
      
      {!novaOpen && <NovaTrigger onClick={toggleNova} />}
    </div>
  );
};

export default DashboardPage;
