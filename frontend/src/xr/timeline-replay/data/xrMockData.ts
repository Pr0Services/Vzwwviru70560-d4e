import { XRRoom, XRParticipant, XRTimelineEvent, XRDecision, XRDecisionBranch } from "../types/xr";

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
    { id: "e1", timestamp: "09:00", label: "Meeting started", type: "system" },
    { id: "e2", timestamp: "09:05", label: "Revue des tâches du jour", type: "note" },
    { id: "e3", timestamp: "09:15", label: "Note: retard livraison béton", type: "note" },
    { id: "e4", timestamp: "09:20", label: "Décision: ajuster planning", type: "decision" },
    { id: "e5", timestamp: "09:25", label: "Pause", type: "system" },
  ],
  "room-2": [
    { id: "e1", timestamp: "14:00", label: "Meeting started", type: "system" },
    { id: "e2", timestamp: "14:10", label: "Analyse plan étage 3", type: "note" },
    { id: "e3", timestamp: "14:30", label: "Modification approuvée", type: "decision" },
  ],
  "room-3": [
    { id: "e1", timestamp: "10:00", label: "Formation débutée", type: "system" },
    { id: "e2", timestamp: "10:15", label: "Module: équipements de protection", type: "note" },
    { id: "e3", timestamp: "10:45", label: "Quiz interactif", type: "note" },
    { id: "e4", timestamp: "11:00", label: "Pause", type: "system" },
    { id: "e5", timestamp: "11:15", label: "Module: procédures d'urgence", type: "note" },
    { id: "e6", timestamp: "11:45", label: "Certification validée", type: "decision" },
  ],
};

// Decision Branches - trajectoires possibles
export const XR_DECISION_BRANCHES: XRDecisionBranch[] = [
  { id: "branch-a", name: "Trajectoire A", color: "#5c6bc0" },
  { id: "branch-b", name: "Trajectoire B", color: "#26a69a" },
  { id: "branch-c", name: "Trajectoire C", color: "#ffa726" },
];

// Decisions par salle
export const XR_DECISIONS: Record<string, XRDecision[]> = {
  "room-1": [
    {
      id: "d1",
      timestamp: 1700000000,
      label: "Reporter livraison béton",
      context: "Retard fournisseur de 2 jours",
      branchId: "branch-a",
    },
    {
      id: "d2",
      timestamp: 1700000100,
      label: "Réaffecter équipe coffreurs",
      context: "Optimiser ressources disponibles",
      branchId: "branch-a",
    },
    {
      id: "d3",
      timestamp: 1700000000,
      label: "Commander béton alternatif",
      context: "Fournisseur secondaire disponible",
      branchId: "branch-b",
    },
    {
      id: "d4",
      timestamp: 1700000150,
      label: "Maintenir planning initial",
      context: "Heures supplémentaires autorisées",
      branchId: "branch-b",
    },
  ],
  "room-2": [
    {
      id: "d1",
      timestamp: 1700001000,
      label: "Modifier structure porteuse",
      context: "Nouvelle charge calculée",
      branchId: "branch-a",
    },
    {
      id: "d2",
      timestamp: 1700001100,
      label: "Ajouter poutre de renfort",
      context: "Solution validée par ingénieur",
      branchId: "branch-a",
    },
    {
      id: "d3",
      timestamp: 1700001000,
      label: "Conserver structure actuelle",
      context: "Marges de sécurité suffisantes",
      branchId: "branch-b",
    },
    {
      id: "d4",
      timestamp: 1700001050,
      label: "Demander contre-expertise",
      context: "Validation externe requise",
      branchId: "branch-c",
    },
  ],
  "room-3": [
    {
      id: "d1",
      timestamp: 1700002000,
      label: "Formation complète obligatoire",
      context: "Tous les employés concernés",
      branchId: "branch-a",
    },
    {
      id: "d2",
      timestamp: 1700002000,
      label: "Formation par équipe",
      context: "Sessions adaptées par métier",
      branchId: "branch-b",
    },
    {
      id: "d3",
      timestamp: 1700002100,
      label: "Certification individuelle",
      context: "Suivi personnalisé",
      branchId: "branch-a",
    },
  ],
};
