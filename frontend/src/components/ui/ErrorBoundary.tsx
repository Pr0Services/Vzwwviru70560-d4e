/* ═══════════════════════════════════════════════════════════════════════════════
   CHE·NU™ — ERROR BOUNDARY COMPONENTS v39
   Professional error handling with recovery options
   ═══════════════════════════════════════════════════════════════════════════════ */

import React, { Component, type ErrorInfo, type ReactNode } from 'react';

// ════════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════════

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
  showDetails?: boolean;
  level?: 'page' | 'section' | 'component';
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// ════════════════════════════════════════════════════════════════════════════════
// COLORS (CHE·NU Palette)
// ════════════════════════════════════════════════════════════════════════════════

const COLORS = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
  background: '#0c0a09',
  cardBg: '#111113',
  errorRed: '#DC2626',
  errorBg: 'rgba(220, 38, 38, 0.1)',
  border: 'rgba(141, 131, 113, 0.15)',
};

// ════════════════════════════════════════════════════════════════════════════════
// STYLES
// ════════════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px',
    backgroundColor: COLORS.cardBg,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '12px',
    textAlign: 'center' as const,
  },
  
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: COLORS.background,
  },
  
  sectionContainer: {
    minHeight: '200px',
  },
  
  componentContainer: {
    minHeight: '100px',
    padding: '16px',
  },
  
  icon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  
  title: {
    fontSize: '20px',
    fontWeight: 600,
    color: COLORS.softSand,
    marginBottom: '8px',
  },
  
  message: {
    fontSize: '14px',
    color: COLORS.ancientStone,
    marginBottom: '24px',
    maxWidth: '400px',
  },
  
  button: {
    padding: '10px 24px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: COLORS.sacredGold,
    color: COLORS.uiSlate,
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  
  secondaryButton: {
    padding: '10px 24px',
    borderRadius: '8px',
    border: `1px solid ${COLORS.ancientStone}`,
    backgroundColor: 'transparent',
    color: COLORS.softSand,
    fontSize: '14px',
    cursor: 'pointer',
    marginLeft: '12px',
  },
  
  details: {
    marginTop: '24px',
    padding: '16px',
    backgroundColor: COLORS.errorBg,
    borderRadius: '8px',
    textAlign: 'left' as const,
    maxWidth: '600px',
    overflow: 'auto',
  },
  
  detailsTitle: {
    fontSize: '12px',
    fontWeight: 600,
    color: COLORS.errorRed,
    marginBottom: '8px',
    textTransform: 'uppercase' as const,
  },
  
  errorText: {
    fontSize: '12px',
    fontFamily: 'monospace',
    color: COLORS.softSand,
    whiteSpace: 'pre-wrap' as const,
    wordBreak: 'break-word' as const,
  },
  
  stackTrace: {
    fontSize: '11px',
    fontFamily: 'monospace',
    color: COLORS.ancientStone,
    marginTop: '12px',
    maxHeight: '200px',
    overflow: 'auto',
  },
};

// ════════════════════════════════════════════════════════════════════════════════
// ERROR FALLBACK COMPONENT
// ════════════════════════════════════════════════════════════════════════════════

interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  onReset?: () => void;
  showDetails?: boolean;
  level?: 'page' | 'section' | 'component';
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  errorInfo,
  onReset,
  showDetails = false,
  level = 'section',
}) => {
  const [showStack, setShowStack] = React.useState(false);
  
  const containerStyle = {
    ...styles.container,
    ...(level === 'page' ? styles.pageContainer : {}),
    ...(level === 'section' ? styles.sectionContainer : {}),
    ...(level === 'component' ? styles.componentContainer : {}),
  };
  
  const handleReset = () => {
    onReset?.();
    window.location.reload();
  };
  
  const handleReportError = () => {
    // In production, this would send to error tracking service
    logger.error('Error Report:', {
      error: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    });
    
    // Show confirmation
    alert('Error report sent. Thank you for helping us improve CHE·NU.');
  };
  
  return (
    <div style={containerStyle} role="alert" aria-live="assertive">
      <div style={styles.icon}>⚠️</div>
      
      <h2 style={styles.title}>
        {level === 'page' ? 'Something went wrong' : 'Error loading content'}
      </h2>
      
      <p style={styles.message}>
        {level === 'page'
          ? "We're sorry, but something unexpected happened. Please try refreshing the page."
          : 'This section encountered an error. You can try again or continue using other features.'}
      </p>
      
      <div>
        <button
          style={styles.button}
          onClick={handleReset}
          onMouseOver={(e) => {
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          {level === 'page' ? 'Refresh Page' : 'Try Again'}
        </button>
        
        {showDetails && (
          <button
            style={styles.secondaryButton}
            onClick={() => setShowStack(!showStack)}
          >
            {showStack ? 'Hide Details' : 'Show Details'}
          </button>
        )}
        
        <button
          style={styles.secondaryButton}
          onClick={handleReportError}
        >
          Report Issue
        </button>
      </div>
      
      {showDetails && showStack && error && (
        <div style={styles.details}>
          <div style={styles.detailsTitle}>Error Details</div>
          <div style={styles.errorText}>
            {error.name}: {error.message}
          </div>
          
          {error.stack && (
            <div style={styles.stackTrace}>
              <div style={styles.detailsTitle}>Stack Trace</div>
              {error.stack}
            </div>
          )}
          
          {errorInfo?.componentStack && (
            <div style={styles.stackTrace}>
              <div style={styles.detailsTitle}>Component Stack</div>
              {errorInfo.componentStack}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// ERROR BOUNDARY CLASS COMPONENT
// ════════════════════════════════════════════════════════════════════════════════

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
    
    // Log to console in development
    logger.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Call optional error handler
    this.props.onError?.(error, errorInfo);
    
    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, errorInfo);
    }
  }
  
  private reportError(error: Error, errorInfo: ErrorInfo): void {
    // This would integrate with your error tracking service (e.g., Sentry)
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };
    
    // Example: Send to logging endpoint
    fetch('/api/log-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorReport),
    }).catch(() => {
      // Silently fail if reporting fails
    });
  }
  
  private handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    this.props.onReset?.();
  };
  
  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback provided
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default fallback
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
          showDetails={this.props.showDetails}
          level={this.props.level}
        />
      );
    }
    
    return this.props.children;
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// SPECIALIZED ERROR BOUNDARIES
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Page-level error boundary with full-page fallback
 */
export const PageErrorBoundary: React.FC<{
  children: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}> = ({ children, onError }) => (
  <ErrorBoundary
    level="page"
    showDetails={process.env.NODE_ENV === 'development'}
    onError={onError}
  >
    {children}
  </ErrorBoundary>
);

/**
 * Section-level error boundary
 */
export const SectionErrorBoundary: React.FC<{
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}> = ({ children, fallback, onError }) => (
  <ErrorBoundary
    level="section"
    fallback={fallback}
    showDetails={process.env.NODE_ENV === 'development'}
    onError={onError}
  >
    {children}
  </ErrorBoundary>
);

/**
 * Component-level error boundary (silent fallback)
 */
export const ComponentErrorBoundary: React.FC<{
  children: ReactNode;
  fallback?: ReactNode;
}> = ({ children, fallback }) => (
  <ErrorBoundary
    level="component"
    fallback={fallback ?? <div style={{ color: COLORS.ancientStone }}>⚠️ Error</div>}
  >
    {children}
  </ErrorBoundary>
);

// ════════════════════════════════════════════════════════════════════════════════
// HOOK FOR FUNCTIONAL COMPONENTS
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Hook to throw errors that will be caught by ErrorBoundary
 */
export function useErrorHandler(): (error: Error) => void {
  const [, setError] = React.useState<Error | null>(null);
  
  return React.useCallback((error: Error) => {
    setError(() => {
      throw error;
    });
  }, []);
}

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export default ErrorBoundary;
