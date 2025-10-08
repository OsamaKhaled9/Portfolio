import React, { useState, useEffect } from 'react';
import { Menu, X } from '../../ui/Icons';
import { useActiveSection } from '../../../hooks/useActiveSection';
import { smoothScrollTo } from '../../../utils/smoothScroll';
import ThemeToggle from '../ThemeToggle';
import './Navigation.css';

const Navigation = ({ 
  sections = ['hero', 'about', 'projects', 'contact'],
  onSectionChange = () => {},
  isVisible = true
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [_isMobile, setIsMobile] = useState(false);
  const { activeSection, isScrolled } = useActiveSection(sections);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleSectionClick = (section) => {
    smoothScrollTo(section);
    onSectionChange(section);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Don't render if not visible
  if (!isVisible) return null;

  return (
    <>
      <nav 
        className="navigation"
        style={{
          // Preserve the advanced gradient background effect
          background: isScrolled 
            ? 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)'
            : 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(15, 23, 42, 0.6) 100%)',
          // Preserve conditional border
          borderBottom: `1px solid ${isScrolled ? 'rgba(6, 182, 212, 0.4)' : 'rgba(6, 182, 212, 0.2)'}`,
          // Preserve conditional box shadow
          boxShadow: isScrolled ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 4px 20px rgba(0, 0, 0, 0.2)',
          // Preserve height
          height: 'clamp(65px, 8vh, 80px)',
          // Preserve visibility transitions
          transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
          opacity: isVisible ? 1 : 0
        }}
      >
        {/* Shimmer effect line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, #06b6d4 20%, #8b5cf6 50%, #06b6d4 80%, transparent 100%)',
          animation: 'shimmer 3s ease-in-out infinite',
        }} />

        <div className="navigation-container" style={{
          height: '100%',
          alignItems: 'center'
        }}>
          {/* Logo */}
          <div 
            className="navigation-logo"
            style={{
              // Preserve holographic gradient effect
              background: 'linear-gradient(45deg, #06b6d4, #8b5cf6, #06b6d4)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'holographic 4s ease-in-out infinite',
              textShadow: '0 0 20px rgba(6, 182, 212, 0.3)'
            }}
            onClick={() => handleSectionClick('hero')}
          >
            {'<OKG />'}
          </div>

          {/* Desktop Navigation */}
          <div className="navigation-links" style={{
            gap: 'clamp(8px, 2vw, 16px)'
          }}>
            {sections.map((section) => {
              const isActive = activeSection === section;
              return (
                <button
                  key={section}
                  onClick={() => handleSectionClick(section)}
                  className={`navigation-link ${isActive ? 'active' : ''}`}
                  style={{
                    // Preserve advanced styling
                    fontSize: 'clamp(0.7rem, 1.8vw, 0.875rem)',
                    color: isActive ? '#ffffff' : '#94a3b8',
                    background: isActive 
                      ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.2))'
                      : 'transparent',
                    border: isActive 
                      ? '1px solid rgba(6, 182, 212, 0.5)' 
                      : '1px solid transparent',
                    borderRadius: '8px',
                    padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 20px)',
                    transform: isActive ? 'translateY(-2px) scale(1.05)' : 'translateY(0) scale(1)',
                    boxShadow: isActive 
                      ? '0 8px 25px rgba(6, 182, 212, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                      : 'none',
                    textShadow: isActive ? '0 0 10px rgba(6, 182, 212, 0.8)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.target.style.color = '#06b6d4';
                      e.target.style.background = 'rgba(6, 182, 212, 0.1)';
                      e.target.style.transform = 'translateY(-2px) scale(1.02)';
                      e.target.style.boxShadow = '0 5px 15px rgba(6, 182, 212, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.target.style.color = '#94a3b8';
                      e.target.style.background = 'transparent';
                      e.target.style.transform = 'translateY(0) scale(1)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                >
                  {isActive && (
                    <div style={{
                      position: 'absolute',
                      bottom: '-1px',
                      left: '50%',
                      width: '60%',
                      height: '2px',
                      background: 'linear-gradient(90deg, transparent, #06b6d4, #8b5cf6, #06b6d4, transparent)',
                      transform: 'translateX(-50%)',
                      borderRadius: '2px',
                      animation: 'glow 2s ease-in-out infinite alternate',
                    }} />
                  )}
                  
                  <span style={{ position: 'relative', zIndex: 1 }}>
                    {section.toUpperCase()}
                  </span>
                </button>
              );
            })}
            
            {/* Theme Toggle */}
            <ThemeToggle />
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={toggleMobileMenu}
            className={`mobile-menu-toggle ${isMobileMenuOpen ? 'open' : ''}`}
            style={{
              // Preserve enhanced styling
              background: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: '8px',
              color: '#06b6d4'
            }}
            aria-label="Toggle mobile menu"
          >
            <span className="sr-only">
              {isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            </span>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        {sections.map((section) => {
          const isActive = activeSection === section;
          return (
            <button
              key={section}
              onClick={() => handleSectionClick(section)}
              className={`mobile-menu-link ${isActive ? 'active' : ''}`}
              style={{
                // Preserve enhanced mobile styling
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: isActive ? '#06b6d4' : '#94a3b8',
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              {section.toUpperCase()}
            </button>
          );
        })}
        <ThemeToggle />
      </div>

      {/* CSS Keyframes - Keep these for advanced animations */}
      <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 0.5; transform: translateX(-100%); }
          50% { opacity: 1; transform: translateX(100%); }
        }
        
        @keyframes holographic {
          0%, 100% { 
            background-position: 0% 50%; 
            filter: hue-rotate(0deg);
          }
          25% { 
            background-position: 100% 50%; 
            filter: hue-rotate(90deg);
          }
          50% { 
            background-position: 100% 50%; 
            filter: hue-rotate(180deg);
          }
          75% { 
            background-position: 0% 50%; 
            filter: hue-rotate(270deg);
          }
        }
        
        @keyframes glow {
          0% { 
            box-shadow: 0 0 5px rgba(6, 182, 212, 0.5);
            opacity: 0.8;
          }
          100% { 
            box-shadow: 0 0 20px rgba(6, 182, 212, 1), 0 0 30px rgba(139, 92, 246, 0.5);
            opacity: 1;
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default Navigation;
