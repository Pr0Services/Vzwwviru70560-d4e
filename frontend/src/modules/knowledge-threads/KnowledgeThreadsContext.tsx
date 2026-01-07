import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { KnowledgeThread, KnowledgeThreadsState, ThreadType, ThreadEndpoint, ThreadVisibility, ThreadVisualization } from './types';
import { DEFAULT_VISUALIZATION, THREAD_AGENTS, createThread, unlinkThread } from './presets';

type Action =
  | { type: 'ADD_THREAD'; payload: KnowledgeThread }
  | { type: 'UNLINK_THREAD'; payload: string }
  | { type: 'SELECT_THREAD'; payload: string | null }
  | { type: 'EXPAND_NETWORK'; payload: string }
  | { type: 'COLLAPSE_NETWORK'; payload: string }
  | { type: 'SET_TYPE_FILTER'; payload: ThreadType | null }
  | { type: 'TOGGLE_TYPE_VISIBILITY'; payload: ThreadType }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET' };

const initialState: KnowledgeThreadsState = {
  threads: [],
  visualization: DEFAULT_VISUALIZATION,
  agents: THREAD_AGENTS,
  selected_thread: null,
  expanded_network: [],
  type_filter: null,
  is_loading: false,
  error: null,
};

function reducer(state: KnowledgeThreadsState, action: Action): KnowledgeThreadsState {
  switch (action.type) {
    case 'ADD_THREAD':
      return { ...state, threads: [...state.threads, action.payload] };
    case 'UNLINK_THREAD':
      return { ...state, threads: state.threads.map(t => t.id === action.payload ? unlinkThread(t) : t) };
    case 'SELECT_THREAD':
      return { ...state, selected_thread: action.payload };
    case 'EXPAND_NETWORK':
      return { ...state, expanded_network: [...state.expanded_network, action.payload] };
    case 'COLLAPSE_NETWORK':
      return { ...state, expanded_network: state.expanded_network.filter(id => id !== action.payload) };
    case 'SET_TYPE_FILTER':
      return { ...state, type_filter: action.payload };
    case 'TOGGLE_TYPE_VISIBILITY':
      return { ...state, visualization: { ...state.visualization, type_toggle: { ...state.visualization.type_toggle, [action.payload]: !state.visualization.type_toggle[action.payload] } } };
    case 'SET_LOADING':
      return { ...state, is_loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface ContextValue {
  state: KnowledgeThreadsState;
  addThread: (type: ThreadType, source: ThreadEndpoint, target: ThreadEndpoint, reason: string) => void;
  unlinkThread: (threadId: string) => void;
  selectThread: (threadId: string | null) => void;
  expandNetwork: (threadId: string) => void;
  collapseNetwork: (threadId: string) => void;
  setTypeFilter: (type: ThreadType | null) => void;
  toggleTypeVisibility: (type: ThreadType) => void;
  getFilteredThreads: () => KnowledgeThread[];
  getConnectedThreads: (objectId: string) => KnowledgeThread[];
  reset: () => void;
}

const Context = createContext<ContextValue | null>(null);

export function KnowledgeThreadsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addThreadFn = useCallback((type: ThreadType, source: ThreadEndpoint, target: ThreadEndpoint, reason: string) => {
    try {
      const thread = createThread(type, source, target, reason, 'current_user');
      dispatch({ type: 'ADD_THREAD', payload: thread });
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: (e as Error).message });
    }
  }, []);

  const unlinkThreadFn = useCallback((threadId: string) => {
    dispatch({ type: 'UNLINK_THREAD', payload: threadId });
  }, []);

  const selectThreadFn = useCallback((threadId: string | null) => {
    dispatch({ type: 'SELECT_THREAD', payload: threadId });
  }, []);

  const expandNetworkFn = useCallback((threadId: string) => {
    dispatch({ type: 'EXPAND_NETWORK', payload: threadId });
  }, []);

  const collapseNetworkFn = useCallback((threadId: string) => {
    dispatch({ type: 'COLLAPSE_NETWORK', payload: threadId });
  }, []);

  const setTypeFilterFn = useCallback((type: ThreadType | null) => {
    dispatch({ type: 'SET_TYPE_FILTER', payload: type });
  }, []);

  const toggleTypeVisibilityFn = useCallback((type: ThreadType) => {
    dispatch({ type: 'TOGGLE_TYPE_VISIBILITY', payload: type });
  }, []);

  const getFilteredThreadsFn = useCallback(() => {
    let threads = state.threads.filter(t => !t.unlinked);
    if (state.type_filter) threads = threads.filter(t => t.type === state.type_filter);
    threads = threads.filter(t => state.visualization.type_toggle[t.type]);
    return threads;
  }, [state.threads, state.type_filter, state.visualization.type_toggle]);

  const getConnectedThreadsFn = useCallback((objectId: string) => {
    return state.threads.filter(t => !t.unlinked && (t.source.id === objectId || t.target.id === objectId));
  }, [state.threads]);

  const resetFn = useCallback(() => { dispatch({ type: 'RESET' }); }, []);

  return (
    <Context.Provider value={{
      state, addThread: addThreadFn, unlinkThread: unlinkThreadFn, selectThread: selectThreadFn,
      expandNetwork: expandNetworkFn, collapseNetwork: collapseNetworkFn, setTypeFilter: setTypeFilterFn,
      toggleTypeVisibility: toggleTypeVisibilityFn, getFilteredThreads: getFilteredThreadsFn,
      getConnectedThreads: getConnectedThreadsFn, reset: resetFn,
    }}>
      {children}
    </Context.Provider>
  );
}

export function useKnowledgeThreads() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('useKnowledgeThreads must be used within provider');
  return ctx;
}

export { Context as KnowledgeThreadsContext };
