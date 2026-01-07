/**
 * CHE·NU™ — ENHANCED MEETING MODULE
 * 
 * ════════════════════════════════════════════════════════════════════════════
 * Salle de réunion collaborative style salle de classe
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * FEATURES:
 * ✅ Shared Meeting Database
 * ✅ Document Sharing (All & 1-to-1)
 * ✅ Document Re-sharing Chain
 * ✅ Floor Control (Take/Give Speaker)
 * ✅ Presenter Mode (Classroom Style)
 * ✅ Collaborative Workspace/Whiteboard
 * ✅ Multi-Platform (Web, Desktop, Mobile, VR)
 * ✅ Parallel Platform Usage
 * ✅ Recording & AI Transcription
 * ✅ Polls & Action Items
 */

export {
  EnhancedMeetingRoomService,
  enhancedMeetingRoom
} from './enhancedMeetingRoom';

export type {
  // Core Types
  Meeting,
  MeetingStatus,
  MeetingParticipant,
  ParticipantRole,
  ParticipantPlatform,
  MeetingSettings,
  MeetingEvent,
  MeetingEventType,
  
  // Floor Control
  FloorControlSettings,
  FloorControlMode,
  
  // Shared Database
  MeetingDatabase,
  SharedDocument,
  DocumentPermission,
  ImportedData,
  QuickNote,
  SharedLink,
  Poll,
  ActionItem,
  DatabaseAccessSettings,
  
  // Workspace
  SharedWorkspace,
  WorkspaceView,
  WorkspacePage,
  WorkspaceElement,
  WorkspaceTool,
  WorkspacePermissions,
  CursorPosition,
  
  // Recording & Transcription
  RecordingSettings,
  MeetingTranscription,
  TranscriptionSegment,
  
  // Multi-Platform
  PlatformConnection,
  PlatformCapabilities
} from './enhancedMeetingRoom';

import { enhancedMeetingRoom } from './enhancedMeetingRoom';

// ═══════════════════════════════════════════════════════════════════════════
// MEETING API
// ═══════════════════════════════════════════════════════════════════════════

/**
 * API complète pour les meetings CHE·NU
 */
export const MeetingAPI = {
  // ─────────────────────────────────────────────────────────────────────────
  // LIFECYCLE
  // ─────────────────────────────────────────────────────────────────────────
  
  /** Créer un meeting */
  create: enhancedMeetingRoom.createMeeting.bind(enhancedMeetingRoom),
  
  /** Démarrer un meeting */
  start: enhancedMeetingRoom.startMeeting.bind(enhancedMeetingRoom),
  
  /** Terminer un meeting */
  end: enhancedMeetingRoom.endMeeting.bind(enhancedMeetingRoom),
  
  /** Obtenir un meeting */
  get: enhancedMeetingRoom.getMeeting.bind(enhancedMeetingRoom),
  
  // ─────────────────────────────────────────────────────────────────────────
  // PARTICIPANTS
  // ─────────────────────────────────────────────────────────────────────────
  
  participants: {
    /** Joindre un meeting */
    join: enhancedMeetingRoom.joinMeeting.bind(enhancedMeetingRoom),
    
    /** Quitter un meeting */
    leave: enhancedMeetingRoom.leaveMeeting.bind(enhancedMeetingRoom),
    
    /** Admettre depuis la salle d'attente */
    admit: enhancedMeetingRoom.admitFromWaitingRoom.bind(enhancedMeetingRoom),
    
    /** Changer le rôle */
    changeRole: enhancedMeetingRoom.changeParticipantRole.bind(enhancedMeetingRoom)
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // FLOOR CONTROL (Speaker Management)
  // ─────────────────────────────────────────────────────────────────────────
  
  floor: {
    /** Lever la main */
    raiseHand: enhancedMeetingRoom.raiseHand.bind(enhancedMeetingRoom),
    
    /** Baisser la main */
    lowerHand: enhancedMeetingRoom.lowerHand.bind(enhancedMeetingRoom),
    
    /** Prendre la parole */
    take: enhancedMeetingRoom.takeFloor.bind(enhancedMeetingRoom),
    
    /** Donner la parole à quelqu'un */
    give: enhancedMeetingRoom.giveFloor.bind(enhancedMeetingRoom),
    
    /** Libérer la parole */
    release: enhancedMeetingRoom.releaseFloor.bind(enhancedMeetingRoom),
    
    /** Activer le mode présentateur */
    enablePresenter: enhancedMeetingRoom.enablePresenterMode.bind(enhancedMeetingRoom),
    
    /** Désactiver le mode présentateur */
    disablePresenter: enhancedMeetingRoom.disablePresenterMode.bind(enhancedMeetingRoom)
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // DOCUMENT SHARING
  // ─────────────────────────────────────────────────────────────────────────
  
  documents: {
    /** Partager avec tous */
    shareWithAll: enhancedMeetingRoom.shareDocumentWithAll.bind(enhancedMeetingRoom),
    
    /** Partager avec un participant (1-à-1) */
    shareWithOne: enhancedMeetingRoom.shareDocumentWithParticipant.bind(enhancedMeetingRoom),
    
    /** Re-partager un document reçu */
    reshare: enhancedMeetingRoom.reshareDocument.bind(enhancedMeetingRoom),
    
    /** Présenter sur le workspace */
    present: enhancedMeetingRoom.presentDocumentOnWorkspace.bind(enhancedMeetingRoom)
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // DATA IMPORT
  // ─────────────────────────────────────────────────────────────────────────
  
  data: {
    /** Importer des données */
    import: enhancedMeetingRoom.importData.bind(enhancedMeetingRoom),
    
    /** Partager toutes ses données */
    shareAll: enhancedMeetingRoom.shareAllImportedData.bind(enhancedMeetingRoom)
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // WORKSPACE
  // ─────────────────────────────────────────────────────────────────────────
  
  workspace: {
    /** Ajouter un élément */
    addElement: enhancedMeetingRoom.addWorkspaceElement.bind(enhancedMeetingRoom),
    
    /** Mettre à jour le curseur */
    updateCursor: enhancedMeetingRoom.updateCursor.bind(enhancedMeetingRoom),
    
    /** Créer une page */
    createPage: enhancedMeetingRoom.createWorkspacePage.bind(enhancedMeetingRoom),
    
    /** Naviguer vers une page */
    navigateTo: enhancedMeetingRoom.navigateToPage.bind(enhancedMeetingRoom)
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // POLLS & ACTION ITEMS
  // ─────────────────────────────────────────────────────────────────────────
  
  polls: {
    /** Créer un sondage */
    create: enhancedMeetingRoom.createPoll.bind(enhancedMeetingRoom),
    
    /** Voter */
    vote: enhancedMeetingRoom.votePoll.bind(enhancedMeetingRoom)
  },
  
  actions: {
    /** Créer un action item */
    create: enhancedMeetingRoom.createActionItem.bind(enhancedMeetingRoom)
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // RECORDING
  // ─────────────────────────────────────────────────────────────────────────
  
  recording: {
    /** Démarrer l'enregistrement */
    start: enhancedMeetingRoom.startRecording.bind(enhancedMeetingRoom),
    
    /** Arrêter l'enregistrement */
    stop: enhancedMeetingRoom.stopRecording.bind(enhancedMeetingRoom),
    
    /** Ajouter un segment de transcription */
    addTranscription: enhancedMeetingRoom.addTranscriptionSegment.bind(enhancedMeetingRoom)
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // AI
  // ─────────────────────────────────────────────────────────────────────────
  
  ai: {
    /** Générer un résumé */
    generateSummary: enhancedMeetingRoom.generateAISummary.bind(enhancedMeetingRoom)
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // EVENTS
  // ─────────────────────────────────────────────────────────────────────────
  
  /** S'abonner aux événements */
  subscribe: enhancedMeetingRoom.subscribeToEvents.bind(enhancedMeetingRoom),
  
  /** Obtenir les connexions plateforme d'un user */
  getPlatformConnections: enhancedMeetingRoom.getUserPlatformConnections.bind(enhancedMeetingRoom),
  
  /** Rapport de capacités */
  getCapabilities: enhancedMeetingRoom.getCapabilityReport.bind(enhancedMeetingRoom)
};

// ═══════════════════════════════════════════════════════════════════════════
// QUICK START EXAMPLES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Exemples d'utilisation rapide
 * 
 * @example
 * ```typescript
 * // 1. Créer un meeting
 * const meeting = MeetingAPI.create({
 *   title: "Sprint Review",
 *   sphereId: "business",
 *   hostId: "user-123",
 *   scheduledStart: new Date(),
 *   scheduledEnd: new Date(Date.now() + 3600000),
 *   floorControlMode: 'raise-hand'
 * });
 * 
 * // 2. Démarrer le meeting
 * MeetingAPI.start(meeting.id, "user-123");
 * 
 * // 3. Participant rejoint depuis mobile
 * MeetingAPI.participants.join(meeting.id, "user-456", "mobile-ios", {
 *   name: "Jean Dupont",
 *   email: "jean@example.com"
 * });
 * 
 * // 4. Partager un document avec tous
 * MeetingAPI.documents.shareWithAll(meeting.id, "user-123", "doc-789", {
 *   name: "Présentation Q4.pptx",
 *   type: "presentation",
 *   size: 2500000
 * }, "view", true);
 * 
 * // 5. Présenter le document sur le workspace
 * MeetingAPI.documents.present(meeting.id, "user-123", "shared-xxx");
 * 
 * // 6. Participant lève la main
 * MeetingAPI.floor.raiseHand(meeting.id, "user-456");
 * 
 * // 7. Host donne la parole
 * MeetingAPI.floor.give(meeting.id, "user-123", "user-456");
 * 
 * // 8. Partager un document 1-à-1
 * MeetingAPI.documents.shareWithOne(meeting.id, "user-456", "user-789", "doc-999", {
 *   name: "Contrat confidentiel.pdf",
 *   type: "pdf",
 *   size: 500000
 * }, "edit", false);  // No resharing allowed
 * 
 * // 9. Créer un sondage
 * MeetingAPI.polls.create(meeting.id, "user-123", "Quelle date pour le prochain meeting?", [
 *   "Lundi 10h",
 *   "Mardi 14h",
 *   "Mercredi 9h"
 * ], { anonymous: true });
 * 
 * // 10. Générer le résumé AI
 * const summary = await MeetingAPI.ai.generateSummary(meeting.id);
 * ```
 */

export default MeetingAPI;
