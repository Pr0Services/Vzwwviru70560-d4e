/* ═══════════════════════════════════════════════════════════════════════════════
   CHE·NU™ — COMMAND PALETTE INDEX
   Unified Search & Quick Actions System (⌘+K)
   ═══════════════════════════════════════════════════════════════════════════════
   
   USAGE:
   
   import { CommandPalette, useCommandPalette } from '@/components/CommandPalette';
   
   function App() {
     const { isOpen, open, close, recentItems, addToRecent } = useCommandPalette();
     const navigate = useNavigate();
     
     return (
       <>
         <button onClick={open}>⌘K</button>
         <CommandPalette
           isOpen={isOpen}
           onClose={close}
           navigate={navigate}
           recentItems={recentItems}
           locale="fr"
         />
       </>
     );
   }
   
   KEYBOARD SHORTCUTS:
   - ⌘+K / Ctrl+K : Open/close palette
   - ↑↓ : Navigate results
   - Enter : Execute command
   - Tab : Switch category
   - Escape : Close
   
   ═══════════════════════════════════════════════════════════════════════════════ */

// ════════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ════════════════════════════════════════════════════════════════════════════════

export { CommandPalette } from './CommandPalette';
export { default } from './CommandPalette';

// ════════════════════════════════════════════════════════════════════════════════
// HOOKS
// ════════════════════════════════════════════════════════════════════════════════

export { useCommandPalette, useCommandSearch } from './useCommandPalette';

// ════════════════════════════════════════════════════════════════════════════════
// REGISTRY
// ════════════════════════════════════════════════════════════════════════════════

export { CommandRegistry } from './commandRegistry';

// ════════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════════

export type {
  CommandItem,
  CommandCategory,
  CommandPriority,
  CommandGroup,
  SearchResult,
  RecentItem,
  SearchQuery,
  SearchResponse,
  CommandPaletteState,
  CommandPaletteActions,
  KeyboardShortcut,
} from './types';

export { KEYBOARD_SHORTCUTS } from './types';
