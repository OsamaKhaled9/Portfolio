import React from 'react';
import { ChevronDown } from 'lucide-react';
import TechIcon from '../../components/ui/TechIcon';
import Button from '../../components/common/Button';
import { useTheme } from '../../context/ThemeContext';
import { personalInfo } from '../../data/personal';
import { techStack } from '../../data/skills';
import './Hero.css'; // Add this import

const Hero = ({ onScrollToNext, onNavigateToSection }) => {
  const { isDarkMode } = useTheme();

  return (
    <section 
      id="hero" 
      className={`hero-section ${isDarkMode ? 'dark' : 'light'}`}
    >
      <div className="hero-content">
        <div className="hero-text-content">
          <h1 className="hero-title">{personalInfo.name}</h1>
          <div className={`hero-subtitle ${isDarkMode ? 'dark' : 'light'}`}>
            {personalInfo.title}
          </div>
          <div className="hero-description">
            {personalInfo.description}
          </div>
        </div>
        
        <div className="hero-tech-stack">
          {techStack.map((tech, index) => (
            <TechIcon key={index} {...tech} />
          ))}
        </div>

        <div className="hero-buttons">
          <Button
            variant="primary"
            onClick={() => onNavigateToSection('projects')}
          >
            View Projects
          </Button>
          <Button
            variant="secondary"
            onClick={() => onNavigateToSection('contact')}
          >
            Get In Touch
          </Button>
        </div>

        <div
          className="hero-scroll-indicator"
          onClick={() => onScrollToNext('about')}
        >
          <ChevronDown size={32} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
