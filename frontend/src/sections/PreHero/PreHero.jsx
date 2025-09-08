import React, { Suspense, useState, useCallback, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Lanyard from '../../components/3D/Lanyard/Lanyard';
import './PreHero.css';

// Simple Loading Component
const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="loading-spinner" />
    <div className="loading-text">Loading 3D Badge...</div>
  </div>
);

// WebGL Error Fallback
const WebGLErrorFallback = ({ onRetry, isDarkMode }) => (
  <div className={`webgl-error ${isDarkMode ? 'dark' : 'light'}`}>
    <div className="error-content">
      <div className="error-spinner" />
      <div className="error-text">3D Scene Unavailable</div>
      <button 
        className="retry-button"
        onClick={onRetry}
      >
        Retry Loading
      </button>
    </div>
  </div>
);

// Simple Error Boundary
class SimpleErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorCount: 0 };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('PreHero Error:', error, errorInfo);
    
    // Auto-retry once for WebGL context issues
    if (this.state.errorCount < 1) {
      setTimeout(() => {
        this.setState({ hasError: false, errorCount: this.state.errorCount + 1 });
        this.props.onRetry?.();
      }, 2000);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <WebGLErrorFallback 
          onRetry={() => {
            this.setState({ hasError: false, errorCount: 0 });
            this.props.onRetry?.();
          }}
          isDarkMode={this.props.isDarkMode}
        />
      );
    }

    return this.props.children;
  }
}

const PreHero = ({ onScrollToNext }) => {
  const { isDarkMode } = useTheme();
  const [lanyardKey, setLanyardKey] = useState(0);
  const [showFallback, setShowFallback] = useState(false);

  // Handle viewport height for mobile
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  const handleEnterPortfolio = useCallback(() => {
    // Direct navigation without transition state
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    
    // Call parent callback if provided
    if (onScrollToNext) {
      onScrollToNext('hero');
    }
  }, [onScrollToNext]);

  const handleLanyardRetry = useCallback(() => {
    console.log('Retrying Lanyard component...');
    setLanyardKey(prev => prev + 1);
    setShowFallback(false);
  }, []);

  const handleLanyardError = useCallback(() => {
    console.log('Lanyard component failed, showing fallback...');
    setShowFallback(true);
  }, []);

  return (
    <section id="prehero" className={`prehero-section ${isDarkMode ? 'dark' : 'light'}`}>
      {/* 3D Canvas Layer */}
      <div className="canvas-layer">
        {!showFallback ? (
          <SimpleErrorBoundary 
            onRetry={handleLanyardRetry}
            isDarkMode={isDarkMode}
          >
            <Suspense fallback={<LoadingSpinner />}>
              <Lanyard 
                key={lanyardKey}
                position={[0, 0, 25]}
                fov={25}
                onError={handleLanyardError}
                isDarkMode={isDarkMode}
              />
            </Suspense>
          </SimpleErrorBoundary>
        ) : (
          <WebGLErrorFallback 
            onRetry={handleLanyardRetry}
            isDarkMode={isDarkMode}
          />
        )}
      </div>

      {/* Content Layer */}
      <div className="content-layer">
        {/* Welcome Text */}
        <div className="welcome-text">
          <h1 className="main-title">
            Osama Khaled Gamal
          </h1>
          <h2 className={`subtitle ${isDarkMode ? 'dark' : 'light'}`}>
            Backend Engineer Portfolio
          </h2>
          <p className="instruction">
            Interact with the 3D badge above
          </p>
        </div>

        {/* Enter Button */}
        <div className="enter-button-container">
          <button
            className={`enter-button ${isDarkMode ? 'dark' : 'light'}`}
            onClick={handleEnterPortfolio}
          >
            <span>ENTER PORTFOLIO</span>
            <ChevronDown size={24} className="chevron-icon" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PreHero;
