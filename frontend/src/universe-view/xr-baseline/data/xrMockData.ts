import { XRRoom, XRParticipant, XRTimelineEvent } from "../types/xr";

export const XR_ROOMS: XRRoom[] = [
  {
    id: "room-1",
    name: "Salle de coordination",
    description: "Réunion quotidienne équipe chantier",
    participantCount: 3,
  },
  {
    id: "room-2",
    name: "Revue de plans",
    description: "Analyse des modifications structurelles",
    participantCount: 2,
  },
  {
    id: "room-3",
    name: "Formation sécurité",
    description: "Session CNESST mensuelle",
    participantCount: 5,
  },
];

export const XR_PARTICIPANTS: Record<string, XRParticipant[]> = {
  "room-1": [
    { id: "p1", name: "Jo", color: "#4a90d9", position: [-1.5, 0, 0] },
    { id: "p2", name: "Marc", color: "#7cb342", position: [0, 0, 1.5] },
    { id: "p3", name: "Sophie", color: "#ff7043", position: [1.5, 0, 0] },
  ],
  "room-2": [
    { id: "p1", name: "Jo", color: "#4a90d9", position: [-1, 0, 0] },
    { id: "p4", name: "Luc", color: "#ab47bc", position: [1, 0, 0] },
  ],
  "room-3": [
    { id: "p1", name: "Jo", color: "#4a90d9", position: [-2, 0, -1] },
    { id: "p5", name: "Claire", color: "#26a69a", position: [-1, 0, 1] },
    { id: "p6", name: "Pierre", color: "#ffa726", position: [0, 0, -1] },
    { id: "p7", name: "Marie", color: "#ef5350", position: [1, 0, 1] },
    { id: "p8", name: "Jean", color: "#5c6bc0", position: [2, 0, -1] },
  ],
};

export const XR_TIMELINE: Record<string, XRTimelineEvent[]> = {
  "room-1": [
    { id: "e1", timestamp: "09:00", label: "Meeting started" },
    { id: "e2", timestamp: "09:05", label: "Revue des tâches du jour" },
    { id: "e3", timestamp: "09:15", label: "Note: retard livraison béton" },
    { id: "e4", timestamp: "09:20", label: "Pause" },
  ],
  "room-2": [
    { id: "e1", timestamp: "14:00", label: "Meeting started" },
    { id: "e2", timestamp: "14:10", label: "Analyse plan étage 3" },
    { id: "e3", timestamp: "14:30", label: "Modification approuvée" },
  ],
  "room-3": [
    { id: "e1", timestamp: "10:00", label: "Formation débutée" },
    { id: "e2", timestamp: "10:15", label: "Module: équipements de protection" },
    { id: "e3", timestamp: "10:45", label: "Quiz interactif" },
    { id: "e4", timestamp: "11:00", label: "Pause" },
    { id: "e5", timestamp: "11:15", label: "Module: procédures d'urgence" },
  ],
};
