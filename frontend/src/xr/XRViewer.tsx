/**
 * XRViewer.tsx - CHE·NU XR Environment Viewer
 * 
 * Renders XR environments generated from Threads.
 * Uses Three.js via React-Three-Fiber for 3D rendering.
 * 
 * IMPORTANT: XR is READ-ONLY projection of Thread data.
 * No modifications allowed from XR view.
 */

import React, { Suspense, useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  Text, 
  Html,
  PerspectiveCamera,
  Float,
  Stars
} from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { 
  XREnvironment, 
  XRZone, 
  XRZoneType, 
  XRLighting,
  Vector3 
} from './types';
import { useXREnvironment } from './types';

// ============================================================================
// TYPES
// ============================================================================

interface XRViewerProps {
  threadId: string;
  sphereId: string;
  onZoneClick?: (zone: XRZone) => void;
  onClose?: () => void;
  className?: string;
}

interface ZoneProps {
  zone: XRZone;
  onClick?: () => void;
}

// ============================================================================
// ZONE COMPONENTS
// ============================================================================

const IntentWall: React.FC<ZoneProps> = ({ zone, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.opacity = 0.7 + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group position={[zone.position.x, zone.position.y, zone.position.z]}>
      <mesh 
        ref={meshRef} 
        onClick={onClick}
        castShadow
      >
        <boxGeometry args={[zone.scale.x * 4, zone.scale.y * 3, 0.1]} />
        <meshStandardMaterial 
          color="#4f46e5" 
          transparent 
          opacity={0.8}
          emissive="#4f46e5"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Title */}
      <Text
        position={[0, zone.scale.y * 1.2, 0.1]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Intent Wall
      </Text>
      
      {/* Content */}
      {zone.content?.text && (
        <Text
          position={[0, 0, 0.1]}
          fontSize={0.2}
          color="#e0e7ff"
          anchorX="center"
          anchorY="middle"
          maxWidth={zone.scale.x * 3}
        >
          {zone.content.text}
        </Text>
      )}
    </group>
  );
};

const DecisionWall: React.FC<ZoneProps> = ({ zone, onClick }) => {
  const decisions = zone.content?.decisions || [];
  
  return (
    <group position={[zone.position.x, zone.position.y, zone.position.z]}>
      <mesh onClick={onClick} castShadow>
        <boxGeometry args={[zone.scale.x * 4, zone.scale.y * 3, 0.1]} />
        <meshStandardMaterial 
          color="#059669" 
          transparent 
          opacity={0.7}
          emissive="#059669"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      <Text
        position={[0, zone.scale.y * 1.2, 0.1]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
      >
        Decision Wall
      </Text>
      
      {/* Decision cards */}
      {decisions.slice(0, 5).map((decision, i) => (
        <Float key={i} speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
          <mesh position={[(i - 2) * 1.2, 0, 0.2]}>
            <boxGeometry args={[1, 0.6, 0.05]} />
            <meshStandardMaterial color="#10b981" />
          </mesh>
          <Text
            position={[(i - 2) * 1.2, 0, 0.25]}
            fontSize={0.1}
            color="#ffffff"
            anchorX="center"
            maxWidth={0.9}
          >
            {decision.title || `Decision ${i + 1}`}
          </Text>
        </Float>
      ))}
    </group>
  );
};

const ActionTable: React.FC<ZoneProps> = ({ zone, onClick }) => {
  const actions = zone.content?.actions || [];
  
  return (
    <group position={[zone.position.x, zone.position.y, zone.position.z]}>
      {/* Table surface */}
      <mesh onClick={onClick} receiveShadow>
        <cylinderGeometry args={[zone.scale.x * 1.5, zone.scale.x * 1.5, 0.1, 32]} />
        <meshStandardMaterial 
          color="#1e293b" 
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.25}
        color="#94a3b8"
        anchorX="center"
      >
        Action Table
      </Text>
      
      {/* Action items floating above table */}
      {actions.slice(0, 6).map((action, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const radius = zone.scale.x;
        return (
          <Float key={i} speed={1.5} floatIntensity={0.2}>
            <mesh 
              position={[
                Math.cos(angle) * radius,
                0.3 + (i % 2) * 0.2,
                Math.sin(angle) * radius
              ]}
            >
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial 
                color={action.status === 'completed' ? '#22c55e' : '#f59e0b'}
                emissive={action.status === 'completed' ? '#22c55e' : '#f59e0b'}
                emissiveIntensity={0.5}
              />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
};

const MemoryKiosk: React.FC<ZoneProps> = ({ zone, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group position={[zone.position.x, zone.position.y, zone.position.z]}>
      {/* Kiosk pillar */}
      <mesh castShadow>
        <cylinderGeometry args={[0.3, 0.4, 2, 8]} />
        <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.3} />
      </mesh>
      
      {/* Rotating holographic display */}
      <mesh ref={meshRef} position={[0, 1.5, 0]} onClick={onClick}>
        <torusGeometry args={[0.5, 0.1, 16, 32]} />
        <meshStandardMaterial 
          color="#8b5cf6" 
          transparent 
          opacity={0.6}
          emissive="#8b5cf6"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      <Text
        position={[0, 2.2, 0]}
        fontSize={0.2}
        color="#a78bfa"
        anchorX="center"
      >
        Memory Kiosk
      </Text>
    </group>
  );
};

const TimelineStrip: React.FC<ZoneProps> = ({ zone, onClick }) => {
  const events = zone.content?.events || [];
  
  return (
    <group position={[zone.position.x, zone.position.y, zone.position.z]}>
      {/* Timeline base */}
      <mesh onClick={onClick}>
        <boxGeometry args={[zone.scale.x * 6, 0.1, 0.5]} />
        <meshStandardMaterial 
          color="#0ea5e9" 
          emissive="#0ea5e9"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.2}
        color="#7dd3fc"
        anchorX="center"
      >
        Timeline Strip
      </Text>
      
      {/* Event markers */}
      {events.slice(0, 10).map((event, i) => (
        <Float key={i} speed={2} floatIntensity={0.1}>
          <mesh position={[(i - 4.5) * (zone.scale.x * 0.6), 0.3, 0]}>
            <coneGeometry args={[0.08, 0.2, 4]} />
            <meshStandardMaterial 
              color="#38bdf8"
              emissive="#38bdf8"
              emissiveIntensity={0.4}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

const ResourceShelf: React.FC<ZoneProps> = ({ zone, onClick }) => {
  const resources = zone.content?.resources || [];
  
  return (
    <group position={[zone.position.x, zone.position.y, zone.position.z]}>
      {/* Shelf structure */}
      {[0, 1, 2].map((level) => (
        <mesh key={level} position={[0, level * 0.8, 0]} onClick={onClick}>
          <boxGeometry args={[zone.scale.x * 3, 0.1, 0.6]} />
          <meshStandardMaterial color="#78716c" metalness={0.3} roughness={0.7} />
        </mesh>
      ))}
      
      <Text
        position={[0, 2.8, 0]}
        fontSize={0.2}
        color="#a8a29e"
        anchorX="center"
      >
        Resource Shelf
      </Text>
      
      {/* Resource items (books/folders) */}
      {resources.slice(0, 9).map((resource, i) => (
        <mesh 
          key={i} 
          position={[
            ((i % 3) - 1) * 0.8,
            Math.floor(i / 3) * 0.8 + 0.2,
            0.1
          ]}
        >
          <boxGeometry args={[0.2, 0.4, 0.3]} />
          <meshStandardMaterial 
            color={['#ef4444', '#3b82f6', '#22c55e', '#f59e0b'][i % 4]}
          />
        </mesh>
      ))}
    </group>
  );
};

// ============================================================================
// ZONE RENDERER
// ============================================================================

const ZoneRenderer: React.FC<{ zone: XRZone; onClick?: () => void }> = ({ zone, onClick }) => {
  if (!zone.visible) return null;
  
  switch (zone.type) {
    case 'intent_wall':
      return <IntentWall zone={zone} onClick={onClick} />;
    case 'decision_wall':
      return <DecisionWall zone={zone} onClick={onClick} />;
    case 'action_table':
      return <ActionTable zone={zone} onClick={onClick} />;
    case 'memory_kiosk':
      return <MemoryKiosk zone={zone} onClick={onClick} />;
    case 'timeline_strip':
      return <TimelineStrip zone={zone} onClick={onClick} />;
    case 'resource_shelf':
      return <ResourceShelf zone={zone} onClick={onClick} />;
    default:
      return null;
  }
};

// ============================================================================
// SCENE COMPONENT
// ============================================================================

interface SceneProps {
  environment: XREnvironment;
  onZoneClick?: (zone: XRZone) => void;
}

const Scene: React.FC<SceneProps> = ({ environment, onZoneClick }) => {
  const { camera } = useThree();
  
  // Set up lighting based on environment
  const lighting = environment.lighting;
  const atmosphere = environment.atmosphere;
  
  return (
    <>
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 3, 8]} fov={60} />
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2}
      />
      
      {/* Lighting */}
      <ambientLight 
        color={lighting.ambient.color} 
        intensity={lighting.ambient.intensity} 
      />
      <directionalLight
        color={lighting.directional.color}
        intensity={lighting.directional.intensity}
        position={[
          lighting.directional.position.x,
          lighting.directional.position.y,
          lighting.directional.position.z
        ]}
        castShadow
      />
      
      {/* Fog */}
      {lighting.fog?.enabled && (
        <fog 
          attach="fog" 
          args={[
            lighting.fog.color, 
            lighting.fog.near, 
            lighting.fog.far
          ]} 
        />
      )}
      
      {/* Atmosphere */}
      {atmosphere.particleSystem === 'stars' && (
        <Stars 
          radius={100} 
          depth={50} 
          count={5000} 
          factor={4} 
          saturation={0} 
        />
      )}
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          color={atmosphere.groundColor} 
          transparent 
          opacity={0.5}
        />
      </mesh>
      
      {/* Zones */}
      {environment.zones.map((zone) => (
        <ZoneRenderer 
          key={zone.id} 
          zone={zone}
          onClick={() => onZoneClick?.(zone)}
        />
      ))}
    </>
  );
};

// ============================================================================
// LOADING COMPONENT
// ============================================================================

const LoadingScreen: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
      <p className="text-slate-400">Loading XR Environment...</p>
    </div>
  </div>
);

// ============================================================================
// ZONE INFO PANEL
// ============================================================================

interface ZoneInfoPanelProps {
  zone: XRZone | null;
  onClose: () => void;
}

const ZoneInfoPanel: React.FC<ZoneInfoPanelProps> = ({ zone, onClose }) => {
  if (!zone) return null;
  
  const zoneLabels: Record<XRZoneType, string> = {
    intent_wall: 'Intent Wall',
    decision_wall: 'Decision Wall',
    action_table: 'Action Table',
    memory_kiosk: 'Memory Kiosk',
    timeline_strip: 'Timeline Strip',
    resource_shelf: 'Resource Shelf',
  };
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="absolute top-4 right-4 w-80 bg-slate-800/90 backdrop-blur-sm rounded-lg border border-slate-700 shadow-xl"
      >
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">
            {zoneLabels[zone.type]}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-700 rounded"
          >
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4 space-y-3">
          {zone.content?.text && (
            <div>
              <p className="text-sm text-slate-400 mb-1">Content</p>
              <p className="text-slate-200">{zone.content.text}</p>
            </div>
          )}
          
          {zone.content?.decisions && zone.content.decisions.length > 0 && (
            <div>
              <p className="text-sm text-slate-400 mb-1">Decisions ({zone.content.decisions.length})</p>
              <ul className="space-y-1">
                {zone.content.decisions.slice(0, 3).map((d, i) => (
                  <li key={i} className="text-sm text-slate-300 truncate">• {d.title}</li>
                ))}
              </ul>
            </div>
          )}
          
          {zone.content?.actions && zone.content.actions.length > 0 && (
            <div>
              <p className="text-sm text-slate-400 mb-1">Actions ({zone.content.actions.length})</p>
              <ul className="space-y-1">
                {zone.content.actions.slice(0, 3).map((a, i) => (
                  <li key={i} className="text-sm text-slate-300 truncate">• {a.title}</li>
                ))}
              </ul>
            </div>
          )}
          
          <p className="text-xs text-slate-500 pt-2 border-t border-slate-700">
            ⚠️ XR View is read-only. Modifications must be made in Thread view.
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const XRViewer: React.FC<XRViewerProps> = ({
  threadId,
  sphereId,
  onZoneClick,
  onClose,
  className = ''
}) => {
  const { environment, isLoading, error, generate } = useXREnvironment(threadId, sphereId);
  const [selectedZone, setSelectedZone] = React.useState<XRZone | null>(null);

  const handleZoneClick = useCallback((zone: XRZone) => {
    setSelectedZone(zone);
    onZoneClick?.(zone);
  }, [onZoneClick]);

  // Generate environment on mount
  React.useEffect(() => {
    if (!environment && !isLoading && !error) {
      generate();
    }
  }, [environment, isLoading, error, generate]);

  if (error) {
    return (
      <div className={`relative w-full h-full bg-slate-900 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <p className="text-red-400 mb-2">Failed to load XR environment</p>
          <p className="text-slate-500 text-sm">{error}</p>
          <button
            onClick={() => generate()}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full bg-slate-900 ${className}`}>
      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 p-2 bg-slate-800/80 hover:bg-slate-700 rounded-lg backdrop-blur-sm"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      )}
      
      {/* Controls hint */}
      <div className="absolute bottom-4 left-4 z-10 px-3 py-2 bg-slate-800/80 rounded-lg backdrop-blur-sm">
        <p className="text-xs text-slate-400">
          🖱️ Drag to rotate • Scroll to zoom • Click zones for details
        </p>
      </div>
      
      {/* Template badge */}
      {environment && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-3 py-1 bg-slate-800/80 rounded-full backdrop-blur-sm">
          <p className="text-sm text-slate-300">
            {environment.template.replace('_', ' ').toUpperCase()}
          </p>
        </div>
      )}
      
      {/* Canvas */}
      <Canvas shadows>
        <Suspense fallback={null}>
          {environment && (
            <Scene 
              environment={environment} 
              onZoneClick={handleZoneClick}
            />
          )}
        </Suspense>
      </Canvas>
      
      {/* Loading overlay */}
      {isLoading && <LoadingScreen />}
      
      {/* Zone info panel */}
      <ZoneInfoPanel 
        zone={selectedZone}
        onClose={() => setSelectedZone(null)}
      />
    </div>
  );
};

export default XRViewer;
