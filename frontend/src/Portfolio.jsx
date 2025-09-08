import React, { useEffect } from 'react';
import { useScrollToSection } from './hooks/useScrollToSection';
import { useNavbarVisibility } from './hooks/useNavbarVisibility';
import { useAnimatedBackground } from './hooks/useAnimatedBackground';
import { usePortfolio } from './context/PortfolioContext';

import Navigation from './components/common/Navigation/Navigation';
import AnimatedBackground from './components/common/AnimatedBackground';
import Loader from './components/common/Loader';
import ChatBot from './components/common/ChatBot/ChatBot'; // Add ChatBot
import PreHero from './sections/PreHero/PreHero';
import Hero from './sections/Hero/Hero';
import About from './sections/About';
import Projects from './sections/Projects/Projects';
import Contact from './sections/Contact';

const Portfolio = () => {
  const { currentSection, scrollToSection } = useScrollToSection();
  const isNavbarVisible = useNavbarVisibility();
  //const { mountRef } = useAnimatedBackground();
  const { state, dispatch } = usePortfolio();

  const navSections = ['hero', 'about', 'projects', 'contact'];

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: 'SET_LOADING', payload: false });
    }, 3000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  return (
    <>
      <Loader 
        isVisible={state.isLoading} 
        message="Initializing Matrix..." 
      />
      
      <div style={{ 
        opacity: state.isLoading ? 0 : 1,
        transition: 'opacity 0.5s ease-in-out'
      }}>
        {/*<AnimatedBackground mountRef={mountRef} />*/}
        
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
  );
};

export default Portfolio;
