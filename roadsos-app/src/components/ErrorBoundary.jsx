import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[ErrorBoundary] Caught an error during initialization or render:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px 20px',
          background: '#ba1a1a',
          color: '#ffffff',
          fontFamily: '"Public Sans", system-ui, sans-serif',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          boxSizing: 'border-box'
        }}>
          <div style={{
            maxWidth: '600px',
            background: '#ffffff',
            color: '#1a1c18',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }}>
            <span className="material-symbols-outlined" style={{
              fontSize: '64px',
              color: '#ba1a1a',
              marginBottom: '16px',
              fontVariationSettings: "'FILL' 1"
            }}>error</span>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '900',
              margin: '0 0 16px 0',
              color: '#ba1a1a',
              letterSpacing: '-0.5px'
            }}>ROADSoS Critical Error</h1>
            <p style={{
              fontSize: '16px',
              margin: '0 0 24px 0',
              color: '#43493e',
              lineHeight: '1.5'
            }}>
              The application encountered an initialization failure or runtime crash. Details below:
            </p>
            <pre style={{
              background: '#f0f1ec',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid #c3c8bc',
              overflowX: 'auto',
              textAlign: 'left',
              fontSize: '13px',
              fontFamily: 'monospace',
              margin: '0 0 24px 0',
              maxHeight: '150px'
            }}>
              {this.state.error?.toString()}
            </pre>
            {this.state.errorInfo && (
              <pre style={{
                background: '#f0f1ec',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid #c3c8bc',
                overflowX: 'auto',
                textAlign: 'left',
                fontSize: '11px',
                fontFamily: 'monospace',
                margin: '0 0 24px 0',
                maxHeight: '150px'
              }}>
                {this.state.errorInfo.componentStack}
              </pre>
            )}
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
              style={{
                background: '#ba1a1a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '100px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.2s',
                boxShadow: '0 4px 12px rgba(186,26,26,0.2)'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#93000a'}
              onMouseOut={(e) => e.currentTarget.style.background = '#ba1a1a'}
            >
              Reset Cache & Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
