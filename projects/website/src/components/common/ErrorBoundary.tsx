import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { logger } from '@/lib/logger';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error('ErrorBoundary', 'componentDidCatch', error, {
      componentStack: errorInfo.componentStack || 'unavailable',
    });
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          padding: '40px 20px',
          textAlign: 'center',
          background: 'rgba(255, 68, 68, 0.05)',
          border: '1px solid rgba(255, 68, 68, 0.15)',
          borderRadius: '12px',
          margin: '20px',
        }}>
          <i className="fa-solid fa-exclamation-triangle" style={{ fontSize: '32px', color: '#ff6b6b', marginBottom: '16px', display: 'block' }} />
          <h3 style={{ color: '#fff', fontSize: '18px', marginBottom: '8px' }}>Something went wrong</h3>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '20px' }}>
            This section encountered an error. Try refreshing or click below.
          </p>
          <button
            onClick={this.handleRetry}
            style={{
              padding: '10px 24px',
              background: 'transparent',
              border: '1px solid rgba(0,255,255,0.3)',
              borderRadius: '6px',
              color: '#00ffff',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
