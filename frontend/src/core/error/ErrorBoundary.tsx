/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — ERROR BOUNDARY
 * Phase 10: Final Polish & Launch
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('[ErrorBoundary]', error, errorInfo);
    // Log to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // analytics.trackError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-container">
          <div className="error-content">
            <h1>⚠️ Oops!</h1>
            <p>Something went wrong. We're working on it.</p>
            <button onClick={() => window.location.reload()}>
              Reload Page
            </button>
          </div>

          <style jsx>{`
            .error-container {
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              background: #e9e4d6;
            }

            .error-content {
              text-align: center;
              padding: 40px;
              background: white;
              border-radius: 12px;
              max-width: 400px;
            }

            h1 {
              color: #1e1f22;
              margin-bottom: 16px;
            }

            p {
              color: #8d8371;
              margin-bottom: 24px;
            }

            button {
              background: #d8b26a;
              color: white;
              border: none;
              padding: 12px 32px;
              border-radius: 8px;
              font-weight: 600;
              cursor: pointer;
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}
