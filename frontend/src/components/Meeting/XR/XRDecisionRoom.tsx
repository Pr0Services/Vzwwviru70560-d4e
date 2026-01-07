/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — XR DECISION ROOM
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * XR est OPTIONNEL.
 * XR n'est PAS requis pour la correction.
 * XR améliore la clarté pour les cas complexes.
 * 
 * RÈGLE D'OR:
 * XR ne doit JAMAIS introduire des actions impossibles dans l'UI standard.
 * XR reflète la gouvernance, elle ne la contourne pas.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { MeetingType, MeetingAgent } from '../../../canonical/MEETING_TYPES_CANONICAL';
import { MeetingProposal } from '../../../canonical/MEETING_UI_CANONICAL';
import {
  XR_INTERACTIONS,
  XRRoomState,
  XR_VISUAL_SETTINGS
} from '../../../canonical/XR_DECISION_ROOM_CANONICAL';

interface XRDecisionRoomProps {
  meetingId: string;
  meetingType: MeetingType;
  objective: string;
  agents: MeetingAgent[];
  proposals: MeetingProposal[];
  onValidate: (proposalId: string) => void;
  onReject: (proposalId: string) => void;
  onExit: () => void;
  language?: 'en' | 'fr';
}

// Agent Orb Component
const AgentOrb: React.FC<{
  agent: MeetingAgent;
  position: [number, number, number];
  color: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ agent, position, color, isActive, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      
      // Glow when active
      if (isActive) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
        meshRef.current.scale.setScalar(scale);
      }
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} onClick={onClick}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isActive ? 0.5 : 0.2}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Role Label */}
      <Html position={[0, 0.5, 0]} center>
        <div
          style={{
            background: 'rgba(0,0,0,0.8)',
            padding: '4px 8px',
            borderRadius: '4px',
            color: '#fff',
            fontSize: '10px',
            whiteSpace: 'nowrap'
          }}
        >
          {agent.agentId}
        </div>
      </Html>
    </group>
  );
};

// Proposal Panel Component
const ProposalPanel: React.FC<{
  proposal: MeetingProposal;
  position: [number, number, number];
  isSelected: boolean;
  onClick: () => void;
  onValidate: () => void;
  onReject: () => void;
}> = ({ proposal, position, isSelected, onClick, onValidate, onReject }) => {
  return (
    <group position={position}>
      {/* Panel Background */}
      <mesh onClick={onClick}>
        <planeGeometry args={[2, 1.5]} />
        <meshStandardMaterial
          color={isSelected ? '#3F7249' : '#2A2B2E'}
          transparent
          opacity={0.95}
        />
      </mesh>
      
      {/* Content */}
      <Html position={[0, 0, 0.01]} center transform>
        <div
          style={{
            width: '180px',
            padding: '12px',
            background: isSelected ? '#3F7249' : '#2A2B2E',
            borderRadius: '8px',
            color: '#E9E4D6'
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '12px' }}>
            {proposal.title}
          </div>
          <div style={{ fontSize: '10px', color: '#8D8371', marginBottom: '12px' }}>
            {proposal.content.substring(0, 80)}...
          </div>
          {isSelected && proposal.status === 'pending' && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={(e) => { e.stopPropagation(); onValidate(); }}
                style={{
                  flex: 1,
                  padding: '6px',
                  background: '#10B981',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '10px',
                  cursor: 'pointer'
                }}
              >
                ✓ Valider
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onReject(); }}
                style={{
                  flex: 1,
                  padding: '6px',
                  background: '#EF4444',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '10px',
                  cursor: 'pointer'
                }}
              >
                × Rejeter
              </button>
            </div>
          )}
        </div>
      </Html>
    </group>
  );
};

// Center Focus Component
const CenterFocus: React.FC<{ objective: string }> = ({ objective }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central focus ring */}
      <mesh ref={meshRef}>
        <torusGeometry args={[1.5, 0.05, 16, 100]} />
        <meshStandardMaterial
          color="#D8B26A"
          emissive="#D8B26A"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Objective display */}
      <Html position={[0, 0.5, 0]} center>
        <div
          style={{
            background: 'rgba(30,31,34,0.95)',
            padding: '16px 24px',
            borderRadius: '12px',
            border: '1px solid #D8B26A',
            maxWidth: '300px',
            textAlign: 'center'
          }}
        >
          <div style={{ color: '#D8B26A', fontSize: '10px', marginBottom: '8px' }}>
            🎯 FOCUS
          </div>
          <div style={{ color: '#E9E4D6', fontSize: '14px' }}>
            {objective}
          </div>
        </div>
      </Html>
    </group>
  );
};

// Validation Zone Component
const ValidationZone: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1, 32]} />
        <meshStandardMaterial
          color="#10B981"
          transparent
          opacity={0.3}
        />
      </mesh>
      <Html position={[0, 0.1, 0]} center>
        <div
          style={{
            color: '#10B981',
            fontSize: '12px',
            fontWeight: 600
          }}
        >
          Zone de Validation
        </div>
      </Html>
    </group>
  );
};

// Main Scene Component
const XRScene: React.FC<{
  objective: string;
  agents: MeetingAgent[];
  proposals: MeetingProposal[];
  selectedProposal: string | null;
  onSelectProposal: (id: string) => void;
  onValidate: (id: string) => void;
  onReject: (id: string) => void;
}> = ({
  objective,
  agents,
  proposals,
  selectedProposal,
  onSelectProposal,
  onValidate,
  onReject
}) => {
  // Calculate agent positions in a circle
  const agentPositions = useMemo(() => {
    return agents.map((agent, index) => {
      const angle = (index / agents.length) * Math.PI * 2;
      const radius = 3;
      return {
        agent,
        position: [
          Math.cos(angle) * radius,
          0.5,
          Math.sin(angle) * radius
        ] as [number, number, number],
        color: getAgentColor(agent.agentId)
      };
    });
  }, [agents]);

  // Calculate proposal positions
  const proposalPositions = useMemo(() => {
    return proposals.map((proposal, index) => {
      const angle = (index / proposals.length) * Math.PI * 2 + Math.PI / 4;
      const radius = 4.5;
      return {
        proposal,
        position: [
          Math.cos(angle) * radius,
          1,
          Math.sin(angle) * radius
        ] as [number, number, number]
      };
    });
  }, [proposals]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 5, 0]} intensity={0.8} />
      <pointLight position={[5, 3, 5]} intensity={0.4} color="#D8B26A" />

      {/* Environment */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <circleGeometry args={[10, 64]} />
        <meshStandardMaterial color="#1E1F22" />
      </mesh>

      {/* Center Focus */}
      <CenterFocus objective={objective} />

      {/* Agents */}
      {agentPositions.map(({ agent, position, color }) => (
        <AgentOrb
          key={agent.agentId}
          agent={agent}
          position={position}
          color={color}
          isActive={false}
          onClick={() => {}}
        />
      ))}

      {/* Proposals */}
      {proposalPositions.map(({ proposal, position }) => (
        <ProposalPanel
          key={proposal.id}
          proposal={proposal}
          position={position}
          isSelected={selectedProposal === proposal.id}
          onClick={() => onSelectProposal(proposal.id)}
          onValidate={() => onValidate(proposal.id)}
          onReject={() => onReject(proposal.id)}
        />
      ))}

      {/* Validation Zone */}
      <ValidationZone position={[0, -0.49, 5]} />

      {/* Camera Controls - Limited (no free roaming) */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={5}
        maxDistance={12}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
      />
    </>
  );
};

// Main Component
export const XRDecisionRoom: React.FC<XRDecisionRoomProps> = ({
  meetingId,
  meetingType,
  objective,
  agents,
  proposals,
  onValidate,
  onReject,
  onExit,
  language = 'fr'
}) => {
  const [roomState, setRoomState] = useState<XRRoomState>('initializing');
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);

  useEffect(() => {
    // Initialize room
    const timer = setTimeout(() => {
      setRoomState('active');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSelectProposal = (id: string) => {
    // Check if action is allowed
    if (!XR_INTERACTIONS.allowed.includes('select_proposal')) {
      logger.warn('Action not allowed in XR');
      return;
    }
    setSelectedProposal(id === selectedProposal ? null : id);
  };

  const handleValidate = (id: string) => {
    if (!XR_INTERACTIONS.allowed.includes('validate')) {
      logger.warn('Validation not allowed in XR');
      return;
    }
    onValidate(id);
    setSelectedProposal(null);
  };

  const handleReject = (id: string) => {
    if (!XR_INTERACTIONS.allowed.includes('reject')) {
      logger.warn('Rejection not allowed in XR');
      return;
    }
    onReject(id);
    setSelectedProposal(null);
  };

  const labels = {
    en: {
      title: 'XR Decision Room',
      loading: 'Initializing XR Environment...',
      exit: 'Exit XR'
    },
    fr: {
      title: 'Salle de Décision XR',
      loading: 'Initialisation de l\'environnement XR...',
      exit: 'Quitter XR'
    }
  };

  const t = labels[language];

  if (roomState === 'initializing') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          background: '#1E1F22',
          color: '#E9E4D6'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🕶️</div>
          <div>{t.loading}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', height: '100%', background: '#1E1F22' }}>
      {/* XR Canvas */}
      <Canvas
        camera={{ position: [0, 3, 8], fov: 60 }}
        style={{ background: '#0A0A0B' }}
      >
        <XRScene
          objective={objective}
          agents={agents}
          proposals={proposals}
          selectedProposal={selectedProposal}
          onSelectProposal={handleSelectProposal}
          onValidate={handleValidate}
          onReject={handleReject}
        />
      </Canvas>

      {/* UI Overlay */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          right: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            background: 'rgba(30,31,34,0.9)',
            padding: '12px 20px',
            borderRadius: '8px',
            border: '1px solid #D8B26A'
          }}
        >
          <span style={{ color: '#D8B26A', marginRight: '8px' }}>🕶️</span>
          <span style={{ color: '#E9E4D6', fontWeight: 600 }}>{t.title}</span>
        </div>

        <button
          onClick={onExit}
          style={{
            padding: '12px 20px',
            background: 'rgba(122,89,58,0.9)',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          {t.exit}
        </button>
      </div>

      {/* Instructions */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(30,31,34,0.9)',
          padding: '8px 16px',
          borderRadius: '8px',
          color: '#8D8371',
          fontSize: '12px'
        }}
      >
        {language === 'fr' 
          ? 'Cliquez sur une proposition pour la sélectionner • Utilisez la souris pour naviguer'
          : 'Click a proposal to select it • Use mouse to navigate'
        }
      </div>
    </div>
  );
};

// Helper function
function getAgentColor(agentId: string): string {
  const colors: Record<string, string> = {
    'personal-core': '#EF4444',
    'team-coordination': '#3B82F6',
    'validation-trust': '#F59E0B',
    'memory-governance': '#8B5CF6',
    'system-orchestrator': '#06B6D4'
  };
  return colors[agentId] || '#8D8371';
}

export default XRDecisionRoom;
