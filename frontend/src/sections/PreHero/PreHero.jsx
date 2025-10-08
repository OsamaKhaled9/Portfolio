import React, { Suspense, useState, useCallback, useEffect } from 'react';
import { ChevronDown } from '../../components/ui/Icons';
import { useTheme } from '../../context/ThemeContext';
import { apiService } from '../../services/api';
import './PreHero.css';

// ✅ Lazy load 3D component
const Lanyard = React.lazy(() => import('../../components/3D/Lanyard/Lanyard'));

// ✅ Import mobile version
const PreHeroMobile = React.lazy(() => import('./PreHeroMobile'));

const isMobileDevice = () => {
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const result = isMobileUA || (isTouchDevice && window.innerWidth < 768);
  
  console.log('Device Detection:', {
    userAgent: navigator.userAgent,
    isMobileUA,
    isTouchDevice,
    width: window.innerWidth,
    result
  });
  
  return result;
};

// Keep all your existing components unchanged
const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="loading-spinner" />
    <div className="loading-text">Loading 3D Badge...</div>
  </div>
);

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

class SimpleErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorCount: 0 };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('PreHero Error:', error, errorInfo);
    
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
  const [isMobile, setIsMobile] = useState(() => isMobileDevice());
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lanyardKey, setLanyardKey] = useState(0);
  const [showFallback, setShowFallback] = useState(false);

  // ✅ Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiService.get('/api/profile');
        if (response.success) {
          setProfile(response.data);
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
        setProfile({
          name: 'Osama Khaled',
          title: 'Full-Stack Developer'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Viewport fix
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

  // Resize handler for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(isMobileDevice());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleEnterPortfolio = useCallback(() => {
    const heroSection = document.getElementById('about');
    if (heroSection) {
      heroSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    
    if (onScrollToNext) {
      onScrollToNext('about');
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

  // ✅ Show mobile version without 3D
  if (isMobile) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <PreHeroMobile onScrollToNext={onScrollToNext} />
      </Suspense>
    );
  } // ✅ FIXED: Added closing brace here!

  // ✅ Show loading state
  if (loading) {
    return (
      <section className={`prehero-section ${isDarkMode ? 'dark' : 'light'}`}>
        <div className="content-layer">
          <div className="welcome-text">
            <div>Loading...</div>
          </div>
        </div>
      </section>
    );
  }

  // ✅ Desktop version with 3D
  return (
    <section id="prehero" className={`prehero-section ${isDarkMode ? 'dark' : 'light'}`}>
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

      <div className="content-layer">
        <div className="welcome-text">
          <h1 className="main-title">
            {profile?.name}
          </h1>
          <h2 className={`subtitle ${isDarkMode ? 'dark' : 'light'}`}>
            {profile?.title} Portfolio
          </h2>
          <p className="instruction">
            Interact with the 3D badge 
          </p>
        </div>

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
