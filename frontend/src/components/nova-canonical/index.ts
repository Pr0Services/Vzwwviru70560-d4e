/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V68 — NOVA CANONICAL INDEX                        ║
 * ║                    Governed Nova UI Components                                ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * RÈGLE: GOUVERNANCE > EXÉCUTION
 * 
 * Ces composants assurent que toute exécution passe par:
 * 1. Preview de l'encodage
 * 2. Checkpoint BLOQUANT
 * 3. Approbation explicite
 * 4. Affichage du résultat
 */

// Pipeline Principal
export { NovaPipelineCanonical, default as NovaPipeline } from './NovaPipelineCanonical';
export type { 
  NovaPipelineCanonicalProps,
  PipelineStepId,
  PipelineStepStatus,
  PipelineStep,
  EncodingPreview,
  ExecutionOutput,
  ExecutionResult,
} from './NovaPipelineCanonical';

// Checkpoint Modal
export { CheckpointModalCanonical, default as CheckpointModal } from './CheckpointModalCanonical';
export type { CheckpointModalCanonicalProps } from './CheckpointModalCanonical';

// Encoding Preview
export { EncodingPreviewCard, default as EncodingPreview } from './EncodingPreviewCard';
export type { 
  EncodingPreviewCardProps,
  SemanticEncoding,
  EncodedAction,
  EncodedActionType,
  EncodedTargetType,
  SensitivityLevel,
} from './EncodingPreviewCard';

// Nova Chat Interface
export { NovaChatCanonical, default as NovaChat } from './NovaChatCanonical';
export type { 
  NovaChatCanonicalProps,
  ChatMessage,
} from './NovaChatCanonical';
