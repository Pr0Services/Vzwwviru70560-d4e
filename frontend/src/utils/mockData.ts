/**
 * CHE·NU™ — Mock Data for Development
 */

import type { UserContextData, Identity, Sphere, Project, Workspace } from "../../../shared/types";
import type { SphereKey } from "../../../shared/types";

// Identities
const identities: Identity[] = [
  { id: "id-personal", type: "personal", name: "Jo Bouchard" },
  { id: "id-business", type: "business", name: "Pro Service Inc" },
];

// Spheres for each identity
const personalSpheres: Sphere[] = [
  { id: "sp-personal-1", key: "personal", label: "Personal", labelFr: "Personnel", emoji: "🏠", color: "#76E6C7" },
  { id: "sp-entertainment-1", key: "entertainment", label: "Entertainment", labelFr: "Divertissement", emoji: "🎬", color: "#F39C12" },
  { id: "sp-community-1", key: "community", label: "Community", labelFr: "Communauté", emoji: "👥", color: "#22C55E" },
];

const businessSpheres: Sphere[] = [
  { id: "sp-business-1", key: "business", label: "Business", labelFr: "Entreprises", emoji: "💼", color: "#5BA9FF" },
  { id: "sp-creative-1", key: "creative_studio", label: "Creative Studio", labelFr: "Studio de création", emoji: "🎨", color: "#FF8BAA" },
  { id: "sp-team-1", key: "my_team", label: "My Team", labelFr: "Mon Équipe", emoji: "🤝", color: "#8B5CF6" },
  { id: "sp-social-1", key: "social_media", label: "Social & Media", labelFr: "Social & Médias", emoji: "📱", color: "#1DA1F2" },
];

// Projects
const businessProjects: Project[] = [
  { id: "proj-1", name: "CHE·NU Development", identityId: "id-business", sphereId: "sp-business-1", createdAt: Date.now() },
  { id: "proj-2", name: "Client Portal v2", identityId: "id-business", sphereId: "sp-business-1", createdAt: Date.now() },
  { id: "proj-3", name: "Brand Refresh", identityId: "id-business", sphereId: "sp-creative-1", createdAt: Date.now() },
];

const personalProjects: Project[] = [
  { id: "proj-p1", name: "Home Renovation", identityId: "id-personal", sphereId: "sp-personal-1", createdAt: Date.now() },
];

// Workspaces
const businessWorkspaces: Workspace[] = [
  { id: "ws-1", name: "Main Development Workspace", identityId: "id-business", sphereId: "sp-business-1", projectId: "proj-1", type: "document", pinned: true, lastOpenedAt: Date.now() - 3600000 },
  { id: "ws-2", name: "API Documentation", identityId: "id-business", sphereId: "sp-business-1", projectId: "proj-1", type: "document", lastOpenedAt: Date.now() - 86400000 },
  { id: "ws-3", name: "Sprint Board", identityId: "id-business", sphereId: "sp-business-1", projectId: "proj-1", type: "board", lastOpenedAt: Date.now() - 172800000 },
  { id: "ws-4", name: "Brand Guidelines", identityId: "id-business", sphereId: "sp-creative-1", projectId: "proj-3", type: "document", pinned: true },
];

const teamWorkspaces: Workspace[] = [
  { id: "ws-t1", name: "Team Kanban", identityId: "id-business", sphereId: "sp-team-1", type: "board", pinned: true },
  { id: "ws-t2", name: "IA Labs Research", identityId: "id-business", sphereId: "sp-team-1", type: "document" },
];

// Build the data structure
export const MOCK_DATA: UserContextData = {
  identities,
  spheresByIdentity: {
    "id-personal": personalSpheres,
    "id-business": businessSpheres,
  },
  projectsByIdentitySphere: {
    "id-business:sp-business-1": businessProjects.filter(p => p.sphereId === "sp-business-1"),
    "id-business:sp-creative-1": businessProjects.filter(p => p.sphereId === "sp-creative-1"),
    "id-personal:sp-personal-1": personalProjects,
  },
  workspacesByIdentitySphere: {
    "id-business:sp-business-1": businessWorkspaces.filter(w => w.sphereId === "sp-business-1"),
    "id-business:sp-creative-1": businessWorkspaces.filter(w => w.sphereId === "sp-creative-1"),
    "id-business:sp-team-1": teamWorkspaces,
  },
};

export default MOCK_DATA;
