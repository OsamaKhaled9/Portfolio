import { useState, useEffect } from 'react';

export const useNavbarVisibility = () => {
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target.id === 'prehero') {
            // Hide navbar when PreHero is visible, show when it's not
            setIsNavbarVisible(!entry.isIntersecting);
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of section is visible
        rootMargin: '0px 0px -10% 0px' // Better detection
      }
    );

    // Simple function to observe prehero
    const preHeroSection = document.getElementById('prehero');
    if (preHeroSection) {
      observer.observe(preHeroSection);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return isNavbarVisible;
};
