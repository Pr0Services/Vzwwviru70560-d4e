// CHE·NU™ Collaboration Vision & Principles
// Objectif: Stabilité idéologique
// 👉 Ce qui ne change pas, même quand le produit évolue

import React, { useState } from 'react';
import { CHENU_COLORS } from '../../types';
import { VisionSection, VISION_SECTIONS, VisionDocument } from './collaboration.types';

interface CollaborationVisionPrinciplesProps {
  collaborationId: string;
  canEdit: boolean;
}

const styles = {
  container: {
    display: 'flex',
    gap: '24px',
    height: '100%',
    maxWidth: '1200px',
  },
  
  // Left Nav
  leftNav: {
    width: '240px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  navItem: (isActive: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    backgroundColor: isActive ? '#111113' : 'transparent',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left' as const,
    transition: 'all 0.15s ease',
  }),
  navIcon: {
    fontSize: '20px',
    width: '28px',
    textAlign: 'center' as const,
  },
  navText: (isActive: boolean) => ({
    flex: 1,
  }),
  navTitle: (isActive: boolean) => ({
    fontSize: '14px',
    fontWeight: isActive ? 600 : 500,
    color: isActive ? CHENU_COLORS.sacredGold : CHENU_COLORS.softSand,
    marginBottom: '2px',
  }),
  navDescription: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  
  // Main Content
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: '#111113',
    borderRadius: '16px',
    overflow: 'hidden',
  },
  contentHeader: {
    padding: '24px',
    borderBottom: `1px solid ${CHENU_COLORS.ancientStone}22`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  headerIcon: {
    fontSize: '28px',
  },
  headerText: {
    fontSize: '20px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  editButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: 'transparent',
    border: `1px solid ${CHENU_COLORS.ancientStone}44`,
    borderRadius: '10px',
    color: CHENU_COLORS.softSand,
    fontSize: '13px',
    cursor: 'pointer',
  },
  saveButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: CHENU_COLORS.sacredGold,
    border: 'none',
    borderRadius: '10px',
    color: '#000',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
  },
  
  contentBody: {
    flex: 1,
    padding: '24px',
    overflowY: 'auto' as const,
  },
  
  // Content Display
  contentDisplay: {
    fontSize: '15px',
    lineHeight: 1.8,
    color: CHENU_COLORS.softSand,
    whiteSpace: 'pre-wrap' as const,
  },
  
  // Content Editor
  contentEditor: {
    width: '100%',
    height: '400px',
    padding: '16px',
    backgroundColor: '#0a0a0b',
    border: `1px solid ${CHENU_COLORS.ancientStone}33`,
    borderRadius: '12px',
    color: CHENU_COLORS.softSand,
    fontSize: '15px',
    lineHeight: 1.8,
    fontFamily: 'inherit',
    resize: 'vertical' as const,
    outline: 'none',
  },
  
  // Last Updated
  lastUpdated: {
    marginTop: '24px',
    paddingTop: '16px',
    borderTop: `1px solid ${CHENU_COLORS.ancientStone}22`,
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  
  // Lock Notice
  lockNotice: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: CHENU_COLORS.sacredGold + '11',
    borderRadius: '12px',
    marginBottom: '24px',
  },
  lockIcon: {
    fontSize: '20px',
  },
  lockText: {
    flex: 1,
    fontSize: '13px',
    color: CHENU_COLORS.sacredGold,
    lineHeight: 1.5,
  },
};

// Mock data - CHE·NU Vision & Principles
const MOCK_VISION_DOCS: Record<VisionSection, string> = {
  mission: `CHE·NU est un **Governed Intelligence Operating System**.

Notre mission est de créer un système d'exploitation pour intelligence gouvernée qui place l'humain au centre de toutes les décisions.

Nous construisons une plateforme où:
- La clarté prime sur les fonctionnalités
- La gouvernance prime sur l'exécution
- L'humain prime sur l'automatisation

CHE·NU n'est PAS un chatbot, une app de productivité, une plateforme crypto, ou un réseau social.

CHE·NU EST un système d'exploitation pour intelligence gouvernée, une plateforme de gestion d'intent, data, AI agents et coûts.`,

  values: `**1. Human Sovereignty**
Aucune action ne peut affecter le monde réel sans approbation humaine explicite.
L'IA propose, l'humain décide.

**2. Clarity Over Features**
Chaque fonctionnalité doit être compréhensible par un utilisateur non-technique.
Si on ne peut pas l'expliquer simplement, on ne le construit pas.

**3. Governance First**
Tout système d'IA doit avoir des budgets, des scopes, et des traces d'audit.
Pas d'intelligence non-gouvernée.

**4. Privacy by Design**
Les données appartiennent aux utilisateurs.
Chiffrement end-to-end, pas de monétisation des données.

**5. Transparency**
Les décisions de l'IA doivent être explicables.
Pas de boîtes noires.`,

  design_principles: `**Architecture (FROZEN)**
- 9 SPHERES exactement: Personal, Business, Government, Studio, Community, Social, Entertainment, My Team, Scholar
- 6 BUREAU SECTIONS par sphère: QuickCapture, ResumeWorkspace, Threads, DataFiles, ActiveAgents, Meetings
- THREADS (.chenu) comme objets first-class
- TOKENS internes (pas crypto) pour gouvernance

**Composants Clés**
- Nova: Intelligence système (jamais hired, toujours présente)
- User Orchestrator: Hired par user, coordonne les agents
- Agents: Ont coûts, scopes, encoding
- Encoding Layer: Compression avant/après exécution AI

**Règles UI/UX**
1. Reduce cognitive load
2. No feature dumping
3. Context first
4. Hierarchie visuelle claire
5. Dark mode natif`,

  ethical_boundaries: `**Lignes Rouges - JAMAIS**

1. **Manipulation**
   - Pas d'algorithmes de ranking addictifs
   - Pas d'optimisation d'engagement
   - Social feeds chronologiques uniquement

2. **Autonomie Non-Contrôlée**
   - Pas d'IA qui orchestre d'autres IA sans humain
   - Pas d'actions automatiques non-approuvées
   - Pas de décisions prises sans trace

3. **Données**
   - Jamais vendre ou monétiser les données utilisateurs
   - Jamais analyser le contenu pour la publicité
   - Jamais partager sans consentement explicite

4. **Agents**
   - Les agents ne peuvent pas inviter d'autres agents
   - Les agents ne peuvent pas modifier leurs propres scopes
   - Les agents ont toujours un budget maximum`,

  non_negotiables: `**1. Human Gates**
Toute action sensible DOIT passer par un human gate.
Pattern: DRAFT → PREVIEW → APPROVE → EXECUTE

**2. Token Budgets**
Chaque agent, thread, et workspace a un budget token.
Pas de budget illimité, jamais.

**3. Audit Trail**
Tout est tracé: created_by, created_at, modified_by, modified_at.
Pas d'action sans trace.

**4. Sphere Isolation**
Les données d'une sphère ne peuvent pas automatiquement aller dans une autre.
Cross-sphere = workflow explicite + approbation.

**5. R&D Continuity**
Les décisions passées sont respectées.
On ne contradit pas les règles établies sans revue complète.

**6. Module Registry**
Tout module a un statut défini dans le registry.
Pas de module orphelin ou non-documenté.

**7. Privacy First**
Encryption at rest, encryption in transit.
Zero-knowledge architecture où possible.`,
};

const CollaborationVisionPrinciples: React.FC<CollaborationVisionPrinciplesProps> = ({
  collaborationId,
  canEdit,
}) => {
  const [activeSection, setActiveSection] = useState<VisionSection>('mission');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  
  const currentSection = VISION_SECTIONS.find(s => s.id === activeSection)!;
  const content = MOCK_VISION_DOCS[activeSection];
  
  const handleEdit = () => {
    setEditContent(content);
    setIsEditing(true);
  };
  
  const handleSave = () => {
    // TODO: Save to backend
    logger.debug('Saving:', editContent);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setEditContent('');
  };
  
  // Format content with basic markdown
  const formatContent = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div style={styles.container}>
      {/* Left Navigation */}
      <div style={styles.leftNav}>
        {VISION_SECTIONS.map(section => (
          <button
            key={section.id}
            style={styles.navItem(activeSection === section.id)}
            onClick={() => {
              if (isEditing) {
                if (confirm('Discard changes?')) {
                  setIsEditing(false);
                  setActiveSection(section.id);
                }
              } else {
                setActiveSection(section.id);
              }
            }}
          >
            <span style={styles.navIcon}>{section.icon}</span>
            <div style={styles.navText(activeSection === section.id)}>
              <div style={styles.navTitle(activeSection === section.id)}>
                {section.name}
              </div>
              <div style={styles.navDescription}>{section.description}</div>
            </div>
          </button>
        ))}
      </div>
      
      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.contentHeader}>
          <div style={styles.headerTitle}>
            <span style={styles.headerIcon}>{currentSection.icon}</span>
            <span style={styles.headerText}>{currentSection.name}</span>
          </div>
          
          {canEdit && (
            <div style={{ display: 'flex', gap: '8px' }}>
              {isEditing ? (
                <>
                  <button style={styles.editButton} onClick={handleCancel}>
                    Cancel
                  </button>
                  <button style={styles.saveButton} onClick={handleSave}>
                    <span>💾</span>
                    <span>Save Changes</span>
                  </button>
                </>
              ) : (
                <button style={styles.editButton} onClick={handleEdit}>
                  <span>✏️</span>
                  <span>Edit</span>
                </button>
              )}
            </div>
          )}
        </div>
        
        <div style={styles.contentBody}>
          {/* Lock Notice for Non-Negotiables */}
          {activeSection === 'non_negotiables' && (
            <div style={styles.lockNotice}>
              <span style={styles.lockIcon}>🔒</span>
              <span style={styles.lockText}>
                These principles are <strong>locked</strong>. Changes require full architectural review and explicit approval from all facilitators.
              </span>
            </div>
          )}
          
          {isEditing ? (
            <textarea
              style={styles.contentEditor}
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              placeholder="Write your content here..."
            />
          ) : (
            <div 
              style={styles.contentDisplay}
              dangerouslySetInnerHTML={{ __html: formatContent(content) }}
            />
          )}
          
          <div style={styles.lastUpdated}>
            Last updated by Jonathan on Dec 27, 2025
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationVisionPrinciples;
