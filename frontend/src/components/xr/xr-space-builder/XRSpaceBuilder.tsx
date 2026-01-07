/**
 * CHE·NU™ XR SPACE BUILDER UI — COMPONENT
 * 
 * Structure Declaration Interface for XR spaces.
 * 
 * The user never "moves polygons".
 * The user declares INTENT and STRUCTURE.
 * 
 * @version 1.0
 * @status V51-ready
 */

import React, { useState, useCallback, useMemo } from 'react';
import type {
  XRSpaceBuilderProps,
  XRPrimitiveType,
  XRPrimitive,
  CreationStep,
  CreationMode,
  SpaceDeclaration,
  ValidationError,
  SafetyViolation,
  ArchitectAgentMessage,
} from './xr-space-builder.types';
import {
  XR_SPACE_BUILDER_TOKENS,
  PRIMITIVE_DEFINITIONS,
  CREATION_STEPS_ORDER,
  XR_SPACE_BUILDER_IS,
} from './xr-space-builder.types';
import {
  useXRSpaceBuilder,
  useBuilderKeyboard,
} from './hooks';

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const XRSpaceBuilder: React.FC<XRSpaceBuilderProps> = ({
  user_id,
  initial_mode,
  template_id,
  clone_from_id,
  space_id,
  architect_agent_enabled = true,
  onSpaceCreated,
  onSpaceUpdated,
  onSpacePublished,
  onValidationChange,
  onStepChange,
  onExit,
  className,
}) => {
  // Combined hook
  const builder = useXRSpaceBuilder({
    user_id,
    space_id,
    initial_mode,
    architect_agent_enabled,
    onSpaceCreated,
    onSpaceUpdated,
    onStepChange,
    onValidationChange,
  });
  
  // Local state
  const [selectedPrimitiveId, setSelectedPrimitiveId] = useState<string | null>(null);
  
  // Keyboard shortcuts
  useBuilderKeyboard({
    onSave: builder.space.saveSpace,
    onEscape: () => {
      setSelectedPrimitiveId(null);
      builder.palette.deselect();
    },
    onDelete: () => {
      if (selectedPrimitiveId) {
        builder.space.removePrimitive(selectedPrimitiveId);
        setSelectedPrimitiveId(null);
      }
    },
  });
  
  // Handle primitive placement
  const handlePrimitivePlacement = useCallback((zoneId?: string) => {
    const selectedType = builder.palette.selectedType;
    if (!selectedType) return;
    
    const info = builder.palette.getPrimitiveInfo(selectedType);
    if (!info) return;
    
    builder.space.addPrimitive({
      type: selectedType,
      icon: info.icon,
      meaning: info.meaning,
      not_meaning: info.not_meaning,
      parameters: {},
      references: [],
      scope: 'zone',
    }, zoneId);
    
    builder.palette.deselect();
  }, [builder.palette, builder.space]);
  
  // Handle publish
  const handlePublish = useCallback(async () => {
    await builder.publish();
    if (builder.space.space) {
      onSpacePublished?.(builder.space.space);
    }
  }, [builder, onSpacePublished]);
  
  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `${XR_SPACE_BUILDER_TOKENS.layout.overview_width} 1fr ${XR_SPACE_BUILDER_TOKENS.layout.validation_width}`,
        gridTemplateRows: `1fr ${XR_SPACE_BUILDER_TOKENS.layout.preview_height}`,
        gap: '1px',
        height: '100vh',
        backgroundColor: XR_SPACE_BUILDER_TOKENS.colors.border,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: XR_SPACE_BUILDER_TOKENS.colors.text_primary,
      }}
    >
      {/* Left Column: Overview + Palette */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: XR_SPACE_BUILDER_TOKENS.colors.background,
        }}
      >
        {/* A) Space Overview Panel */}
        <SpaceOverviewPanel
          zones={builder.space.zones}
          primitives={builder.space.primitives}
          selectedPrimitiveId={selectedPrimitiveId}
          onZoneClick={(zoneId) => handlePrimitivePlacement(zoneId)}
          onPrimitiveSelect={setSelectedPrimitiveId}
        />
        
        {/* B) Primitive Palette */}
        <PrimitivePalettePanel
          palette={builder.palette.palette}
          onSelect={builder.palette.select}
          selectedType={builder.palette.selectedType}
        />
      </div>
      
      {/* Center: Main content based on step */}
      <div
        style={{
          backgroundColor: XR_SPACE_BUILDER_TOKENS.colors.background,
          padding: '24px',
          overflow: 'auto',
        }}
      >
        {/* Step indicator */}
        <StepIndicator
          currentStep={builder.flow.currentStep}
          completedSteps={builder.flow.state.completed_steps}
          onStepClick={builder.flow.goToStep}
        />
        
        {/* Step content */}
        <StepContent
          step={builder.flow.currentStep}
          flow={builder.flow}
          space={builder.space}
          validation={builder.validation}
          onDeclarationChange={builder.flow.setDeclaration}
          onModeSelect={builder.flow.setMode}
        />
        
        {/* Navigation */}
        <StepNavigation
          canProceed={builder.flow.canProceed}
          canGoBack={builder.flow.canGoBack}
          currentStep={builder.flow.currentStep}
          onNext={builder.flow.nextStep}
          onBack={builder.flow.previousStep}
          onPublish={handlePublish}
          canPublish={builder.canPublish}
        />
      </div>
      
      {/* Right Column: Validation + Agent */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: XR_SPACE_BUILDER_TOKENS.colors.background,
        }}
      >
        {/* D) Validation Panel */}
        <ValidationPanel
          isValid={builder.validation.isValid}
          errors={builder.validation.errors}
          warnings={builder.validation.warnings}
          safetyViolations={builder.validation.safetyViolations}
          onErrorClick={(errorId) => builder.agent.explainError(errorId)}
          onViolationClick={(violationId) => builder.agent.explainViolation(violationId)}
        />
        
        {/* Agent Panel */}
        {architect_agent_enabled && (
          <AgentPanel
            messages={builder.agent.messages}
            onAskQuestion={builder.agent.askQuestion}
          />
        )}
      </div>
      
      {/* Bottom: Preview Panel */}
      <div
        style={{
          gridColumn: '1 / -1',
          backgroundColor: XR_SPACE_BUILDER_TOKENS.colors.panel_bg,
        }}
      >
        <PreviewPanel
          panel={builder.preview.panel}
          isPreviewing={builder.preview.isPreviewing}
          onStartPreview={builder.preview.startPreview}
          onStopPreview={builder.preview.stopPreview}
          onModeChange={builder.preview.setMode}
          onToggleOverlay={builder.preview.toggleOverlay}
          onMarkComplete={builder.preview.markComplete}
        />
      </div>
      
      {/* Exit button */}
      <button
        onClick={onExit}
        style={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          padding: '8px 16px',
          backgroundColor: 'transparent',
          border: `1px solid ${XR_SPACE_BUILDER_TOKENS.colors.border}`,
          color: XR_SPACE_BUILDER_TOKENS.colors.text_secondary,
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        Exit Builder
      </button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// A) Space Overview Panel
interface SpaceOverviewPanelProps {
  zones: Array<{ id: string; name: string; position_hint: string; primitives: string[] }>;
  primitives: XRPrimitive[];
  selectedPrimitiveId: string | null;
  onZoneClick: (zoneId: string) => void;
  onPrimitiveSelect: (id: string | null) => void;
}

const SpaceOverviewPanel: React.FC<SpaceOverviewPanelProps> = ({
  zones,
  primitives,
  selectedPrimitiveId,
  onZoneClick,
  onPrimitiveSelect,
}) => (
  <div
    style={{
      flex: 1,
      padding: '16px',
      borderBottom: `1px solid ${XR_SPACE_BUILDER_TOKENS.colors.border}`,
    }}
  >
    <h3 style={{ 
      margin: '0 0 16px 0', 
      fontSize: '14px',
      color: XR_SPACE_BUILDER_TOKENS.colors.text_secondary,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    }}>
      Space Overview
    </h3>
    
    {/* Abstract top-down map */}
    <div
      style={{
        aspectRatio: '1',
        backgroundColor: XR_SPACE_BUILDER_TOKENS.colors.panel_bg,
        borderRadius: '8px',
        border: `1px solid ${XR_SPACE_BUILDER_TOKENS.colors.border}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Center zone (default) */}
      <div
        onClick={() => onZoneClick('center')}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60%',
          height: '60%',
          backgroundColor: 'rgba(102, 136, 204, 0.1)',
          border: `1px dashed ${XR_SPACE_BUILDER_TOKENS.colors.accent}`,
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: XR_SPACE_BUILDER_TOKENS.colors.text_secondary,
          fontSize: '12px',
        }}
      >
        {zones.length === 0 ? 'Click to place primitive' : 'Main Zone'}
      </div>
      
      {/* Render primitives */}
      {primitives.map((primitive, index) => (
        <div
          key={primitive.id}
          onClick={() => onPrimitiveSelect(primitive.id)}
          style={{
            position: 'absolute',
            top: `${30 + (index % 3) * 20}%`,
            left: `${30 + Math.floor(index / 3) * 20}%`,
            width: '24px',
            height: '24px',
            backgroundColor: selectedPrimitiveId === primitive.id
              ? XR_SPACE_BUILDER_TOKENS.colors.accent
              : XR_SPACE_BUILDER_TOKENS.primitives[primitive.type],
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
          }}
          title={`${primitive.type}: ${primitive.meaning}`}
        >
          {primitive.icon}
        </div>
      ))}
    </div>
    
    <p style={{
      margin: '8px 0 0 0',
      fontSize: '11px',
      color: XR_SPACE_BUILDER_TOKENS.colors.text_secondary,
    }}>
      Top-down abstract view • No perspective
    </p>
  </div>
);

// B) Primitive Palette Panel
interface PrimitivePalettePanelProps {
  palette: { primitives: typeof PRIMITIVE_DEFINITIONS };
  selectedType: XRPrimitiveType | null;
  onSelect: (type: XRPrimitiveType) => void;
}

const PrimitivePalettePanel: React.FC<PrimitivePalettePanelProps> = ({
  palette,
  selectedType,
  onSelect,
}) => (
  <div
    style={{
      height: XR_SPACE_BUILDER_TOKENS.layout.palette_height,
      padding: '16px',
      overflow: 'auto',
    }}
  >
    <h3 style={{ 
      margin: '0 0 12px 0', 
      fontSize: '14px',
      color: XR_SPACE_BUILDER_TOKENS.colors.text_secondary,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    }}>
      Primitives
    </h3>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {palette.primitives.map((primitive) => (
        <button
          key={primitive.type}
          onClick={() => onSelect(primitive.type)}
          disabled={!primitive.enabled}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            backgroundColor: selectedType === primitive.type
              ? XR_SPACE_BUILDER_TOKENS.colors.accent
              : 'transparent',
            border: `1px solid ${selectedType === primitive.type 
              ? XR_SPACE_BUILDER_TOKENS.colors.accent 
              : XR_SPACE_BUILDER_TOKENS.colors.border}`,
            borderRadius: '4px',
            cursor: primitive.enabled ? 'pointer' : 'not-allowed',
            opacity: primitive.enabled ? 1 : 0.5,
            color: XR_SPACE_BUILDER_TOKENS.colors.text_primary,
            textAlign: 'left',
          }}
          title={`${primitive.meaning}\n\nNOT: ${primitive.not_meaning}`}
        >
          <span style={{ fontSize: '16px' }}>{primitive.icon}</span>
          <span style={{ fontSize: '13px' }}>{primitive.label}</span>
        </button>
      ))}
    </div>
  </div>
);

// Step Indicator
interface StepIndicatorProps {
  currentStep: CreationStep;
  completedSteps: CreationStep[];
  onStepClick: (step: CreationStep) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  completedSteps,
  onStepClick,
}) => {
  const stepLabels: Record<CreationStep, string> = {
    select_mode: 'Mode',
    declare_purpose: 'Purpose',
    place_primitives: 'Build',
    validate: 'Validate',
    preview: 'Preview',
    confirm: 'Publish',
  };
  
  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: `1px solid ${XR_SPACE_BUILDER_TOKENS.colors.border}`,
      }}
    >
      {CREATION_STEPS_ORDER.map((step, index) => {
        const isCompleted = completedSteps.includes(step);
        const isCurrent = step === currentStep;
        const canClick = isCompleted || isCurrent;
        
        return (
          <React.Fragment key={step}>
            {index > 0 && (
              <div style={{
                flex: 1,
                height: '2px',
                backgroundColor: isCompleted
                  ? XR_SPACE_BUILDER_TOKENS.colors.accent
                  : XR_SPACE_BUILDER_TOKENS.colors.border,
                alignSelf: 'center',
              }} />
            )}
            <button
              onClick={() => canClick && onStepClick(step)}
              style={{
                padding: '8px 16px',
                backgroundColor: isCurrent
                  ? XR_SPACE_BUILDER_TOKENS.colors.accent
                  : isCompleted
                    ? XR_SPACE_BUILDER_TOKENS.colors.panel_bg
                    : 'transparent',
                border: `1px solid ${isCurrent || isCompleted
                  ? XR_SPACE_BUILDER_TOKENS.colors.accent
                  : XR_SPACE_BUILDER_TOKENS.colors.border}`,
                borderRadius: '4px',
                color: isCurrent
                  ? '#ffffff'
                  : XR_SPACE_BUILDER_TOKENS.colors.text_primary,
                cursor: canClick ? 'pointer' : 'default',
                fontSize: '13px',
                opacity: canClick ? 1 : 0.5,
              }}
            >
              {isCompleted && !isCurrent && '✓ '}
              {stepLabels[step]}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
};

// Step Content
interface StepContentProps {
  step: CreationStep;
  flow: ReturnType<typeof useXRSpaceBuilder>['flow'];
  space: ReturnType<typeof useXRSpaceBuilder>['space'];
  validation: ReturnType<typeof useXRSpaceBuilder>['validation'];
  onDeclarationChange: (declaration: SpaceDeclaration) => void;
  onModeSelect: (mode: CreationMode) => void;
}

const StepContent: React.FC<StepContentProps> = ({
  step,
  flow,
  space,
  validation,
  onDeclarationChange,
  onModeSelect,
}) => {
  const [declaration, setDeclaration] = useState<Partial<SpaceDeclaration>>({});
  
  const handleDeclarationField = (field: keyof SpaceDeclaration, value: string) => {
    const updated = { ...declaration, [field]: value };
    setDeclaration(updated);
    if (updated.purpose && updated.meaning) {
      onDeclarationChange(updated as SpaceDeclaration);
    }
  };
  
  switch (step) {
    case 'select_mode':
      return (
        <div>
          <h2 style={{ margin: '0 0 16px 0' }}>Select Creation Mode</h2>
          <p style={{ color: XR_SPACE_BUILDER_TOKENS.colors.text_secondary, marginBottom: '24px' }}>
            Choose how you want to create your XR space.
          </p>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            {(['template', 'clone', 'composable'] as CreationMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => onModeSelect(mode)}
                style={{
                  flex: 1,
                  padding: '24px',
                  backgroundColor: flow.state.mode === mode
                    ? XR_SPACE_BUILDER_TOKENS.colors.accent
                    : XR_SPACE_BUILDER_TOKENS.colors.panel_bg,
                  border: `1px solid ${XR_SPACE_BUILDER_TOKENS.colors.border}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: XR_SPACE_BUILDER_TOKENS.colors.text_primary,
                }}
              >
                <h3 style={{ margin: '0 0 8px 0', textTransform: 'capitalize' }}>
                  {mode}
                </h3>
                <p style={{ margin: 0, fontSize: '13px', opacity: 0.8 }}>
                  {mode === 'template' && 'Start from a pre-built template'}
                  {mode === 'clone' && 'Clone an existing space'}
                  {mode === 'composable' && 'Build from scratch (guided)'}
                </p>
              </button>
            ))}
          </div>
        </div>
      );
    
    case 'declare_purpose':
      return (
        <div>
          <h2 style={{ margin: '0 0 16px 0' }}>Declare Purpose & Meaning</h2>
          <p style={{ color: XR_SPACE_BUILDER_TOKENS.colors.text_secondary, marginBottom: '24px' }}>
            Every space must have a clear purpose and meaning. This is required.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px',
                fontSize: '14px',
                color: XR_SPACE_BUILDER_TOKENS.colors.text_secondary,
              }}>
                Purpose (What is this space for?)
              </label>
              <input
                type="text"
                value={declaration.purpose || ''}
                onChange={(e) => handleDeclarationField('purpose', e.target.value)}
                placeholder="e.g., Team decision-making for Q1 planning"
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: XR_SPACE_BUILDER_TOKENS.colors.panel_bg,
                  border: `1px solid ${XR_SPACE_BUILDER_TOKENS.colors.border}`,
                  borderRadius: '4px',
                  color: XR_SPACE_BUILDER_TOKENS.colors.text_primary,
                  fontSize: '14px',
                }}
              />
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px',
                fontSize: '14px',
                color: XR_SPACE_BUILDER_TOKENS.colors.text_secondary,
              }}>
                Meaning (What does this space represent?)
              </label>
              <textarea
                value={declaration.meaning || ''}
                onChange={(e) => handleDeclarationField('meaning', e.target.value)}
                placeholder="e.g., A calm space where options are equal and decisions crystallize through reflection"
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: XR_SPACE_BUILDER_TOKENS.colors.panel_bg,
                  border: `1px solid ${XR_SPACE_BUILDER_TOKENS.colors.border}`,
                  borderRadius: '4px',
                  color: XR_SPACE_BUILDER_TOKENS.colors.text_primary,
                  fontSize: '14px',
                  resize: 'vertical',
                }}
              />
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px',
                fontSize: '14px',
                color: XR_SPACE_BUILDER_TOKENS.colors.text_secondary,
              }}>
                Primary Use Case
              </label>
              <input
                type="text"
                value={declaration.primary_use_case || ''}
                onChange={(e) => handleDeclarationField('primary_use_case', e.target.value)}
                placeholder="e.g., Weekly team reflection sessions"
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: XR_SPACE_BUILDER_TOKENS.colors.panel_bg,
                  border: `1px solid ${XR_SPACE_BUILDER_TOKENS.colors.border}`,
                  borderRadius: '4px',
                  color: XR_SPACE_BUILDER_TOKENS.colors.text_primary,
                  fontSize: '14px',
                }}
              />
            </div>
          </div>
        </div>
      );
    
    case 'place_primitives':
      return (
        <div>
          <h2 style={{ margin: '0 0 16px 0' }}>Place Primitives</h2>
          <p style={{ color: XR_SPACE_BUILDER_TOKENS.colors.text_secondary, marginBottom: '24px' }}>
            Select primitives from the palette and place them in the space.
            Each primitive has semantic meaning, not geometric meaning.
          </p>
          
          <div style={{
            padding: '24px',
            backgroundColor: XR_SPACE_BUILDER_TOKENS.colors.panel_bg,
            borderRadius: '8px',
            border: `1px solid ${XR_SPACE_BUILDER_TOKENS.colors.border}`,
          }}>
            <p style={{ margin: 0, color: XR_SPACE_BUILDER_TOKENS.colors.text_secondary }}>
              {space.primitives.length === 0 
                ? '1. Select a primitive from the palette on the left\n2. Click on the overview map to place it'
                : `${space.primitives.length} primitive(s) placed`}
            </p>
            
            {space.primitives.length > 0 && (
              <ul style={{ margin: '16px 0 0 0', paddingLeft: '20px' }}>
                {space.primitives.map((p) => (
                  <li key={p.id} style={{ marginBottom: '8px' }}>
                    {p.icon} <strong>{p.type}</strong>: {p.meaning}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      );
    
    case 'validate':
      return (
        <div>
          <h2 style={{ margin: '0 0 16px 0' }}>Validate Space</h2>
          <p style={{ color: XR_SPACE_BUILDER_TOKENS.colors.text_secondary, marginBottom: '24px' }}>
            Your space must pass all validation checks before it can be published.
          </p>
          
          <div style={{
            padding: '24px',
            backgroundColor: validation.isValid
              ? 'rgba(136, 170, 136, 0.1)'
              : 'rgba(170, 136, 136, 0.1)',
            borderRadius: '8px',
            border: `1px solid ${validation.isValid
              ? XR_SPACE_BUILDER_TOKENS.validation.pass
              : XR_SPACE_BUILDER_TOKENS.validation.fail}`,
          }}>
            <h3 style={{ 
              margin: '0 0 16px 0',
              color: validation.isValid
                ? XR_SPACE_BUILDER_TOKENS.validation.pass
                : XR_SPACE_BUILDER_TOKENS.validation.fail,
            }}>
              {validation.isValid ? '✓ All Checks Passed' : '✕ Validation Failed'}
            </h3>
            
            {validation.errors.length > 0 && (
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Errors (must fix):</h4>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {validation.errors.map((error) => (
                    <li key={error.id} style={{ marginBottom: '8px', color: XR_SPACE_BUILDER_TOKENS.validation.fail }}>
                      {error.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {validation.safetyViolations.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Safety Violations:</h4>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {validation.safetyViolations.map((v) => (
                    <li key={v.id} style={{ marginBottom: '8px', color: XR_SPACE_BUILDER_TOKENS.validation.blocked }}>
                      {v.description} — {v.why_dangerous}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      );
    
    case 'preview':
      return (
        <div>
          <h2 style={{ margin: '0 0 16px 0' }}>Preview Space</h2>
          <p style={{ color: XR_SPACE_BUILDER_TOKENS.colors.text_secondary, marginBottom: '24px' }}>
            Enter XR preview to experience the space before publishing.
          </p>
          
          <p style={{ color: XR_SPACE_BUILDER_TOKENS.colors.text_secondary }}>
            Use the preview panel below to test different modes and overlays.
          </p>
        </div>
      );
    
    case 'confirm':
      return (
        <div>
          <h2 style={{ margin: '0 0 16px 0' }}>Confirm & Publish</h2>
          <p style={{ color: XR_SPACE_BUILDER_TOKENS.colors.text_secondary, marginBottom: '24px' }}>
            Review your space and publish when ready.
          </p>
          
          <div style={{
            padding: '24px',
            backgroundColor: XR_SPACE_BUILDER_TOKENS.colors.panel_bg,
            borderRadius: '8px',
            border: `1px solid ${XR_SPACE_BUILDER_TOKENS.colors.border}`,
          }}>
            <h3 style={{ margin: '0 0 16px 0' }}>Summary</h3>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>Purpose: {flow.state.declaration?.purpose || 'Not set'}</li>
              <li>Meaning: {flow.state.declaration?.meaning || 'Not set'}</li>
              <li>Primitives: {space.primitives.length}</li>
              <li>Zones: {space.zones.length}</li>
              <li>Validation: {validation.isValid ? '✓ Passed' : '✕ Failed'}</li>
            </ul>
          </div>
        </div>
      );
    
    default:
      return null;
  }
};

// Step Navigation
interface StepNavigationProps {
  canProceed: boolean;
  canGoBack: boolean;
  currentStep: CreationStep;
  onNext: () => void;
  onBack: () => void;
  onPublish: () => void;
  canPublish: boolean;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  canProceed,
  canGoBack,
  currentStep,
  onNext,
  onBack,
  onPublish,
  canPublish,
}) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '32px',
      paddingTop: '16px',
      borderTop: `1px solid ${XR_SPACE_BUILDER_TOKENS.colors.border}`,
    }}
  >
    <button
      onClick={onBack}
      disabled={!canGoBack}
      style={{
        padding: '12px 24px',
        backgroundColor: 'transparent',
        border: `1px solid ${XR_SPACE_BUILDER_TOKENS.colors.border}`,
        borderRadius: '4px',
        color: XR_SPACE_BUILDER_TOKENS.colors.text_primary,
        cursor: canGoBack ? 'pointer' : 'not-allowed',
        opacity: canGoBack ? 1 : 0.5,
        fontSize: '14px',
      }}
    >
      ← Back
    </button>
    
    {currentStep === 'confirm' ? (
      <button
        onClick={onPublish}
        disabled={!canPublish}
        style={{
          padding: '12px 24px',
          backgroundColor: canPublish
            ? XR_SPACE_BUILDER_TOKENS.colors.success
            : XR_SPACE_BUILDER_TOKENS.colors.panel_bg,
          border: 'none',
          borderRadius: '4px',
          color: '#ffffff',
          cursor: canPublish ? 'pointer' : 'not-allowed',
          opacity: canPublish ? 1 : 0.5,
          fontSize: '14px',
          fontWeight: 500,
        }}
      >
        Publish Space
      </button>
    ) : (
      <button
        onClick={onNext}
        disabled={!canProceed}
        style={{
          padding: '12px 24px',
          backgroundColor: canProceed
            ? XR_SPACE_BUILDER_TOKENS.colors.accent
            : XR_SPACE_BUILDER_TOKENS.colors.panel_bg,
          border: 'none',
          borderRadius: '4px',
          color: '#ffffff',
          cursor: canProceed ? 'pointer' : 'not-allowed',
          opacity: canProceed ? 1 : 0.5,
          fontSize: '14px',
        }}
      >
        Continue →
      </button>
    )}
  </div>
);

// D) Validation Panel
interface ValidationPanelProps {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  safetyViolations: SafetyViolation[];
  onErrorClick: (errorId: string) => void;
  onViolationClick: (violationId: string) => void;
}

const ValidationPanel: React.FC<ValidationPanelProps> = ({
  isValid,
  errors,
  warnings,
  safetyViolations,
  onErrorClick,
  onViolationClick,
}) => (
  <div
    style={{
      flex: 1,
      padding: '16px',
      overflow: 'auto',
      borderBottom: `1px solid ${XR_SPACE_BUILDER_TOKENS.colors.border}`,
    }}
  >
    <h3 style={{ 
      margin: '0 0 16px 0', 
      fontSize: '14px',
      color: XR_SPACE_BUILDER_TOKENS.colors.text_secondary,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    }}>
      Validation
    </h3>
    
    {/* Status indicator */}
    <div
      style={{
        padding: '12px',
        backgroundColor: isValid
          ? 'rgba(136, 170, 136, 0.1)'
          : 'rgba(170, 136, 136, 0.1)',
        borderRadius: '4px',
        marginBottom: '16px',
        textAlign: 'center',
        color: isValid
          ? XR_SPACE_BUILDER_TOKENS.validation.pass
          : XR_SPACE_BUILDER_TOKENS.validation.fail,
        fontSize: '13px',
      }}
    >
      {isValid ? '✓ Semantically Valid' : '✕ Validation Errors'}
    </div>
    
    {/* Errors */}
    {errors.length > 0 && (
      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '12px',
          color: XR_SPACE_BUILDER_TOKENS.validation.fail,
        }}>
          ERRORS (blocking)
        </h4>
        {errors.map((error) => (
          <button
            key={error.id}
            onClick={() => onErrorClick(error.id)}
            style={{
              display: 'block',
              width: '100%',
              padding: '8px',
              marginBottom: '4px',
              backgroundColor: 'rgba(170, 136, 136, 0.1)',
              border: 'none',
              borderRadius: '4px',
              textAlign: 'left',
              cursor: 'pointer',
              color: XR_SPACE_BUILDER_TOKENS.colors.text_primary,
              fontSize: '12px',
            }}
          >
            {error.message}
          </button>
        ))}
      </div>
    )}
    
    {/* Safety violations */}
    {safetyViolations.length > 0 && (
      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '12px',
          color: XR_SPACE_BUILDER_TOKENS.validation.blocked,
        }}>
          SAFETY (critical)
        </h4>
        {safetyViolations.map((violation) => (
          <button
            key={violation.id}
            onClick={() => onViolationClick(violation.id)}
            style={{
              display: 'block',
              width: '100%',
              padding: '8px',
              marginBottom: '4px',
              backgroundColor: 'rgba(170, 102, 102, 0.1)',
              border: 'none',
              borderRadius: '4px',
              textAlign: 'left',
              cursor: 'pointer',
              color: XR_SPACE_BUILDER_TOKENS.colors.text_primary,
              fontSize: '12px',
            }}
          >
            {violation.description}
          </button>
        ))}
      </div>
    )}
    
    {/* Warnings */}
    {warnings.length > 0 && (
      <div>
        <h4 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '12px',
          color: XR_SPACE_BUILDER_TOKENS.validation.warning,
        }}>
          WARNINGS
        </h4>
        {warnings.map((warning) => (
          <div
            key={warning.id}
            style={{
              padding: '8px',
              marginBottom: '4px',
              backgroundColor: 'rgba(170, 170, 136, 0.1)',
              borderRadius: '4px',
              fontSize: '12px',
            }}
          >
            {warning.message}
          </div>
        ))}
      </div>
    )}
  </div>
);

// Agent Panel
interface AgentPanelProps {
  messages: ArchitectAgentMessage[];
  onAskQuestion: (question: string) => Promise<void>;
}

const AgentPanel: React.FC<AgentPanelProps> = ({
  messages,
  onAskQuestion,
}) => {
  const [question, setQuestion] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    await onAskQuestion(question);
    setQuestion('');
  };
  
  return (
    <div
      style={{
        height: '200px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h3 style={{ 
        margin: '0 0 12px 0', 
        fontSize: '14px',
        color: XR_SPACE_BUILDER_TOKENS.colors.text_secondary,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        XR Architect
      </h3>
      
      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          marginBottom: '12px',
        }}
      >
        {messages.length === 0 ? (
          <p style={{ 
            fontSize: '12px', 
            color: XR_SPACE_BUILDER_TOKENS.colors.text_secondary,
            fontStyle: 'italic',
          }}>
            Ask about architectural rules...
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                padding: '8px',
                marginBottom: '8px',
                backgroundColor: XR_SPACE_BUILDER_TOKENS.colors.panel_bg,
                borderRadius: '4px',
                fontSize: '12px',
              }}
            >
              <p style={{ margin: 0 }}>{msg.content}</p>
              <p style={{ 
                margin: '4px 0 0 0', 
                fontSize: '10px',
                color: XR_SPACE_BUILDER_TOKENS.colors.text_secondary,
              }}>
                Source: {msg.source_citation}
              </p>
            </div>
          ))
        )}
      </div>
      
      {/* Input */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question..."
          style={{
            flex: 1,
            padding: '8px',
            backgroundColor: XR_SPACE_BUILDER_TOKENS.colors.panel_bg,
            border: `1px solid ${XR_SPACE_BUILDER_TOKENS.colors.border}`,
            borderRadius: '4px',
            color: XR_SPACE_BUILDER_TOKENS.colors.text_primary,
            fontSize: '12px',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '8px 12px',
            backgroundColor: XR_SPACE_BUILDER_TOKENS.colors.accent,
            border: 'none',
            borderRadius: '4px',
            color: '#ffffff',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Ask
        </button>
      </form>
    </div>
  );
};

// E) Preview Panel
interface PreviewPanelProps {
  panel: ReturnType<typeof useXRSpaceBuilder>['preview']['panel'];
  isPreviewing: boolean;
  onStartPreview: () => void;
  onStopPreview: () => void;
  onModeChange: (mode: 'static' | 'walkthrough' | 'observer' | 'overlay') => void;
  onToggleOverlay: (overlay: 'cognitive_load' | 'meaning_layer') => void;
  onMarkComplete: () => void;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({
  panel,
  isPreviewing,
  onStartPreview,
  onStopPreview,
  onModeChange,
  onToggleOverlay,
  onMarkComplete,
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: '16px',
      gap: '24px',
    }}
  >
    {/* Preview controls */}
    <div style={{ display: 'flex', gap: '8px' }}>
      {isPreviewing ? (
        <button
          onClick={onStopPreview}
          style={{
            padding: '12px 24px',
            backgroundColor: XR_SPACE_BUILDER_TOKENS.validation.fail,
            border: 'none',
            borderRadius: '4px',
            color: '#ffffff',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Exit Preview
        </button>
      ) : (
        <button
          onClick={onStartPreview}
          style={{
            padding: '12px 24px',
            backgroundColor: XR_SPACE_BUILDER_TOKENS.colors.accent,
            border: 'none',
            borderRadius: '4px',
            color: '#ffffff',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Enter XR Preview
        </button>
      )}
    </div>
    
    {/* Mode selection */}
    <div style={{ display: 'flex', gap: '8px' }}>
      {panel.simulations.slice(0, 2).map((sim) => (
        <button
          key={sim.id}
          onClick={() => onModeChange(sim.id as any)}
          disabled={!isPreviewing}
          style={{
            padding: '8px 16px',
            backgroundColor: 'transparent',
            border: `1px solid ${XR_SPACE_BUILDER_TOKENS.colors.border}`,
            borderRadius: '4px',
            color: XR_SPACE_BUILDER_TOKENS.colors.text_primary,
            cursor: isPreviewing ? 'pointer' : 'not-allowed',
            opacity: isPreviewing ? 1 : 0.5,
            fontSize: '12px',
          }}
          title={sim.description}
        >
          {sim.name}
        </button>
      ))}
    </div>
    
    {/* Overlays */}
    <div style={{ display: 'flex', gap: '8px' }}>
      <button
        onClick={() => onToggleOverlay('cognitive_load')}
        disabled={!isPreviewing}
        style={{
          padding: '8px 16px',
          backgroundColor: panel.state.cognitive_load_visible
            ? XR_SPACE_BUILDER_TOKENS.colors.accent
            : 'transparent',
          border: `1px solid ${XR_SPACE_BUILDER_TOKENS.colors.border}`,
          borderRadius: '4px',
          color: XR_SPACE_BUILDER_TOKENS.colors.text_primary,
          cursor: isPreviewing ? 'pointer' : 'not-allowed',
          opacity: isPreviewing ? 1 : 0.5,
          fontSize: '12px',
        }}
      >
        Cognitive Load
      </button>
      <button
        onClick={() => onToggleOverlay('meaning_layer')}
        disabled={!isPreviewing}
        style={{
          padding: '8px 16px',
          backgroundColor: panel.state.meaning_layer_visible
            ? XR_SPACE_BUILDER_TOKENS.colors.accent
            : 'transparent',
          border: `1px solid ${XR_SPACE_BUILDER_TOKENS.colors.border}`,
          borderRadius: '4px',
          color: XR_SPACE_BUILDER_TOKENS.colors.text_primary,
          cursor: isPreviewing ? 'pointer' : 'not-allowed',
          opacity: isPreviewing ? 1 : 0.5,
          fontSize: '12px',
        }}
      >
        Meaning Layer
      </button>
    </div>
    
    {/* Mark complete */}
    <button
      onClick={onMarkComplete}
      disabled={!isPreviewing}
      style={{
        padding: '8px 16px',
        backgroundColor: XR_SPACE_BUILDER_TOKENS.colors.success,
        border: 'none',
        borderRadius: '4px',
        color: '#ffffff',
        cursor: isPreviewing ? 'pointer' : 'not-allowed',
        opacity: isPreviewing ? 1 : 0.5,
        fontSize: '12px',
      }}
    >
      ✓ Preview Complete
    </button>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default XRSpaceBuilder;
