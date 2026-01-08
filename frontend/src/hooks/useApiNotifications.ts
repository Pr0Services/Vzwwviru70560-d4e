/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V75 — API NOTIFICATIONS HOOK                      ║
 * ║                                                                              ║
 * ║  Auto-notify on API mutations success/error                                   ║
 * ║  GOUVERNANCE > EXÉCUTION                                                     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { useToast } from '../components/toast/ToastProvider';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface NotificationMessages {
  loading?: string;
  success: string;
  error?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export function useApiNotifications() {
  const toast = useToast();

  /**
   * Wrap a mutation with automatic notifications
   */
  const withNotification = <T,>(
    promise: Promise<T>,
    messages: NotificationMessages
  ): Promise<T> => {
    return promise
      .then((result) => {
        toast.success(messages.success);
        return result;
      })
      .catch((error) => {
        toast.error(
          messages.error || 'Une erreur est survenue',
          error.message || 'Veuillez réessayer'
        );
        throw error;
      });
  };

  /**
   * Pre-configured notifications for common actions
   */
  const notifications = {
    // Threads
    threadCreated: () => toast.success('Thread créé', 'Votre nouveau thread est prêt'),
    threadUpdated: () => toast.success('Thread mis à jour'),
    threadArchived: () => toast.info('Thread archivé'),
    threadDeleted: () => toast.warning('Thread supprimé'),

    // Agents
    agentHired: (name: string) => toast.success(`${name} engagé`, 'L\'agent est maintenant actif'),
    agentFired: (name: string) => toast.info(`${name} désengagé`),

    // Checkpoints
    checkpointApproved: () => toast.success('Checkpoint approuvé', 'L\'action peut maintenant s\'exécuter'),
    checkpointRejected: () => toast.warning('Checkpoint rejeté', 'L\'action a été annulée'),
    checkpointPending: (title: string) => toast.checkpoint(
      'Approbation requise',
      title,
      { label: 'Voir', onClick: () => window.location.href = '/governance' }
    ),

    // Decisions
    decisionResolved: () => toast.success('Décision prise', 'Enregistrée dans l\'historique'),
    decisionDeferred: () => toast.info('Décision reportée'),

    // Auth
    loginSuccess: () => toast.success('Connexion réussie', 'Bienvenue sur CHE·NU'),
    logoutSuccess: () => toast.info('Déconnexion réussie'),
    sessionExpired: () => toast.warning('Session expirée', 'Veuillez vous reconnecter'),

    // Nova
    novaProcessing: () => toast.info('Nova analyse votre demande...'),
    novaComplete: () => toast.success('Analyse terminée'),

    // Generic
    saved: () => toast.success('Modifications enregistrées'),
    copied: () => toast.success('Copié dans le presse-papiers'),
    deleted: () => toast.warning('Élément supprimé'),
    
    // Errors
    networkError: () => toast.error('Erreur réseau', 'Vérifiez votre connexion'),
    serverError: () => toast.error('Erreur serveur', 'Veuillez réessayer plus tard'),
    validationError: (msg: string) => toast.error('Validation échouée', msg),
    permissionDenied: () => toast.error('Accès refusé', 'Vous n\'avez pas les permissions'),
  };

  return {
    toast,
    withNotification,
    notifications,
  };
}

export default useApiNotifications;
