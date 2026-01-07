/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V41 UI — USAGE EXAMPLE
 * Complete integration example
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { initV41Complete } from './world3d/V41Complete';
import { V41UIController } from './world3d/V41UI/V41UIController';
import type { V41IntegrationManager } from './world3d/V41Complete';

// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE APP COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const V41Example: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [v41Manager, setV41Manager] = useState<V41IntegrationManager | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let animationId: number;

    const init = async () => {
      try {
        // Create Three.js scene
        scene = new THREE.Scene();
        
        // Create camera
        camera = new THREE.PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
        );
        camera.position.z = 5;

        // Create renderer
        renderer = new THREE.WebGLRenderer({ 
          antialias: true,
          alpha: true,
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        containerRef.current?.appendChild(renderer.domElement);

        // Initialize V41 Complete System
        console.log('🚀 Initializing V41 Complete...');
        const manager = await initV41Complete(
          scene,
          renderer,
          camera,
          {
            defaultTheme: 'atlean',
            enableShaders: true,
            enableHDR: true,
            enablePostProcessing: true,
            enableAtmospheric: true,
            enableAdaptiveQuality: true,
          }
        );

        setV41Manager(manager);
        setIsLoading(false);

        console.log('✅ V41 Complete initialized!');

        // Add some demo content
        addDemoContent(scene);

        // Animation loop
        const animate = () => {
          animationId = requestAnimationFrame(animate);

          // Update V41 (particles + performance)
          manager.update();

          // Render with post-processing
          manager.render();
        };

        animate();

        // Handle window resize
        const handleResize = () => {
          const width = window.innerWidth;
          const height = window.innerHeight;

          camera.aspect = width / height;
          camera.updateProjectionMatrix();

          renderer.setSize(width, height);
          manager.handleResize(width, height);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
          window.removeEventListener('resize', handleResize);
          cancelAnimationFrame(animationId);
          manager.dispose();
          renderer.dispose();
          containerRef.current?.removeChild(renderer.domElement);
        };

      } catch (err) {
        console.error('Failed to initialize V41:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsLoading(false);
      }
    };

    init();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1E1F22 0%, #2C2D31 100%)',
          color: '#FFFFFF',
          fontFamily: "'Inter', sans-serif",
          fontSize: '18px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚀</div>
          <div>Loading CHE·NU V41...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1E1F22 0%, #2C2D31 100%)',
          color: '#FFFFFF',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '400px', padding: '20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
          <div style={{ fontSize: '18px', marginBottom: '8px' }}>Failed to initialize V41</div>
          <div style={{ fontSize: '14px', opacity: 0.6 }}>{error}</div>
        </div>
      </div>
    );
  }

  // Main view
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* Three.js container */}
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* V41 UI Controller */}
      {v41Manager && (
        <V41UIController
          v41Manager={v41Manager}
          showThemeSwitcher={true}
          showSettingsPanel={true}
          showQualityPresets={true}
          themeSwitcherPosition="top-right"
          themeSwitcherCompact={false}
          settingsPanelPosition="right"
          qualityPresetsPosition="bottom"
        />
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// DEMO CONTENT
// ═══════════════════════════════════════════════════════════════════════════════

function addDemoContent(scene: THREE.Scene): void {
  // Add some demo objects to showcase materials and effects

  // Central cube with PBR material
  const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeMaterial = new THREE.MeshStandardMaterial({
    color: 0xD8B26A, // Sacred Gold
    metalness: 0.3,
    roughness: 0.4,
  });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.set(0, 0, 0);
  scene.add(cube);

  // Rotating torus
  const torusGeometry = new THREE.TorusGeometry(3, 0.5, 16, 100);
  const torusMaterial = new THREE.MeshStandardMaterial({
    color: 0x3EB4A2, // Cenote Turquoise
    metalness: 0.8,
    roughness: 0.2,
  });
  const torus = new THREE.Mesh(torusGeometry, torusMaterial);
  torus.position.set(0, 0, 0);
  scene.add(torus);

  // Ambient light (will be enhanced by V41 lighting)
  const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
  scene.add(ambientLight);

  // Directional light (will be enhanced by V41 lighting)
  const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  // Animate objects
  const animate = () => {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    torus.rotation.x += 0.005;
    torus.rotation.y += 0.01;

    requestAnimationFrame(animate);
  };

  animate();
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default V41Example;
