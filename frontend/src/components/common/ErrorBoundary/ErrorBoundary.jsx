class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, webglContextLost: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('3D Lanyard Error:', error, errorInfo);
    
    // Check if it's a WebGL context lost error
    if (error.message && error.message.includes('CONTEXT_LOST')) {
      this.setState({ webglContextLost: true });
    }
    
    if (this.props.onError) {
      this.props.onError();
    }
  }

  // Add a method to attempt recovery
  attemptRecovery = () => {
    this.setState({ hasError: false, webglContextLost: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          gap: '20px'
        }}>
          <div>3D rendering failed</div>
          {this.state.webglContextLost && (
            <div style={{ fontSize: '14px', opacity: 0.7 }}>
              WebGL context was lost. This can happen on some browsers or devices.
            </div>
          )}
          <button 
            onClick={this.attemptRecovery}
            style={{
              padding: '10px 20px',
              background: '#06b6d4',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
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