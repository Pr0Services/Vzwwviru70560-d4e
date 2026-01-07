/* ═══════════════════════════════════════════════════════════════════════════════
   CHE·NU™ — NOTIFICATION CENTER INDEX
   Centralized notification management system
   ═══════════════════════════════════════════════════════════════════════════════
   
   USAGE:
   
   import { 
     NotificationCenter, 
     NotificationBell, 
     useNotifications 
   } from '@/components/NotificationCenter';
   
   function App() {
     const { 
       notifications, 
       unreadCount, 
       isOpen, 
       open, 
       close,
       markAsRead,
       markAllAsRead,
       dismiss,
       archiveAll,
       notify 
     } = useNotifications();
     
     // Add a notification
     notify.success('Task completed', 'Your task has been saved');
     notify.agent('DataAnalyzer', 'Analysis complete: 15 insights found');
     notify.meeting('Standup in 5 minutes', 'Daily standup with team');
     
     return (
       <>
         <NotificationBell unreadCount={unreadCount} onClick={open} />
         <NotificationCenter
           isOpen={isOpen}
           onClose={close}
           notifications={notifications}
           onMarkAsRead={markAsRead}
           onMarkAllAsRead={markAllAsRead}
           onDismiss={dismiss}
           onArchiveAll={archiveAll}
           locale="fr"
         />
       </>
     );
   }
   
   ═══════════════════════════════════════════════════════════════════════════════ */

// ════════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ════════════════════════════════════════════════════════════════════════════════

export { NotificationCenter, NotificationBell } from './NotificationCenter';
export { default } from './NotificationCenter';

// ════════════════════════════════════════════════════════════════════════════════
// HOOKS
// ════════════════════════════════════════════════════════════════════════════════

export { useNotifications } from './useNotifications';

// ════════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════════

export type {
  Notification,
  NotificationType,
  NotificationPriority,
  NotificationStatus,
  NotificationAction,
  NotificationGroup,
  NotificationPreferences,
  NotificationFilter,
  NotificationState,
  NotificationActions,
} from './types';

// ════════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ════════════════════════════════════════════════════════════════════════════════

export { 
  NOTIFICATION_ICONS, 
  NOTIFICATION_COLORS,
  DEFAULT_PREFERENCES,
} from './types';
