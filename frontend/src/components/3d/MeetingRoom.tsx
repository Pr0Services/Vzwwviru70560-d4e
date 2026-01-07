/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                       CHE·NU V25 - MEETING ROOM 3D                           ║
 * ║                                                                              ║
 * ║  Salles de Réunions Interdimensionnelles                                    ║
 * ║                                                                              ║
 * ║  4 Salles disponibles:                                                       ║
 * ║  🌌 Orbit Meeting Room (Cosmique)                                           ║
 * ║  🏛️ Temple du Conseil (Ancien)                                              ║
 * ║  🔮 Nexus Room (Futuriste)                                                  ║
 * ║  ✨ Chambre Hyper-Fréquentielle (Métaphysique)                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useRef, useEffect, useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { Universe, UNIVERSE_THEMES } from '../../types/chenu.types';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  isAI?: boolean;
  position?: number; // Seat position (0-7)
}

interface MeetingRoomProps {
  participants?: Participant[];
  onSeatClick?: (position: number) => void;
  showControls?: boolean;
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// THREE.JS SCENE (Vanilla JS approach for React)
// ═══════════════════════════════════════════════════════════════════════════════

class MeetingRoomScene {
  private container: HTMLElement;
  private scene: unknown;
  private camera: unknown;
  private renderer: unknown;
  private controls: unknown;
  private platform: unknown;
  private table: unknown;
  private seats: unknown[] = [];
  private planets: unknown[] = [];
  private animationId: number | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.init();
  }

  private async init() {
    // Dynamic import Three.js
    const THREE = await import('three');
    const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 5, 12);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.minDistance = 5;
    this.controls.maxDistance = 20;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7);
    this.scene.add(dirLight);

    // Platform
    const platformGeom = new THREE.CylinderGeometry(5, 5, 0.4, 64);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0x222244,
      metalness: 0.6,
      roughness: 0.3,
    });
    this.platform = new THREE.Mesh(platformGeom, platformMat);
    this.platform.position.y = 0;
    this.scene.add(this.platform);

    // Table
    const tableGeom = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 32);
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x5555ff,
      emissive: 0x222244,
      metalness: 0.8,
      roughness: 0.2,
    });
    this.table = new THREE.Mesh(tableGeom, tableMat);
    this.table.position.y = 0.5;
    this.scene.add(this.table);

    // Seats
    const seatGeom = new THREE.CylinderGeometry(0.25, 0.25, 0.4, 16);
    const seatMat = new THREE.MeshStandardMaterial({ color: 0x8888aa });
    const seatCount = 8;

    for (let i = 0; i < seatCount; i++) {
      const angle = (i / seatCount) * Math.PI * 2;
      const radius = 3.2;
      const seat = new THREE.Mesh(seatGeom, seatMat.clone());
      seat.position.set(Math.cos(angle) * radius, 0.25, Math.sin(angle) * radius);
      seat.userData = { position: i };
      this.seats.push(seat);
      this.scene.add(seat);
    }

    // Planets/Orbs
    const planetGeom = new THREE.SphereGeometry(0.7, 32, 32);
    const planetMat = new THREE.MeshStandardMaterial({ color: 0xffaa00 });

    for (let i = 0; i < 5; i++) {
      const p = new THREE.Mesh(planetGeom, planetMat.clone());
      const r = 15 + i * 3;
      const angle = (i / 5) * Math.PI * 2;
      p.position.set(Math.cos(angle) * r, 5, Math.sin(angle) * r);
      this.planets.push(p);
      this.scene.add(p);
    }

    // Background
    this.scene.background = new THREE.Color(0x000010);

    // Start animation
    this.animate();

    // Handle resize
    window.addEventListener('resize', this.handleResize);
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);

    // Animate planets
    this.planets.forEach((p, i) => {
      const speed = 0.001 + i * 0.0003;
      const r = Math.sqrt(p.position.x ** 2 + p.position.z ** 2);
      const angle = performance.now() * speed * 0.001;
      p.position.x = Math.cos(angle + i) * r;
      p.position.z = Math.sin(angle + i) * r;
    });

    this.controls?.update();
    this.renderer?.render(this.scene, this.camera);
  };

  private handleResize = () => {
    if (!this.container) return;
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  };

  public applyTheme(universe: Universe) {
    const themes: Record<Universe, any> = {
      cosmic: {
        background: 0x000010,
        platformColor: 0x222244,
        tableColor: 0x5555ff,
        seatColor: 0x8888aa,
        planetColor: 0xffaa00,
      },
      ancient: {
        background: 0x1a1208,
        platformColor: 0x4b3621,
        tableColor: 0xc2a476,
        seatColor: 0x8b5a2b,
        planetColor: 0xffd27f,
      },
      futuristic: {
        background: 0x020812,
        platformColor: 0x111827,
        tableColor: 0x00ffff,
        seatColor: 0x94a3b8,
        planetColor: 0x38bdf8,
      },
      metaphysical: {
        background: 0x050008,
        platformColor: 0x2d0444,
        tableColor: 0xff00ff,
        seatColor: 0x9f1239,
        planetColor: 0x22c55e,
      },
    };

    const t = themes[universe] || themes.cosmic;

    if (this.scene?.background) {
      this.scene.background.setHex(t.background);
    }
    if (this.platform?.material) {
      this.platform.material.color.setHex(t.platformColor);
    }
    if (this.table?.material) {
      this.table.material.color.setHex(t.tableColor);
    }
    this.seats.forEach((s) => {
      if (s.material) s.material.color.setHex(t.seatColor);
    });
    this.planets.forEach((p) => {
      if (p.material) p.material.color.setHex(t.planetColor);
    });
  }

  public highlightSeat(position: number, color: number = 0x00ff00) {
    const seat = this.seats[position];
    if (seat?.material) {
      seat.material.emissive.setHex(color);
    }
  }

  public destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', this.handleResize);
    if (this.renderer?.domElement) {
      this.container.removeChild(this.renderer.domElement);
    }
    this.renderer?.dispose();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// REACT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const MeetingRoom: React.FC<MeetingRoomProps> = ({
  participants = [],
  onSeatClick,
  showControls = true,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<MeetingRoomScene | null>(null);
  const { universe, theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  // Initialize scene
  useEffect(() => {
    if (!containerRef.current) return;

    const initScene = async () => {
      setIsLoading(true);
      try {
        sceneRef.current = new MeetingRoomScene(containerRef.current!);
        // Wait for scene to initialize
        await new Promise((resolve) => setTimeout(resolve, 100));
        sceneRef.current.applyTheme(universe);
        setIsLoading(false);
      } catch (error) {
        logger.error('Failed to initialize 3D scene:', error);
        setIsLoading(false);
      }
    };

    initScene();

    return () => {
      sceneRef.current?.destroy();
    };
  }, []);

  // Update theme when universe changes
  useEffect(() => {
    sceneRef.current?.applyTheme(universe);
  }, [universe]);

  // Get meeting room name based on universe
  const getMeetingRoomName = () => {
    const names: Record<Universe, string> = {
      cosmic: 'Orbit Meeting Room',
      ancient: 'Temple du Conseil',
      futuristic: 'Nexus Room',
      metaphysical: 'Chambre Hyper-Fréquentielle',
    };
    return names[universe];
  };

  return (
    <div className={`meeting-room ${className}`} style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>
          <span style={{ fontSize: '24px' }}>{theme.emoji}</span>
          <span>{getMeetingRoomName()}</span>
        </div>
        <div style={styles.participants}>
          {participants.length} participant{participants.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* 3D Scene */}
      <div ref={containerRef} style={styles.scene}>
        {isLoading && (
          <div style={styles.loading}>
            <div style={styles.spinner} />
            <span>Chargement de la salle...</span>
          </div>
        )}
      </div>

      {/* Participants List */}
      {participants.length > 0 && (
        <div style={styles.participantsList}>
          {participants.map((p) => (
            <div key={p.id} style={styles.participant}>
              <div style={styles.participantAvatar}>
                {p.avatar || (p.isAI ? '🤖' : '👤')}
              </div>
              <span style={styles.participantName}>{p.name}</span>
              {p.isAI && <span style={styles.aiBadge}>IA</span>}
            </div>
          ))}
        </div>
      )}

      {/* Controls */}
      {showControls && (
        <div style={styles.controls}>
          <button style={styles.controlButton}>🎤 Micro</button>
          <button style={styles.controlButton}>📹 Caméra</button>
          <button style={styles.controlButton}>🖥️ Partager</button>
          <button style={{ ...styles.controlButton, ...styles.endButton }}>
            📞 Quitter
          </button>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: 'var(--chenu-bg)',
    borderRadius: '16px',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    background: 'var(--chenu-bg-secondary)',
    borderBottom: '1px solid var(--chenu-border)',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontWeight: 600,
    fontSize: '18px',
    color: 'var(--chenu-text)',
  },
  participants: {
    fontSize: '14px',
    color: 'var(--chenu-text-secondary)',
  },
  scene: {
    flex: 1,
    position: 'relative',
    minHeight: '400px',
  },
  loading: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    background: 'var(--chenu-bg)',
    color: 'var(--chenu-text-secondary)',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid var(--chenu-border)',
    borderTopColor: 'var(--chenu-accent)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  participantsList: {
    display: 'flex',
    gap: '12px',
    padding: '12px 20px',
    background: 'var(--chenu-bg-secondary)',
    borderTop: '1px solid var(--chenu-border)',
    overflowX: 'auto',
  },
  participant: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    background: 'var(--chenu-surface)',
    borderRadius: '8px',
    whiteSpace: 'nowrap',
  },
  participantAvatar: {
    fontSize: '20px',
  },
  participantName: {
    fontSize: '14px',
    color: 'var(--chenu-text)',
  },
  aiBadge: {
    fontSize: '10px',
    padding: '2px 6px',
    background: 'var(--chenu-accent)',
    color: '#000',
    borderRadius: '4px',
    fontWeight: 600,
  },
  controls: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    padding: '16px 20px',
    background: 'var(--chenu-bg-tertiary)',
  },
  controlButton: {
    padding: '12px 20px',
    background: 'var(--chenu-surface)',
    border: '1px solid var(--chenu-border)',
    borderRadius: '8px',
    color: 'var(--chenu-text)',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  endButton: {
    background: '#ef4444',
    borderColor: '#ef4444',
    color: '#fff',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default MeetingRoom;
