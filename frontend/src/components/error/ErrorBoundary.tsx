/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — ERROR BOUNDARIES                                ║
 * ║                    Sprint B3.4: Error Handling                               ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home, Bug, ChevronDown, ChevronUp } from 'lucide-react'

// ============================================================================
// ERROR BOUNDARY BASE CLASS
// ============================================================================

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  showDetails: boolean
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode)
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  onReset?: () => void
  level?: 'page' | 'section' | 'component'
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo })
    
    // Report to error tracking service
    logger.error('ErrorBoundary caught:', error, errorInfo)
    
    // Call optional error handler
    this.props.onError?.(error, errorInfo)
    
    // Log to analytics in production
    if (import.meta.env.PROD) {
      this.reportError(error, errorInfo)
    }
  }

  private reportError(error: Error, errorInfo: ErrorInfo) {
    // Would send to error tracking service like Sentry
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    }
    
    // Log for now, would POST to error tracking endpoint
    logger.error('Error Report:', errorReport)
  }

  private reset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    })
    this.props.onReset?.()
  }

  private toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }))
  }

  render() {
    const { hasError, error, errorInfo, showDetails } = this.state
    const { children, fallback, level = 'component' } = this.props

    if (hasError && error) {
      // Custom fallback
      if (fallback) {
        if (typeof fallback === 'function') {
          return <>{fallback(error, this.reset)}</>
        }
        return <>{fallback}</>
      }

      // Default fallback based on level
      switch (level) {
        case 'page':
          return (
            <PageErrorFallback
              error={error}
              errorInfo={errorInfo}
              showDetails={showDetails}
              onToggleDetails={this.toggleDetails}
              onReset={this.reset}
            />
          )
        case 'section':
          return (
            <SectionErrorFallback
              error={error}
              showDetails={showDetails}
              onToggleDetails={this.toggleDetails}
              onReset={this.reset}
            />
          )
        default:
          return (
            <ComponentErrorFallback
              error={error}
              onReset={this.reset}
            />
          )
      }
    }

    return children
  }
}

// ============================================================================
// ERROR FALLBACK COMPONENTS
// ============================================================================

interface FallbackProps {
  error: Error
  errorInfo?: ErrorInfo | null
  showDetails?: boolean
  onToggleDetails?: () => void
  onReset: () => void
}

/**
 * Full page error fallback
 */
export function PageErrorFallback({
  error,
  errorInfo,
  showDetails,
  onToggleDetails,
  onReset,
}: FallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 text-center">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Oops! Something went wrong
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We've encountered an unexpected error. Don't worry, our team has been notified.
        </p>

        {/* Error message */}
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm font-mono text-red-600 dark:text-red-400 break-all">
            {error.message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <button
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </a>
        </div>

        {/* Details toggle */}
        {errorInfo && (
          <div>
            <button
              onClick={onToggleDetails}
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Bug className="w-4 h-4" />
              Technical Details
              {showDetails ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            
            {showDetails && (
              <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-left overflow-auto max-h-64">
                <pre className="text-xs font-mono text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {error.stack}
                  {errorInfo.componentStack && (
                    <>
                      {'\n\nComponent Stack:'}
                      {errorInfo.componentStack}
                    </>
                  )}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Section-level error fallback
 */
export function SectionErrorFallback({
  error,
  showDetails,
  onToggleDetails,
  onReset,
}: FallbackProps) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-1">
            Section Error
          </h3>
          <p className="text-sm text-red-600 dark:text-red-400 mb-3">
            This section failed to load. Other parts of the page may still work.
          </p>
          <p className="text-xs font-mono text-red-500 dark:text-red-500 mb-4 break-all">
            {error.message}
          </p>
          
          <div className="flex gap-2">
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
            {onToggleDetails && (
              <button
                onClick={onToggleDetails}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:underline"
              >
                {showDetails ? 'Hide' : 'Show'} Details
              </button>
            )}
          </div>
          
          {showDetails && (
            <pre className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 rounded text-xs font-mono text-red-700 dark:text-red-300 overflow-auto max-h-40">
              {error.stack}
            </pre>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Component-level error fallback (minimal)
 */
export function ComponentErrorFallback({ error, onReset }: FallbackProps) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm">
      <AlertTriangle className="w-4 h-4 text-red-500" />
      <span className="text-red-700 dark:text-red-300">
        Error loading component
      </span>
      <button
        onClick={onReset}
        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
        title="Retry"
      >
        <RefreshCw className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
      </button>
    </div>
  )
}

// ============================================================================
// QUERY ERROR FALLBACK
// ============================================================================

interface QueryErrorFallbackProps {
  error: Error
  onRetry?: () => void
  title?: string
  compact?: boolean
}

/**
 * Error fallback specifically for TanStack Query errors
 */
export function QueryErrorFallback({
  error,
  onRetry,
  title = 'Failed to load data',
  compact = false,
}: QueryErrorFallbackProps) {
  // Parse error for user-friendly message
  const message = error.message.includes('Network Error')
    ? 'Unable to connect. Please check your internet connection.'
    : error.message.includes('401')
    ? 'Your session has expired. Please log in again.'
    : error.message.includes('403')
    ? 'You don\'t have permission to access this resource.'
    : error.message.includes('404')
    ? 'The requested resource was not found.'
    : error.message.includes('500')
    ? 'Server error. Please try again later.'
    : 'An unexpected error occurred.'

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
        <AlertTriangle className="w-4 h-4" />
        <span>{message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="underline hover:no-underline"
          >
            Retry
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-sm">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  )
}

// ============================================================================
// HOC FOR ERROR BOUNDARY
// ============================================================================

/**
 * HOC to wrap component with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...options}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

// ============================================================================
// EXPORTS
// ============================================================================

export default ErrorBoundary
