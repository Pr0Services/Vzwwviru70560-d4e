/**
 * ============================================================
 * CHE·NU — XR UI DASHBOARD — XR ADAPTER
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 * 
 * Mock data source for XR scenes, universes, avatars, presets.
 */

// ============================================================
// TYPES
// ============================================================

export interface XRObject {
  id: string;
  name: string;
  type: "panel" | "node" | "avatar" | "decoration" | "portal" | "display" | "interaction_zone";
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  meta?: Record<string, unknown>;
}

export interface XRSector {
  id: string;
  name: string;
  color: string;
  objects: XRObject[];
  bounds: { width: number; height: number; depth: number };
}

export interface XRScene {
  id: string;
  name: string;
  sphere: string;
  domain: string;
  description: string;
  sectors: XRSector[];
  engines: string[];
  memoryRefs: string[];
  createdAt: string;
  status: "draft" | "published" | "archived";
}

export interface XRUniverse {
  id: string;
  name: string;
  description: string;
  scenes: XRScene[];
  rootSceneId: string;
  theme: {
    primaryColor: string;
    ambientColor: string;
    skybox: string;
  };
}

export interface XRAvatar {
  id: string;
  name: string;
  description: string;
  traits: {
    height: number;
    proportions: "compact" | "balanced" | "elongated";
    silhouette: "neutral" | "athletic" | "rounded" | "angular";
    expressiveness: "minimal" | "moderate" | "expressive";
  };
  colorPalette: string[];
  accessories: string[];
  animations: string[];
}

export interface XRPreset {
  id: string;
  name: string;
  description: string;
  category: string;
  sphere: string;
  thumbnail: string;
  objects: number;
  sectors: number;
}

export interface XRTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

export interface XRProcess {
  id: string;
  name: string;
  description: string;
  steps: string[];
  status: "idle" | "active" | "completed";
}

export interface XRMemoryEntry {
  id: string;
  objectId: string;
  title: string;
  content: string;
  type: "note" | "reference" | "context";
  timestamp: string;
}

export interface XREngine {
  id: string;
  name: string;
  description: string;
  status: "active" | "standby" | "disabled";
  sphere: string;
}

// ============================================================
// MOCK DATA GENERATORS
// ============================================================

export function getXrScenesMock(): XRScene[] {
  return [
    {
      id: "scene_personal",
      name: "Personal Sanctuary",
      sphere: "Personal",
      domain: "Life Organization",
      description: "Main personal space for daily life management and wellness tracking",
      sectors: [
        {
          id: "sec_main",
          name: "Central Hub",
          color: "#3F7249",
          bounds: { width: 10, height: 4, depth: 10 },
          objects: [
            { id: "panel_overview", name: "Life Overview Panel", type: "panel", position: { x: 0, y: 2, z: -3 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3, y: 2, z: 0.1 } },
            { id: "node_health", name: "Health Node", type: "node", position: { x: -2, y: 1.5, z: -2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.5, y: 0.5, z: 0.5 } },
            { id: "node_tasks", name: "Tasks Node", type: "node", position: { x: 2, y: 1.5, z: -2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.5, y: 0.5, z: 0.5 } }
          ]
        },
        {
          id: "sec_wellness",
          name: "Wellness Corner",
          color: "#3EB4A2",
          bounds: { width: 6, height: 3, depth: 6 },
          objects: [
            { id: "display_stats", name: "Wellness Stats Display", type: "display", position: { x: 5, y: 1.5, z: 0 }, rotation: { x: 0, y: -90, z: 0 }, scale: { x: 2, y: 1.5, z: 0.1 } },
            { id: "deco_plant", name: "Meditation Plant", type: "decoration", position: { x: 6, y: 0, z: 2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1.5, z: 1 } }
          ]
        }
      ],
      engines: ["HealthEngine", "TaskEngine", "WellnessEngine"],
      memoryRefs: ["mem_daily_routine", "mem_health_goals"],
      createdAt: "2024-01-15",
      status: "published"
    },
    {
      id: "scene_streaming",
      name: "Streaming Studio",
      sphere: "Entertainment",
      domain: "Video Streaming Platform",
      description: "Immersive streaming room for content consumption and creation",
      sectors: [
        {
          id: "sec_player",
          name: "Player Area",
          color: "#D8B26A",
          bounds: { width: 12, height: 5, depth: 8 },
          objects: [
            { id: "screen_main", name: "Main Display Screen", type: "display", position: { x: 0, y: 2.5, z: -4 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 8, y: 4.5, z: 0.1 } },
            { id: "panel_controls", name: "Playback Controls", type: "panel", position: { x: 0, y: 0.8, z: -2 }, rotation: { x: -30, y: 0, z: 0 }, scale: { x: 2, y: 0.5, z: 0.1 } }
          ]
        },
        {
          id: "sec_library",
          name: "Content Library",
          color: "#7A593A",
          bounds: { width: 8, height: 4, depth: 4 },
          objects: [
            { id: "panel_library", name: "Library Browser", type: "panel", position: { x: -6, y: 2, z: 0 }, rotation: { x: 0, y: 45, z: 0 }, scale: { x: 3, y: 3, z: 0.1 } },
            { id: "node_favorites", name: "Favorites Node", type: "node", position: { x: -5, y: 1, z: 2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } }
          ]
        }
      ],
      engines: ["StreamingEngine", "MediaEngine", "RecommendationEngine"],
      memoryRefs: ["mem_watch_history", "mem_preferences"],
      createdAt: "2024-02-20",
      status: "published"
    },
    {
      id: "scene_forum",
      name: "Community Forum",
      sphere: "Social",
      domain: "Discussion & Community",
      description: "Social space for community discussions and collaboration",
      sectors: [
        {
          id: "sec_agora",
          name: "Main Agora",
          color: "#8D8371",
          bounds: { width: 15, height: 6, depth: 15 },
          objects: [
            { id: "panel_threads", name: "Active Threads Panel", type: "panel", position: { x: 0, y: 3, z: -5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6, y: 4, z: 0.1 } },
            { id: "zone_discussion", name: "Discussion Zone", type: "interaction_zone", position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 8, y: 0.1, z: 8 } },
            { id: "avatar_spot1", name: "Avatar Spot 1", type: "avatar", position: { x: -3, y: 0, z: 2 }, rotation: { x: 0, y: 30, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
            { id: "avatar_spot2", name: "Avatar Spot 2", type: "avatar", position: { x: 3, y: 0, z: 2 }, rotation: { x: 0, y: -30, z: 0 }, scale: { x: 1, y: 1, z: 1 } }
          ]
        },
        {
          id: "sec_private",
          name: "Private Rooms",
          color: "#2F4C39",
          bounds: { width: 5, height: 3, depth: 5 },
          objects: [
            { id: "portal_room1", name: "Room 1 Portal", type: "portal", position: { x: 8, y: 1.5, z: -3 }, rotation: { x: 0, y: -45, z: 0 }, scale: { x: 1.5, y: 2.5, z: 0.1 } },
            { id: "portal_room2", name: "Room 2 Portal", type: "portal", position: { x: 8, y: 1.5, z: 3 }, rotation: { x: 0, y: -45, z: 0 }, scale: { x: 1.5, y: 2.5, z: 0.1 } }
          ]
        }
      ],
      engines: ["SocialEngine", "ModerationEngine", "NotificationEngine"],
      memoryRefs: ["mem_connections", "mem_discussions"],
      createdAt: "2024-03-10",
      status: "published"
    },
    {
      id: "scene_ailab",
      name: "AI Laboratory",
      sphere: "Systems",
      domain: "AI & Automation",
      description: "Sandbox environment for AI experimentation and visualization",
      sectors: [
        {
          id: "sec_workspace",
          name: "Main Workspace",
          color: "#3EB4A2",
          bounds: { width: 12, height: 5, depth: 12 },
          objects: [
            { id: "panel_agents", name: "Agent Overview Panel", type: "panel", position: { x: 0, y: 2.5, z: -4 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 5, y: 3, z: 0.1 } },
            { id: "node_nova", name: "Nova Core Node", type: "node", position: { x: 0, y: 1.5, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, meta: { glow: true, pulse: true } },
            { id: "display_metrics", name: "Metrics Display", type: "display", position: { x: 4, y: 2, z: -2 }, rotation: { x: 0, y: -30, z: 0 }, scale: { x: 2, y: 2, z: 0.1 } }
          ]
        },
        {
          id: "sec_sandbox",
          name: "Experimentation Sandbox",
          color: "#D8B26A",
          bounds: { width: 8, height: 4, depth: 8 },
          objects: [
            { id: "zone_experiment", name: "Experiment Zone", type: "interaction_zone", position: { x: -6, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6, y: 0.1, z: 6 } },
            { id: "panel_results", name: "Results Panel", type: "panel", position: { x: -6, y: 2, z: -3 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3, y: 2, z: 0.1 } }
          ]
        }
      ],
      engines: ["AIEngine", "OrchestrationEngine", "AnalyticsEngine"],
      memoryRefs: ["mem_experiments", "mem_agent_configs"],
      createdAt: "2024-04-05",
      status: "published"
    },
    {
      id: "scene_construction",
      name: "Project Command Center",
      sphere: "Construction",
      domain: "Project Management",
      description: "Construction project visualization and management hub",
      sectors: [
        {
          id: "sec_overview",
          name: "Project Overview",
          color: "#7A593A",
          bounds: { width: 14, height: 5, depth: 10 },
          objects: [
            { id: "display_timeline", name: "Project Timeline", type: "display", position: { x: 0, y: 2.5, z: -4 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 10, y: 2, z: 0.1 } },
            { id: "panel_tasks", name: "Task Board", type: "panel", position: { x: -5, y: 2, z: -2 }, rotation: { x: 0, y: 20, z: 0 }, scale: { x: 3, y: 3, z: 0.1 } },
            { id: "panel_resources", name: "Resources Panel", type: "panel", position: { x: 5, y: 2, z: -2 }, rotation: { x: 0, y: -20, z: 0 }, scale: { x: 3, y: 3, z: 0.1 } }
          ]
        }
      ],
      engines: ["ProjectEngine", "SchedulingEngine", "ResourceEngine"],
      memoryRefs: ["mem_project_plans", "mem_milestones"],
      createdAt: "2024-05-01",
      status: "draft"
    }
  ];
}

export function getXrUniversesMock(): XRUniverse[] {
  const scenes = getXrScenesMock();
  return [
    {
      id: "univ_chenu_main",
      name: "CHE·NU Base Universe",
      description: "The primary CHE·NU universe containing all core scenes and experiences",
      scenes: scenes,
      rootSceneId: "scene_personal",
      theme: {
        primaryColor: "#D8B26A",
        ambientColor: "#1E1F22",
        skybox: "cosmos_gradient"
      }
    },
    {
      id: "univ_work",
      name: "Professional Universe",
      description: "Work-focused universe for business and productivity",
      scenes: scenes.filter(s => ["Business", "Construction", "Systems"].includes(s.sphere)),
      rootSceneId: "scene_construction",
      theme: {
        primaryColor: "#3F7249",
        ambientColor: "#2F4C39",
        skybox: "corporate_sky"
      }
    },
    {
      id: "univ_social",
      name: "Social Universe",
      description: "Community and entertainment focused universe",
      scenes: scenes.filter(s => ["Social", "Entertainment"].includes(s.sphere)),
      rootSceneId: "scene_forum",
      theme: {
        primaryColor: "#3EB4A2",
        ambientColor: "#8D8371",
        skybox: "sunset_warm"
      }
    }
  ];
}

export function getXrAvatarsMock(): XRAvatar[] {
  return [
    {
      id: "avatar_default",
      name: "Default Morphology",
      description: "Standard balanced avatar with neutral appearance",
      traits: {
        height: 1.75,
        proportions: "balanced",
        silhouette: "neutral",
        expressiveness: "moderate"
      },
      colorPalette: ["#FFFFFF", "#E9E4D6", "#8D8371", "#1E1F22"],
      accessories: ["none"],
      animations: ["idle", "walk", "gesture_wave", "gesture_nod"]
    },
    {
      id: "avatar_professional",
      name: "Professional Style",
      description: "Business-oriented avatar with formal appearance",
      traits: {
        height: 1.80,
        proportions: "balanced",
        silhouette: "angular",
        expressiveness: "minimal"
      },
      colorPalette: ["#1E1F22", "#8D8371", "#D8B26A", "#FFFFFF"],
      accessories: ["glasses", "briefcase"],
      animations: ["idle", "walk", "gesture_handshake", "gesture_present"]
    },
    {
      id: "avatar_creative",
      name: "Creative Expression",
      description: "Artistic avatar with expressive features",
      traits: {
        height: 1.70,
        proportions: "elongated",
        silhouette: "rounded",
        expressiveness: "expressive"
      },
      colorPalette: ["#3EB4A2", "#D8B26A", "#3F7249", "#E9E4D6"],
      accessories: ["headphones", "tablet"],
      animations: ["idle", "walk", "gesture_dance", "gesture_create"]
    },
    {
      id: "avatar_athletic",
      name: "Athletic Build",
      description: "Sport-oriented avatar with dynamic posture",
      traits: {
        height: 1.82,
        proportions: "balanced",
        silhouette: "athletic",
        expressiveness: "moderate"
      },
      colorPalette: ["#3F7249", "#FFFFFF", "#1E1F22", "#3EB4A2"],
      accessories: ["sports_band"],
      animations: ["idle", "walk", "run", "gesture_victory"]
    },
    {
      id: "avatar_minimal",
      name: "Minimalist Form",
      description: "Simplified geometric avatar for distraction-free presence",
      traits: {
        height: 1.75,
        proportions: "compact",
        silhouette: "neutral",
        expressiveness: "minimal"
      },
      colorPalette: ["#E9E4D6", "#8D8371"],
      accessories: ["none"],
      animations: ["idle", "walk"]
    }
  ];
}

export function getXrPresetsMock(): XRPreset[] {
  return [
    {
      id: "preset_personal",
      name: "Personal Room Preset",
      description: "Cozy personal space for daily life management",
      category: "Personal",
      sphere: "Personal",
      thumbnail: "🏠",
      objects: 8,
      sectors: 3
    },
    {
      id: "preset_forum",
      name: "Forum Space Preset",
      description: "Open discussion area for community gatherings",
      category: "Social",
      sphere: "Social",
      thumbnail: "💬",
      objects: 12,
      sectors: 4
    },
    {
      id: "preset_streaming",
      name: "Streaming Room Preset",
      description: "Media consumption and streaming studio",
      category: "Entertainment",
      sphere: "Entertainment",
      thumbnail: "📺",
      objects: 6,
      sectors: 2
    },
    {
      id: "preset_ailab",
      name: "AI Lab Sandbox",
      description: "Experimental space for AI visualization",
      category: "Technical",
      sphere: "Systems",
      thumbnail: "🤖",
      objects: 10,
      sectors: 3
    },
    {
      id: "preset_office",
      name: "Virtual Office",
      description: "Professional workspace for remote collaboration",
      category: "Business",
      sphere: "Business",
      thumbnail: "💼",
      objects: 15,
      sectors: 5
    },
    {
      id: "preset_classroom",
      name: "Learning Space",
      description: "Educational environment for courses and training",
      category: "Education",
      sphere: "Education",
      thumbnail: "📚",
      objects: 10,
      sectors: 3
    },
    {
      id: "preset_gallery",
      name: "Creative Gallery",
      description: "Exhibition space for creative works",
      category: "Creative",
      sphere: "Creative",
      thumbnail: "🎨",
      objects: 20,
      sectors: 6
    },
    {
      id: "preset_command",
      name: "Command Center",
      description: "Operations hub for project management",
      category: "Management",
      sphere: "Construction",
      thumbnail: "🏗️",
      objects: 14,
      sectors: 4
    }
  ];
}

export function getXrToolsMock(): XRTool[] {
  return [
    {
      id: "tool_layout",
      name: "Layout Helper",
      description: "Conceptual layout planning and visualization",
      icon: "📐",
      category: "Planning"
    },
    {
      id: "tool_mapper",
      name: "Scene Structure Mapper",
      description: "Map and visualize scene hierarchy",
      icon: "🗺️",
      category: "Mapping"
    },
    {
      id: "tool_cluster",
      name: "Node Clustering Tool",
      description: "Group and organize nodes by context",
      icon: "🔗",
      category: "Organization"
    },
    {
      id: "tool_palette",
      name: "Color Palette Manager",
      description: "Manage scene color themes",
      icon: "🎨",
      category: "Styling"
    },
    {
      id: "tool_validator",
      name: "Scene Validator",
      description: "Validate scene structure and constraints",
      icon: "✅",
      category: "Validation"
    },
    {
      id: "tool_exporter",
      name: "Schema Exporter",
      description: "Export scene as JSON schema",
      icon: "📤",
      category: "Export"
    }
  ];
}

export function getXrProcessesMock(): XRProcess[] {
  return [
    {
      id: "proc_scene_create",
      name: "Scene Creation Process",
      description: "Workflow for creating new XR scenes",
      steps: ["Define sphere & domain", "Create sectors", "Place objects", "Configure engines", "Validate structure"],
      status: "completed"
    },
    {
      id: "proc_preset_apply",
      name: "Preset Application",
      description: "Apply preset template to new scene",
      steps: ["Select preset", "Configure parameters", "Generate objects", "Review layout"],
      status: "idle"
    },
    {
      id: "proc_context_map",
      name: "Context Mapping",
      description: "Map context snapshot to spatial layout",
      steps: ["Load context", "Identify engines", "Generate panels", "Position elements"],
      status: "active"
    },
    {
      id: "proc_avatar_config",
      name: "Avatar Configuration",
      description: "Configure avatar morphology and traits",
      steps: ["Select base", "Adjust proportions", "Set color palette", "Choose animations"],
      status: "idle"
    }
  ];
}

export function getXrMemoryEntriesMock(): XRMemoryEntry[] {
  return [
    {
      id: "xrmem_1",
      objectId: "panel_overview",
      title: "Panel Purpose",
      content: "Life Overview Panel displays aggregated wellness metrics",
      type: "note",
      timestamp: "2024-01-15T10:30:00Z"
    },
    {
      id: "xrmem_2",
      objectId: "node_nova",
      title: "Nova Core Reference",
      content: "Central AI orchestration node - connects to all agent systems",
      type: "reference",
      timestamp: "2024-04-05T14:20:00Z"
    },
    {
      id: "xrmem_3",
      objectId: "zone_discussion",
      title: "Discussion Zone Context",
      content: "Supports up to 12 simultaneous avatar presences",
      type: "context",
      timestamp: "2024-03-10T09:15:00Z"
    },
    {
      id: "xrmem_4",
      objectId: "screen_main",
      title: "Display Configuration",
      content: "Main streaming display - 8K resolution, HDR support",
      type: "note",
      timestamp: "2024-02-20T16:45:00Z"
    }
  ];
}

export function getXrEnginesMock(): XREngine[] {
  return [
    { id: "eng_health", name: "HealthEngine", description: "Wellness and health metric processing", status: "active", sphere: "Personal" },
    { id: "eng_task", name: "TaskEngine", description: "Task management and scheduling", status: "active", sphere: "Personal" },
    { id: "eng_streaming", name: "StreamingEngine", description: "Media streaming and playback", status: "active", sphere: "Entertainment" },
    { id: "eng_social", name: "SocialEngine", description: "Social interactions and presence", status: "active", sphere: "Social" },
    { id: "eng_ai", name: "AIEngine", description: "AI orchestration and processing", status: "active", sphere: "Systems" },
    { id: "eng_project", name: "ProjectEngine", description: "Project management workflows", status: "standby", sphere: "Construction" },
    { id: "eng_analytics", name: "AnalyticsEngine", description: "Data analysis and visualization", status: "active", sphere: "Systems" },
    { id: "eng_notification", name: "NotificationEngine", description: "Alert and notification delivery", status: "active", sphere: "Systems" }
  ];
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

export function getSceneById(sceneId: string): XRScene | undefined {
  return getXrScenesMock().find(s => s.id === sceneId);
}

export function getUniverseById(universeId: string): XRUniverse | undefined {
  return getXrUniversesMock().find(u => u.id === universeId);
}

export function getAvatarById(avatarId: string): XRAvatar | undefined {
  return getXrAvatarsMock().find(a => a.id === avatarId);
}

export function getObjectsForScene(sceneId: string): XRObject[] {
  const scene = getSceneById(sceneId);
  if (!scene) return [];
  return scene.sectors.flatMap(s => s.objects);
}

export function getMemoryForObject(objectId: string): XRMemoryEntry[] {
  return getXrMemoryEntriesMock().filter(m => m.objectId === objectId);
}

export function getEnginesForScene(sceneId: string): XREngine[] {
  const scene = getSceneById(sceneId);
  if (!scene) return [];
  const allEngines = getXrEnginesMock();
  return allEngines.filter(e => scene.engines.includes(e.name));
}

// Stats
export function getXrStats() {
  const scenes = getXrScenesMock();
  const universes = getXrUniversesMock();
  const avatars = getXrAvatarsMock();
  const presets = getXrPresetsMock();
  
  return {
    totalScenes: scenes.length,
    totalUniverses: universes.length,
    totalAvatars: avatars.length,
    totalPresets: presets.length,
    totalObjects: scenes.reduce((acc, s) => acc + s.sectors.reduce((a, sec) => a + sec.objects.length, 0), 0),
    totalSectors: scenes.reduce((acc, s) => acc + s.sectors.length, 0)
  };
}
