// CHE·NU™ Stepper & Wizard Component
// Comprehensive multi-step forms and guided workflows

import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  createContext,
  useContext,
  ReactNode,
  CSSProperties,
} from 'react';

// ============================================================
// TYPES
// ============================================================

type StepStatus = 'pending' | 'active' | 'completed' | 'error' | 'skipped';
type StepperOrientation = 'horizontal' | 'vertical';
type StepperSize = 'sm' | 'md' | 'lg';
type StepperVariant = 'default' | 'outline' | 'minimal' | 'dots';

interface Step {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  optional?: boolean;
  disabled?: boolean;
  validationFn?: () => boolean | Promise<boolean>;
  content?: ReactNode;
}

interface StepperContextValue {
  currentStep: number;
  steps: Step[];
  orientation: StepperOrientation;
  isFirstStep: boolean;
  isLastStep: boolean;
  goToStep: (index: number) => void;
  nextStep: () => Promise<boolean>;
  prevStep: () => void;
  reset: () => void;
  getStepStatus: (index: number) => StepStatus;
  completedSteps: Set<number>;
  errorSteps: Set<number>;
  skippedSteps: Set<number>;
}

interface StepperProps {
  steps: Step[];
  currentStep?: number;
  defaultStep?: number;
  orientation?: StepperOrientation;
  size?: StepperSize;
  variant?: StepperVariant;
  showStepNumbers?: boolean;
  allowClickableSteps?: boolean;
  allowSkip?: boolean;
  linear?: boolean;
  onChange?: (step: number) => void;
  onComplete?: () => void;
  onStepComplete?: (step: number) => void;
  className?: string;
  children?: ReactNode;
}

interface StepperHeaderProps {
  steps: Step[];
  currentStep: number;
  orientation?: StepperOrientation;
  size?: StepperSize;
  variant?: StepperVariant;
  showStepNumbers?: boolean;
  allowClickableSteps?: boolean;
  completedSteps: Set<number>;
  errorSteps: Set<number>;
  skippedSteps: Set<number>;
  onStepClick?: (index: number) => void;
  className?: string;
}

interface StepperContentProps {
  children: ReactNode;
  className?: string;
}

interface StepperActionsProps {
  nextLabel?: string;
  prevLabel?: string;
  finishLabel?: string;
  skipLabel?: string;
  showSkip?: boolean;
  showPrev?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onNext?: () => void | Promise<void>;
  onPrev?: () => void;
  onSkip?: () => void;
  onFinish?: () => void | Promise<void>;
  className?: string;
}

interface WizardProps extends Omit<StepperProps, 'children'> {
  renderStep?: (step: Step, index: number) => ReactNode;
  nextLabel?: string;
  prevLabel?: string;
  finishLabel?: string;
  skipLabel?: string;
  showSkip?: boolean;
  loading?: boolean;
  onFinish?: () => void | Promise<void>;
  headerClassName?: string;
  contentClassName?: string;
  actionsClassName?: string;
}

// ============================================================
// BRAND COLORS (Memory Prompt)
// ============================================================

const BRAND = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
};

// ============================================================
// CONSTANTS
// ============================================================

const SIZE_CONFIG: Record<StepperSize, {
  iconSize: number;
  fontSize: number;
  connectorHeight: number;
  spacing: number;
}> = {
  sm: { iconSize: 28, fontSize: 12, connectorHeight: 2, spacing: 8 },
  md: { iconSize: 36, fontSize: 14, connectorHeight: 2, spacing: 12 },
  lg: { iconSize: 44, fontSize: 16, connectorHeight: 3, spacing: 16 },
};

const STATUS_COLORS: Record<StepStatus, { bg: string; border: string; text: string; icon: string }> = {
  pending: {
    bg: '#ffffff',
    border: `${BRAND.ancientStone}40`,
    text: BRAND.ancientStone,
    icon: BRAND.ancientStone,
  },
  active: {
    bg: BRAND.sacredGold,
    border: BRAND.sacredGold,
    text: '#ffffff',
    icon: '#ffffff',
  },
  completed: {
    bg: BRAND.jungleEmerald,
    border: BRAND.jungleEmerald,
    text: '#ffffff',
    icon: '#ffffff',
  },
  error: {
    bg: '#E53E3E',
    border: '#E53E3E',
    text: '#ffffff',
    icon: '#ffffff',
  },
  skipped: {
    bg: `${BRAND.ancientStone}20`,
    border: `${BRAND.ancientStone}40`,
    text: BRAND.ancientStone,
    icon: BRAND.ancientStone,
  },
};

// ============================================================
// CONTEXT
// ============================================================

const StepperContext = createContext<StepperContextValue | null>(null);

export function useStepper(): StepperContextValue {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error('useStepper must be used within Stepper');
  }
  return context;
}

// ============================================================
// STYLES
// ============================================================

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    width: '100%',
  },

  // Header styles
  header: {
    display: 'flex',
    alignItems: 'flex-start',
  },

  headerHorizontal: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
  },

  headerVertical: {
    flexDirection: 'column' as const,
  },

  step: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative' as const,
  },

  stepHorizontal: {
    flexDirection: 'column' as const,
    flex: 1,
  },

  stepVertical: {
    flexDirection: 'row' as const,
    marginBottom: '24px',
  },

  stepClickable: {
    cursor: 'pointer',
  },

  stepIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    fontWeight: 600,
    transition: 'all 0.2s',
    flexShrink: 0,
    position: 'relative' as const,
    zIndex: 1,
  },

  stepIconOutline: {
    backgroundColor: 'transparent',
    borderWidth: '2px',
    borderStyle: 'solid',
  },

  stepIconMinimal: {
    backgroundColor: 'transparent',
    border: 'none',
  },

  stepIconDots: {
    borderRadius: '50%',
  },

  stepContent: {
    display: 'flex',
    flexDirection: 'column' as const,
  },

  stepContentHorizontal: {
    alignItems: 'center',
    textAlign: 'center' as const,
    marginTop: '8px',
  },

  stepContentVertical: {
    marginLeft: '12px',
    paddingBottom: '24px',
  },

  stepTitle: {
    fontWeight: 600,
    color: BRAND.uiSlate,
    lineHeight: 1.3,
  },

  stepTitleActive: {
    color: BRAND.sacredGold,
  },

  stepTitleCompleted: {
    color: BRAND.jungleEmerald,
  },

  stepDescription: {
    color: BRAND.ancientStone,
    marginTop: '2px',
    lineHeight: 1.4,
  },

  stepOptional: {
    fontSize: '11px',
    color: BRAND.ancientStone,
    fontStyle: 'italic',
  },

  connector: {
    backgroundColor: `${BRAND.ancientStone}30`,
    transition: 'background-color 0.3s',
  },

  connectorHorizontal: {
    flex: 1,
    height: '2px',
    marginLeft: '8px',
    marginRight: '8px',
    alignSelf: 'center',
  },

  connectorVertical: {
    position: 'absolute' as const,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '2px',
    top: '100%',
    bottom: '-24px',
  },

  connectorCompleted: {
    backgroundColor: BRAND.jungleEmerald,
  },

  connectorActive: {
    backgroundColor: BRAND.sacredGold,
  },

  // Content styles
  content: {
    padding: '24px 0',
  },

  contentVertical: {
    paddingLeft: '48px',
  },

  // Actions styles
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    paddingTop: '24px',
    borderTop: `1px solid ${BRAND.ancientStone}15`,
  },

  actionsLeft: {
    display: 'flex',
    gap: '8px',
  },

  actionsRight: {
    display: 'flex',
    gap: '8px',
  },

  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 500,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: 'none',
  },

  buttonPrimary: {
    backgroundColor: BRAND.sacredGold,
    color: '#ffffff',
  },

  buttonPrimaryHover: {
    backgroundColor: BRAND.earthEmber,
  },

  buttonSecondary: {
    backgroundColor: 'transparent',
    color: BRAND.uiSlate,
    border: `1px solid ${BRAND.ancientStone}30`,
  },

  buttonSecondaryHover: {
    borderColor: BRAND.sacredGold,
    color: BRAND.sacredGold,
  },

  buttonLink: {
    backgroundColor: 'transparent',
    color: BRAND.ancientStone,
    padding: '10px 12px',
  },

  buttonLinkHover: {
    color: BRAND.uiSlate,
  },

  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  buttonLoading: {
    position: 'relative' as const,
    color: 'transparent',
  },

  spinner: {
    position: 'absolute' as const,
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#ffffff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },

  // Wizard styles
  wizard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: `1px solid ${BRAND.ancientStone}15`,
    padding: '24px',
  },

  wizardHeader: {
    marginBottom: '24px',
    paddingBottom: '24px',
    borderBottom: `1px solid ${BRAND.ancientStone}15`,
  },

  wizardContent: {
    minHeight: '200px',
  },

  wizardActions: {
    marginTop: '24px',
  },

  // Progress indicator
  progressBar: {
    width: '100%',
    height: '4px',
    backgroundColor: `${BRAND.ancientStone}20`,
    borderRadius: '100px',
    overflow: 'hidden',
    marginBottom: '24px',
  },

  progressFill: {
    height: '100%',
    backgroundColor: BRAND.sacredGold,
    borderRadius: '100px',
    transition: 'width 0.3s ease',
  },
};

// ============================================================
// STEP ICON COMPONENT
// ============================================================

interface StepIconProps {
  index: number;
  status: StepStatus;
  icon?: ReactNode;
  size: StepperSize;
  variant: StepperVariant;
  showNumber?: boolean;
}

function StepIcon({ index, status, icon, size, variant, showNumber = true }: StepIconProps): JSX.Element {
  const sizeConfig = SIZE_CONFIG[size];
  const statusColors = STATUS_COLORS[status];

  const iconStyle: CSSProperties = {
    ...styles.stepIcon,
    width: variant === 'dots' ? sizeConfig.iconSize / 2 : sizeConfig.iconSize,
    height: variant === 'dots' ? sizeConfig.iconSize / 2 : sizeConfig.iconSize,
    fontSize: sizeConfig.fontSize,
    backgroundColor: variant === 'outline' ? 'transparent' : statusColors.bg,
    borderColor: statusColors.border,
    color: variant === 'outline' ? statusColors.border : statusColors.text,
    ...(variant === 'outline' && styles.stepIconOutline),
    ...(variant === 'minimal' && styles.stepIconMinimal),
    ...(variant === 'dots' && styles.stepIconDots),
  };

  const renderContent = () => {
    if (status === 'completed') {
      return '✓';
    }
    if (status === 'error') {
      return '!';
    }
    if (icon) {
      return icon;
    }
    if (showNumber && variant !== 'dots') {
      return index + 1;
    }
    return null;
  };

  return <div style={iconStyle}>{renderContent()}</div>;
}

// ============================================================
// STEPPER HEADER COMPONENT
// ============================================================

export function StepperHeader({
  steps,
  currentStep,
  orientation = 'horizontal',
  size = 'md',
  variant = 'default',
  showStepNumbers = true,
  allowClickableSteps = false,
  completedSteps,
  errorSteps,
  skippedSteps,
  onStepClick,
  className,
}: StepperHeaderProps): JSX.Element {
  const sizeConfig = SIZE_CONFIG[size];
  const isHorizontal = orientation === 'horizontal';

  const getStepStatus = (index: number): StepStatus => {
    if (errorSteps.has(index)) return 'error';
    if (skippedSteps.has(index)) return 'skipped';
    if (completedSteps.has(index)) return 'completed';
    if (index === currentStep) return 'active';
    return 'pending';
  };

  const getConnectorStatus = (index: number): 'pending' | 'active' | 'completed' => {
    if (completedSteps.has(index)) return 'completed';
    if (index === currentStep) return 'active';
    return 'pending';
  };

  return (
    <div
      style={{
        ...styles.header,
        ...(isHorizontal ? styles.headerHorizontal : styles.headerVertical),
      }}
      className={className}
    >
      {steps.map((step, index) => {
        const status = getStepStatus(index);
        const isLast = index === steps.length - 1;
        const isClickable = allowClickableSteps && !step.disabled;

        return (
          <div
            key={step.id}
            style={{
              ...styles.step,
              ...(isHorizontal ? styles.stepHorizontal : styles.stepVertical),
              ...(isClickable && styles.stepClickable),
            }}
            onClick={() => isClickable && onStepClick?.(index)}
          >
            {/* Icon */}
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <StepIcon
                index={index}
                status={status}
                icon={step.icon}
                size={size}
                variant={variant}
                showNumber={showStepNumbers}
              />

              {/* Vertical connector */}
              {!isHorizontal && !isLast && (
                <div
                  style={{
                    ...styles.connector,
                    ...styles.connectorVertical,
                    height: '100%',
                    ...(getConnectorStatus(index) === 'completed' && styles.connectorCompleted),
                    ...(getConnectorStatus(index) === 'active' && styles.connectorActive),
                  }}
                />
              )}
            </div>

            {/* Content */}
            <div
              style={{
                ...styles.stepContent,
                ...(isHorizontal ? styles.stepContentHorizontal : styles.stepContentVertical),
              }}
            >
              <div
                style={{
                  ...styles.stepTitle,
                  fontSize: sizeConfig.fontSize,
                  ...(status === 'active' && styles.stepTitleActive),
                  ...(status === 'completed' && styles.stepTitleCompleted),
                }}
              >
                {step.title}
              </div>
              {step.description && (
                <div style={{ ...styles.stepDescription, fontSize: sizeConfig.fontSize - 2 }}>
                  {step.description}
                </div>
              )}
              {step.optional && (
                <div style={styles.stepOptional}>Optional</div>
              )}
            </div>

            {/* Horizontal connector */}
            {isHorizontal && !isLast && (
              <div
                style={{
                  ...styles.connector,
                  ...styles.connectorHorizontal,
                  height: sizeConfig.connectorHeight,
                  ...(getConnectorStatus(index) === 'completed' && styles.connectorCompleted),
                  ...(getConnectorStatus(index) === 'active' && styles.connectorActive),
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// STEPPER CONTENT COMPONENT
// ============================================================

export function StepperContent({ children, className }: StepperContentProps): JSX.Element {
  const { orientation } = useStepper();

  return (
    <div
      style={{
        ...styles.content,
        ...(orientation === 'vertical' && styles.contentVertical),
      }}
      className={className}
    >
      {children}
    </div>
  );
}

// ============================================================
// STEPPER ACTIONS COMPONENT
// ============================================================

export function StepperActions({
  nextLabel = 'Next',
  prevLabel = 'Back',
  finishLabel = 'Finish',
  skipLabel = 'Skip',
  showSkip = false,
  showPrev = true,
  loading = false,
  disabled = false,
  onNext,
  onPrev,
  onSkip,
  onFinish,
  className,
}: StepperActionsProps): JSX.Element {
  const { isFirstStep, isLastStep, nextStep, prevStep, steps, currentStep } = useStepper();
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const currentStepData = steps[currentStep];
  const canSkip = showSkip && currentStepData?.optional;

  const handleNext = async () => {
    if (onNext) {
      await onNext();
    } else {
      await nextStep();
    }
  };

  const handlePrev = () => {
    if (onPrev) {
      onPrev();
    } else {
      prevStep();
    }
  };

  const handleFinish = async () => {
    if (onFinish) {
      await onFinish();
    }
  };

  return (
    <div style={styles.actions} className={className}>
      <div style={styles.actionsLeft}>
        {showPrev && !isFirstStep && (
          <button
            style={{
              ...styles.button,
              ...styles.buttonSecondary,
              ...(hoveredButton === 'prev' && styles.buttonSecondaryHover),
              ...(disabled && styles.buttonDisabled),
            }}
            onClick={handlePrev}
            disabled={disabled || loading}
            onMouseEnter={() => setHoveredButton('prev')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            ← {prevLabel}
          </button>
        )}
      </div>

      <div style={styles.actionsRight}>
        {canSkip && (
          <button
            style={{
              ...styles.button,
              ...styles.buttonLink,
              ...(hoveredButton === 'skip' && styles.buttonLinkHover),
              ...(disabled && styles.buttonDisabled),
            }}
            onClick={onSkip}
            disabled={disabled || loading}
            onMouseEnter={() => setHoveredButton('skip')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            {skipLabel}
          </button>
        )}

        <button
          style={{
            ...styles.button,
            ...styles.buttonPrimary,
            ...(hoveredButton === 'next' && styles.buttonPrimaryHover),
            ...((disabled || loading) && styles.buttonDisabled),
            ...(loading && styles.buttonLoading),
          }}
          onClick={isLastStep ? handleFinish : handleNext}
          disabled={disabled || loading}
          onMouseEnter={() => setHoveredButton('next')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          {loading && <div style={styles.spinner} />}
          {isLastStep ? finishLabel : nextLabel} {!isLastStep && '→'}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// MAIN STEPPER COMPONENT
// ============================================================

export function Stepper({
  steps,
  currentStep: controlledStep,
  defaultStep = 0,
  orientation = 'horizontal',
  size = 'md',
  variant = 'default',
  showStepNumbers = true,
  allowClickableSteps = false,
  allowSkip = false,
  linear = true,
  onChange,
  onComplete,
  onStepComplete,
  className,
  children,
}: StepperProps): JSX.Element {
  const [internalStep, setInternalStep] = useState(defaultStep);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [errorSteps, setErrorSteps] = useState<Set<number>>(new Set());
  const [skippedSteps, setSkippedSteps] = useState<Set<number>>(new Set());

  const currentStep = controlledStep !== undefined ? controlledStep : internalStep;

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const goToStep = useCallback((index: number) => {
    if (linear && index > currentStep + 1) return;
    if (steps[index]?.disabled) return;

    setInternalStep(index);
    onChange?.(index);
  }, [currentStep, linear, steps, onChange]);

  const nextStep = useCallback(async (): Promise<boolean> => {
    const step = steps[currentStep];

    // Run validation if exists
    if (step.validationFn) {
      const isValid = await step.validationFn();
      if (!isValid) {
        setErrorSteps((prev) => new Set(prev).add(currentStep));
        return false;
      }
    }

    // Mark as completed
    setCompletedSteps((prev) => new Set(prev).add(currentStep));
    setErrorSteps((prev) => {
      const next = new Set(prev);
      next.delete(currentStep);
      return next;
    });
    onStepComplete?.(currentStep);

    // Move to next or complete
    if (isLastStep) {
      onComplete?.();
      return true;
    }

    const nextIndex = currentStep + 1;
    setInternalStep(nextIndex);
    onChange?.(nextIndex);
    return true;
  }, [currentStep, steps, isLastStep, onChange, onComplete, onStepComplete]);

  const prevStep = useCallback(() => {
    if (isFirstStep) return;
    const prevIndex = currentStep - 1;
    setInternalStep(prevIndex);
    onChange?.(prevIndex);
  }, [currentStep, isFirstStep, onChange]);

  const reset = useCallback(() => {
    setInternalStep(0);
    setCompletedSteps(new Set());
    setErrorSteps(new Set());
    setSkippedSteps(new Set());
    onChange?.(0);
  }, [onChange]);

  const getStepStatus = useCallback((index: number): StepStatus => {
    if (errorSteps.has(index)) return 'error';
    if (skippedSteps.has(index)) return 'skipped';
    if (completedSteps.has(index)) return 'completed';
    if (index === currentStep) return 'active';
    return 'pending';
  }, [currentStep, completedSteps, errorSteps, skippedSteps]);

  const handleStepClick = useCallback((index: number) => {
    if (!allowClickableSteps) return;
    if (linear && !completedSteps.has(index) && index !== currentStep && index > currentStep) return;
    goToStep(index);
  }, [allowClickableSteps, linear, completedSteps, currentStep, goToStep]);

  const contextValue: StepperContextValue = {
    currentStep,
    steps,
    orientation,
    isFirstStep,
    isLastStep,
    goToStep,
    nextStep,
    prevStep,
    reset,
    getStepStatus,
    completedSteps,
    errorSteps,
    skippedSteps,
  };

  return (
    <StepperContext.Provider value={contextValue}>
      <div style={styles.container} className={className}>
        <StepperHeader
          steps={steps}
          currentStep={currentStep}
          orientation={orientation}
          size={size}
          variant={variant}
          showStepNumbers={showStepNumbers}
          allowClickableSteps={allowClickableSteps}
          completedSteps={completedSteps}
          errorSteps={errorSteps}
          skippedSteps={skippedSteps}
          onStepClick={handleStepClick}
        />
        {children}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </StepperContext.Provider>
  );
}

// ============================================================
// WIZARD COMPONENT (Complete multi-step form)
// ============================================================

export function Wizard({
  steps,
  currentStep,
  defaultStep = 0,
  orientation = 'horizontal',
  size = 'md',
  variant = 'default',
  showStepNumbers = true,
  allowClickableSteps = false,
  allowSkip = false,
  linear = true,
  onChange,
  onComplete,
  onStepComplete,
  renderStep,
  nextLabel = 'Continue',
  prevLabel = 'Back',
  finishLabel = 'Complete',
  skipLabel = 'Skip this step',
  showSkip = false,
  loading = false,
  onFinish,
  className,
  headerClassName,
  contentClassName,
  actionsClassName,
}: WizardProps): JSX.Element {
  return (
    <div style={styles.wizard} className={className}>
      <Stepper
        steps={steps}
        currentStep={currentStep}
        defaultStep={defaultStep}
        orientation={orientation}
        size={size}
        variant={variant}
        showStepNumbers={showStepNumbers}
        allowClickableSteps={allowClickableSteps}
        allowSkip={allowSkip}
        linear={linear}
        onChange={onChange}
        onComplete={onComplete}
        onStepComplete={onStepComplete}
      >
        <WizardInner
          steps={steps}
          renderStep={renderStep}
          nextLabel={nextLabel}
          prevLabel={prevLabel}
          finishLabel={finishLabel}
          skipLabel={skipLabel}
          showSkip={showSkip}
          loading={loading}
          onFinish={onFinish}
          contentClassName={contentClassName}
          actionsClassName={actionsClassName}
        />
      </Stepper>
    </div>
  );
}

interface WizardInnerProps {
  steps: Step[];
  renderStep?: (step: Step, index: number) => ReactNode;
  nextLabel: string;
  prevLabel: string;
  finishLabel: string;
  skipLabel: string;
  showSkip: boolean;
  loading: boolean;
  onFinish?: () => void | Promise<void>;
  contentClassName?: string;
  actionsClassName?: string;
}

function WizardInner({
  steps,
  renderStep,
  nextLabel,
  prevLabel,
  finishLabel,
  skipLabel,
  showSkip,
  loading,
  onFinish,
  contentClassName,
  actionsClassName,
}: WizardInnerProps): JSX.Element {
  const { currentStep, completedSteps } = useStepper();
  const currentStepData = steps[currentStep];

  // Calculate progress
  const progress = ((completedSteps.size) / steps.length) * 100;

  return (
    <>
      {/* Progress bar */}
      <div style={styles.progressBar}>
        <div style={{ ...styles.progressFill, width: `${progress}%` }} />
      </div>

      {/* Content */}
      <StepperContent className={contentClassName}>
        <div style={styles.wizardContent}>
          {renderStep
            ? renderStep(currentStepData, currentStep)
            : currentStepData.content}
        </div>
      </StepperContent>

      {/* Actions */}
      <StepperActions
        nextLabel={nextLabel}
        prevLabel={prevLabel}
        finishLabel={finishLabel}
        skipLabel={skipLabel}
        showSkip={showSkip && currentStepData.optional}
        loading={loading}
        onFinish={onFinish}
        className={actionsClassName}
      />
    </>
  );
}

// ============================================================
// SIMPLE PROGRESS STEPS COMPONENT
// ============================================================

interface ProgressStepsProps {
  steps: string[];
  currentStep: number;
  size?: StepperSize;
  className?: string;
}

export function ProgressSteps({
  steps,
  currentStep,
  size = 'md',
  className,
}: ProgressStepsProps): JSX.Element {
  const sizeConfig = SIZE_CONFIG[size];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className={className}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <React.Fragment key={index}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  width: sizeConfig.iconSize * 0.6,
                  height: sizeConfig.iconSize * 0.6,
                  borderRadius: '50%',
                  backgroundColor: isCompleted
                    ? BRAND.jungleEmerald
                    : isActive
                      ? BRAND.sacredGold
                      : `${BRAND.ancientStone}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '10px',
                }}
              >
                {isCompleted && '✓'}
              </div>
              <span
                style={{
                  fontSize: sizeConfig.fontSize - 2,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? BRAND.uiSlate : BRAND.ancientStone,
                }}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: '2px',
                  backgroundColor: isCompleted ? BRAND.jungleEmerald : `${BRAND.ancientStone}20`,
                  marginLeft: '8px',
                  marginRight: '8px',
                  minWidth: '20px',
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ============================================================
// EXPORTS
// ============================================================

export type {
  StepStatus,
  StepperOrientation,
  StepperSize,
  StepperVariant,
  Step,
  StepperContextValue,
  StepperProps,
  StepperHeaderProps,
  StepperContentProps,
  StepperActionsProps,
  WizardProps,
  ProgressStepsProps,
};

export {
  SIZE_CONFIG,
  STATUS_COLORS,
};

export default {
  Stepper,
  StepperHeader,
  StepperContent,
  StepperActions,
  Wizard,
  ProgressSteps,
  useStepper,
};
