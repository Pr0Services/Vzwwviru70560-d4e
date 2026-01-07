/**
 * CHE·NU - Navigation Reducer
 */

import { NavigationState, NavigationAction } from './types';

export const initialNavigationState: NavigationState = {
  currentPath: '/',
  history: ['/'],
  canGoBack: false,
  canGoForward: false,
};

export const navigationReducer = (
  state: NavigationState,
  action: NavigationAction
): NavigationState => {
  switch (action.type) {
    case 'PUSH':
      return {
        ...state,
        currentPath: action.payload || state.currentPath,
        history: [...state.history, action.payload || ''],
        canGoBack: true,
        canGoForward: false,
      };
    case 'POP':
    case 'GO_BACK':
      if (state.history.length <= 1) return state;
      const newHistory = state.history.slice(0, -1);
      return {
        ...state,
        currentPath: newHistory[newHistory.length - 1],
        history: newHistory,
        canGoBack: newHistory.length > 1,
        canGoForward: true,
      };
    case 'REPLACE':
      return {
        ...state,
        currentPath: action.payload || state.currentPath,
        history: [...state.history.slice(0, -1), action.payload || ''],
      };
    default:
      return state;
  }
};

export default navigationReducer;
