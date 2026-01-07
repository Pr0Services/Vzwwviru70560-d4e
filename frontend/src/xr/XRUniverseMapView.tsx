/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — XR UNIVERSE MAP VIEW
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Vue carte 3D de l'univers CHE·NU avec les 9 sphères
 * Utilise React Three Fiber pour le rendu WebGL
 * 
 * @version 46.0
 * @author CHE·NU Team
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useRef, useState, useMemo, Suspense, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Html, 
  Float, 
  MeshWobbleMaterial,
  Stars,
  Sparkles
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

export type SphereId = 
  | 'personal' 
  | 'business' 
  | 'government' 
  | 'creative' 
  | 'community' 
  | 'social' 
  | 'entertainment' 
  | 'team' 
  | 'scholar';

interface SphereConfig {
  id: SphereId;
  name: string;
  nameFr: string;
  icon: string;
  color: string;
  position: [number, number, number];
  agentCount: number;
}

interface XRUniverseMapViewProps {
  onSphereSelect?: (sphereId: SphereId) => void;
  onSphereHover?: (sphereId: SphereId | null) => void;
  selectedSphere?: SphereId | null;
  showLabels?: boolean;
  quality?: 'low' | 'medium' | 'high';
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS & CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const TOKENS = {
  colors: {
    sacredGold: '#D8B26A',
    ancientStone: '#8D8371',
    jungleEmerald: '#3F7249',
    cenoteTurquoise: '#3EB4A2',
    darkSlate: '#1A1A1A',
    creamText: '#E9E4D6'
  }
};

const RADIUS = 6;
const getPositionOnCircle = (index: number, total: number): [number, number, number] => {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  return [Math.cos(angle) * RADIUS, 0, Math.sin(angle) * RADIUS];
};

const SPHERES_CONFIG: SphereConfig[] = [
  { id: 'personal', name: 'Personal', nameFr: 'Personnel', icon: '🏠', color: '#76E6C7', position: getPositionOnCircle(0, 9), agentCount: 25 },
  { id: 'business', name: 'Business', nameFr: 'Entreprise', icon: '💼', color: '#5BA9FF', position: getPositionOnCircle(1, 9), agentCount: 32 },
  { id: 'government', name: 'Government', nameFr: 'Gouvernement', icon: '🏛️', color: '#D08FFF', position: getPositionOnCircle(2, 9), agentCount: 20 },
  { id: 'creative', name: 'Creative Studio', nameFr: 'Studio Créatif', icon: '🎨', color: '#FF8BAA', position: getPositionOnCircle(3, 9), agentCount: 27 },
  { id: 'community', name: 'Community', nameFr: 'Communauté', icon: '👥', color: '#22C55E', position: getPositionOnCircle(4, 9), agentCount: 18 },
  { id: 'social', name: 'Social & Media', nameFr: 'Social & Médias', icon: '📱', color: '#66D06F', position: getPositionOnCircle(5, 9), agentCount: 23 },
  { id: 'entertainment', name: 'Entertainment', nameFr: 'Divertissement', icon: '🎬', color: '#FFB04D', position: getPositionOnCircle(6, 9), agentCount: 20 },
  { id: 'team', name: 'My Team', nameFr: 'Mon Équipe', icon: '🤝', color: '#5ED8FF', position: getPositionOnCircle(7, 9), agentCount: 34 },
  { id: 'scholar', name: 'Scholar', nameFr: 'Savant', icon: '📚', color: '#9B59B6', position: getPositionOnCircle(8, 9), agentCount: 25 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SPHERE NODE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface SphereNodeProps {
  config: SphereConfig;
  isSelected: boolean;
  isHovered: boolean;
  showLabel: boolean;
  onClick: () => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

function SphereNode({ config, isSelected, isHovered, showLabel, onClick, onPointerEnter, onPointerLeave }: SphereNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + config.position[0]) * 0.05;
      const baseScale = isSelected ? 1.3 : isHovered ? 1.15 : 1;
      meshRef.current.scale.setScalar(scale * baseScale);
      meshRef.current.rotation.y += 0.002;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(isSelected ? 2.2 : isHovered ? 1.8 : 1.4);
    }
  });
  
  return (
    <group position={config.position}>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshBasicMaterial color={config.color} transparent opacity={isSelected ? 0.3 : isHovered ? 0.2 : 0.1} />
      </mesh>
      
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh
          ref={meshRef}
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          onPointerEnter={(e) => { e.stopPropagation(); onPointerEnter(); }}
          onPointerLeave={(e) => { e.stopPropagation(); onPointerLeave(); }}
        >
          <icosahedronGeometry args={[0.5, 2]} />
          <MeshWobbleMaterial color={config.color} factor={0.3} speed={isHovered ? 2 : 1} metalness={0.4} roughness={0.3} />
        </mesh>
      </Float>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]}>
        <ringGeometry args={[0.7, 0.75, 32]} />
        <meshBasicMaterial color={config.color} transparent opacity={isSelected ? 0.8 : 0.4} side={THREE.DoubleSide} />
      </mesh>
      
      {showLabel && (
        <Html position={[0, 0.9, 0]} center distanceFactor={10} style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(26, 26, 26, 0.9)',
            padding: '8px 16px',
            borderRadius: '8px',
            border: `2px solid ${config.color}`,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(4px)'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>{config.icon}</div>
            <div style={{ color: config.color, fontWeight: 600, fontSize: '14px' }}>{config.name}</div>
            <div style={{ color: TOKENS.colors.creamText, fontSize: '11px', opacity: 0.7, marginTop: '2px' }}>{config.agentCount} agents</div>
          </div>
        </Html>
      )}
      
      <Sparkles count={isHovered ? 20 : 10} size={2} scale={1} color={config.color} speed={0.5} />
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// NOVA CENTER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function NovaCenter() {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    if (ringRef.current) ringRef.current.rotation.z += 0.01;
  });
  
  return (
    <group position={[0, 0, 0]}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.8, 3]} />
        <meshStandardMaterial color={TOKENS.colors.sacredGold} metalness={0.8} roughness={0.2} emissive={TOKENS.colors.sacredGold} emissiveIntensity={0.3} />
      </mesh>
      
      <mesh><sphereGeometry args={[1.2, 32, 32]} /><meshBasicMaterial color={TOKENS.colors.sacredGold} transparent opacity={0.15} /></mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 4, 0, 0]}><torusGeometry args={[1.5, 0.02, 16, 64]} /><meshBasicMaterial color={TOKENS.colors.sacredGold} transparent opacity={0.5} /></mesh>
      
      <Html position={[0, 1.5, 0]} center>
        <div style={{
          background: `linear-gradient(135deg, ${TOKENS.colors.sacredGold}22, ${TOKENS.colors.sacredGold}44)`,
          padding: '12px 24px',
          borderRadius: '12px',
          border: `2px solid ${TOKENS.colors.sacredGold}`,
          textAlign: 'center',
          backdropFilter: 'blur(8px)'
        }}>
          <div style={{ color: TOKENS.colors.sacredGold, fontWeight: 700, fontSize: '18px', letterSpacing: '2px' }}>NOVA</div>
          <div style={{ color: TOKENS.colors.creamText, fontSize: '11px', opacity: 0.8, marginTop: '4px' }}>System Intelligence</div>
        </div>
      </Html>
      
      <Sparkles count={50} size={3} scale={3} color={TOKENS.colors.sacredGold} speed={0.3} />
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GROUND & ENVIRONMENT
// ═══════════════════════════════════════════════════════════════════════════════

function Ground() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <circleGeometry args={[12, 64]} /><meshStandardMaterial color="#151515" roughness={0.9} metalness={0.1} />
      </mesh>
      <gridHelper args={[20, 20, TOKENS.colors.sacredGold, '#222222']} position={[0, -0.49, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.48, 0]}>
        <ringGeometry args={[1.8, 2, 64]} /><meshBasicMaterial color={TOKENS.colors.sacredGold} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.47, 0]}>
        <ringGeometry args={[RADIUS - 0.2, RADIUS + 0.2, 64]} /><meshBasicMaterial color={TOKENS.colors.cenoteTurquoise} transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <hemisphereLight args={['#87CEEB', '#362312', 0.5]} />
      <directionalLight position={[10, 20, 10]} intensity={1} castShadow shadow-mapSize={[2048, 2048]} />
      <pointLight position={[0, 5, 0]} color={TOKENS.colors.sacredGold} intensity={0.5} />
    </>
  );
}

function PostProcessing({ quality }: { quality: string }) {
  if (quality === 'low') return null;
  return (
    <EffectComposer>
      <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} intensity={quality === 'high' ? 0.6 : 0.4} />
      <Vignette darkness={0.3} offset={0.3} />
    </EffectComposer>
  );
}

function LoadingFallback() {
  return (
    <Html center>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: TOKENS.colors.creamText }}>
        <div style={{ fontSize: '32px', fontWeight: 700, color: TOKENS.colors.sacredGold, marginBottom: '16px' }}>CHE·NU</div>
        <div style={{ fontSize: '14px' }}>Chargement de l'Univers...</div>
      </div>
    </Html>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface SceneProps {
  selectedSphere: SphereId | null;
  hoveredSphere: SphereId | null;
  showLabels: boolean;
  quality: string;
  onSphereSelect: (id: SphereId) => void;
  onSphereHover: (id: SphereId | null) => void;
}

function Scene({ selectedSphere, hoveredSphere, showLabels, quality, onSphereSelect, onSphereHover }: SceneProps) {
  return (
    <>
      <Lighting />
      <Ground />
      <NovaCenter />
      {SPHERES_CONFIG.map((config) => (
        <SphereNode
          key={config.id}
          config={config}
          isSelected={selectedSphere === config.id}
          isHovered={hoveredSphere === config.id}
          showLabel={showLabels || hoveredSphere === config.id || selectedSphere === config.id}
          onClick={() => onSphereSelect(config.id)}
          onPointerEnter={() => onSphereHover(config.id)}
          onPointerLeave={() => onSphereHover(null)}
        />
      ))}
      <Stars radius={100} depth={50} count={2000} factor={4} fade speed={0.3} />
      <OrbitControls enableDamping dampingFactor={0.05} rotateSpeed={0.5} zoomSpeed={0.8} minDistance={5} maxDistance={25} minPolarAngle={Math.PI / 6} maxPolarAngle={Math.PI / 2.5} />
      <PostProcessing quality={quality} />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export const XRUniverseMapView: React.FC<XRUniverseMapViewProps> = ({
  onSphereSelect,
  onSphereHover,
  selectedSphere = null,
  showLabels = false,
  quality = 'medium',
  className = ''
}) => {
  const [hoveredSphere, setHoveredSphere] = useState<SphereId | null>(null);
  const [internalSelected, setInternalSelected] = useState<SphereId | null>(selectedSphere);
  
  const handleSphereSelect = useCallback((id: SphereId) => {
    setInternalSelected(id);
    onSphereSelect?.(id);
  }, [onSphereSelect]);
  
  const handleSphereHover = useCallback((id: SphereId | null) => {
    setHoveredSphere(id);
    onSphereHover?.(id);
  }, [onSphereHover]);
  
  const currentSelected = selectedSphere ?? internalSelected;
  
  return (
    <div className={`xr-universe-map-view ${className}`} style={{
      position: 'relative', width: '100%', height: '100%', minHeight: '400px',
      background: `linear-gradient(180deg, ${TOKENS.colors.darkSlate} 0%, #0a0a0a 100%)`,
      borderRadius: '16px', overflow: 'hidden'
    }}>
      <Canvas shadows camera={{ fov: 45, near: 0.1, far: 1000, position: [0, 8, 12] }} gl={{ antialias: true, alpha: true }} dpr={[1, quality === 'high' ? 2 : 1.5]}>
        <Suspense fallback={<LoadingFallback />}>
          <Scene selectedSphere={currentSelected} hoveredSphere={hoveredSphere} showLabels={showLabels} quality={quality} onSphereSelect={handleSphereSelect} onSphereHover={handleSphereHover} />
        </Suspense>
      </Canvas>
      
      <div style={{
        position: 'absolute', bottom: '16px', left: '16px', background: 'rgba(26, 26, 26, 0.8)',
        padding: '8px 12px', borderRadius: '8px', color: TOKENS.colors.creamText, fontSize: '12px', backdropFilter: 'blur(4px)'
      }}>
        🖱️ Glisser pour tourner • Scroll pour zoomer
      </div>
      
      <div style={{
        position: 'absolute', top: '16px', right: '16px', background: 'rgba(26, 26, 26, 0.9)',
        padding: '12px', borderRadius: '12px', backdropFilter: 'blur(4px)'
      }}>
        <div style={{ color: TOKENS.colors.sacredGold, fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>CHE·NU Universe</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: TOKENS.colors.creamText, fontSize: '11px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: TOKENS.colors.sacredGold }} /> Nova (Centre)
        </div>
        <div style={{ color: '#888', fontSize: '10px', marginTop: '4px' }}>9 Sphères • 224 Agents</div>
      </div>
    </div>
  );
};

export default XRUniverseMapView;
