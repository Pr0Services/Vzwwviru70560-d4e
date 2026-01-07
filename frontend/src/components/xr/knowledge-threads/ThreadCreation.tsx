/**
 * CHE·NU™ Knowledge Threads - Thread Creation Component
 * 
 * Modal/form for creating new Knowledge Threads.
 * Enforces human-explicit creation with clear reason.
 * 
 * Rules (from spec):
 * - Threads can be created via explicit user action
 * - Every thread has: human owner, creation timestamp, visible reason
 * - No auto-creation without human confirmation
 * 
 * @version 1.0.0
 */

import React, { useState, useCallback } from 'react';
import type {
  ThreadCreationForm,
  LinkedEntityType,
  LinkType,
  VisibilityScope,
} from './knowledge-threads.types';
import {
  LINK_TYPE_META,
  ENTITY_TYPE_META,
  THREAD_COLORS,
  DEFAULT_THREAD_FORM,
} from './knowledge-threads.types';

// ============================================================================
// PROPS
// ============================================================================

export interface ThreadCreationProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Close the modal */
  onClose: () => void;
  /** Submit the new thread */
  onSubmit: (form: ThreadCreationForm) => void;
  /** Current user ID */
  userId: string;
  /** Optional initial entity to link */
  initialEntity?: {
    type: LinkedEntityType;
    id: string;
    title: string;
  };
  /** Optional agent suggestion context */
  fromSuggestion?: {
    agentId: string;
    agentName: string;
    suggestedTitle?: string;
    suggestedDescription?: string;
  };
}

// ============================================================================
// CONSTANTS
// ============================================================================

const THREAD_ICONS = ['🧵', '💡', '🎯', '🔬', '📚', '🚀', '⚙️', '🌱', '🔮', '🎨', '🤝', '⚖️'];

const THREAD_PRESET_COLORS = [
  '#D4AF37', // Sacred Gold
  '#22C55E', // Green
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#F97316', // Orange
  '#14B8A6', // Teal
  '#EF4444', // Red
];

// ============================================================================
// COMPONENT
// ============================================================================

export const ThreadCreation: React.FC<ThreadCreationProps> = ({
  isOpen,
  onClose,
  onSubmit,
  userId,
  initialEntity,
  fromSuggestion,
}) => {
  // ============================================================================
  // STATE
  // ============================================================================

  const [form, setForm] = useState<ThreadCreationForm>(() => ({
    ...DEFAULT_THREAD_FORM,
    title: fromSuggestion?.suggestedTitle || '',
    description: fromSuggestion?.suggestedDescription || '',
    initial_entities: initialEntity ? [{
      type: initialEntity.type,
      id: initialEntity.id,
      title: initialEntity.title,
      link_type: 'ORIGIN' as LinkType,
    }] : [],
    color: THREAD_PRESET_COLORS[0],
    icon: '🧵',
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<1 | 2>(1);

  // ============================================================================
  // VALIDATION
  // ============================================================================

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.title.trim()) {
      newErrors.title = 'Le titre est requis';
    } else if (form.title.length < 3) {
      newErrors.title = 'Le titre doit avoir au moins 3 caractères';
    }

    if (!form.description?.trim()) {
      newErrors.description = 'Expliquez pourquoi ce fil existe (contexte de création)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleSubmit = useCallback(() => {
    if (!validate()) return;
    onSubmit(form);
    onClose();
  }, [form, validate, onSubmit, onClose]);

  const updateForm = useCallback((updates: Partial<ThreadCreationForm>) => {
    setForm(prev => ({ ...prev, ...updates }));
    // Clear related errors
    const keys = Object.keys(updates);
    setErrors(prev => {
      const next = { ...prev };
      keys.forEach(k => delete next[k]);
      return next;
    });
  }, []);

  const addTag = useCallback((tag: string) => {
    if (!tag.trim()) return;
    if (form.tags.includes(tag.trim())) return;
    updateForm({ tags: [...form.tags, tag.trim()] });
  }, [form.tags, updateForm]);

  const removeTag = useCallback((tag: string) => {
    updateForm({ tags: form.tags.filter(t => t !== tag) });
  }, [form.tags, updateForm]);

  const updateEntityLinkType = useCallback((index: number, linkType: LinkType) => {
    const updated = [...form.initial_entities];
    updated[index] = { ...updated[index], link_type: linkType };
    updateForm({ initial_entities: updated });
  }, [form.initial_entities, updateForm]);

  const removeEntity = useCallback((index: number) => {
    updateForm({ 
      initial_entities: form.initial_entities.filter((_, i) => i !== index) 
    });
  }, [form.initial_entities, updateForm]);

  // ============================================================================
  // RENDER
  // ============================================================================

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px',
    }}>
      <div
        style={{
          background: '#111113',
          borderRadius: '16px',
          border: `1px solid ${THREAD_COLORS.nightSlate}`,
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-thread-title"
      >
        {/* ============================================================ */}
        {/* HEADER */}
        {/* ============================================================ */}
        <header style={{
          padding: '24px',
          borderBottom: `1px solid ${THREAD_COLORS.nightSlate}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h2 
              id="create-thread-title"
              style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: 600,
                color: '#E5E7EB',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span>🧵</span>
              <span>Nouveau Fil de Connaissance</span>
            </h2>
            {fromSuggestion && (
              <p style={{
                margin: '4px 0 0 32px',
                fontSize: '13px',
                color: '#6B7280',
              }}>
                Suggéré par {fromSuggestion.agentName}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#6B7280',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '4px',
            }}
            aria-label="Fermer"
          >
            ×
          </button>
        </header>

        {/* ============================================================ */}
        {/* CONTENT */}
        {/* ============================================================ */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '24px',
        }}>
          {/* Step Indicator */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '24px',
          }}>
            <div style={{
              flex: 1,
              height: '4px',
              borderRadius: '2px',
              background: THREAD_COLORS.sacredGold,
            }} />
            <div style={{
              flex: 1,
              height: '4px',
              borderRadius: '2px',
              background: step >= 2 ? THREAD_COLORS.sacredGold : THREAD_COLORS.nightSlate,
            }} />
          </div>

          {step === 1 && (
            <>
              {/* Title */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  marginBottom: '8px',
                  color: '#E5E7EB',
                }}>
                  Titre du fil <span style={{ color: THREAD_COLORS.sacredGold }}>*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => updateForm({ title: e.target.value })}
                  placeholder="Ex: Stratégie de lancement Q1 2025"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: THREAD_COLORS.nightSlate,
                    border: errors.title 
                      ? '1px solid #EF4444'
                      : `1px solid ${THREAD_COLORS.nightSlate}`,
                    borderRadius: '8px',
                    color: '#E5E7EB',
                    fontSize: '15px',
                  }}
                />
                {errors.title && (
                  <span style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', display: 'block' }}>
                    {errors.title}
                  </span>
                )}
              </div>

              {/* Description / Creation Context */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  marginBottom: '8px',
                  color: '#E5E7EB',
                }}>
                  Pourquoi ce fil existe <span style={{ color: THREAD_COLORS.sacredGold }}>*</span>
                </label>
                <p style={{
                  margin: '0 0 8px 0',
                  fontSize: '12px',
                  color: '#6B7280',
                }}>
                  Expliquez le contexte et la raison d'être de ce fil de connaissance.
                </p>
                <textarea
                  value={form.description}
                  onChange={(e) => updateForm({ description: e.target.value })}
                  placeholder="Ce fil regroupe toutes les réflexions sur..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: THREAD_COLORS.nightSlate,
                    border: errors.description 
                      ? '1px solid #EF4444'
                      : `1px solid ${THREAD_COLORS.nightSlate}`,
                    borderRadius: '8px',
                    color: '#E5E7EB',
                    fontSize: '14px',
                    resize: 'vertical',
                  }}
                />
                {errors.description && (
                  <span style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', display: 'block' }}>
                    {errors.description}
                  </span>
                )}
              </div>

              {/* Visibility */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  marginBottom: '8px',
                  color: '#E5E7EB',
                }}>
                  Visibilité
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {(['private', 'shared', 'team'] as VisibilityScope[]).map(scope => (
                    <button
                      key={scope}
                      onClick={() => updateForm({ visibility_scope: scope })}
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        background: form.visibility_scope === scope 
                          ? `${THREAD_COLORS.sacredGold}20`
                          : THREAD_COLORS.nightSlate,
                        border: form.visibility_scope === scope
                          ? `1px solid ${THREAD_COLORS.sacredGold}40`
                          : `1px solid ${THREAD_COLORS.nightSlate}`,
                        borderRadius: '8px',
                        color: form.visibility_scope === scope 
                          ? THREAD_COLORS.sacredGold 
                          : '#9CA3AF',
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span style={{ fontSize: '16px' }}>
                        {scope === 'private' && '🔒'}
                        {scope === 'shared' && '🔗'}
                        {scope === 'my_team' && '👥'}
                      </span>
                      <span style={{ textTransform: 'capitalize' }}>{scope}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              {/* Icon Selection */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  marginBottom: '8px',
                  color: '#E5E7EB',
                }}>
                  Icône
                </label>
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap',
                }}>
                  {THREAD_ICONS.map(icon => (
                    <button
                      key={icon}
                      onClick={() => updateForm({ icon })}
                      style={{
                        width: '44px',
                        height: '44px',
                        background: form.icon === icon 
                          ? `${THREAD_COLORS.sacredGold}20`
                          : THREAD_COLORS.nightSlate,
                        border: form.icon === icon
                          ? `2px solid ${THREAD_COLORS.sacredGold}`
                          : '2px solid transparent',
                        borderRadius: '10px',
                        fontSize: '22px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  marginBottom: '8px',
                  color: '#E5E7EB',
                }}>
                  Couleur
                </label>
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap',
                }}>
                  {THREAD_PRESET_COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => updateForm({ color })}
                      style={{
                        width: '36px',
                        height: '36px',
                        background: color,
                        border: form.color === color
                          ? '3px solid #fff'
                          : '3px solid transparent',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        boxShadow: form.color === color 
                          ? `0 0 0 2px ${THREAD_COLORS.obsidianBlack}, 0 0 0 4px ${color}`
                          : 'none',
                      }}
                      aria-label={`Couleur ${color}`}
                    />
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  marginBottom: '8px',
                  color: '#E5E7EB',
                }}>
                  Tags (optionnel)
                </label>
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap',
                  marginBottom: '8px',
                }}>
                  {form.tags.map(tag => (
                    <span
                      key={tag}
                      style={{
                        padding: '4px 10px',
                        background: THREAD_COLORS.nightSlate,
                        borderRadius: '6px',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#6B7280',
                          cursor: 'pointer',
                          padding: 0,
                          fontSize: '14px',
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Ajouter un tag..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: THREAD_COLORS.nightSlate,
                    border: `1px solid ${THREAD_COLORS.nightSlate}`,
                    borderRadius: '8px',
                    color: '#E5E7EB',
                    fontSize: '13px',
                  }}
                />
              </div>

              {/* Initial Entities */}
              {form.initial_entities.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 500,
                    marginBottom: '8px',
                    color: '#E5E7EB',
                  }}>
                    Éléments initiaux
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {form.initial_entities.map((entity, index) => (
                      <div
                        key={entity.id}
                        style={{
                          padding: '12px',
                          background: THREAD_COLORS.nightSlate,
                          borderRadius: '8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '18px' }}>
                            {ENTITY_TYPE_META[entity.type]?.icon || '📎'}
                          </span>
                          <div>
                            <div style={{ fontSize: '14px' }}>{entity.title}</div>
                            <select
                              value={entity.link_type}
                              onChange={(e) => updateEntityLinkType(index, e.target.value as LinkType)}
                              style={{
                                marginTop: '4px',
                                padding: '4px 8px',
                                background: THREAD_COLORS.obsidianBlack,
                                border: 'none',
                                borderRadius: '4px',
                                color: LINK_TYPE_META[entity.link_type]?.color || '#9CA3AF',
                                fontSize: '12px',
                                cursor: 'pointer',
                              }}
                            >
                              {Object.entries(LINK_TYPE_META).map(([type, meta]) => (
                                <option key={type} value={type}>
                                  {meta.icon} {meta.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <button
                          onClick={() => removeEntity(index)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#6B7280',
                            cursor: 'pointer',
                            fontSize: '18px',
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview */}
              <div style={{
                padding: '16px',
                background: `${form.color}10`,
                border: `1px solid ${form.color}30`,
                borderRadius: '12px',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '8px',
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: `${form.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                  }}>
                    {form.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 500 }}>{form.title || 'Titre du fil'}</div>
                    <div style={{ fontSize: '12px', color: '#6B7280' }}>
                      Aperçu
                    </div>
                  </div>
                </div>
                {form.description && (
                  <p style={{
                    margin: 0,
                    fontSize: '13px',
                    color: '#9CA3AF',
                    marginLeft: '52px',
                  }}>
                    {form.description}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* ============================================================ */}
        {/* FOOTER */}
        {/* ============================================================ */}
        <footer style={{
          padding: '20px 24px',
          borderTop: `1px solid ${THREAD_COLORS.nightSlate}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <button
            onClick={step === 1 ? onClose : () => setStep(1)}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              border: `1px solid ${THREAD_COLORS.nightSlate}`,
              borderRadius: '8px',
              color: '#9CA3AF',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            {step === 1 ? 'Annuler' : '← Retour'}
          </button>

          <button
            onClick={step === 1 ? () => { if (validate()) setStep(2); } : handleSubmit}
            style={{
              padding: '10px 24px',
              background: THREAD_COLORS.sacredGold,
              border: 'none',
              borderRadius: '8px',
              color: '#000',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {step === 1 ? (
              <>
                <span>Suivant</span>
                <span>→</span>
              </>
            ) : (
              <>
                <span>🧵</span>
                <span>Créer le Fil</span>
              </>
            )}
          </button>
        </footer>
      </div>
    </div>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default ThreadCreation;
