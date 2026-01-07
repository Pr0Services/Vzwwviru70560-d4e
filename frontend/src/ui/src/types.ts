/**
 * CHE·NU™ — UI Types Re-export
 * 
 * Ce fichier réexporte les types principaux depuis le dossier types/
 * pour permettre les imports locaux dans ui/src/
 */

// Re-export tout depuis les types principaux
export * from '../../types';

// Re-export les couleurs de marque pour faciliter l'accès
export { 
  CHENU_COLORS, 
  SPHERE_COLORS, 
  SPHERE_ICONS,
  BUREAU_SECTIONS 
} from '../../types';
