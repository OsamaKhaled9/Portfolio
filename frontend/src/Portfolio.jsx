import React, { useEffect, lazy, Suspense } from 'react';
import { useScrollToSection } from './hooks/useScrollToSection';
import { usePortfolio } from './context/PortfolioContext';
import useNavbarVisibility from './hooks/useNavbarVisibility.js'; // ✅ Moved to top

// Always import (critical path)
import Navigation from './components/common/Navigation/Navigation';
import Loader from './components/common/Loader';
import ChatBot from './components/common/ChatBot/ChatBot';
import PreHero from './sections/PreHero/PreHero';

// ✅ Lazy load with separate Suspense boundaries
const About = lazy(() => import('./sections/About'));
const Projects = lazy(() => import('./sections/Projects/Projects'));
const Contact = lazy(() => import('./sections/Contact/Contact'));

const Portfolio = () => {
  const { scrollToSection } = useScrollToSection();
  const isNavbarVisible = useNavbarVisibility();
  const { state, dispatch } = usePortfolio();

  const navSections = ['about', 'projects', 'contact'];

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: 'SET_LOADING', payload: false });
    }, 3000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  // ✅ Memoize fallback component
  const loadingFallback = (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      color: 'var(--accent-primary)',
      fontFamily: 'var(--font-mono)'
    }}>
      <div className="loading-spinner" />
    </div>
  );

  return (
    <div className="portfolio-root">
      {!state.isLoading && (
        <Navigation
          sections={navSections}
          onSectionChange={scrollToSection}
          isVisible={isNavbarVisible}
        />
      )}

      <Loader 
        isVisible={state.isLoading} 
        message="Initializing Matrix..." 
      />
      
      <div style={{ 
        opacity: state.isLoading ? 0 : 1,
        transition: 'opacity 0.5s ease-in-out'
      }}>
        <PreHero onScrollToNext={scrollToSection} />

        {/* ✅ Separate Suspense boundaries for progressive loading */}
        <Suspense fallback={loadingFallback}>
          <About />
        </Suspense>

        <Suspense fallback={loadingFallback}>
          <Projects />
        </Suspense>

        <Suspense fallback={loadingFallback}>
          <Contact />
        </Suspense>

        <ChatBot />
      </div>
    </div>
  );
};

export default Portfolio;
