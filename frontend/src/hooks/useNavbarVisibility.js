// src/hooks/useNavbarVisibility.js
import { useState, useEffect } from 'react';

const useNavbarVisibility = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Get the PreHero section
      const preHeroElement = document.getElementById('prehero');
      
      if (preHeroElement) {
        const preHeroRect = preHeroElement.getBoundingClientRect();
        // Hide navbar when PreHero is visible (when its bottom is still above viewport bottom)
        const isPreHeroVisible = preHeroRect.bottom > 0 && preHeroRect.top <= window.innerHeight;
        setIsVisible(!isPreHeroVisible);
      } else {
        // If no prehero section found, show navbar by default
        setIsVisible(true);
      }
    };

    // Check initial state
    handleScroll();
    
    // Listen to scroll events
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return isVisible;
};

export default useNavbarVisibility;
