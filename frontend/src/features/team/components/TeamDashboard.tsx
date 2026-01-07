/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — TEAM DASHBOARD
 * Phase 7: Collaboration & Team Features
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect } from 'react';
import { useTeam } from '../hooks/useTeam';

interface TeamMember {
  user_id: string;
  role: 'owner' | 'admin' | 'member' | 'guest';
  joined_at: string;
  email: string;
  name: string;
}

export const TeamDashboard: React.FC = () => {
  const { team, members, isLoading, inviteMember, removeMember, updateRole } = useTeam();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member' | 'guest'>('member');

  if (isLoading || !team) {
    return <div className="loading">Chargement de l'équipe...</div>;
  }

  const handleInvite = async () => {
    if (!inviteEmail) return;

    await inviteMember(inviteEmail, inviteRole);
    setInviteEmail('');
    setShowInviteModal(false);
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      owner: '#d8b26a',
      admin: '#3f7249',
      member: '#3eb4a2',
      guest: '#8d8371',
    };
    return colors[role as keyof typeof colors] || '#8d8371';
  };

  const canManageMembers = members.find(m => m.user_id === 'current_user')?.role in ['owner', 'admin'];

  return (
    <div className="team-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="team-info">
          <h1>{team.name}</h1>
          <p>{team.description}</p>
        </div>

        {canManageMembers && (
          <button className="btn-primary" onClick={() => setShowInviteModal(true)}>
            Inviter un membre
          </button>
        )}
      </div>

      {/* Team Stats */}
      <div className="team-stats">
        <div className="stat-card">
          <span className="stat-icon">👥</span>
          <div className="stat-content">
            <span className="stat-value">{members.length}/{team.max_members}</span>
            <span className="stat-label">Membres</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">🧵</span>
          <div className="stat-content">
            <span className="stat-value">{team.shared_threads?.length || 0}</span>
            <span className="stat-label">Threads Partagés</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">🤖</span>
          <div className="stat-content">
            <span className="stat-value">{team.team_agents?.length || 0}</span>
            <span className="stat-label">Agents d'Équipe</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">🪙</span>
          <div className="stat-content">
            <span className="stat-value">
              {((team.total_token_budget - team.tokens_spent) || 0).toLocaleString()}
            </span>
            <span className="stat-label">Tokens Disponibles</span>
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="members-section">
        <h2>Membres de l'équipe</h2>

        <div className="members-list">
          {members.map((member) => (
            <div key={member.user_id} className="member-card">
              <div className="member-avatar">
                {member.name.charAt(0).toUpperCase()}
              </div>

              <div className="member-info">
                <div className="member-name">{member.name}</div>
                <div className="member-email">{member.email}</div>
                <div className="member-joined">
                  Rejoint le {new Date(member.joined_at).toLocaleDateString()}
                </div>
              </div>

              <div
                className="role-badge"
                style={{ background: getRoleBadgeColor(member.role) }}
              >
                {member.role}
              </div>

              {canManageMembers && member.role !== 'owner' && (
                <div className="member-actions">
                  <select
                    value={member.role}
                    onChange={(e) => updateRole(member.user_id, e.target.value as any)}
                    className="role-selector"
                  >
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                    <option value="guest">Guest</option>
                  </select>

                  <button
                    className="btn-danger"
                    onClick={() => removeMember(member.user_id)}
                  >
                    Retirer
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="modal-overlay" onClick={() => setShowInviteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Inviter un membre</h3>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="membre@example.com"
              />
            </div>

            <div className="form-group">
              <label>Rôle</label>
              <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value as any)}>
                <option value="admin">Admin</option>
                <option value="member">Member</option>
                <option value="guest">Guest</option>
              </select>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowInviteModal(false)}>
                Annuler
              </button>
              <button className="btn-primary" onClick={handleInvite}>
                Envoyer l'invitation
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .team-dashboard {
          padding: 40px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .team-info h1 {
          font-size: 32px;
          color: #1e1f22;
          margin: 0 0 8px;
        }

        .team-info p {
          color: #8d8371;
          margin: 0;
        }

        .btn-primary {
          background: #d8b26a;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary:hover {
          background: #c9a159;
          transform: translateY(-2px);
        }

        .team-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: white;
          border: 2px solid #e9e4d6;
          border-radius: 12px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .stat-icon {
          font-size: 32px;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #1e1f22;
        }

        .stat-label {
          font-size: 12px;
          color: #8d8371;
          text-transform: uppercase;
        }

        .members-section {
          background: white;
          border: 2px solid #e9e4d6;
          border-radius: 12px;
          padding: 32px;
        }

        .members-section h2 {
          font-size: 20px;
          color: #1e1f22;
          margin: 0 0 24px;
        }

        .members-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .member-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #e9e4d6;
          border-radius: 8px;
        }

        .member-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #d8b26a;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 700;
        }

        .member-info {
          flex: 1;
        }

        .member-name {
          font-weight: 600;
          color: #1e1f22;
        }

        .member-email {
          font-size: 14px;
          color: #8d8371;
        }

        .member-joined {
          font-size: 12px;
          color: #8d8371;
        }

        .role-badge {
          padding: 6px 12px;
          border-radius: 6px;
          color: white;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .member-actions {
          display: flex;
          gap: 8px;
        }

        .role-selector {
          padding: 8px 12px;
          border: 1px solid #8d8371;
          border-radius: 6px;
          background: white;
        }

        .btn-danger {
          background: #e74c3c;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          padding: 32px;
          width: 90%;
          max-width: 500px;
        }

        .modal-content h3 {
          margin: 0 0 24px;
          color: #1e1f22;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #2f4c39;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 12px;
          border: 2px solid #e9e4d6;
          border-radius: 8px;
          font-size: 16px;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .btn-secondary {
          background: transparent;
          color: #8d8371;
          border: 2px solid #8d8371;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .loading {
          padding: 60px;
          text-align: center;
          color: #8d8371;
          font-size: 18px;
        }
      `}</style>
    </div>
  );
};
