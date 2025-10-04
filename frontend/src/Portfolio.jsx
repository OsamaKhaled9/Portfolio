import React, { useEffect, lazy, Suspense } from 'react';
import { useScrollToSection } from './hooks/useScrollToSection';
import { usePortfolio } from './context/PortfolioContext';

// Always import (critical path)
import Navigation from './components/common/Navigation/Navigation';
import Loader from './components/common/Loader';
import ChatBot from './components/common/ChatBot/ChatBot';
import PreHero from './sections/PreHero/PreHero';

// Lazy load sections (loaded after PreHero)
const About = lazy(() => import('./sections/About'));
const Projects = lazy(() => import('./sections/Projects/Projects'));
const Contact = lazy(() => import('./sections/Contact/Contact'));

const Portfolio = () => {
  const { scrollToSection } = useScrollToSection();
  const isNavbarVisible = useNavbarVisibility();
  const { state, dispatch } = usePortfolio();
  //const { isDarkMode } = useTheme();

  const navSections = ['about', 'projects', 'contact'];

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: 'SET_LOADING', payload: false });
    }, 3000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  return (
    // Use .portfolio-root instead of .portfolio-container
    <div className="portfolio-root">
      {/* Navigation - Only show when not loading */}
      {!state.isLoading && (
        <Navigation
          sections={navSections}
          onSectionChange={scrollToSection}
          isVisible={isNavbarVisible}
        />
      )}

      {/* Loader */}
      <Loader 
        isVisible={state.isLoading} 
        message="Initializing Matrix..." 
      />
      
      {/* Main Content */}
      <div style={{ 
        opacity: state.isLoading ? 0 : 1,
        transition: 'opacity 0.5s ease-in-out'
      }}>
        {/* PreHero - Always loads first */}
        <PreHero onScrollToNext={scrollToSection} />

        {/* Lazy-loaded sections with fallback */}
        <Suspense fallback={
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
        }>
          <About />
          <Projects />
          <Contact />
        </Suspense>

        {/* Persistent Chat Bot */}
        <ChatBot />
      </div>
    </div>
  );
};

// Add missing import
import useNavbarVisibility from './hooks/useNavbarVisibility.js';

export default Portfolio;