/**
 * CHE·NU™ — Core Components Index
 * 
 * Architecture canonique DASHBOARD vs BUREAU
 */

// Architecture
export * from '../architecture/dashboard-bureau.architecture';

// Components
export { CommandCenter } from './CommandCenter';
export { Workdesk } from './Workdesk';

// Default export
export default {
  CommandCenter: () => import('./CommandCenter'),
  Workdesk: () => import('./Workdesk'),
};
