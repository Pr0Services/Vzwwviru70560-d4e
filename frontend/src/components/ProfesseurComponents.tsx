/**
 * CHE·NU™ — Agent Professeur Frontend Components
 * Version: V1.0
 * Date: 2026-01-07
 * 
 * Components pour la visualisation et gestion du Professeur:
 * - Dashboard des échecs marqués
 * - Fichier de recadrage
 * - Sessions de revue
 * 
 * GOUVERNANCE > EXÉCUTION
 */

import React, { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface MarqueEchec {
  id: string;
  timestamp: string;
  echec_type: 'comprehension_intention' | 'stabilite' | 'recuperation_contexte' | 'jugement_confiance';
  severity: 'low' | 'medium' | 'high';
  sphere_id?: string;
  thread_id?: string;
  description: string;
  symptoms: string[];
  axe_amelioration?: string;
  recadrage_suggested: boolean;
}

interface RecadrageEntry {
  id: string;
  created_at: string;
  entry_type: 'intention_validee' | 'decision_explicite' | 'autorisation_donnee' | 'structure_fonctionnelle' | 'hypothese_cloturee';
  content: string;
  context: string;
  sphere_id?: string;
  is_active: boolean;
}

interface ProfesseurStats {
  total_echecs: number;
  echecs_by_type: Record<string, number>;
  echecs_by_severity: Record<string, number>;
  recadrage_entries: number;
  sessions_completed: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const ECHEC_TYPE_LABELS: Record<string, string> = {
  comprehension_intention: "Compréhension d'intention",
  stabilite: "Stabilité",
  recuperation_contexte: "Récupération de contexte",
  jugement_confiance: "Jugement de confiance",
};

const ECHEC_TYPE_ICONS: Record<string, string> = {
  comprehension_intention: "🎯",
  stabilite: "⚖️",
  recuperation_contexte: "🔄",
  jugement_confiance: "🤔",
};

const SEVERITY_COLORS: Record<string, string> = {
  low: "#3EB4A2",      // Cenote Turquoise
  medium: "#D8B26A",   // Sacred Gold
  high: "#E74C3C",     // Red
};

const ENTRY_TYPE_LABELS: Record<string, string> = {
  intention_validee: "✓ Intention",
  decision_explicite: "✓ Décision",
  autorisation_donnee: "✓ Autorisation",
  structure_fonctionnelle: "✓ Structure",
  hypothese_cloturee: "✓ Clôturé",
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Badge de sévérité
 */
export const SeverityBadge: React.FC<{ severity: string }> = ({ severity }) => {
  const color = SEVERITY_COLORS[severity] || '#8D8371';
  
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '12px',
        backgroundColor: color,
        color: severity === 'low' ? '#1E1F22' : '#FFFFFF',
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'uppercase',
      }}
    >
      {severity}
    </span>
  );
};

/**
 * Carte d'échec marqué
 */
export const EchecCard: React.FC<{ echec: MarqueEchec }> = ({ echec }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div
      style={{
        backgroundColor: '#1E1F22',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px',
        border: `2px solid ${SEVERITY_COLORS[echec.severity]}`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>
            {ECHEC_TYPE_ICONS[echec.echec_type] || '❓'}
          </span>
          <div>
            <div style={{ color: '#E9E4D6', fontWeight: 600 }}>
              {ECHEC_TYPE_LABELS[echec.echec_type]}
            </div>
            <div style={{ color: '#8D8371', fontSize: '12px' }}>
              {new Date(echec.timestamp).toLocaleString()}
            </div>
          </div>
        </div>
        <SeverityBadge severity={echec.severity} />
      </div>
      
      <p style={{ color: '#E9E4D6', marginTop: '12px', marginBottom: '8px' }}>
        {echec.description}
      </p>
      
      {echec.symptoms.length > 0 && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: 'none',
            border: 'none',
            color: '#3EB4A2',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          {expanded ? '▼ Masquer les symptômes' : '▶ Voir les symptômes'}
        </button>
      )}
      
      {expanded && (
        <ul style={{ color: '#8D8371', marginTop: '8px', paddingLeft: '20px' }}>
          {echec.symptoms.map((symptom, i) => (
            <li key={i} style={{ marginBottom: '4px' }}>{symptom}</li>
          ))}
        </ul>
      )}
      
      {echec.axe_amelioration && (
        <div
          style={{
            marginTop: '12px',
            padding: '8px',
            backgroundColor: '#2F4C39',
            borderRadius: '4px',
          }}
        >
          <span style={{ color: '#3F7249', fontWeight: 600 }}>💡 Axe d'amélioration: </span>
          <span style={{ color: '#E9E4D6' }}>{echec.axe_amelioration}</span>
        </div>
      )}
      
      {echec.recadrage_suggested && (
        <div style={{ marginTop: '8px', color: '#D8B26A', fontSize: '12px' }}>
          ⚠️ Mise à jour du fichier de recadrage suggérée
        </div>
      )}
    </div>
  );
};

/**
 * Fichier de recadrage
 */
export const FichierRecadrage: React.FC<{
  entries: RecadrageEntry[];
  onAddEntry?: (content: string, type: string) => void;
}> = ({ entries, onAddEntry }) => {
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState('intention_validee');
  
  const activeEntries = entries.filter(e => e.is_active);
  
  return (
    <div
      style={{
        backgroundColor: '#1E1F22',
        borderRadius: '8px',
        padding: '20px',
      }}
    >
      <h3 style={{ color: '#D8B26A', marginBottom: '16px' }}>
        📜 Fichier de Recadrage
      </h3>
      
      <p style={{ color: '#8D8371', fontSize: '12px', marginBottom: '16px' }}>
        Ce fichier permet au système de revenir à une compréhension stabilisée.
        Utilisé par l'orchestreur, jamais exposé à l'utilisateur.
      </p>
      
      {/* Liste des entrées actives */}
      <div style={{ marginBottom: '20px' }}>
        {activeEntries.length === 0 ? (
          <p style={{ color: '#8D8371', fontStyle: 'italic' }}>
            Aucune entrée de recadrage
          </p>
        ) : (
          activeEntries.map(entry => (
            <div
              key={entry.id}
              style={{
                padding: '12px',
                backgroundColor: '#2F4C39',
                borderRadius: '4px',
                marginBottom: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#3F7249', fontWeight: 600 }}>
                  {ENTRY_TYPE_LABELS[entry.entry_type]}
                </span>
                <span style={{ color: '#8D8371', fontSize: '12px' }}>
                  {entry.sphere_id || 'global'}
                </span>
              </div>
              <p style={{ color: '#E9E4D6', marginTop: '4px', marginBottom: 0 }}>
                {entry.content}
              </p>
              {entry.context && (
                <p style={{ color: '#8D8371', fontSize: '12px', marginTop: '4px', marginBottom: 0 }}>
                  Contexte: {entry.context}
                </p>
              )}
            </div>
          ))
        )}
      </div>
      
      {/* Formulaire d'ajout */}
      {onAddEntry && (
        <div style={{ borderTop: '1px solid #2F4C39', paddingTop: '16px' }}>
          <h4 style={{ color: '#E9E4D6', marginBottom: '12px' }}>Ajouter une entrée</h4>
          
          <select
            value={newType}
            onChange={e => setNewType(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '8px',
              backgroundColor: '#2F4C39',
              border: 'none',
              borderRadius: '4px',
              color: '#E9E4D6',
            }}
          >
            {Object.entries(ENTRY_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          
          <textarea
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
            placeholder="Contenu de l'entrée..."
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '8px',
              backgroundColor: '#2F4C39',
              border: 'none',
              borderRadius: '4px',
              color: '#E9E4D6',
              minHeight: '80px',
              resize: 'vertical',
            }}
          />
          
          <button
            onClick={() => {
              if (newContent.trim()) {
                onAddEntry(newContent, newType);
                setNewContent('');
              }
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3F7249',
              color: '#E9E4D6',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Ajouter
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * Dashboard Professeur
 */
export const ProfesseurDashboard: React.FC<{
  stats: ProfesseurStats;
  echecs: MarqueEchec[];
  recadrageEntries: RecadrageEntry[];
  onStartSession?: () => void;
  onEndSession?: () => void;
  sessionActive?: boolean;
}> = ({ stats, echecs, recadrageEntries, onStartSession, onEndSession, sessionActive }) => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#0D0D0D', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ color: '#D8B26A', marginBottom: '8px' }}>
          🎓 Agent Professeur
        </h1>
        <p style={{ color: '#8D8371' }}>
          Le professeur n'aide pas le système à aller plus vite. Il l'aide à ne pas se perdre.
        </p>
      </div>
      
      {/* Session Controls */}
      <div style={{ marginBottom: '24px' }}>
        {sessionActive ? (
          <button
            onClick={onEndSession}
            style={{
              padding: '12px 24px',
              backgroundColor: '#E74C3C',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            ⏹️ Terminer la session de revue
          </button>
        ) : (
          <button
            onClick={onStartSession}
            style={{
              padding: '12px 24px',
              backgroundColor: '#3F7249',
              color: '#E9E4D6',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            ▶️ Démarrer une session de revue
          </button>
        )}
        {sessionActive && (
          <span style={{ marginLeft: '16px', color: '#3EB4A2' }}>
            🔴 Session en cours...
          </span>
        )}
      </div>
      
      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <StatCard label="Total Échecs" value={stats.total_echecs} color="#E74C3C" />
        <StatCard label="Entrées Recadrage" value={stats.recadrage_entries} color="#3EB4A2" />
        <StatCard label="Sessions" value={stats.sessions_completed} color="#D8B26A" />
        <StatCard
          label="Haute Sévérité"
          value={stats.echecs_by_severity?.high || 0}
          color="#E74C3C"
        />
      </div>
      
      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Échecs */}
        <div>
          <h2 style={{ color: '#E9E4D6', marginBottom: '16px' }}>
            Échecs Marqués ({echecs.length})
          </h2>
          {echecs.map(echec => (
            <EchecCard key={echec.id} echec={echec} />
          ))}
          {echecs.length === 0 && (
            <p style={{ color: '#8D8371', fontStyle: 'italic' }}>
              Aucun échec marqué
            </p>
          )}
        </div>
        
        {/* Recadrage */}
        <div>
          <FichierRecadrage entries={recadrageEntries} />
        </div>
      </div>
    </div>
  );
};

/**
 * Carte de statistique
 */
const StatCard: React.FC<{ label: string; value: number; color: string }> = ({
  label,
  value,
  color,
}) => (
  <div
    style={{
      backgroundColor: '#1E1F22',
      borderRadius: '8px',
      padding: '16px',
      textAlign: 'center',
      borderTop: `3px solid ${color}`,
    }}
  >
    <div style={{ color, fontSize: '32px', fontWeight: 700 }}>{value}</div>
    <div style={{ color: '#8D8371', fontSize: '12px' }}>{label}</div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default ProfesseurDashboard;
