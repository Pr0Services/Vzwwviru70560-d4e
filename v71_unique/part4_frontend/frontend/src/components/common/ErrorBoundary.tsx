/**
 * CHE·NU™ Error Boundary
 * 
 * Robust error handling with recovery options.
 * Catches JavaScript errors and displays fallback UI.
 * 
 * @version V72.0
 * @phase Phase 1 - Fondations
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, resetError: () => void) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
  level?: 'page' | 'section' | 'component';
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// ═══════════════════════════════════════════════════════════════════════════
// ERROR BOUNDARY CLASS
// ═══════════════════════════════════════════════════════════════════════════

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    
    // Log error to console
    console.error('[ErrorBoundary] Caught error:', error);
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);
    
    // Call onError callback if provided
    this.props.onError?.(error, errorInfo);
    
    // Report to error tracking service (if configured)
    this.reportError(error, errorInfo);
  }

  private reportError(error: Error, errorInfo: ErrorInfo): void {
    // TODO: Send to error tracking service (Sentry, etc.)
    // For now, just log to console
    if (typeof window !== 'undefined' && (window as any).__CHENU_ERROR_REPORTER__) {
      (window as any).__CHENU_ERROR_REPORTER__({
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      });
    }
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback, showDetails = false, level = 'component' } = this.props;

    if (hasError && error) {
      // Custom fallback
      if (fallback) {
        if (typeof fallback === 'function') {
          return fallback(error, this.resetError);
        }
        return fallback;
      }

      // Default fallback UI based on level
      return (
        <DefaultErrorFallback
          error={error}
          errorInfo={errorInfo}
          resetError={this.resetError}
          showDetails={showDetails}
          level={level}
        />
      );
    }

    return children;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT FALLBACK COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface DefaultErrorFallbackProps {
  error: Error;
  errorInfo: ErrorInfo | null;
  resetError: () => void;
  showDetails: boolean;
  level: 'page' | 'section' | 'component';
}

const DefaultErrorFallback: React.FC<DefaultErrorFallbackProps> = ({
  error,
  errorInfo,
  resetError,
  showDetails,
  level,
}) => {
  const [showStack, setShowStack] = React.useState(false);

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const copyErrorDetails = () => {
    const details = `
Error: ${error.name}
Message: ${error.message}
${error.stack ? `\nStack:\n${error.stack}` : ''}
${errorInfo?.componentStack ? `\nComponent Stack:\n${errorInfo.componentStack}` : ''}
    `.trim();
    
    navigator.clipboard.writeText(details);
  };

  // Styles based on level
  const containerStyles: Record<typeof level, React.CSSProperties> = {
    page: {
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg-primary, #fff)',
    },
    section: {
      padding: '48px 24px',
      background: 'var(--color-bg-secondary, #f9f9f9)',
      borderRadius: '12px',
      margin: '16px',
    },
    component: {
      padding: '24px',
      background: 'var(--color-bg-tertiary, #f5f5f5)',
      borderRadius: '8px',
      margin: '8px',
    },
  };

  return (
    <div style={containerStyles[level]}>
      <div style={{ 
        maxWidth: level === 'page' ? '500px' : '100%', 
        textAlign: 'center' 
      }}>
        {/* Icon */}
        <div style={{ marginBottom: '24px' }}>
          <svg
            width={level === 'page' ? 64 : 48}
            height={level === 'page' ? 64 : 48}
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-error, #ef4444)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        {/* Title */}
        <h2 style={{ 
          fontSize: level === 'page' ? '24px' : '18px',
          fontWeight: 600,
          color: 'var(--color-text-primary, #1a1a1a)',
          marginBottom: '12px',
        }}>
          {level === 'page' 
            ? 'Une erreur est survenue' 
            : 'Erreur de chargement'
          }
        </h2>

        {/* Message */}
        <p style={{ 
          color: 'var(--color-text-secondary, #666)',
          marginBottom: '24px',
          fontSize: level === 'component' ? '14px' : '16px',
        }}>
          {error.message || 'Une erreur inattendue s\'est produite.'}
        </p>

        {/* Actions */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <button
            onClick={resetError}
            style={{
              padding: '10px 20px',
              background: 'var(--color-primary, #6366f1)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Réessayer
          </button>

          {level === 'page' && (
            <>
              <button
                onClick={handleReload}
                style={{
                  padding: '10px 20px',
                  background: 'var(--color-bg-tertiary, #f5f5f5)',
                  color: 'var(--color-text-primary, #1a1a1a)',
                  border: '1px solid var(--color-border, #e5e5e5)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Recharger la page
              </button>

              <button
                onClick={handleGoHome}
                style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  color: 'var(--color-text-secondary, #666)',
                  border: '1px solid var(--color-border, #e5e5e5)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Retour à l'accueil
              </button>
            </>
          )}
        </div>

        {/* Details toggle */}
        {(showDetails || process.env.NODE_ENV === 'development') && (
          <div style={{ marginTop: '24px' }}>
            <button
              onClick={() => setShowStack(!showStack)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-tertiary, #999)',
                fontSize: '12px',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              {showStack ? 'Masquer les détails' : 'Afficher les détails'}
            </button>

            {showStack && (
              <div style={{
                marginTop: '16px',
                padding: '16px',
                background: 'var(--color-bg-tertiary, #f5f5f5)',
                borderRadius: '8px',
                textAlign: 'left',
                position: 'relative',
              }}>
                <button
                  onClick={copyErrorDetails}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    padding: '4px 8px',
                    background: 'var(--color-bg-secondary, #fff)',
                    border: '1px solid var(--color-border, #e5e5e5)',
                    borderRadius: '4px',
                    fontSize: '11px',
                    cursor: 'pointer',
                  }}
                >
                  Copier
                </button>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ fontSize: '12px', color: 'var(--color-text-secondary, #666)' }}>
                    {error.name}:
                  </strong>
                  <p style={{ 
                    fontSize: '12px', 
                    color: 'var(--color-error, #ef4444)',
                    margin: '4px 0 0 0',
                  }}>
                    {error.message}
                  </p>
                </div>

                {error.stack && (
                  <pre style={{
                    fontSize: '11px',
                    color: 'var(--color-text-tertiary, #999)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                    margin: 0,
                    maxHeight: '200px',
                    overflow: 'auto',
                  }}>
                    {error.stack}
                  </pre>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SPECIALIZED ERROR BOUNDARIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Page-level error boundary
 */
export const PageErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary level="page" showDetails>
    {children}
  </ErrorBoundary>
);

/**
 * Section-level error boundary
 */
export const SectionErrorBoundary: React.FC<{ 
  children: ReactNode;
  fallbackTitle?: string;
}> = ({ children, fallbackTitle }) => (
  <ErrorBoundary 
    level="section"
    fallback={(error, reset) => (
      <div style={{
        padding: '32px',
        background: 'var(--color-bg-secondary, #f9f9f9)',
        borderRadius: '12px',
        textAlign: 'center',
      }}>
        <p style={{ 
          color: 'var(--color-text-secondary, #666)',
          marginBottom: '16px',
        }}>
          {fallbackTitle || 'Cette section n\'a pas pu être chargée.'}
        </p>
        <button
          onClick={reset}
          style={{
            padding: '8px 16px',
            background: 'var(--color-primary, #6366f1)',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Réessayer
        </button>
      </div>
    )}
  >
    {children}
  </ErrorBoundary>
);

/**
 * Component-level error boundary (minimal UI)
 */
export const ComponentErrorBoundary: React.FC<{ 
  children: ReactNode;
  fallbackText?: string;
}> = ({ children, fallbackText }) => (
  <ErrorBoundary 
    level="component"
    fallback={(error, reset) => (
      <div style={{
        padding: '16px',
        background: 'var(--color-bg-tertiary, #f5f5f5)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <span style={{ color: 'var(--color-error, #ef4444)' }}>⚠️</span>
        <span style={{ 
          flex: 1,
          fontSize: '14px',
          color: 'var(--color-text-secondary, #666)',
        }}>
          {fallbackText || 'Erreur'}
        </span>
        <button
          onClick={reset}
          style={{
            padding: '4px 12px',
            background: 'transparent',
            color: 'var(--color-primary, #6366f1)',
            border: '1px solid currentColor',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Réessayer
        </button>
      </div>
    )}
  >
    {children}
  </ErrorBoundary>
);

// ═══════════════════════════════════════════════════════════════════════════
// HOOK FOR PROGRAMMATIC ERROR HANDLING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hook to throw errors caught by error boundaries
 */
export function useErrorBoundary(): (error: Error) => void {
  const [, setError] = React.useState<Error | null>(null);
  
  return React.useCallback((error: Error) => {
    setError(() => {
      throw error;
    });
  }, []);
}

// Export default
export default ErrorBoundary;