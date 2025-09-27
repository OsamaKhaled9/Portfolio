import React, { useEffect } from 'react';
import { useScrollToSection } from './hooks/useScrollToSection';
import { usePortfolio } from './context/PortfolioContext';
import { useTheme } from './context/ThemeContext';

import Navigation from './components/common/Navigation/Navigation';
import Loader from './components/common/Loader';
import ChatBot from './components/common/ChatBot/ChatBot';
import PreHero from './sections/PreHero/PreHero';
import Hero from './sections/Hero/Hero';
import About from './sections/About';
import Projects from './sections/Projects/Projects';
import Contact from './sections/Contact';
import useNavbarVisibility from './hooks/useNavbarVisibility.js';

const Portfolio = () => {
  const { currentSection, scrollToSection } = useScrollToSection();
  const isNavbarVisible = useNavbarVisibility();
  const { state, dispatch } = usePortfolio();
  const { isDarkMode } = useTheme();

  const navSections = ['hero', 'about', 'projects', 'contact'];

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: 'SET_LOADING', payload: false });
    }, 3000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  return (
    <div className="portfolio-container">
      {/* ✨ NEW: Global Background Container */}
      <div 
        className="global-background"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'var(--global-background)',
          zIndex: -1,
          transition: 'background 0.3s ease'
        }}
      />

      <>
        <Loader 
          isVisible={state.isLoading} 
          message="Initializing Matrix..." 
        />
        
        <div style={{ 
          opacity: state.isLoading ? 0 : 1,
          transition: 'opacity 0.5s ease-in-out'
        }}>
          <Navigation
            sections={navSections}
            onSectionChange={scrollToSection}
            isVisible={isNavbarVisible}
          />

          <PreHero onScrollToNext={scrollToSection} />
          <Hero 
            onScrollToNext={scrollToSection}
            onNavigateToSection={scrollToSection}
          />
          <About />
          <Projects />
          <Contact />

          {/* Persistent Chat Bot */}
          <ChatBot />
        </div>
      </>
    </div>
  );
};

export default Portfolio;
