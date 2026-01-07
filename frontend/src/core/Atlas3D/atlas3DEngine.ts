/**
 * CHE·NU™ — ATLAS 3D
 * 
 * ════════════════════════════════════════════════════════════════════════════
 * Visualisation 3D immersive des sphères CHE·NU
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * FEATURES:
 * - 3D Sphere Visualization (8 spheres orbiting)
 * - Immersive Navigation
 * - XR Mode (VR/AR)
 * - Smooth Transitions
 * - Interactive Elements
 * - Real-time Activity Indicators
 * - Spatial Audio
 */

import * as THREE from 'three';

// ═══════════════════════════════════════════════════════════════════════════
// CHE·NU BRAND COLORS
// ═══════════════════════════════════════════════════════════════════════════

export const CHENU_COLORS = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6'
};

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface Sphere3D {
  id: string;
  name: string;
  nameFr: string;
  icon: string;
  color: string;
  
  // 3D Properties
  position: THREE.Vector3;
  radius: number;
  orbitRadius: number;
  orbitSpeed: number;
  rotationSpeed: number;
  
  // State
  active: boolean;
  hovered: boolean;
  notificationCount: number;
  
  // Activity indicators
  activityLevel: 'dormant' | 'low' | 'medium' | 'high';
  lastActivity: Date;
  
  // Connections to other spheres
  connections: SphereConnection[];
}

export interface SphereConnection {
  targetSphereId: string;
  strength: number;          // 0-1
  type: 'data' | 'workflow' | 'reference';
  animated: boolean;
}

export interface Atlas3DConfig {
  // Scene
  backgroundColor: string;
  ambientLightColor: string;
  ambientLightIntensity: number;
  
  // Camera
  cameraDistance: number;
  cameraFov: number;
  cameraMinDistance: number;
  cameraMaxDistance: number;
  
  // Animation
  orbitAnimationEnabled: boolean;
  orbitAnimationSpeed: number;
  hoverScaleMultiplier: number;
  transitionDuration: number;
  
  // Effects
  glowEnabled: boolean;
  particlesEnabled: boolean;
  connectionsEnabled: boolean;
  
  // XR
  xrEnabled: boolean;
  xrRoomScale: number;
}

export interface AtlasViewState {
  mode: 'overview' | 'focused' | 'xr';
  activeSphereId: string | null;
  cameraPosition: THREE.Vector3;
  cameraTarget: THREE.Vector3;
  zoom: number;
}

export interface AtlasInteraction {
  type: 'click' | 'hover' | 'drag' | 'pinch' | 'gesture';
  sphereId?: string;
  position: THREE.Vector3;
  timestamp: Date;
}

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT CONFIG
// ═══════════════════════════════════════════════════════════════════════════

export const DEFAULT_ATLAS_CONFIG: Atlas3DConfig = {
  backgroundColor: CHENU_COLORS.uiSlate,
  ambientLightColor: '#FFFFFF',
  ambientLightIntensity: 0.5,
  
  cameraDistance: 15,
  cameraFov: 60,
  cameraMinDistance: 5,
  cameraMaxDistance: 50,
  
  orbitAnimationEnabled: true,
  orbitAnimationSpeed: 0.1,
  hoverScaleMultiplier: 1.2,
  transitionDuration: 1000,
  
  glowEnabled: true,
  particlesEnabled: true,
  connectionsEnabled: true,
  
  xrEnabled: true,
  xrRoomScale: 1.5
};

// ═══════════════════════════════════════════════════════════════════════════
// THE 8 CHE·NU SPHERES
// ═══════════════════════════════════════════════════════════════════════════

export const CHENU_SPHERES: Omit<Sphere3D, 'position'>[] = [
  {
    id: 'personal',
    name: 'Personal',
    nameFr: 'Personnel',
    icon: '🏠',
    color: CHENU_COLORS.sacredGold,
    radius: 1.2,
    orbitRadius: 8,
    orbitSpeed: 0.3,
    rotationSpeed: 0.5,
    active: false,
    hovered: false,
    notificationCount: 0,
    activityLevel: 'medium',
    lastActivity: new Date(),
    connections: [
      { targetSphereId: 'business', strength: 0.4, type: 'workflow', animated: false },
      { targetSphereId: 'entertainment', strength: 0.3, type: 'reference', animated: false }
    ]
  },
  {
    id: 'business',
    name: 'Business',
    nameFr: 'Affaires',
    icon: '💼',
    color: CHENU_COLORS.jungleEmerald,
    radius: 1.3,
    orbitRadius: 8,
    orbitSpeed: 0.25,
    rotationSpeed: 0.4,
    active: false,
    hovered: false,
    notificationCount: 0,
    activityLevel: 'high',
    lastActivity: new Date(),
    connections: [
      { targetSphereId: 'personal', strength: 0.4, type: 'workflow', animated: false },
      { targetSphereId: 'government', strength: 0.5, type: 'data', animated: true },
      { targetSphereId: 'my_team', strength: 0.8, type: 'workflow', animated: true }
    ]
  },
  {
    id: 'government',
    name: 'Government & Institutions',
    nameFr: 'Gouvernement & Institutions',
    icon: '🏛️',
    color: CHENU_COLORS.ancientStone,
    radius: 1.1,
    orbitRadius: 8,
    orbitSpeed: 0.2,
    rotationSpeed: 0.3,
    active: false,
    hovered: false,
    notificationCount: 0,
    activityLevel: 'low',
    lastActivity: new Date(),
    connections: [
      { targetSphereId: 'business', strength: 0.5, type: 'data', animated: true }
    ]
  },
  {
    id: 'design_studio',
    name: 'Studio de création',
    nameFr: 'Studio de création',
    icon: '🎨',
    color: CHENU_COLORS.cenoteTurquoise,
    radius: 1.4,
    orbitRadius: 8,
    orbitSpeed: 0.35,
    rotationSpeed: 0.6,
    active: false,
    hovered: false,
    notificationCount: 0,
    activityLevel: 'medium',
    lastActivity: new Date(),
    connections: [
      { targetSphereId: 'entertainment', strength: 0.6, type: 'workflow', animated: true },
      { targetSphereId: 'social', strength: 0.4, type: 'reference', animated: false }
    ]
  },
  {
    id: 'community',
    name: 'Community',
    nameFr: 'Communauté',
    icon: '👥',
    color: CHENU_COLORS.earthEmber,
    radius: 1.2,
    orbitRadius: 8,
    orbitSpeed: 0.28,
    rotationSpeed: 0.45,
    active: false,
    hovered: false,
    notificationCount: 0,
    activityLevel: 'medium',
    lastActivity: new Date(),
    connections: [
      { targetSphereId: 'social', strength: 0.7, type: 'data', animated: true }
    ]
  },
  {
    id: 'social',
    name: 'Social & Media',
    nameFr: 'Social & Média',
    icon: '📱',
    color: CHENU_COLORS.shadowMoss,
    radius: 1.15,
    orbitRadius: 8,
    orbitSpeed: 0.32,
    rotationSpeed: 0.55,
    active: false,
    hovered: false,
    notificationCount: 0,
    activityLevel: 'high',
    lastActivity: new Date(),
    connections: [
      { targetSphereId: 'community', strength: 0.7, type: 'data', animated: true },
      { targetSphereId: 'design_studio', strength: 0.4, type: 'reference', animated: false },
      { targetSphereId: 'entertainment', strength: 0.5, type: 'workflow', animated: false }
    ]
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    nameFr: 'Divertissement',
    icon: '🎬',
    color: '#9C27B0',
    radius: 1.25,
    orbitRadius: 8,
    orbitSpeed: 0.33,
    rotationSpeed: 0.5,
    active: false,
    hovered: false,
    notificationCount: 0,
    activityLevel: 'low',
    lastActivity: new Date(),
    connections: [
      { targetSphereId: 'personal', strength: 0.3, type: 'reference', animated: false },
      { targetSphereId: 'design_studio', strength: 0.6, type: 'workflow', animated: true }
    ]
  },
  {
    id: 'my_team',
    name: 'My Team',
    nameFr: 'Mon Équipe',
    icon: '🤝',
    color: CHENU_COLORS.sacredGold,
    radius: 1.35,
    orbitRadius: 8,
    orbitSpeed: 0.22,
    rotationSpeed: 0.35,
    active: false,
    hovered: false,
    notificationCount: 0,
    activityLevel: 'high',
    lastActivity: new Date(),
    connections: [
      { targetSphereId: 'business', strength: 0.8, type: 'workflow', animated: true }
    ]
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// ATLAS 3D ENGINE
// ═══════════════════════════════════════════════════════════════════════════

export class Atlas3DEngine {
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private spheres: Map<string, Sphere3D> = new Map();
  private sphereMeshes: Map<string, THREE.Mesh> = new Map();
  private connectionLines: Map<string, THREE.Line> = new Map();
  private config: Atlas3DConfig;
  private viewState: AtlasViewState;
  private animationFrameId: number | null = null;
  private clock: THREE.Clock;
  
  // Event callbacks
  private onSphereClick?: (sphereId: string) => void;
  private onSphereHover?: (sphereId: string | null) => void;
  private onViewChange?: (state: AtlasViewState) => void;
  
  constructor(config: Partial<Atlas3DConfig> = {}) {
    this.config = { ...DEFAULT_ATLAS_CONFIG, ...config };
    this.clock = new THREE.Clock();
    
    this.viewState = {
      mode: 'overview',
      activeSphereId: null,
      cameraPosition: new THREE.Vector3(0, 5, this.config.cameraDistance),
      cameraTarget: new THREE.Vector3(0, 0, 0),
      zoom: 1
    };
    
    // Initialize spheres
    this.initializeSpheres();
    
    logger.debug('🌐 Atlas 3D Engine initialized');
    logger.debug(`   Spheres: ${this.spheres.size}`);
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // INITIALIZATION
  // ─────────────────────────────────────────────────────────────────────────
  
  /**
   * Initialiser la scène 3D
   */
  initialize(container: HTMLElement): void {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.config.backgroundColor);
    
    // Camera
    this.camera = new THREE.PerspectiveCamera(
      this.config.cameraFov,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.copy(this.viewState.cameraPosition);
    this.camera.lookAt(this.viewState.cameraTarget);
    
    // Renderer
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    container.appendChild(this.renderer.domElement);
    
    // Lights
    this.setupLights();
    
    // Create sphere meshes
    this.createSphereMeshes();
    
    // Create connections
    if (this.config.connectionsEnabled) {
      this.createConnections();
    }
    
    // Add particles
    if (this.config.particlesEnabled) {
      this.createParticles();
    }
    
    // Add central Nova indicator
    this.createNovaCore();
    
    // Start animation loop
    this.animate();
    
    // Handle resize
    window.addEventListener('resize', () => this.handleResize(container));
    
    // Handle interactions
    this.setupInteractions(container);
  }
  
  private initializeSpheres(): void {
    const sphereCount = CHENU_SPHERES.length;
    
    CHENU_SPHERES.forEach((sphereData, index) => {
      // Calculate initial position in a circle
      const angle = (index / sphereCount) * Math.PI * 2;
      const x = Math.cos(angle) * sphereData.orbitRadius;
      const z = Math.sin(angle) * sphereData.orbitRadius;
      
      const sphere: Sphere3D = {
        ...sphereData,
        position: new THREE.Vector3(x, 0, z)
      };
      
      this.spheres.set(sphere.id, sphere);
    });
  }
  
  private setupLights(): void {
    if (!this.scene) return;
    
    // Ambient light
    const ambient = new THREE.AmbientLight(
      this.config.ambientLightColor,
      this.config.ambientLightIntensity
    );
    this.scene.add(ambient);
    
    // Point light at center (Nova)
    const pointLight = new THREE.PointLight(CHENU_COLORS.sacredGold, 1, 20);
    pointLight.position.set(0, 0, 0);
    pointLight.castShadow = true;
    this.scene.add(pointLight);
    
    // Directional light
    const directional = new THREE.DirectionalLight('#FFFFFF', 0.5);
    directional.position.set(10, 10, 10);
    directional.castShadow = true;
    this.scene.add(directional);
  }
  
  private createSphereMeshes(): void {
    if (!this.scene) return;
    
    for (const sphere of this.spheres.values()) {
      // Create sphere geometry
      const geometry = new THREE.SphereGeometry(sphere.radius, 64, 64);
      
      // Create material with glow effect
      const material = new THREE.MeshStandardMaterial({
        color: sphere.color,
        metalness: 0.3,
        roughness: 0.4,
        emissive: sphere.color,
        emissiveIntensity: 0.2
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(sphere.position);
      mesh.userData = { sphereId: sphere.id };
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      
      this.scene.add(mesh);
      this.sphereMeshes.set(sphere.id, mesh);
      
      // Add glow effect if enabled
      if (this.config.glowEnabled) {
        this.addGlowEffect(mesh, sphere.color);
      }
      
      // Add icon sprite
      this.addSphereLabel(mesh, sphere);
    }
  }
  
  private addGlowEffect(mesh: THREE.Mesh, color: string): void {
    if (!this.scene) return;
    
    // Create glow sprite
    const glowGeometry = new THREE.SphereGeometry(
      (mesh.geometry as THREE.SphereGeometry).parameters.radius * 1.3,
      32,
      32
    );
    
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide
    });
    
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    mesh.add(glow);
  }
  
  private addSphereLabel(mesh: THREE.Mesh, sphere: Sphere3D): void {
    // In a real implementation, use a sprite or HTML overlay
    // For now, store the label info in userData
    mesh.userData.label = {
      icon: sphere.icon,
      name: sphere.name,
      nameFr: sphere.nameFr
    };
  }
  
  private createConnections(): void {
    if (!this.scene) return;
    
    for (const sphere of this.spheres.values()) {
      for (const connection of sphere.connections) {
        const targetSphere = this.spheres.get(connection.targetSphereId);
        if (!targetSphere) continue;
        
        const connectionId = `${sphere.id}-${connection.targetSphereId}`;
        
        // Skip if already created
        if (this.connectionLines.has(connectionId) || 
            this.connectionLines.has(`${connection.targetSphereId}-${sphere.id}`)) {
          continue;
        }
        
        // Create line
        const material = new THREE.LineBasicMaterial({
          color: CHENU_COLORS.sacredGold,
          transparent: true,
          opacity: connection.strength * 0.5
        });
        
        const points = [
          sphere.position.clone(),
          targetSphere.position.clone()
        ];
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);
        line.userData = { 
          sourceId: sphere.id, 
          targetId: connection.targetSphereId,
          animated: connection.animated
        };
        
        this.scene.add(line);
        this.connectionLines.set(connectionId, line);
      }
    }
  }
  
  private createParticles(): void {
    if (!this.scene) return;
    
    const particleCount = 500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const color = new THREE.Color(CHENU_COLORS.sacredGold);
    
    for (let i = 0; i < particleCount; i++) {
      // Random position in a sphere
      const radius = 12 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.6
    });
    
    const particles = new THREE.Points(geometry, material);
    particles.userData = { isParticles: true };
    this.scene.add(particles);
  }
  
  private createNovaCore(): void {
    if (!this.scene) return;
    
    // Central Nova sphere
    const geometry = new THREE.SphereGeometry(0.8, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      color: CHENU_COLORS.sacredGold,
      metalness: 0.8,
      roughness: 0.2,
      emissive: CHENU_COLORS.sacredGold,
      emissiveIntensity: 0.5
    });
    
    const nova = new THREE.Mesh(geometry, material);
    nova.userData = { isNova: true };
    this.scene.add(nova);
    
    // Add pulsing glow
    const glowGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: CHENU_COLORS.sacredGold,
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide
    });
    
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.userData = { isPulsingGlow: true };
    nova.add(glow);
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // ANIMATION
  // ─────────────────────────────────────────────────────────────────────────
  
  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);
    
    const delta = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();
    
    // Update sphere positions (orbit animation)
    if (this.config.orbitAnimationEnabled) {
      this.updateSphereOrbits(elapsed);
    }
    
    // Update connections
    this.updateConnections();
    
    // Update particles
    this.updateParticles(elapsed);
    
    // Update Nova pulse
    this.updateNovaPulse(elapsed);
    
    // Render
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  };
  
  private updateSphereOrbits(elapsed: number): void {
    const baseSpeed = this.config.orbitAnimationSpeed;
    
    for (const [id, sphere] of this.spheres) {
      const mesh = this.sphereMeshes.get(id);
      if (!mesh) continue;
      
      // Update orbit position
      const angle = elapsed * sphere.orbitSpeed * baseSpeed + 
        (Array.from(this.spheres.keys()).indexOf(id) / this.spheres.size) * Math.PI * 2;
      
      const x = Math.cos(angle) * sphere.orbitRadius;
      const z = Math.sin(angle) * sphere.orbitRadius;
      
      mesh.position.x = x;
      mesh.position.z = z;
      sphere.position.set(x, 0, z);
      
      // Self rotation
      mesh.rotation.y += sphere.rotationSpeed * 0.01;
      
      // Activity-based vertical oscillation
      const oscillationAmount = sphere.activityLevel === 'high' ? 0.3 : 
        sphere.activityLevel === 'medium' ? 0.15 : 0.05;
      mesh.position.y = Math.sin(elapsed * 2 + angle) * oscillationAmount;
      
      // Hover scale
      const targetScale = sphere.hovered ? this.config.hoverScaleMultiplier : 1;
      mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  }
  
  private updateConnections(): void {
    for (const [id, line] of this.connectionLines) {
      const [sourceId, targetId] = id.split('-');
      const sourceMesh = this.sphereMeshes.get(sourceId);
      const targetMesh = this.sphereMeshes.get(targetId);
      
      if (!sourceMesh || !targetMesh) continue;
      
      // Update line positions
      const positions = line.geometry.attributes.position as THREE.BufferAttribute;
      positions.setXYZ(0, sourceMesh.position.x, sourceMesh.position.y, sourceMesh.position.z);
      positions.setXYZ(1, targetMesh.position.x, targetMesh.position.y, targetMesh.position.z);
      positions.needsUpdate = true;
    }
  }
  
  private updateParticles(elapsed: number): void {
    if (!this.scene) return;
    
    const particles = this.scene.children.find(c => c.userData.isParticles) as THREE.Points;
    if (!particles) return;
    
    particles.rotation.y = elapsed * 0.02;
    particles.rotation.x = Math.sin(elapsed * 0.05) * 0.1;
  }
  
  private updateNovaPulse(elapsed: number): void {
    if (!this.scene) return;
    
    const nova = this.scene.children.find(c => c.userData.isNova) as THREE.Mesh;
    if (!nova) return;
    
    // Pulse effect
    const pulse = 1 + Math.sin(elapsed * 2) * 0.1;
    nova.scale.setScalar(pulse);
    
    // Update glow
    const glow = nova.children.find(c => c.userData.isPulsingGlow) as THREE.Mesh;
    if (glow) {
      const glowMaterial = glow.material as THREE.MeshBasicMaterial;
      glowMaterial.opacity = 0.15 + Math.sin(elapsed * 3) * 0.1;
    }
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // INTERACTIONS
  // ─────────────────────────────────────────────────────────────────────────
  
  private setupInteractions(container: HTMLElement): void {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    // Mouse move (hover)
    container.addEventListener('mousemove', (event) => {
      if (!this.camera) return;
      
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(mouse, this.camera);
      const meshes = Array.from(this.sphereMeshes.values());
      const intersects = raycaster.intersectObjects(meshes);
      
      // Reset all hovers
      for (const sphere of this.spheres.values()) {
        sphere.hovered = false;
      }
      
      if (intersects.length > 0) {
        const sphereId = intersects[0].object.userData.sphereId;
        const sphere = this.spheres.get(sphereId);
        if (sphere) {
          sphere.hovered = true;
          container.style.cursor = 'pointer';
          this.onSphereHover?.(sphereId);
        }
      } else {
        container.style.cursor = 'default';
        this.onSphereHover?.(null);
      }
    });
    
    // Click
    container.addEventListener('click', (event) => {
      if (!this.camera) return;
      
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(mouse, this.camera);
      const meshes = Array.from(this.sphereMeshes.values());
      const intersects = raycaster.intersectObjects(meshes);
      
      if (intersects.length > 0) {
        const sphereId = intersects[0].object.userData.sphereId;
        this.focusOnSphere(sphereId);
        this.onSphereClick?.(sphereId);
      }
    });
    
    // Wheel (zoom)
    container.addEventListener('wheel', (event) => {
      event.preventDefault();
      if (!this.camera) return;
      
      const zoomSpeed = 0.1;
      const delta = event.deltaY > 0 ? 1 + zoomSpeed : 1 - zoomSpeed;
      
      const newDistance = this.camera.position.length() * delta;
      if (newDistance >= this.config.cameraMinDistance && 
          newDistance <= this.config.cameraMaxDistance) {
        this.camera.position.multiplyScalar(delta);
        this.viewState.zoom = this.config.cameraDistance / newDistance;
      }
    });
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // PUBLIC METHODS
  // ─────────────────────────────────────────────────────────────────────────
  
  /**
   * Focus sur une sphère spécifique
   */
  focusOnSphere(sphereId: string): void {
    const sphere = this.spheres.get(sphereId);
    const mesh = this.sphereMeshes.get(sphereId);
    if (!sphere || !mesh || !this.camera) return;
    
    // Update state
    for (const s of this.spheres.values()) {
      s.active = s.id === sphereId;
    }
    
    this.viewState.mode = 'focused';
    this.viewState.activeSphereId = sphereId;
    
    // Animate camera to sphere
    const targetPosition = mesh.position.clone()
      .add(new THREE.Vector3(0, 2, 5));
    
    this.animateCameraTo(targetPosition, mesh.position.clone());
    
    this.onViewChange?.(this.viewState);
  }
  
  /**
   * Retourner à la vue d'ensemble
   */
  resetToOverview(): void {
    if (!this.camera) return;
    
    for (const sphere of this.spheres.values()) {
      sphere.active = false;
    }
    
    this.viewState.mode = 'overview';
    this.viewState.activeSphereId = null;
    
    const targetPosition = new THREE.Vector3(0, 5, this.config.cameraDistance);
    const targetLookAt = new THREE.Vector3(0, 0, 0);
    
    this.animateCameraTo(targetPosition, targetLookAt);
    
    this.onViewChange?.(this.viewState);
  }
  
  /**
   * Activer le mode XR
   */
  async enterXRMode(): Promise<boolean> {
    if (!this.config.xrEnabled || !this.renderer) {
      logger.warn('XR not enabled or renderer not available');
      return false;
    }
    
    if ('xr' in navigator) {
      try {
        const xr = navigator.xr as any;
        if (await xr.isSessionSupported('immersive-vr')) {
          const session = await xr.requestSession('immersive-vr', {
            optionalFeatures: ['local-floor', 'bounded-floor']
          });
          
          this.renderer.xr.enabled = true;
          await this.renderer.xr.setSession(session);
          
          this.viewState.mode = 'xr';
          this.onViewChange?.(this.viewState);
          
          return true;
        }
      } catch (error) {
        logger.error('Failed to enter XR mode:', error);
      }
    }
    
    return false;
  }
  
  /**
   * Mettre à jour l'activité d'une sphère
   */
  updateSphereActivity(
    sphereId: string, 
    activityLevel: Sphere3D['activityLevel'],
    notificationCount?: number
  ): void {
    const sphere = this.spheres.get(sphereId);
    if (!sphere) return;
    
    sphere.activityLevel = activityLevel;
    sphere.lastActivity = new Date();
    
    if (notificationCount !== undefined) {
      sphere.notificationCount = notificationCount;
    }
    
    // Update emissive intensity based on activity
    const mesh = this.sphereMeshes.get(sphereId);
    if (mesh) {
      const material = mesh.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 
        activityLevel === 'high' ? 0.5 :
        activityLevel === 'medium' ? 0.3 :
        activityLevel === 'low' ? 0.15 : 0.05;
    }
  }
  
  /**
   * Set event callbacks
   */
  setCallbacks(callbacks: {
    onSphereClick?: (sphereId: string) => void;
    onSphereHover?: (sphereId: string | null) => void;
    onViewChange?: (state: AtlasViewState) => void;
  }): void {
    this.onSphereClick = callbacks.onSphereClick;
    this.onSphereHover = callbacks.onSphereHover;
    this.onViewChange = callbacks.onViewChange;
  }
  
  /**
   * Obtenir l'état actuel
   */
  getViewState(): AtlasViewState {
    return { ...this.viewState };
  }
  
  /**
   * Obtenir toutes les sphères
   */
  getSpheres(): Sphere3D[] {
    return Array.from(this.spheres.values());
  }
  
  /**
   * Cleanup
   */
  dispose(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    if (this.renderer) {
      this.renderer.dispose();
    }
    
    this.sphereMeshes.clear();
    this.connectionLines.clear();
    this.spheres.clear();
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // PRIVATE HELPERS
  // ─────────────────────────────────────────────────────────────────────────
  
  private animateCameraTo(targetPosition: THREE.Vector3, targetLookAt: THREE.Vector3): void {
    if (!this.camera) return;
    
    const startPosition = this.camera.position.clone();
    const startLookAt = this.viewState.cameraTarget.clone();
    
    const duration = this.config.transitionDuration;
    const startTime = Date.now();
    
    const animateCamera = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out-cubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      
      this.camera!.position.lerpVectors(startPosition, targetPosition, eased);
      
      const currentLookAt = new THREE.Vector3().lerpVectors(startLookAt, targetLookAt, eased);
      this.camera!.lookAt(currentLookAt);
      
      this.viewState.cameraPosition = this.camera!.position.clone();
      this.viewState.cameraTarget = currentLookAt;
      
      if (progress < 1) {
        requestAnimationFrame(animateCamera);
      }
    };
    
    animateCamera();
  }
  
  private handleResize(container: HTMLElement): void {
    if (!this.camera || !this.renderer) return;
    
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export const createAtlas3D = (config?: Partial<Atlas3DConfig>) => new Atlas3DEngine(config);
