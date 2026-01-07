/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ - DATABASE SETTINGS PAGE
 * Page dédiée pour gérer les connexions aux bases de données
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import DatabaseConnectionManager from '../../components/settings/database/DatabaseConnectionManager';

export const DatabaseSettingsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="database-settings-page">
      {/* Header */}
      <header className="page-header">
        <button className="back-button" onClick={() => navigate('/settings')}>
          <ArrowLeft size={20} />
          Retour aux paramètres
        </button>
      </header>

      {/* Content */}
      <DatabaseConnectionManager />

      <style>{`
        .database-settings-page {
          min-height: 100vh;
          background: #121212;
        }

        .page-header {
          padding: 16px 24px;
          border-bottom: 1px solid #2a2a2a;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: transparent;
          color: #888;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #D8B26A;
        }
      `}</style>
    </div>
  );
};

export default DatabaseSettingsPage;
