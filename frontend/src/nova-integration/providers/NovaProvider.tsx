// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU™ — NOVA PROVIDER
// Provider React principal pour l'intégration Nova dans le frontend CHE·NU
// ═══════════════════════════════════════════════════════════════════════════════

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';

// Import Nova System
import { NovaService } from '../nova/NovaService';
import { NovaIntentDetector } from '../nova/engines/NovaIntentDetector';
import { NovaKnowledgeEngine } from '../nova/engines/NovaKnowledgeEngine';
import { NovaResponseGenerator } from '../nova/engines/NovaResponseGenerator';
import { NovaTutorialEngine } from '../nova/engines/NovaTutorialEngine';
import { NovaQuestionEngine } from '../nova/engines/NovaQuestionEngine';
import { NovaProactiveEngine } from '../nova/engines/NovaProactiveEngine';
import { NovaMLIntegration } from '../nova/integration/NovaMLIntegration';

import type {
  NovaContext,
  NovaMessage,
  NovaUser,
  NovaSphere,
  NovaSection,
} from '../nova/types/nova.types';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export interface NovaProviderState {
  // UI State
  isOpen: boolean;
  isMinimized: boolean;
  isLoading: boolean;
  isListening: boolean;
  
  // Context
  context: NovaContext;
  
  // Conversation
  messages: NovaMessage[];
  currentConversationId: string | null;
  
  // Features
  activeTutorial: string | null;
  tutorialStep: number;
  activeQuestion: string | null;
  suggestions: unknown[];
  
  // Settings
  settings: NovaSettings;
}

export interface NovaSettings {
  language: 'fr' | 'en';
  tone: 'friendly' | 'professional' | 'balanced';
  proactiveEnabled: boolean;
  tutorialsEnabled: boolean;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
}

type NovaAction =
  | { type: 'OPEN_NOVA' }
  | { type: 'CLOSE_NOVA' }
  | { type: 'TOGGLE_NOVA' }
  | { type: 'MINIMIZE_NOVA' }
  | { type: 'MAXIMIZE_NOVA' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_LISTENING'; payload: boolean }
  | { type: 'UPDATE_CONTEXT'; payload: Partial<NovaContext> }
  | { type: 'SET_SPHERE'; payload: NovaSphere }
  | { type: 'SET_SECTION'; payload: NovaSection }
  | { type: 'SET_USER'; payload: NovaUser }
  | { type: 'ADD_MESSAGE'; payload: NovaMessage }
  | { type: 'UPDATE_MESSAGE'; payload: { id: string; updates: Partial<NovaMessage> } }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'START_TUTORIAL'; payload: string }
  | { type: 'NEXT_TUTORIAL_STEP' }
  | { type: 'PREV_TUTORIAL_STEP' }
  | { type: 'END_TUTORIAL' }
  | { type: 'SET_ACTIVE_QUESTION'; payload: string | null }
  | { type: 'SET_SUGGESTIONS'; payload: unknown[] }
  | { type: 'DISMISS_SUGGESTION'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<NovaSettings> };

export interface NovaContextValue {
  // State
  state: NovaProviderState;
  
  // Services
  novaService: NovaService;
  intentDetector: NovaIntentDetector;
  knowledgeEngine: NovaKnowledgeEngine;
  responseGenerator: NovaResponseGenerator;
  tutorialEngine: NovaTutorialEngine;
  questionEngine: NovaQuestionEngine;
  proactiveEngine: NovaProactiveEngine;
  mlIntegration: NovaMLIntegration;
  
  // Actions - UI
  openNova: () => void;
  closeNova: () => void;
  toggleNova: () => void;
  minimizeNova: () => void;
  maximizeNova: () => void;
  
  // Actions - Messages
  sendMessage: (content: string) => Promise<NovaMessage>;
  clearMessages: () => void;
  
  // Actions - Context
  setSphere: (sphere: NovaSphere) => void;
  setSection: (section: NovaSection) => void;
  setUser: (user: NovaUser) => void;
  
  // Actions - Tutorials
  startTutorial: (tutorialId: string) => void;
  nextTutorialStep: () => void;
  prevTutorialStep: () => void;
  endTutorial: () => void;
  skipTutorial: () => void;
  
  // Actions - Questions
  answerQuestion: (answer: unknown) => void;
  skipQuestion: () => void;
  
  // Actions - Suggestions
  acceptSuggestion: (id: string) => void;
  dismissSuggestion: (id: string) => void;
  
  // Actions - Settings
  updateSettings: (settings: Partial<NovaSettings>) => void;
  
  // Actions - Navigation
  navigateToSphere: (sphereId: string) => void;
  navigateToSection: (sectionId: string) => void;
  executeAction: (action: string, params?: unknown) => void;
  
  // Actions - Feedback
  submitFeedback: (messageId: string, type: 'positive' | 'negative', reason?: string) => void;
  submitCorrection: (messageId: string, correction: string) => void;
}

// ─────────────────────────────────────────────────────────────────────────────────
// INITIAL STATE
// ─────────────────────────────────────────────────────────────────────────────────

const initialSettings: NovaSettings = {
  language: 'fr',
  tone: 'friendly',
  proactiveEnabled: true,
  tutorialsEnabled: true,
  soundEnabled: true,
  voiceEnabled: false,
  theme: 'system',
};

const initialState: NovaProviderState = {
  isOpen: false,
  isMinimized: false,
  isLoading: false,
  isListening: false,
  context: {
    user: null,
    sphere: null,
    section: null,
    session: {
      id: `session_${Date.now()}`,
      startedAt: new Date(),
    },
  },
  messages: [],
  currentConversationId: null,
  activeTutorial: null,
  tutorialStep: 0,
  activeQuestion: null,
  suggestions: [],
  settings: initialSettings,
};

// ─────────────────────────────────────────────────────────────────────────────────
// REDUCER
// ─────────────────────────────────────────────────────────────────────────────────

function novaReducer(state: NovaProviderState, action: NovaAction): NovaProviderState {
  switch (action.type) {
    case 'OPEN_NOVA':
      return { ...state, isOpen: true, isMinimized: false };
    
    case 'CLOSE_NOVA':
      return { ...state, isOpen: false };
    
    case 'TOGGLE_NOVA':
      return { ...state, isOpen: !state.isOpen, isMinimized: false };
    
    case 'MINIMIZE_NOVA':
      return { ...state, isMinimized: true };
    
    case 'MAXIMIZE_NOVA':
      return { ...state, isMinimized: false };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_LISTENING':
      return { ...state, isListening: action.payload };
    
    case 'UPDATE_CONTEXT':
      return { ...state, context: { ...state.context, ...action.payload } };
    
    case 'SET_SPHERE':
      return { 
        ...state, 
        context: { ...state.context, sphere: action.payload } 
      };
    
    case 'SET_SECTION':
      return { 
        ...state, 
        context: { ...state.context, section: action.payload } 
      };
    
    case 'SET_USER':
      return { 
        ...state, 
        context: { ...state.context, user: action.payload } 
      };
    
    case 'ADD_MESSAGE':
      return { 
        ...state, 
        messages: [...state.messages, action.payload] 
      };
    
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(m => 
          m.id === action.payload.id 
            ? { ...m, ...action.payload.updates }
            : m
        ),
      };
    
    case 'CLEAR_MESSAGES':
      return { ...state, messages: [] };
    
    case 'START_TUTORIAL':
      return { 
        ...state, 
        activeTutorial: action.payload, 
        tutorialStep: 0 
      };
    
    case 'NEXT_TUTORIAL_STEP':
      return { ...state, tutorialStep: state.tutorialStep + 1 };
    
    case 'PREV_TUTORIAL_STEP':
      return { ...state, tutorialStep: Math.max(0, state.tutorialStep - 1) };
    
    case 'END_TUTORIAL':
      return { 
        ...state, 
        activeTutorial: null, 
        tutorialStep: 0 
      };
    
    case 'SET_ACTIVE_QUESTION':
      return { ...state, activeQuestion: action.payload };
    
    case 'SET_SUGGESTIONS':
      return { ...state, suggestions: action.payload };
    
    case 'DISMISS_SUGGESTION':
      return {
        ...state,
        suggestions: state.suggestions.filter(s => s.id !== action.payload),
      };
    
    case 'UPDATE_SETTINGS':
      return { 
        ...state, 
        settings: { ...state.settings, ...action.payload } 
      };
    
    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────────────────────────────────

const NovaReactContext = createContext<NovaContextValue | null>(null);

// ─────────────────────────────────────────────────────────────────────────────────
// PROVIDER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

interface NovaProviderProps {
  children: ReactNode;
  user?: NovaUser;
  initialSphere?: NovaSphere;
  apiEndpoint?: string;
  onNavigate?: (target: { type: 'sphere' | 'section'; id: string }) => void;
  onAction?: (action: string, params?: unknown) => void;
}

export function NovaProvider({
  children,
  user,
  initialSphere,
  apiEndpoint,
  onNavigate,
  onAction,
}: NovaProviderProps) {
  const [state, dispatch] = useReducer(novaReducer, {
    ...initialState,
    context: {
      ...initialState.context,
      user: user || null,
      sphere: initialSphere || null,
    },
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // INITIALIZE SERVICES
  // ═══════════════════════════════════════════════════════════════════════════
  
  const services = useMemo(() => {
    const intentDetector = new NovaIntentDetector();
    const knowledgeEngine = new NovaKnowledgeEngine();
    const responseGenerator = new NovaResponseGenerator();
    const tutorialEngine = new NovaTutorialEngine();
    const questionEngine = new NovaQuestionEngine();
    const proactiveEngine = new NovaProactiveEngine();
    
    const novaService = new NovaService({
      userId: user?.id || 'anonymous',
      language: state.settings.language,
      debug: process.env.NODE_ENV === 'development',
    });
    
    const mlIntegration = new NovaMLIntegration(novaService, {
      enableLogging: true,
      minFeedbackForTraining: 100,
    });
    
    return {
      novaService,
      intentDetector,
      knowledgeEngine,
      responseGenerator,
      tutorialEngine,
      questionEngine,
      proactiveEngine,
      mlIntegration,
    };
  }, [user?.id, state.settings.language]);

  // ═══════════════════════════════════════════════════════════════════════════
  // KEYBOARD SHORTCUTS
  // ═══════════════════════════════════════════════════════════════════════════
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // "/" pour ouvrir Nova
      if (e.key === '/' && !state.isOpen && !isInputFocused()) {
        e.preventDefault();
        dispatch({ type: 'OPEN_NOVA' });
      }
      
      // Escape pour fermer Nova
      if (e.key === 'Escape' && state.isOpen) {
        dispatch({ type: 'CLOSE_NOVA' });
      }
      
      // Cmd/Ctrl + K pour Nova (alternative)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        dispatch({ type: 'TOGGLE_NOVA' });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.isOpen]);

  // ═══════════════════════════════════════════════════════════════════════════
  // PROACTIVE SUGGESTIONS
  // ═══════════════════════════════════════════════════════════════════════════
  
  useEffect(() => {
    if (!state.settings.proactiveEnabled) return;
    
    const checkSuggestions = () => {
      const suggestions = services.proactiveEngine.evaluate(
        user?.id || 'anonymous',
        state.context,
        state.settings.language
      );
      
      if (suggestions.length > 0) {
        dispatch({ type: 'SET_SUGGESTIONS', payload: suggestions });
      }
    };
    
    // Vérifier toutes les 30 secondes
    const interval = setInterval(checkSuggestions, 30000);
    
    return () => clearInterval(interval);
  }, [state.settings.proactiveEnabled, state.context, user?.id]);

  // ═══════════════════════════════════════════════════════════════════════════
  // ACTIONS
  // ═══════════════════════════════════════════════════════════════════════════
  
  const openNova = useCallback(() => {
    dispatch({ type: 'OPEN_NOVA' });
  }, []);
  
  const closeNova = useCallback(() => {
    dispatch({ type: 'CLOSE_NOVA' });
  }, []);
  
  const toggleNova = useCallback(() => {
    dispatch({ type: 'TOGGLE_NOVA' });
  }, []);
  
  const minimizeNova = useCallback(() => {
    dispatch({ type: 'MINIMIZE_NOVA' });
  }, []);
  
  const maximizeNova = useCallback(() => {
    dispatch({ type: 'MAXIMIZE_NOVA' });
  }, []);
  
  const sendMessage = useCallback(async (content: string): Promise<NovaMessage> => {
    // Ajouter le message utilisateur
    const userMessage: NovaMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Traiter avec NovaService
      const response = await services.novaService.processMessage(content, state.context);
      
      // Ajouter la réponse Nova
      const novaMessage: NovaMessage = {
        id: `msg_${Date.now()}_nova`,
        role: 'assistant',
        content: response.text,
        timestamp: new Date(),
        metadata: {
          intent: response.intent,
          confidence: response.confidence,
          actions: response.actions,
        },
      };
      dispatch({ type: 'ADD_MESSAGE', payload: novaMessage });
      
      // Logger pour ML
      services.mlIntegration.logConversation(
        userMessage,
        novaMessage,
        state.context
      );
      
      // Exécuter les actions si présentes
      if (response.actions && response.actions.length > 0) {
        for (const action of response.actions) {
          executeAction(action.type, action.data);
        }
      }
      
      return novaMessage;
    } catch (error) {
      logger.error('[Nova] Error processing message:', error);
      
      const errorMessage: NovaMessage = {
        id: `msg_${Date.now()}_error`,
        role: 'assistant',
        content: state.settings.language === 'fr'
          ? "Oups, j'ai eu un problème. Peux-tu reformuler?"
          : "Oops, I had a problem. Can you rephrase?",
        timestamp: new Date(),
        metadata: { error: true },
      };
      dispatch({ type: 'ADD_MESSAGE', payload: errorMessage });
      
      return errorMessage;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.context, state.settings.language, services]);
  
  const clearMessages = useCallback(() => {
    dispatch({ type: 'CLEAR_MESSAGES' });
  }, []);
  
  const setSphere = useCallback((sphere: NovaSphere) => {
    dispatch({ type: 'SET_SPHERE', payload: sphere });
    services.proactiveEngine.recordAction(user?.id || 'anonymous', `sphere_switch_${sphere.id}`);
  }, [services, user?.id]);
  
  const setSection = useCallback((section: NovaSection) => {
    dispatch({ type: 'SET_SECTION', payload: section });
    services.proactiveEngine.recordAction(user?.id || 'anonymous', `section_enter_${section.id}`);
  }, [services, user?.id]);
  
  const setUser = useCallback((newUser: NovaUser) => {
    dispatch({ type: 'SET_USER', payload: newUser });
  }, []);
  
  const startTutorial = useCallback((tutorialId: string) => {
    dispatch({ type: 'START_TUTORIAL', payload: tutorialId });
    services.tutorialEngine.startTutorial(user?.id || 'anonymous', tutorialId);
  }, [services, user?.id]);
  
  const nextTutorialStep = useCallback(() => {
    dispatch({ type: 'NEXT_TUTORIAL_STEP' });
    services.tutorialEngine.nextStep(user?.id || 'anonymous');
  }, [services, user?.id]);
  
  const prevTutorialStep = useCallback(() => {
    dispatch({ type: 'PREV_TUTORIAL_STEP' });
    services.tutorialEngine.previousStep(user?.id || 'anonymous');
  }, [services, user?.id]);
  
  const endTutorial = useCallback(() => {
    dispatch({ type: 'END_TUTORIAL' });
    services.tutorialEngine.completeTutorial(user?.id || 'anonymous');
  }, [services, user?.id]);
  
  const skipTutorial = useCallback(() => {
    dispatch({ type: 'END_TUTORIAL' });
    services.tutorialEngine.skipTutorial(user?.id || 'anonymous');
  }, [services, user?.id]);
  
  const answerQuestion = useCallback((answer: unknown) => {
    if (state.activeQuestion) {
      // Handle question answer
      dispatch({ type: 'SET_ACTIVE_QUESTION', payload: null });
    }
  }, [state.activeQuestion]);
  
  const skipQuestion = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_QUESTION', payload: null });
  }, []);
  
  const acceptSuggestion = useCallback((id: string) => {
    const suggestion = state.suggestions.find(s => s.id === id);
    if (suggestion?.action) {
      suggestion.action.onClick();
    }
    dispatch({ type: 'DISMISS_SUGGESTION', payload: id });
  }, [state.suggestions]);
  
  const dismissSuggestion = useCallback((id: string) => {
    dispatch({ type: 'DISMISS_SUGGESTION', payload: id });
    services.proactiveEngine.dismissSuggestion(user?.id || 'anonymous', id);
  }, [services, user?.id]);
  
  const updateSettings = useCallback((settings: Partial<NovaSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  }, []);
  
  const navigateToSphere = useCallback((sphereId: string) => {
    onNavigate?.({ type: 'sphere', id: sphereId });
  }, [onNavigate]);
  
  const navigateToSection = useCallback((sectionId: string) => {
    onNavigate?.({ type: 'section', id: sectionId });
  }, [onNavigate]);
  
  const executeAction = useCallback((action: string, params?: unknown) => {
    onAction?.(action, params);
    services.proactiveEngine.recordAction(user?.id || 'anonymous', action);
  }, [onAction, services, user?.id]);
  
  const submitFeedback = useCallback((
    messageId: string,
    type: 'positive' | 'negative',
    reason?: string
  ) => {
    services.mlIntegration.submitFeedback({
      messageId,
      conversationId: state.currentConversationId || 'unknown',
      type: type === 'positive' ? 'thumbs_up' : 'thumbs_down',
      reason,
      timestamp: new Date(),
    });
  }, [services, state.currentConversationId]);
  
  const submitCorrection = useCallback((messageId: string, correction: string) => {
    services.mlIntegration.submitCorrection({
      messageId,
      conversationId: state.currentConversationId || 'unknown',
      type: 'correction',
      correction,
      timestamp: new Date(),
    });
  }, [services, state.currentConversationId]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CONTEXT VALUE
  // ═══════════════════════════════════════════════════════════════════════════
  
  const contextValue = useMemo<NovaContextValue>(() => ({
    state,
    ...services,
    openNova,
    closeNova,
    toggleNova,
    minimizeNova,
    maximizeNova,
    sendMessage,
    clearMessages,
    setSphere,
    setSection,
    setUser,
    startTutorial,
    nextTutorialStep,
    prevTutorialStep,
    endTutorial,
    skipTutorial,
    answerQuestion,
    skipQuestion,
    acceptSuggestion,
    dismissSuggestion,
    updateSettings,
    navigateToSphere,
    navigateToSection,
    executeAction,
    submitFeedback,
    submitCorrection,
  }), [
    state,
    services,
    openNova,
    closeNova,
    toggleNova,
    minimizeNova,
    maximizeNova,
    sendMessage,
    clearMessages,
    setSphere,
    setSection,
    setUser,
    startTutorial,
    nextTutorialStep,
    prevTutorialStep,
    endTutorial,
    skipTutorial,
    answerQuestion,
    skipQuestion,
    acceptSuggestion,
    dismissSuggestion,
    updateSettings,
    navigateToSphere,
    navigateToSection,
    executeAction,
    submitFeedback,
    submitCorrection,
  ]);

  return (
    <NovaReactContext.Provider value={contextValue}>
      {children}
    </NovaReactContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────────────────────────────

export function useNovaContext(): NovaContextValue {
  const context = useContext(NovaReactContext);
  if (!context) {
    throw new Error('useNovaContext must be used within a NovaProvider');
  }
  return context;
}

// Helper hook for common operations
export function useNovaChatbot() {
  const { state, openNova, closeNova, sendMessage, clearMessages } = useNovaContext();
  
  return {
    isOpen: state.isOpen,
    isLoading: state.isLoading,
    messages: state.messages,
    open: openNova,
    close: closeNova,
    send: sendMessage,
    clear: clearMessages,
  };
}

// Helper hook for tutorials
export function useNovaTutorials() {
  const { 
    state, 
    tutorialEngine, 
    startTutorial, 
    nextTutorialStep, 
    prevTutorialStep, 
    endTutorial,
    skipTutorial,
  } = useNovaContext();
  
  const tutorial = state.activeTutorial 
    ? tutorialEngine.getTutorial(state.activeTutorial)
    : null;
  
  return {
    isActive: !!state.activeTutorial,
    tutorial,
    currentStep: state.tutorialStep,
    start: startTutorial,
    next: nextTutorialStep,
    prev: prevTutorialStep,
    complete: endTutorial,
    skip: skipTutorial,
  };
}

// Helper hook for suggestions
export function useNovaSuggestions() {
  const { state, acceptSuggestion, dismissSuggestion } = useNovaContext();
  
  return {
    suggestions: state.suggestions,
    accept: acceptSuggestion,
    dismiss: dismissSuggestion,
  };
}

// ─────────────────────────────────────────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────────────────────────────────────────

function isInputFocused(): boolean {
  const active = document.activeElement;
  return (
    active instanceof HTMLInputElement ||
    active instanceof HTMLTextAreaElement ||
    (active instanceof HTMLElement && active.isContentEditable)
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────────

export default NovaProvider;
