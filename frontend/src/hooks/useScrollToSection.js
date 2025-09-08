import { useState, useCallback, useEffect } from 'react';

export const useScrollToSection = () => {
  const [currentSection, setCurrentSection] = useState('prehero'); // Start with prehero

  const scrollToSection = useCallback((section) => {
    const element = document.getElementById(section);
    if (element) {
      setCurrentSection(section);
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, []);

  // Track current section based on scroll position
  useEffect(() => {
    const sections = ['prehero', 'hero', 'about', 'projects', 'contact'];
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            setCurrentSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '-20% 0px'
      }
    );

    sections.forEach(sectionId => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  return { currentSection, scrollToSection, setCurrentSection };
};
