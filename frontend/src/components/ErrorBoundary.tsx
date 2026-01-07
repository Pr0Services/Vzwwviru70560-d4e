/**
 * CHE·NU™ — Enhanced Error Boundary v40
 * Sprint 1: Foundation - Task 1.14
 * 
 * Features:
 * - Graceful error handling
 * - User-friendly error messages
 * - Automatic error reporting
 * - Recovery options
 * - Sphere-aware error isolation
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  sphereId?: string;
  level?: 'page' | 'component' | 'critical';
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ERROR BOUNDARY CLASS
// ═══════════════════════════════════════════════════════════════════════════════

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    
    // Log error
    logger.error('[CHE·NU Error Boundary]', {
      error,
      errorInfo,
      sphereId: this.props.sphereId,
      level: this.props.level,
    });
    
    // Call custom error handler
    this.props.onError?.(error, errorInfo);
    
    // Report to error tracking service
    this.reportError(error, errorInfo);
  }

  private reportError(error: Error, errorInfo: ErrorInfo): void {
    // Send to error tracking (Sentry, etc.)
    const errorReport = {
      id: this.state.errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      sphereId: this.props.sphereId,
      level: this.props.level || 'component',
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    };
    
    // In production, send to API
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/v1/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorReport),
      }).catch(() => {
        // Silently fail error reporting
      });
    }
  }

  private handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
  };

  private handleReload = (): void => {
    window.location.reload();
  };

  private handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    const { hasError, error, errorId } = this.state;
    const { children, fallback, level = 'component' } = this.props;

    if (!hasError) {
      return children;
    }

    // Custom fallback
    if (fallback) {
      if (typeof fallback === 'function') {
        return fallback(error!, this.handleReset);
      }
      return fallback;
    }

    // Default error UI based on level
    switch (level) {
      case 'critical':
        return (
          <CriticalErrorUI
            error={error!}
            errorId={errorId!}
            onReload={this.handleReload}
          />
        );
      case 'page':
        return (
          <PageErrorUI
            error={error!}
            errorId={errorId!}
            onReset={this.handleReset}
            onGoHome={this.handleGoHome}
          />
        );
      default:
        return (
          <ComponentErrorUI
            error={error!}
            errorId={errorId!}
            onReset={this.handleReset}
          />
        );
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ERROR UI COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

interface ErrorUIProps {
  error: Error;
  errorId: string;
  onReset?: () => void;
  onReload?: () => void;
  onGoHome?: () => void;
}

/**
 * Critical error - full page takeover
 */
const CriticalErrorUI: React.FC<ErrorUIProps> = ({ error, errorId, onReload }) => (
  <div className="error-critical" role="alert">
    <style>{`
      .error-critical {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #1E1F22 0%, #2a2a2e 100%);
        color: #E9E4D6;
        padding: 2rem;
        text-align: center;
      }
      .error-critical__icon {
        font-size: 4rem;
        margin-bottom: 1.5rem;
      }
      .error-critical__title {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: #D8B26A;
      }
      .error-critical__message {
        font-size: 1rem;
        color: #8D8371;
        margin-bottom: 2rem;
        max-width: 400px;
      }
      .error-critical__id {
        font-size: 0.75rem;
        color: #666;
        font-family: monospace;
        margin-bottom: 1.5rem;
      }
      .error-critical__button {
        padding: 0.75rem 2rem;
        background: #D8B26A;
        color: #1E1F22;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }
      .error-critical__button:hover {
        background: #e5c078;
        transform: translateY(-2px);
      }
    `}</style>
    
    <div className="error-critical__icon">⚠️</div>
    <h1 className="error-critical__title">System Error</h1>
    <p className="error-critical__message">
      CHE·NU encountered a critical error and needs to restart.
      Your data is safe and all changes have been saved.
    </p>
    <p className="error-critical__id">Error ID: {errorId}</p>
    <button className="error-critical__button" onClick={onReload}>
      Restart CHE·NU
    </button>
  </div>
);

/**
 * Page-level error
 */
const PageErrorUI: React.FC<ErrorUIProps> = ({ error, errorId, onReset, onGoHome }) => (
  <div className="error-page" role="alert">
    <style>{`
      .error-page {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 60vh;
        padding: 2rem;
        text-align: center;
      }
      .error-page__icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }
      .error-page__title {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 0.75rem;
        color: #D8B26A;
      }
      .error-page__message {
        font-size: 0.9rem;
        color: #8D8371;
        margin-bottom: 1.5rem;
        max-width: 350px;
      }
      .error-page__id {
        font-size: 0.7rem;
        color: #555;
        font-family: monospace;
        margin-bottom: 1.5rem;
      }
      .error-page__actions {
        display: flex;
        gap: 1rem;
      }
      .error-page__button {
        padding: 0.6rem 1.5rem;
        border-radius: 6px;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
      }
      .error-page__button--primary {
        background: #D8B26A;
        color: #1E1F22;
      }
      .error-page__button--secondary {
        background: transparent;
        border: 1px solid #D8B26A;
        color: #D8B26A;
      }
    `}</style>
    
    <div className="error-page__icon">😕</div>
    <h2 className="error-page__title">Something went wrong</h2>
    <p className="error-page__message">
      This page encountered an error. You can try again or go back to the home page.
    </p>
    <p className="error-page__id">Reference: {errorId}</p>
    <div className="error-page__actions">
      <button className="error-page__button error-page__button--primary" onClick={onReset}>
        Try Again
      </button>
      <button className="error-page__button error-page__button--secondary" onClick={onGoHome}>
        Go Home
      </button>
    </div>
  </div>
);

/**
 * Component-level error (inline)
 */
const ComponentErrorUI: React.FC<ErrorUIProps> = ({ error, errorId, onReset }) => (
  <div className="error-component" role="alert">
    <style>{`
      .error-component {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: rgba(255, 100, 100, 0.1);
        border: 1px solid rgba(255, 100, 100, 0.3);
        border-radius: 8px;
        margin: 0.5rem 0;
      }
      .error-component__icon {
        font-size: 1.5rem;
      }
      .error-component__content {
        flex: 1;
      }
      .error-component__title {
        font-size: 0.9rem;
        font-weight: 500;
        color: #ff9999;
        margin-bottom: 0.25rem;
      }
      .error-component__message {
        font-size: 0.8rem;
        color: #888;
      }
      .error-component__retry {
        padding: 0.4rem 1rem;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        color: #E9E4D6;
        font-size: 0.8rem;
        cursor: pointer;
        transition: all 0.2s;
      }
      .error-component__retry:hover {
        background: rgba(255, 255, 255, 0.15);
      }
    `}</style>
    
    <div className="error-component__icon">⚠️</div>
    <div className="error-component__content">
      <p className="error-component__title">Failed to load component</p>
      <p className="error-component__message">{error.message}</p>
    </div>
    <button className="error-component__retry" onClick={onReset}>
      Retry
    </button>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SPHERE ERROR BOUNDARY
// ═══════════════════════════════════════════════════════════════════════════════

interface SphereErrorBoundaryProps {
  sphereId: string;
  sphereName: string;
  sphereColor: string;
  children: ReactNode;
}

/**
 * Specialized error boundary for spheres
 * Isolates errors within a sphere without affecting others
 */
export const SphereErrorBoundary: React.FC<SphereErrorBoundaryProps> = ({
  sphereId,
  sphereName,
  sphereColor,
  children,
}) => (
  <ErrorBoundary
    sphereId={sphereId}
    level="page"
    fallback={(error, reset) => (
      <SphereErrorUI
        sphereName={sphereName}
        sphereColor={sphereColor}
        error={error}
        onReset={reset}
      />
    )}
  >
    {children}
  </ErrorBoundary>
);

const SphereErrorUI: React.FC<{
  sphereName: string;
  sphereColor: string;
  error: Error;
  onReset: () => void;
}> = ({ sphereName, sphereColor, error, onReset }) => (
  <div className="sphere-error" style={{ borderColor: sphereColor }}>
    <style>{`
      .sphere-error {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 50vh;
        padding: 2rem;
        text-align: center;
        border-left: 4px solid;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 12px;
        margin: 1rem;
      }
      .sphere-error__title {
        font-size: 1.2rem;
        margin-bottom: 0.5rem;
      }
      .sphere-error__message {
        color: #888;
        margin-bottom: 1.5rem;
      }
      .sphere-error__button {
        padding: 0.6rem 1.5rem;
        background: ${sphereColor};
        color: #1E1F22;
        border: none;
        border-radius: 6px;
        cursor: pointer;
      }
    `}</style>
    
    <h3 className="sphere-error__title">
      {sphereName} encountered an error
    </h3>
    <p className="sphere-error__message">
      {error.message}
    </p>
    <button className="sphere-error__button" onClick={onReset}>
      Reload {sphereName}
    </button>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Hook to catch errors in async operations
 */
export function useErrorHandler(): (error: Error) => void {
  return (error: Error) => {
    logger.error('[CHE·NU Async Error]', error);
    
    // Could show a toast notification here
    // Could report to error tracking
  };
}

/**
 * Hook to wrap async functions with error handling
 */
export function useSafeAsync<T, Args extends any[]>(
  asyncFn: (...args: Args) => Promise<T>,
  onError?: (error: Error) => void
): (...args: Args) => Promise<T | undefined> {
  const handleError = useErrorHandler();
  
  return async (...args: Args) => {
    try {
      return await asyncFn(...args);
    } catch (error) {
      const err = error as Error;
      (onError || handleError)(err);
      return undefined;
    }
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default ErrorBoundary;
