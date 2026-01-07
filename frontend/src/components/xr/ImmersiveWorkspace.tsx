/**
 * CHE·NU™ - XR IMMERSIVE WORKSPACE
 * 3D/VR immersive interface using Three.js / React Three Fiber
 * 
 * Features:
 * - 3D sphere visualization
 * - Floating bureau sections
 * - Nova AI presence
 * - Agent bubbles
 * - Token flow visualization
 */

import React, { useRef, useMemo, useState, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Text, 
  Float, 
  Stars,
  Environment,
  Html,
  useTexture,
  MeshDistortMaterial,
  Sphere as DreiSphere,
} from '@react-three/drei';
import * as THREE from 'three';
import { SPHERES, SphereId, BUREAU_SECTIONS } from '../../config/spheres.config';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface SphereNodeProps {
  sphere: typeof SPHERES[SphereId];
  position: [number, number, number];
  isActive: boolean;
  onClick: () => void;
}

interface NovaPresenceProps {
  isActive: boolean;
  status: 'idle' | 'thinking' | 'speaking';
}

interface BureauPanelProps {
  section: typeof BUREAU_SECTIONS[number];
  position: [number, number, number];
  rotation: [number, number, number];
  isVisible: boolean;
}

interface AgentBubbleProps {
  agent: {
    id: string;
    name: string;
    avatar: string;
    status: string;
  };
  position: [number, number, number];
}

// ═══════════════════════════════════════════════════════════════
// SPHERE NODE (3D Clickable Sphere)
// ═══════════════════════════════════════════════════════════════

const SphereNode: React.FC<SphereNodeProps> = ({ sphere, position, isActive, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
      
      // Scale on hover/active
      const targetScale = isActive ? 1.3 : hovered ? 1.15 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  const color = new THREE.Color(sphere.color);

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={isActive ? 0.3 : 0.1}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      
      {/* Glow effect */}
      <mesh scale={1.2}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isActive ? 0.3 : 0.1}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Label */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
        <Text
          position={[0, -0.8, 0]}
          fontSize={0.15}
          color={isActive ? '#D8B26A' : '#888888'}
          anchorX="center"
          anchorY="middle"
        >
          {sphere.icon} {sphere.name}
        </Text>
      </Float>
      
      {/* Connection lines when active */}
      {isActive && (
        <mesh>
          <ringGeometry args={[0.7, 0.72, 32]} />
          <meshBasicMaterial color={sphere.color} transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// NOVA PRESENCE (Central AI Presence)
// ═══════════════════════════════════════════════════════════════

const NovaPresence: React.FC<NovaPresenceProps> = ({ isActive, status }) => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
    if (coreRef.current) {
      const pulse = status === 'thinking' ? 0.2 : status === 'speaking' ? 0.15 : 0.05;
      coreRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * pulse);
    }
  });

  const novaColor = status === 'thinking' ? '#D8B26A' : status === 'speaking' ? '#3EB4A2' : '#3F7249';

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.3, 2]} />
        <meshStandardMaterial
          color={novaColor}
          emissive={novaColor}
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* Orbiting rings */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[Math.PI * i * 0.3, Math.PI * i * 0.2, 0]}>
          <torusGeometry args={[0.5 + i * 0.15, 0.01, 8, 64]} />
          <meshBasicMaterial color={novaColor} transparent opacity={0.3 - i * 0.08} />
        </mesh>
      ))}
      
      {/* Status indicator */}
      {status !== 'idle' && (
        <Html position={[0, 0.8, 0]} center>
          <div style={{
            background: 'rgba(0,0,0,0.8)',
            padding: '4px 12px',
            borderRadius: '12px',
            color: novaColor,
            fontSize: '12px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}>
            ✧ Nova {status === 'thinking' ? 'is thinking...' : 'is speaking'}
          </div>
        </Html>
      )}
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// BUREAU PANEL (Floating Section)
// ═══════════════════════════════════════════════════════════════

const BureauPanel: React.FC<BureauPanelProps> = ({ section, position, rotation, isVisible }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      const targetOpacity = isVisible ? 0.9 : 0;
      meshRef.current.material.opacity = THREE.MathUtils.lerp(
        meshRef.current.material.opacity,
        targetOpacity,
        0.1
      );
    }
  });

  if (!isVisible) return null;

  return (
    <group position={position} rotation={rotation}>
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
        <mesh ref={meshRef}>
          <planeGeometry args={[1.5, 1]} />
          <meshBasicMaterial color="#1a1a1a" transparent opacity={0.9} side={THREE.DoubleSide} />
        </mesh>
        
        {/* Border */}
        <lineSegments position={[0, 0, 0.001]}>
          <edgesGeometry args={[new THREE.PlaneGeometry(1.5, 1)]} />
          <lineBasicMaterial color="#D8B26A" />
        </lineSegments>
        
        {/* Title */}
        <Text
          position={[0, 0.35, 0.01]}
          fontSize={0.08}
          color="#D8B26A"
          anchorX="center"
        >
          {section.name}
        </Text>
        
        {/* Content placeholder */}
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.05}
          color="#666666"
          anchorX="center"
          maxWidth={1.3}
        >
          Section {section.order} of Bureau
        </Text>
      </Float>
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// AGENT BUBBLE
// ═══════════════════════════════════════════════════════════════

const AgentBubble: React.FC<AgentBubbleProps> = ({ agent, position }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.05;
    }
  });

  const statusColor = agent.status === 'executing' ? '#3EB4A2' : 
                      agent.status === 'thinking' ? '#D8B26A' : '#666666';

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={statusColor} metalness={0.5} roughness={0.3} />
      </mesh>
      
      <Html position={[0, 0.25, 0]} center>
        <div style={{
          background: 'rgba(0,0,0,0.8)',
          padding: '2px 8px',
          borderRadius: '8px',
          color: '#fff',
          fontSize: '10px',
          whiteSpace: 'nowrap',
        }}>
          {agent.avatar} {agent.name}
        </div>
      </Html>
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// TOKEN FLOW VISUALIZATION
// ═══════════════════════════════════════════════════════════════

const TokenFlow: React.FC<{ from: THREE.Vector3; to: THREE.Vector3; active: boolean }> = ({ from, to, active }) => {
  const lineRef = useRef<THREE.Line>(null);
  const particleRef = useRef<THREE.Mesh>(null);
  const [progress, setProgress] = useState(0);

  useFrame((state, delta) => {
    if (active && particleRef.current) {
      setProgress((p) => (p + delta * 0.5) % 1);
      particleRef.current.position.lerpVectors(from, to, progress);
    }
  });

  if (!active) return null;

  const points = [from, to];
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <group>
      <line ref={lineRef} geometry={lineGeometry}>
        <lineBasicMaterial color="#D8B26A" transparent opacity={0.3} />
      </line>
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#D8B26A" />
      </mesh>
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN IMMERSIVE WORKSPACE
// ═══════════════════════════════════════════════════════════════

interface ImmersiveWorkspaceProps {
  activeSphereId?: SphereId;
  onSphereSelect: (sphereId: SphereId) => void;
  novaStatus?: 'idle' | 'thinking' | 'speaking';
  agents?: Array<{ id: string; name: string; avatar: string; status: string }>;
}

const ImmersiveScene: React.FC<ImmersiveWorkspaceProps> = ({
  activeSphereId,
  onSphereSelect,
  novaStatus = 'idle',
  agents = [],
}) => {
  // Calculate sphere positions in a circle
  const spherePositions = useMemo(() => {
    const sphereIds = Object.keys(SPHERES) as SphereId[];
    const radius = 3;
    return sphereIds.map((id, i) => {
      const angle = (i / sphereIds.length) * Math.PI * 2 - Math.PI / 2;
      return {
        id,
        sphere: SPHERES[id],
        position: [
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius,
        ] as [number, number, number],
      };
    });
  }, []);

  // Bureau panel positions (arranged around active sphere)
  const bureauPositions = useMemo(() => {
    return BUREAU_SECTIONS.map((section, i) => {
      const angle = (i / BUREAU_SECTIONS.length) * Math.PI * 2;
      const radius = 1.5;
      return {
        section,
        position: [
          Math.cos(angle) * radius,
          0.5 + (i % 2) * 0.3,
          Math.sin(angle) * radius,
        ] as [number, number, number],
        rotation: [0, -angle + Math.PI, 0] as [number, number, number],
      };
    });
  }, []);

  return (
    <>
      {/* Environment */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3EB4A2" />
      
      {/* Nova at center */}
      <NovaPresence isActive={!!activeSphereId} status={novaStatus} />
      
      {/* Sphere nodes */}
      {spherePositions.map(({ id, sphere, position }) => (
        <SphereNode
          key={id}
          sphere={sphere}
          position={position}
          isActive={activeSphereId === id}
          onClick={() => onSphereSelect(id)}
        />
      ))}
      
      {/* Bureau panels (only show when sphere is active) */}
      {activeSphereId && bureauPositions.map(({ section, position, rotation }) => (
        <BureauPanel
          key={section.id}
          section={section}
          position={position}
          rotation={rotation}
          isVisible={!!activeSphereId}
        />
      ))}
      
      {/* Agent bubbles */}
      {agents.map((agent, i) => (
        <AgentBubble
          key={agent.id}
          agent={agent}
          position={[
            Math.cos((i / agents.length) * Math.PI * 2) * 2,
            1,
            Math.sin((i / agents.length) * Math.PI * 2) * 2,
          ]}
        />
      ))}
      
      {/* Controls */}
      <OrbitControls
        enablePan={false}
        minDistance={2}
        maxDistance={10}
        maxPolarAngle={Math.PI / 1.5}
      />
    </>
  );
};

// ═══════════════════════════════════════════════════════════════
// EXPORTED COMPONENT
// ═══════════════════════════════════════════════════════════════

export const ImmersiveWorkspace: React.FC<ImmersiveWorkspaceProps> = (props) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '500px', background: '#0a0a0a' }}>
      <Canvas
        camera={{ position: [0, 3, 6], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ImmersiveScene {...props} />
        </Suspense>
      </Canvas>
      
      {/* Overlay UI */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 12,
        padding: '12px 20px',
        background: 'rgba(0,0,0,0.8)',
        borderRadius: 12,
        border: '1px solid #333',
      }}>
        <span style={{ color: '#888', fontSize: 12 }}>
          🖱️ Drag to rotate • Scroll to zoom
        </span>
        <span style={{ color: '#D8B26A', fontSize: 12 }}>
          Click sphere to enter
        </span>
      </div>
    </div>
  );
};

export default ImmersiveWorkspace;
