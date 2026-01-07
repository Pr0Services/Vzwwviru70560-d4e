// CHE·NU™ Stepper & Wizard Component
// Comprehensive multi-step navigation and form wizard

import React, {
  useState,
  useCallback,
  useMemo,
  createContext,
  useContext,
  ReactNode,
  CSSProperties,
} from 'react';

// ============================================================
// TYPES
// ============================================================

type StepStatus = 'pending' | 'current' | 'completed' | 'error' | 'skipped';
type StepperOrientation = 'horizontal' | 'vertical';
type StepperSize = 'sm' | 'md' | 'lg';
type StepperVariant = 'default' | 'dots' | 'progress' | 'simple';

interface Step {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  optional?: boolean;
  disabled?: boolean;
  content?: ReactNode;
  validate?: () => boolean | Promise<boolean>;
  onEnter?: () => void;
  onLeave?: () => void;
}

interface StepperContextValue {
  steps: Step[];
  currentStep: number;
  completedSteps: Set<number>;
  errorSteps: Set<number>;
  skippedSteps: Set<number>;
  goToStep: (step: number) => void;
  nextStep: () => Promise<boolean>;
  prevStep: () => void;
  skipStep: () => void;
  completeStep: (step: number) => void;
  setError: (step: number, hasError: boolean) => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  canGoNext: boolean;
  canGoPrev: boolean;
}

interface StepperProps {
  steps: Step[];
  initialStep?: number;
  orientation?: StepperOrientation;
  size?: StepperSize;
  variant?: StepperVariant;
  allowNavigation?: boolean;
  linear?: boolean;
  showStepNumbers?: boolean;
  showConnector?: boolean;
  onStepChange?: (step: number, direction: 'next' | 'prev' | 'skip' | 'jump') => void;
  onComplete?: () => void;
  className?: string;
  children?: ReactNode;
}

interface StepProps {
  step: Step;
  index: number;
  status: StepStatus;
  isFirst: boolean;
  isLast: boolean;
  orientation: StepperOrientation;
  size: StepperSize;
  variant: StepperVariant;
  showNumber: boolean;
  showConnector: boolean;
  allowNavigation: boolean;
  onClick: (index: number) => void;
}

interface StepContentProps {
  children: ReactNode;
  className?: string;
}

interface StepActionsProps {
  showPrev?: boolean;
  showNext?: boolean;
  showSkip?: boolean;
  prevLabel?: string;
  nextLabel?: string;
  skipLabel?: string;
  completeLabel?: string;
  loading?: boolean;
  className?: string;
}

interface WizardProps extends Omit<StepperProps, 'children'> {
  showNavigation?: boolean;
  showProgress?: boolean;
  prevLabel?: string;
  nextLabel?: string;
  skipLabel?: string;
  completeLabel?: string;
  onComplete?: () => void;
  renderStep?: (step: Step, index: number) => ReactNode;
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
  titleSize: number;
  descSize: number;
  connectorWidth: number;
  spacing: number;
}> = {
  sm: { iconSize: 28, fontSize: 12, titleSize: 13, descSize: 11, connectorWidth: 2, spacing: 8 },
  md: { iconSize: 36, fontSize: 14, titleSize: 14, descSize: 12, connectorWidth: 2, spacing: 12 },
  lg: { iconSize: 44, fontSize: 16, titleSize: 16, descSize: 13, connectorWidth: 3, spacing: 16 },
};

const STATUS_CONFIG: Record<StepStatus, { bgColor: string; color: string; borderColor: string }> = {
  pending: { bgColor: '#ffffff', color: BRAND.ancientStone, borderColor: `${BRAND.ancientStone}40` },
  current: { bgColor: BRAND.sacredGold, color: '#ffffff', borderColor: BRAND.sacredGold },
  completed: { bgColor: BRAND.cenoteTurquoise, color: '#ffffff', borderColor: BRAND.cenoteTurquoise },
  error: { bgColor: '#FFF5F5', color: '#E53E3E', borderColor: '#E53E3E' },
  skipped: { bgColor: BRAND.softSand, color: BRAND.ancientStone, borderColor: `${BRAND.ancientStone}30` },
};

// ============================================================
// STYLES
// ============================================================

const styles = {
  container: {
    display: 'flex',
    width: '100%',
  },

  containerHorizontal: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start',
  },

  containerVertical: {
    flexDirection: 'column' as const,
  },

  stepContainer: {
    display: 'flex',
    position: 'relative' as const,
  },

  stepContainerHorizontal: {
    flexDirection: 'column' as const,
    alignItems: 'center',
    flex: 1,
  },

  stepContainerVertical: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start',
  },

  stepIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    fontWeight: 600,
    transition: 'all 0.2s',
    flexShrink: 0,
    border: '2px solid',
    zIndex: 1,
  },

  stepIconClickable: {
    cursor: 'pointer',
  },

  stepIconDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  stepContent: {
    display: 'flex',
    flexDirection: 'column' as const,
  },

  stepContentHorizontal: {
    alignItems: 'center',
    textAlign: 'center' as const,
    marginTop: '8px',
    maxWidth: '120px',
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

  stepTitleCurrent: {
    color: BRAND.sacredGold,
  },

  stepTitleCompleted: {
    color: BRAND.cenoteTurquoise,
  },

  stepTitleError: {
    color: '#E53E3E',
  },

  stepDescription: {
    color: BRAND.ancientStone,
    marginTop: '2px',
    lineHeight: 1.4,
  },

  stepOptional: {
    fontSize: '11px',
    color: BRAND.ancientStone,
    fontStyle: 'italic' as const,
  },

  connector: {
    backgroundColor: `${BRAND.ancientStone}30`,
    transition: 'background-color 0.3s',
  },

  connectorCompleted: {
    backgroundColor: BRAND.cenoteTurquoise,
  },

  connectorHorizontal: {
    position: 'absolute' as const,
    top: '50%',
    transform: 'translateY(-50%)',
    left: '50%',
    right: '-50%',
  },

  connectorVertical: {
    position: 'absolute' as const,
    width: '2px',
    top: '0',
    bottom: '0',
    left: '50%',
    transform: 'translateX(-50%)',
  },

  // Progress variant
  progressContainer: {
    width: '100%',
    marginBottom: '24px',
  },

  progressBar: {
    height: '8px',
    backgroundColor: `${BRAND.ancientStone}20`,
    borderRadius: '100px',
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: BRAND.sacredGold,
    borderRadius: '100px',
    transition: 'width 0.3s ease',
  },

  progressLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '8px',
  },

  progressLabel: {
    fontSize: '12px',
    color: BRAND.ancientStone,
  },

  progressLabelActive: {
    color: BRAND.sacredGold,
    fontWeight: 600,
  },

  // Dots variant
  dotsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '24px',
  },

  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: `${BRAND.ancientStone}30`,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  dotActive: {
    width: '24px',
    backgroundColor: BRAND.sacredGold,
    borderRadius: '6px',
  },

  dotCompleted: {
    backgroundColor: BRAND.cenoteTurquoise,
  },

  // Simple variant
  simpleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
  },

  simpleStep: {
    padding: '8px 16px',
    borderRadius: '100px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    backgroundColor: 'transparent',
    color: BRAND.ancientStone,
    border: `1px solid ${BRAND.ancientStone}30`,
  },

  simpleStepActive: {
    backgroundColor: BRAND.sacredGold,
    color: '#ffffff',
    borderColor: BRAND.sacredGold,
  },

  simpleStepCompleted: {
    backgroundColor: `${BRAND.cenoteTurquoise}15`,
    color: BRAND.cenoteTurquoise,
    borderColor: BRAND.cenoteTurquoise,
  },

  // Content area
  stepContentArea: {
    padding: '24px 0',
  },

  // Actions
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    paddingTop: '24px',
    borderTop: `1px solid ${BRAND.ancientStone}15`,
    marginTop: '24px',
  },

  actionsRight: {
    display: 'flex',
    gap: '12px',
  },

  button: {
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
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
    backgroundColor: BRAND.softSand,
  },

  buttonText: {
    backgroundColor: 'transparent',
    color: BRAND.ancientStone,
  },

  buttonTextHover: {
    color: BRAND.uiSlate,
  },

  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  buttonLoading: {
    position: 'relative' as const,
  },

  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid transparent',
    borderTopColor: 'currentColor',
    borderRadius: '50%',
    animation: 'spin 0.6s linear infinite',
  },
};

// ============================================================
// CONTEXT
// ============================================================

const StepperContext = createContext<StepperContextValue | null>(null);

export function useStepperContext(): StepperContextValue {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error('useStepperContext must be used within a Stepper component');
  }
  return context;
}

// ============================================================
// STEP ICON COMPONENT
// ============================================================

interface StepIconProps {
  index: number;
  status: StepStatus;
  icon?: ReactNode;
  showNumber: boolean;
  size: StepperSize;
}

function StepIcon({ index, status, icon, showNumber, size }: StepIconProps): JSX.Element {
  const sizeConfig = SIZE_CONFIG[size];
  const statusConfig = STATUS_CONFIG[status];

  const iconStyle: CSSProperties = {
    ...styles.stepIcon,
    width: sizeConfig.iconSize,
    height: sizeConfig.iconSize,
    fontSize: sizeConfig.fontSize,
    backgroundColor: statusConfig.bgColor,
    color: statusConfig.color,
    borderColor: statusConfig.borderColor,
  };

  let content: ReactNode = null;

  if (status === 'completed') {
    content = '✓';
  } else if (status === 'error') {
    content = '!';
  } else if (icon) {
    content = icon;
  } else if (showNumber) {
    content = index + 1;
  }

  return <div style={iconStyle}>{content}</div>;
}

// ============================================================
// STEP COMPONENT
// ============================================================

function StepItem({
  step,
  index,
  status,
  isFirst,
  isLast,
  orientation,
  size,
  variant,
  showNumber,
  showConnector,
  allowNavigation,
  onClick,
}: StepProps): JSX.Element {
  const sizeConfig = SIZE_CONFIG[size];
  const statusConfig = STATUS_CONFIG[status];

  const isHorizontal = orientation === 'horizontal';
  const canClick = allowNavigation && !step.disabled;

  const containerStyle: CSSProperties = {
    ...styles.stepContainer,
    ...(isHorizontal ? styles.stepContainerHorizontal : styles.stepContainerVertical),
  };

  const iconContainerStyle: CSSProperties = {
    position: 'relative',
    ...(canClick && styles.stepIconClickable),
    ...(step.disabled && styles.stepIconDisabled),
  };

  const contentStyle: CSSProperties = {
    ...styles.stepContent,
    ...(isHorizontal ? styles.stepContentHorizontal : styles.stepContentVertical),
  };

  const titleStyle: CSSProperties = {
    ...styles.stepTitle,
    fontSize: sizeConfig.titleSize,
    ...(status === 'current' && styles.stepTitleCurrent),
    ...(status === 'completed' && styles.stepTitleCompleted),
    ...(status === 'error' && styles.stepTitleError),
  };

  const descriptionStyle: CSSProperties = {
    ...styles.stepDescription,
    fontSize: sizeConfig.descSize,
  };

  // Connector for horizontal layout
  const renderHorizontalConnector = () => {
    if (!showConnector || isLast) return null;

    const connectorStyle: CSSProperties = {
      ...styles.connector,
      ...styles.connectorHorizontal,
      height: sizeConfig.connectorWidth,
      ...(status === 'completed' && styles.connectorCompleted),
    };

    return <div style={connectorStyle} />;
  };

  // Connector for vertical layout
  const renderVerticalConnector = () => {
    if (!showConnector || isLast) return null;

    const connectorStyle: CSSProperties = {
      ...styles.connector,
      ...styles.connectorVertical,
      width: sizeConfig.connectorWidth,
      top: sizeConfig.iconSize,
      ...(status === 'completed' && styles.connectorCompleted),
    };

    return <div style={connectorStyle} />;
  };

  return (
    <div style={containerStyle}>
      <div style={iconContainerStyle} onClick={() => canClick && onClick(index)}>
        <StepIcon
          index={index}
          status={status}
          icon={step.icon}
          showNumber={showNumber}
          size={size}
        />
        {isHorizontal && renderHorizontalConnector()}
        {!isHorizontal && renderVerticalConnector()}
      </div>

      <div style={contentStyle}>
        <div style={titleStyle}>{step.title}</div>
        {step.description && <div style={descriptionStyle}>{step.description}</div>}
        {step.optional && <div style={styles.stepOptional}>Optional</div>}
      </div>
    </div>
  );
}

// ============================================================
// PROGRESS VARIANT
// ============================================================

interface ProgressStepperProps {
  steps: Step[];
  currentStep: number;
  completedSteps: Set<number>;
}

function ProgressStepper({ steps, currentStep, completedSteps }: ProgressStepperProps): JSX.Element {
  const totalSteps = steps.length;
  const completedCount = completedSteps.size;
  const progress = (completedCount / (totalSteps - 1)) * 100;

  return (
    <div style={styles.progressContainer}>
      <div style={styles.progressBar}>
        <div style={{ ...styles.progressFill, width: `${progress}%` }} />
      </div>
      <div style={styles.progressLabels}>
        {steps.map((step, index) => (
          <span
            key={step.id}
            style={{
              ...styles.progressLabel,
              ...(index === currentStep && styles.progressLabelActive),
            }}
          >
            {step.title}
          </span>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// DOTS VARIANT
// ============================================================

interface DotsStepperProps {
  steps: Step[];
  currentStep: number;
  completedSteps: Set<number>;
  allowNavigation: boolean;
  onStepClick: (index: number) => void;
}

function DotsStepper({
  steps,
  currentStep,
  completedSteps,
  allowNavigation,
  onStepClick,
}: DotsStepperProps): JSX.Element {
  return (
    <div style={styles.dotsContainer}>
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = completedSteps.has(index);

        return (
          <div
            key={step.id}
            style={{
              ...styles.dot,
              ...(isActive && styles.dotActive),
              ...(isCompleted && !isActive && styles.dotCompleted),
              cursor: allowNavigation ? 'pointer' : 'default',
            }}
            onClick={() => allowNavigation && onStepClick(index)}
            title={step.title}
          />
        );
      })}
    </div>
  );
}

// ============================================================
// SIMPLE VARIANT
// ============================================================

interface SimpleStepperProps {
  steps: Step[];
  currentStep: number;
  completedSteps: Set<number>;
  allowNavigation: boolean;
  onStepClick: (index: number) => void;
}

function SimpleStepper({
  steps,
  currentStep,
  completedSteps,
  allowNavigation,
  onStepClick,
}: SimpleStepperProps): JSX.Element {
  return (
    <div style={styles.simpleContainer}>
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = completedSteps.has(index);

        return (
          <div
            key={step.id}
            style={{
              ...styles.simpleStep,
              ...(isActive && styles.simpleStepActive),
              ...(isCompleted && !isActive && styles.simpleStepCompleted),
              cursor: allowNavigation ? 'pointer' : 'default',
            }}
            onClick={() => allowNavigation && onStepClick(index)}
          >
            {index + 1}. {step.title}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// STEP CONTENT COMPONENT
// ============================================================

export function StepContent({ children, className }: StepContentProps): JSX.Element {
  return (
    <div style={styles.stepContentArea} className={className}>
      {children}
    </div>
  );
}

// ============================================================
// STEP ACTIONS COMPONENT
// ============================================================

export function StepActions({
  showPrev = true,
  showNext = true,
  showSkip = false,
  prevLabel = 'Back',
  nextLabel = 'Next',
  skipLabel = 'Skip',
  completeLabel = 'Complete',
  loading = false,
  className,
}: StepActionsProps): JSX.Element {
  const {
    isFirstStep,
    isLastStep,
    canGoPrev,
    canGoNext,
    prevStep,
    nextStep,
    skipStep,
    steps,
    currentStep,
  } = useStepperContext();

  const [prevHovered, setPrevHovered] = useState(false);
  const [nextHovered, setNextHovered] = useState(false);
  const [skipHovered, setSkipHovered] = useState(false);

  const currentStepData = steps[currentStep];
  const isOptional = currentStepData?.optional;

  const handleNext = useCallback(async () => {
    await nextStep();
  }, [nextStep]);

  return (
    <div style={styles.actions} className={className}>
      <div>
        {showPrev && !isFirstStep && (
          <button
            style={{
              ...styles.button,
              ...styles.buttonSecondary,
              ...(prevHovered && styles.buttonSecondaryHover),
              ...(!canGoPrev && styles.buttonDisabled),
            }}
            disabled={!canGoPrev || loading}
            onClick={prevStep}
            onMouseEnter={() => setPrevHovered(true)}
            onMouseLeave={() => setPrevHovered(false)}
          >
            ← {prevLabel}
          </button>
        )}
      </div>

      <div style={styles.actionsRight}>
        {showSkip && isOptional && !isLastStep && (
          <button
            style={{
              ...styles.button,
              ...styles.buttonText,
              ...(skipHovered && styles.buttonTextHover),
            }}
            onClick={skipStep}
            disabled={loading}
            onMouseEnter={() => setSkipHovered(true)}
            onMouseLeave={() => setSkipHovered(false)}
          >
            {skipLabel}
          </button>
        )}

        {showNext && (
          <button
            style={{
              ...styles.button,
              ...styles.buttonPrimary,
              ...(nextHovered && styles.buttonPrimaryHover),
              ...(!canGoNext && styles.buttonDisabled),
              ...(loading && styles.buttonLoading),
            }}
            disabled={!canGoNext || loading}
            onClick={handleNext}
            onMouseEnter={() => setNextHovered(true)}
            onMouseLeave={() => setNextHovered(false)}
          >
            {loading && <div style={styles.spinner} />}
            {isLastStep ? completeLabel : nextLabel} {!isLastStep && '→'}
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================
// MAIN STEPPER COMPONENT
// ============================================================

export function Stepper({
  steps,
  initialStep = 0,
  orientation = 'horizontal',
  size = 'md',
  variant = 'default',
  allowNavigation = false,
  linear = true,
  showStepNumbers = true,
  showConnector = true,
  onStepChange,
  onComplete,
  className,
  children,
}: StepperProps): JSX.Element {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [errorSteps, setErrorSteps] = useState<Set<number>>(new Set());
  const [skippedSteps, setSkippedSteps] = useState<Set<number>>(new Set());

  const totalSteps = steps.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const canGoNext = useMemo(() => {
    if (currentStep >= totalSteps - 1) return true; // Allow completing last step
    const step = steps[currentStep];
    return !step.disabled;
  }, [currentStep, steps, totalSteps]);

  const canGoPrev = useMemo(() => {
    if (currentStep <= 0) return false;
    if (linear) {
      return true;
    }
    const prevStep = steps[currentStep - 1];
    return !prevStep.disabled;
  }, [currentStep, steps, linear]);

  const getStepStatus = useCallback((index: number): StepStatus => {
    if (errorSteps.has(index)) return 'error';
    if (index === currentStep) return 'current';
    if (completedSteps.has(index)) return 'completed';
    if (skippedSteps.has(index)) return 'skipped';
    return 'pending';
  }, [currentStep, completedSteps, errorSteps, skippedSteps]);

  const goToStep = useCallback((step: number) => {
    if (step < 0 || step >= totalSteps) return;
    
    const currentStepData = steps[currentStep];
    currentStepData.onLeave?.();

    const newStepData = steps[step];
    newStepData.onEnter?.();

    setCurrentStep(step);
    onStepChange?.(step, 'jump');
  }, [currentStep, steps, totalSteps, onStepChange]);

  const nextStep = useCallback(async (): Promise<boolean> => {
    const step = steps[currentStep];

    // Validate current step
    if (step.validate) {
      const isValid = await step.validate();
      if (!isValid) {
        setErrorSteps((prev) => new Set(prev).add(currentStep));
        return false;
      }
    }

    // Clear any error
    setErrorSteps((prev) => {
      const next = new Set(prev);
      next.delete(currentStep);
      return next;
    });

    // Mark as completed
    setCompletedSteps((prev) => new Set(prev).add(currentStep));

    step.onLeave?.();

    if (isLastStep) {
      onComplete?.();
      return true;
    }

    const nextIndex = currentStep + 1;
    const nextStepData = steps[nextIndex];
    nextStepData.onEnter?.();

    setCurrentStep(nextIndex);
    onStepChange?.(nextIndex, 'next');
    return true;
  }, [currentStep, steps, isLastStep, onComplete, onStepChange]);

  const prevStep = useCallback(() => {
    if (!canGoPrev) return;

    const currentStepData = steps[currentStep];
    currentStepData.onLeave?.();

    const prevIndex = currentStep - 1;
    const prevStepData = steps[prevIndex];
    prevStepData.onEnter?.();

    setCurrentStep(prevIndex);
    onStepChange?.(prevIndex, 'prev');
  }, [canGoPrev, currentStep, steps, onStepChange]);

  const skipStep = useCallback(() => {
    const step = steps[currentStep];
    if (!step.optional) return;

    step.onLeave?.();

    setSkippedSteps((prev) => new Set(prev).add(currentStep));

    if (isLastStep) {
      onComplete?.();
      return;
    }

    const nextIndex = currentStep + 1;
    const nextStepData = steps[nextIndex];
    nextStepData.onEnter?.();

    setCurrentStep(nextIndex);
    onStepChange?.(nextIndex, 'skip');
  }, [currentStep, steps, isLastStep, onComplete, onStepChange]);

  const completeStep = useCallback((step: number) => {
    setCompletedSteps((prev) => new Set(prev).add(step));
  }, []);

  const setError = useCallback((step: number, hasError: boolean) => {
    setErrorSteps((prev) => {
      const next = new Set(prev);
      if (hasError) {
        next.add(step);
      } else {
        next.delete(step);
      }
      return next;
    });
  }, []);

  const handleStepClick = useCallback((index: number) => {
    if (!allowNavigation) return;
    if (linear && index > currentStep && !completedSteps.has(index - 1)) return;
    goToStep(index);
  }, [allowNavigation, linear, currentStep, completedSteps, goToStep]);

  const contextValue: StepperContextValue = {
    steps,
    currentStep,
    completedSteps,
    errorSteps,
    skippedSteps,
    goToStep,
    nextStep,
    prevStep,
    skipStep,
    completeStep,
    setError,
    isFirstStep,
    isLastStep,
    canGoNext,
    canGoPrev,
  };

  const containerStyle: CSSProperties = {
    ...styles.container,
    ...(orientation === 'horizontal' ? styles.containerHorizontal : styles.containerVertical),
  };

  return (
    <StepperContext.Provider value={contextValue}>
      <div className={className}>
        {/* Render variant */}
        {variant === 'progress' && (
          <ProgressStepper
            steps={steps}
            currentStep={currentStep}
            completedSteps={completedSteps}
          />
        )}

        {variant === 'dots' && (
          <DotsStepper
            steps={steps}
            currentStep={currentStep}
            completedSteps={completedSteps}
            allowNavigation={allowNavigation}
            onStepClick={handleStepClick}
          />
        )}

        {variant === 'simple' && (
          <SimpleStepper
            steps={steps}
            currentStep={currentStep}
            completedSteps={completedSteps}
            allowNavigation={allowNavigation}
            onStepClick={handleStepClick}
          />
        )}

        {variant === 'default' && (
          <div style={containerStyle}>
            {steps.map((step, index) => (
              <StepItem
                key={step.id}
                step={step}
                index={index}
                status={getStepStatus(index)}
                isFirst={index === 0}
                isLast={index === totalSteps - 1}
                orientation={orientation}
                size={size}
                variant={variant}
                showNumber={showStepNumbers}
                showConnector={showConnector}
                allowNavigation={allowNavigation && (!linear || index <= currentStep)}
                onClick={handleStepClick}
              />
            ))}
          </div>
        )}

        {/* Children (content + actions) */}
        {children}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </StepperContext.Provider>
  );
}

// ============================================================
// WIZARD COMPONENT (Pre-configured Stepper)
// ============================================================

export function Wizard({
  steps,
  initialStep = 0,
  orientation = 'horizontal',
  size = 'md',
  variant = 'default',
  allowNavigation = false,
  linear = true,
  showStepNumbers = true,
  showConnector = true,
  showNavigation = true,
  showProgress = false,
  prevLabel = 'Back',
  nextLabel = 'Next',
  skipLabel = 'Skip',
  completeLabel = 'Complete',
  onStepChange,
  onComplete,
  renderStep,
  className,
}: WizardProps): JSX.Element {
  return (
    <Stepper
      steps={steps}
      initialStep={initialStep}
      orientation={orientation}
      size={size}
      variant={variant}
      allowNavigation={allowNavigation}
      linear={linear}
      showStepNumbers={showStepNumbers}
      showConnector={showConnector}
      onStepChange={onStepChange}
      onComplete={onComplete}
      className={className}
    >
      <WizardContent
        steps={steps}
        showNavigation={showNavigation}
        prevLabel={prevLabel}
        nextLabel={nextLabel}
        skipLabel={skipLabel}
        completeLabel={completeLabel}
        renderStep={renderStep}
      />
    </Stepper>
  );
}

interface WizardContentProps {
  steps: Step[];
  showNavigation: boolean;
  prevLabel: string;
  nextLabel: string;
  skipLabel: string;
  completeLabel: string;
  renderStep?: (step: Step, index: number) => ReactNode;
}

function WizardContent({
  steps,
  showNavigation,
  prevLabel,
  nextLabel,
  skipLabel,
  completeLabel,
  renderStep,
}: WizardContentProps): JSX.Element {
  const { currentStep } = useStepperContext();
  const currentStepData = steps[currentStep];

  return (
    <>
      <StepContent>
        {renderStep
          ? renderStep(currentStepData, currentStep)
          : currentStepData.content}
      </StepContent>

      {showNavigation && (
        <StepActions
          prevLabel={prevLabel}
          nextLabel={nextLabel}
          skipLabel={skipLabel}
          completeLabel={completeLabel}
          showSkip={currentStepData.optional}
        />
      )}
    </>
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
  StepContentProps,
  StepActionsProps,
  WizardProps,
};

export { SIZE_CONFIG, STATUS_CONFIG };

export default {
  Stepper,
  StepContent,
  StepActions,
  Wizard,
  useStepperContext,
};
