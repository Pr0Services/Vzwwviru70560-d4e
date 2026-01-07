/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V41 - 7 ESPACES 3D AVEC PBR MATERIALS
 * Upgrade des 7 espaces avec matériaux réalistes PBR
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SpaceBase } from './SpaceBase';
import { SPACES_CONFIG } from '../../config/spacesConfig';
import { getPBRLibrary } from '../../materials';

// Hook pour charger les matériaux PBR
function usePBRMaterial(presetId: string) {
  const library = getPBRLibrary();
  return useMemo(() => library.getPreset(presetId), [presetId]);
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAISON - Cozy House (WOOD + STONE)
// ═══════════════════════════════════════════════════════════════════════════════

export function MaisonSpace() {
  const config = SPACES_CONFIG.maison;
  
  // PBR Materials
  const oakWood = usePBRMaterial('oak');
  const weatheredWood = usePBRMaterial('weathered_wood');
  const sandstone = usePBRMaterial('sandstone');
  
  return (
    <SpaceBase spaceId="maison">
      <group>
        {/* Base - Oak wood */}
        <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.5, 1.5, 2]} />
          {oakWood ? (
            <primitive object={oakWood} attach="material" />
          ) : (
            <meshStandardMaterial color={config.color} roughness={0.6} />
          )}
        </mesh>
        
        {/* Roof - Weathered wood */}
        <mesh position={[0, 2.1, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[2, 1.2, 4]} />
          {weatheredWood ? (
            <primitive object={weatheredWood} attach="material" />
          ) : (
            <meshStandardMaterial color="#8B4513" roughness={0.7} />
          )}
        </mesh>
        
        {/* Door - Dark oak */}
        <mesh position={[0, 0.4, 1.01]}>
          <boxGeometry args={[0.5, 0.8, 0.1]} />
          <meshStandardMaterial color="#4A3728" roughness={0.8} />
        </mesh>
        
        {/* Windows - Warm glow */}
        <mesh position={[-0.7, 1.1, 1.01]}>
          <boxGeometry args={[0.4, 0.4, 0.1]} />
          <meshStandardMaterial 
            color="#FFE4B5" 
            emissive="#FFE4B5" 
            emissiveIntensity={0.3} 
          />
        </mesh>
        <mesh position={[0.7, 1.1, 1.01]}>
          <boxGeometry args={[0.4, 0.4, 0.1]} />
          <meshStandardMaterial 
            color="#FFE4B5" 
            emissive="#FFE4B5" 
            emissiveIntensity={0.3} 
          />
        </mesh>
        
        {/* Chimney - Sandstone */}
        <mesh position={[0.7, 2.4, -0.3]} castShadow>
          <boxGeometry args={[0.4, 0.8, 0.4]} />
          {sandstone ? (
            <primitive object={sandstone} attach="material" />
          ) : (
            <meshStandardMaterial color="#8B4513" roughness={0.7} />
          )}
        </mesh>
      </group>
    </SpaceBase>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENTREPRISE - Office Tower (METAL + GLASS)
// ═══════════════════════════════════════════════════════════════════════════════

export function EntrepriseSpace() {
  const config = SPACES_CONFIG.entreprise;
  
  // PBR Materials
  const brushedAluminum = usePBRMaterial('brushed_aluminum');
  const clearGlass = usePBRMaterial('clear_glass');
  const polishedSteel = usePBRMaterial('polished_steel');
  
  return (
    <SpaceBase spaceId="entreprise">
      <group>
        {/* Main tower - Brushed aluminum */}
        <mesh position={[0, 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[2, 4, 2]} />
          {brushedAluminum ? (
            <primitive object={brushedAluminum} attach="material" />
          ) : (
            <meshStandardMaterial color={config.color} roughness={0.3} metalness={0.6} />
          )}
        </mesh>
        
        {/* Glass windows - 4x4 grid */}
        {[0, 1, 2, 3].map((floor) => (
          [0, 1, 2, 3].map((side) => {
            const angle = (side * Math.PI) / 2;
            const x = Math.sin(angle) * 1.01;
            const z = Math.cos(angle) * 1.01;
            const y = -1.5 + floor * 1;
            
            return (
              <mesh 
                key={`window-${floor}-${side}`} 
                position={[x, y, z]}
                rotation={[0, -angle, 0]}
              >
                <boxGeometry args={[0.4, 0.8, 0.05]} />
                {clearGlass ? (
                  <primitive object={clearGlass} attach="material" />
                ) : (
                  <meshStandardMaterial 
                    color="#88CCFF" 
                    transparent 
                    opacity={0.3} 
                    roughness={0.1}
                  />
                )}
              </mesh>
            );
          })
        ))}
        
        {/* Top accent - Polished steel */}
        <mesh position={[0, 4.5, 0]} castShadow>
          <boxGeometry args={[2.2, 0.3, 2.2]} />
          {polishedSteel ? (
            <primitive object={polishedSteel} attach="material" />
          ) : (
            <meshStandardMaterial color="#CCCCCC" metalness={1.0} roughness={0.1} />
          )}
        </mesh>
      </group>
    </SpaceBase>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROJETS - Construction Site (MIXED MATERIALS)
// ═══════════════════════════════════════════════════════════════════════════════

export function ProjetsSpace() {
  const config = SPACES_CONFIG.projets;
  
  // PBR Materials
  const concrete = usePBRMaterial('concrete');
  const rustyIron = usePBRMaterial('iron_rusty');
  const pineWood = usePBRMaterial('pine');
  
  return (
    <SpaceBase spaceId="projets">
      <group>
        {/* Foundation - Concrete */}
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[3, 1, 3]} />
          {concrete ? (
            <primitive object={concrete} attach="material" />
          ) : (
            <meshStandardMaterial color="#888888" roughness={0.8} />
          )}
        </mesh>
        
        {/* Steel beams - Rusty iron */}
        {[-1, 1].map((x) => (
          <mesh key={`beam-${x}`} position={[x, 2, 0]} castShadow>
            <boxGeometry args={[0.2, 3, 0.2]} />
            {rustyIron ? (
              <primitive object={rustyIron} attach="material" />
            ) : (
              <meshStandardMaterial color="#8B4513" roughness={0.7} metalness={0.5} />
            )}
          </mesh>
        ))}
        
        {/* Scaffolding - Pine wood */}
        <mesh position={[0, 2.5, 1.5]} castShadow>
          <boxGeometry args={[2.5, 0.2, 0.2]} />
          {pineWood ? (
            <primitive object={pineWood} attach="material" />
          ) : (
            <meshStandardMaterial color="#DEB887" roughness={0.6} />
          )}
        </mesh>
        
        {/* Construction crane - Industrial look */}
        <group position={[1.5, 3, -1.5]}>
          <mesh position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
            <meshStandardMaterial color="#FF6600" roughness={0.5} metalness={0.8} />
          </mesh>
          <mesh position={[0.5, 1, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
            <boxGeometry args={[1.5, 0.1, 0.1]} />
            <meshStandardMaterial color="#FF6600" roughness={0.5} metalness={0.8} />
          </mesh>
        </group>
      </group>
    </SpaceBase>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GOUVERNEMENT - Institutional Building (STONE + METAL PRESTIGE)
// ═══════════════════════════════════════════════════════════════════════════════

export function GouvernementSpace() {
  const config = SPACES_CONFIG.gouvernement;
  
  // PBR Materials
  const marble = usePBRMaterial('marble');
  const granite = usePBRMaterial('granite');
  const gold = usePBRMaterial('gold');
  
  return (
    <SpaceBase spaceId="gouvernement">
      <group>
        {/* Main building - Marble */}
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[3, 3, 2.5]} />
          {marble ? (
            <primitive object={marble} attach="material" />
          ) : (
            <meshStandardMaterial color="#F5F5DC" roughness={0.2} />
          )}
        </mesh>
        
        {/* Columns (4) - Granite */}
        {[-1, -0.33, 0.33, 1].map((x) => (
          <mesh key={`column-${x}`} position={[x, 1.5, 1.3]} castShadow>
            <cylinderGeometry args={[0.15, 0.15, 3, 16]} />
            {granite ? (
              <primitive object={granite} attach="material" />
            ) : (
              <meshStandardMaterial color="#696969" roughness={0.4} />
            )}
          </mesh>
        ))}
        
        {/* Dome - Gold accent */}
        <mesh position={[0, 3.5, 0]} castShadow>
          <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          {gold ? (
            <primitive object={gold} attach="material" />
          ) : (
            <meshStandardMaterial color="#FFD700" roughness={0.2} metalness={1.0} />
          )}
        </mesh>
        
        {/* Flag pole */}
        <mesh position={[0, 5, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
          <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.3} />
        </mesh>
        
        {/* Flag */}
        <mesh position={[0.3, 5.8, 0]}>
          <planeGeometry args={[0.6, 0.4]} />
          <meshStandardMaterial color={config.color} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </SpaceBase>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// IMMOBILIER - Real Estate (REALISTIC BUILDING MATERIALS)
// ═══════════════════════════════════════════════════════════════════════════════

export function ImmobilierSpace() {
  const config = SPACES_CONFIG.immobilier;
  
  // PBR Materials
  const limestone = usePBRMaterial('limestone');
  const concrete = usePBRMaterial('concrete');
  const frostedGlass = usePBRMaterial('frosted_glass');
  
  return (
    <SpaceBase spaceId="immobilier">
      <group>
        {/* Building structure - Concrete */}
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.5, 3, 2]} />
          {concrete ? (
            <primitive object={concrete} attach="material" />
          ) : (
            <meshStandardMaterial color="#A0A0A0" roughness={0.7} />
          )}
        </mesh>
        
        {/* Balconies - Limestone */}
        {[0.5, 1.5, 2.5].map((y, i) => (
          <mesh key={`balcony-${i}`} position={[0, y, 1.1]} castShadow>
            <boxGeometry args={[2.3, 0.1, 0.4]} />
            {limestone ? (
              <primitive object={limestone} attach="material" />
            ) : (
              <meshStandardMaterial color="#E0E0D1" roughness={0.5} />
            )}
          </mesh>
        ))}
        
        {/* Windows - Frosted glass */}
        {[0.8, 1.8].map((y, floorIdx) => (
          [-0.6, 0.6].map((x, winIdx) => (
            <mesh 
              key={`window-${floorIdx}-${winIdx}`} 
              position={[x, y, 1.01]}
            >
              <boxGeometry args={[0.5, 0.6, 0.05]} />
              {frostedGlass ? (
                <primitive object={frostedGlass} attach="material" />
              ) : (
                <meshStandardMaterial 
                  color="#E8F4F8" 
                  transparent 
                  opacity={0.5} 
                  roughness={0.3}
                />
              )}
            </mesh>
          ))
        ))}
        
        {/* Roof - Modern flat */}
        <mesh position={[0, 3.2, 0]} castShadow>
          <boxGeometry args={[2.7, 0.2, 2.2]} />
          <meshStandardMaterial color="#505050" roughness={0.6} />
        </mesh>
      </group>
    </SpaceBase>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ASSOCIATIONS - Community Center (WARM WOOD)
// ═══════════════════════════════════════════════════════════════════════════════

export function AssociationsSpace() {
  const config = SPACES_CONFIG.associations;
  
  // PBR Materials
  const walnutWood = usePBRMaterial('walnut');
  const bamboo = usePBRMaterial('bamboo');
  
  return (
    <SpaceBase spaceId="associations">
      <group>
        {/* Main hall - Walnut wood */}
        <mesh position={[0, 1, 0]} castShadow receiveShadow>
          <boxGeometry args={[3, 2, 2.5]} />
          {walnutWood ? (
            <primitive object={walnutWood} attach="material" />
          ) : (
            <meshStandardMaterial color="#8B7355" roughness={0.6} />
          )}
        </mesh>
        
        {/* Roof - Bamboo sustainable */}
        <mesh position={[0, 2.5, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[2.2, 1, 4]} />
          {bamboo ? (
            <primitive object={bamboo} attach="material" />
          ) : (
            <meshStandardMaterial color="#D4AF37" roughness={0.5} />
          )}
        </mesh>
        
        {/* Entrance archway */}
        <mesh position={[0, 0.8, 1.3]}>
          <torusGeometry args={[0.5, 0.1, 16, 32, Math.PI]} />
          <meshStandardMaterial color="#654321" roughness={0.7} />
        </mesh>
        
        {/* Community board */}
        <mesh position={[1.3, 1, 0]}>
          <boxGeometry args={[0.05, 0.8, 0.6]} />
          <meshStandardMaterial color="#8B4513" roughness={0.6} />
        </mesh>
      </group>
    </SpaceBase>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CREATIVE - Studio (VIBRANT + EXPERIMENTAL)
// ═══════════════════════════════════════════════════════════════════════════════

export function CreativeSpace() {
  const config = SPACES_CONFIG.creative;
  
  // PBR Materials
  const coloredGlass = usePBRMaterial('colored_glass');
  const polishedSteel = usePBRMaterial('polished_steel');
  
  // Animated rotation
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });
  
  return (
    <SpaceBase spaceId="creative">
      <group ref={groupRef}>
        {/* Central sphere - Polished steel */}
        <mesh position={[0, 1.5, 0]} castShadow>
          <sphereGeometry args={[1, 32, 32]} />
          {polishedSteel ? (
            <primitive object={polishedSteel} attach="material" />
          ) : (
            <meshStandardMaterial color="#DDDDDD" metalness={1.0} roughness={0.1} />
          )}
        </mesh>
        
        {/* Orbiting cubes - Colored glass */}
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = (i * Math.PI * 2) / 5;
          const radius = 2;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          
          return (
            <mesh 
              key={`cube-${i}`} 
              position={[x, 1.5, z]} 
              rotation={[i * 0.5, i * 0.3, i * 0.2]}
              castShadow
            >
              <boxGeometry args={[0.4, 0.4, 0.4]} />
              {coloredGlass ? (
                <primitive object={coloredGlass} attach="material" />
              ) : (
                <meshStandardMaterial 
                  color={config.color} 
                  transparent 
                  opacity={0.6} 
                  roughness={0.1}
                />
              )}
            </mesh>
          );
        })}
        
        {/* Light rings */}
        {[0.8, 1.5, 2.2].map((y, i) => (
          <mesh key={`ring-${i}`} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.2 + i * 0.3, 0.05, 16, 32]} />
            <meshStandardMaterial 
              color="#FF00FF" 
              emissive="#FF00FF" 
              emissiveIntensity={0.5}
              transparent
              opacity={0.7}
            />
          </mesh>
        ))}
      </group>
    </SpaceBase>
  );
}
