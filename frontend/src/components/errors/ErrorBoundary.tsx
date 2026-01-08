/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V75 — ERROR BOUNDARY                              ║
 * ║                                                                              ║
 * ║  Global error handling with recovery options                                  ║
 * ║  GOUVERNANCE > EXÉCUTION                                                     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ERROR BOUNDARY COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    
    // Log to console in development
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
    
    // TODO: Send to error tracking service (Sentry, etc.)
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(180deg, #0D0D0D 0%, #1A1A1A 100%)',
            padding: 20,
          }}
        >
          <div
            style={{
              maxWidth: 500,
              width: '100%',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 20,
              padding: 40,
              textAlign: 'center',
            }}
          >
            {/* Error Icon */}
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
              }}
            >
              <span style={{ fontSize: 40 }}>⚠️</span>
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: 24,
                color: '#E8F0E8',
                margin: '0 0 12px',
                fontWeight: 600,
              }}
            >
              Une erreur est survenue
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: 14,
                color: '#9BA89B',
                margin: '0 0 24px',
                lineHeight: 1.6,
              }}
            >
              CHE·NU a rencontré un problème inattendu. Vos données sont en sécurité.
            </p>

            {/* Error Details (collapsible) */}
            {this.state.error && (
              <details
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 24,
                  textAlign: 'left',
                }}
              >
                <summary
                  style={{
                    color: '#EF4444',
                    fontSize: 13,
                    cursor: 'pointer',
                    marginBottom: 8,
                  }}
                >
                  Détails techniques
                </summary>
                <pre
                  style={{
                    fontSize: 11,
                    color: '#9BA89B',
                    overflow: 'auto',
                    maxHeight: 150,
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                gap: 12,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={this.handleReset}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #D8B26A 0%, #C9A35B 100%)',
                  border: 'none',
                  borderRadius: 10,
                  color: '#1A1A1A',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                Réessayer
              </button>

              <button
                onClick={this.handleGoHome}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 10,
                  color: '#E8F0E8',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
                onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
              >
                Retour accueil
              </button>

              <button
                onClick={this.handleReload}
                style={{
                  padding: '12px 24px',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 10,
                  color: '#9BA89B',
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)')}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
              >
                Recharger la page
              </button>
            </div>

            {/* CHE·NU Branding */}
            <div
              style={{
                marginTop: 32,
                paddingTop: 24,
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  color: '#4B5B4B',
                  fontFamily: 'monospace',
                }}
              >
                CHE·NU™ V75 • GOUVERNANCE {'>'} EXÉCUTION
              </span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// API ERROR BOUNDARY (for React Query errors)
// ═══════════════════════════════════════════════════════════════════════════════

interface ApiErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const ApiErrorFallback: React.FC<ApiErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  const isNetworkError = error.message.includes('Network') || error.message.includes('fetch');
  const isAuthError = error.message.includes('401') || error.message.includes('Unauthorized');

  return (
    <div
      style={{
        padding: 24,
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: 12,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 12 }}>
        {isNetworkError ? '🌐' : isAuthError ? '🔒' : '⚠️'}
      </div>
      
      <h3 style={{ color: '#EF4444', fontSize: 16, margin: '0 0 8px' }}>
        {isNetworkError
          ? 'Erreur de connexion'
          : isAuthError
          ? 'Session expirée'
          : 'Erreur de chargement'}
      </h3>
      
      <p style={{ color: '#9BA89B', fontSize: 13, margin: '0 0 16px' }}>
        {isNetworkError
          ? 'Vérifiez votre connexion internet'
          : isAuthError
          ? 'Veuillez vous reconnecter'
          : error.message}
      </p>
      
      <button
        onClick={resetErrorBoundary}
        style={{
          padding: '10px 20px',
          background: 'rgba(239, 68, 68, 0.2)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: 8,
          color: '#EF4444',
          cursor: 'pointer',
          fontSize: 13,
        }}
      >
        {isAuthError ? 'Se reconnecter' : 'Réessayer'}
      </button>
    </div>
  );
};

export default ErrorBoundary;
