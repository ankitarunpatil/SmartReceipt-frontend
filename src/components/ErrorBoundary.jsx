import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '20px'
        }}>
          <div className="card" style={{ 
            maxWidth: '500px', 
            textAlign: 'center',
            padding: '40px'
          }}>
            <AlertTriangle size={64} color="#dc3545" style={{ marginBottom: '20px' }} />
            <h2 style={{ marginBottom: '12px' }}>Something went wrong</h2>
            <p style={{ color: '#6c757d', marginBottom: '24px' }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              <RefreshCw size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;