/**
 * ============================================================
 * CHE·NU — UI DASHBOARD — UNIVERSE ADAPTER
 * SAFE · READ-ONLY · MOCK DATA
 * ============================================================
 */

// Root Sphere type
export type RootSphere =
  | "Personal"
  | "Business"
  | "Creative"
  | "Scholar"
  | "SocialNetworkMedia"
  | "Community"
  | "XRImmersive"
  | "MyTeam"
  | "AILab"
  | "Entertainment";

// All 10 official spheres
export const ROOT_SPHERES: RootSphere[] = [
  "Personal",
  "Business",
  "Creative",
  "Scholar",
  "SocialNetworkMedia",
  "Community",
  "XRImmersive",
  "MyTeam",
  "AILab",
  "Entertainment"
];

// Sphere labels for display
export function getSphereLabel(sphere: RootSphere): string {
  const labels: Record<RootSphere, string> = {
    Personal: "Personal",
    Business: "Business",
    Creative: "Creative",
    Scholar: "Scholar",
    SocialNetworkMedia: "Social & Media",
    Community: "Community",
    XRImmersive: "XR / Spatial",
    MyTeam: "My Team",
    AILab: "AI Lab",
    Entertainment: "Entertainment"
  };
  return labels[sphere] || sphere;
}

// Sphere icons (emoji)
export function getSphereIcon(sphere: RootSphere): string {
  const icons: Record<RootSphere, string> = {
    Personal: "👤",
    Business: "💼",
    Creative: "🎨",
    Scholar: "📚",
    SocialNetworkMedia: "📱",
    Community: "🏘️",
    XRImmersive: "🥽",
    MyTeam: "👥",
    AILab: "🤖",
    Entertainment: "🎬"
  };
  return icons[sphere] || "📦";
}

// Sphere colors (CHE·NU brand palette)
export function getSphereColor(sphere: RootSphere): string {
  const colors: Record<RootSphere, string> = {
    Personal: "#3EB4A2",      // Cenote Turquoise
    Business: "#D8B26A",      // Sacred Gold
    Creative: "#7A593A",      // Earth Ember
    Scholar: "#8D8371",       // Ancient Stone
    SocialNetworkMedia: "#3F7249", // Jungle Emerald
    Community: "#2F4C39",     // Shadow Moss
    XRImmersive: "#6B5B95",   // Deep Purple
    MyTeam: "#3EB4A2",        // Cenote Turquoise
    AILab: "#4A90A4",         // Tech Blue
    Entertainment: "#D8B26A"  // Sacred Gold
  };
  return colors[sphere] || "#8D8371";
}

// Domains for each sphere
export function getDomainsForSphere(sphere: RootSphere): string[] {
  const domains: Record<RootSphere, string[]> = {
    Personal: [
      "Health & Wellbeing",
      "Habits & Routines",
      "Personal Finance",
      "Personal Development",
      "Life Organization"
    ],
    Business: [
      "Business Finance",
      "Operations",
      "Supply & Logistics",
      "Construction / Industrial",
      "Commerce"
    ],
    Creative: [
      "Art & Visual",
      "Media Creation",
      "Design",
      "Concept & Ideation",
      "Writing & Content"
    ],
    Scholar: [
      "Study & Learning",
      "Research",
      "Documentation",
      "Information Architecture",
      "Academic Writing"
    ],
    SocialNetworkMedia: [
      "Posts & Content",
      "Comments & Engagement",
      "Messages & Chat",
      "Feed Management",
      "Influence & Analytics"
    ],
    Community: [
      "Groups & Pages",
      "Forum / Reddit-like",
      "Public Announcements",
      "Civic Culture & Public Services",
      "Events & Gatherings"
    ],
    XRImmersive: [
      "XR Scene",
      "Spatial Design",
      "World Building",
      "Avatar Creation",
      "Virtual Events"
    ],
    MyTeam: [
      "Team Roles",
      "Coordination",
      "Delegation",
      "Collaboration",
      "Team Analytics"
    ],
    AILab: [
      "Sandbox",
      "Cognitive Tools",
      "Test Rig",
      "Model Exploration",
      "Experiment Design"
    ],
    Entertainment: [
      "Video Streaming Platform",
      "Interactive Entertainment",
      "Games & Play",
      "Audience Experience",
      "Live Events"
    ]
  };
  return domains[sphere] || ["General Domain"];
}

// Engines for each sphere
export function getEnginesForSphere(sphere: RootSphere): string[] {
  const engines: Record<RootSphere, string[]> = {
    Personal: ["HealthEngine", "EnergyEngine", "HabitEngine", "PersonalFinanceEngine", "LifeMapEngine"],
    Business: ["BusinessFinanceEngine", "OperationEngine", "LogisticsEngine", "ConstructionEngine", "MarketEngine"],
    Creative: ["ArtEngine", "MediaCreationEngine", "DesignEngine", "ConceptEngine", "WritingEngine"],
    Scholar: ["StudyEngine", "ResearchEngine", "DocumentationEngine", "InfoArchEngine", "AcademicEngine"],
    SocialNetworkMedia: ["PostEngine", "CommentEngine", "MessageEngine", "FeedEngine", "InfluenceEngine"],
    Community: ["GroupEngine", "PageEngine", "ForumEngine", "AnnouncementEngine", "CivicEngine"],
    XRImmersive: ["XRSceneEngine", "SpatialEngine", "WorldBuilderEngine", "AvatarEngine", "VREventEngine"],
    MyTeam: ["TeamRoleEngine", "CoordinationEngine", "DelegationEngine", "CollaborationEngine", "TeamAnalyticsEngine"],
    AILab: ["SandboxEngine", "CognitiveToolEngine", "TestRigEngine", "ModelEngine", "ExperimentEngine"],
    Entertainment: ["StreamingEngine", "InteractionEngine", "GameEngine", "AudienceEngine", "LiveEventEngine"]
  };
  return engines[sphere] || ["GeneralEngine"];
}

// Sphere description
export function getSphereDescription(sphere: RootSphere): string {
  const descriptions: Record<RootSphere, string> = {
    Personal: "Personal life management including health, habits, finance, and development.",
    Business: "Business operations, finance, logistics, construction, and commerce.",
    Creative: "Art, design, media creation, and creative ideation tools.",
    Scholar: "Study, research, documentation, and academic pursuits.",
    SocialNetworkMedia: "Social networking, content creation, and media engagement.",
    Community: "Community building, forums, groups, and civic engagement.",
    XRImmersive: "Extended reality, spatial computing, and immersive experiences.",
    MyTeam: "Team management, collaboration, and coordination tools.",
    AILab: "AI experimentation, cognitive tools, and sandbox environments.",
    Entertainment: "Streaming, gaming, and entertainment experiences."
  };
  return descriptions[sphere] || "General purpose sphere.";
}
