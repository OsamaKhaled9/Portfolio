import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useActiveSection } from '../../../hooks/useActiveSection';
import { smoothScrollTo } from '../../../utils/smoothScroll';
import ThemeToggle from '../ThemeToggle';

const Navigation = ({ 
  sections = ['hero', 'about', 'projects', 'contact'],
  onSectionChange = () => {},
  isVisible = true
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
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

  const navStyles = {
    nav: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      width: '100%',
      zIndex: 50,
      background: isScrolled 
        ? 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)'
        : 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(15, 23, 42, 0.6) 100%)',
      backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${isScrolled ? 'rgba(6, 182, 212, 0.4)' : 'rgba(6, 182, 212, 0.2)'}`,
      boxShadow: isScrolled ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 4px 20px rgba(0, 0, 0, 0.2)',
      height: 'clamp(65px, 8vh, 80px)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
      opacity: isVisible ? 1 : 0
    },
  };

  const getLinkStyle = (section) => {
    const isActive = activeSection === section;
    return {
      position: 'relative',
      fontSize: 'clamp(0.7rem, 1.8vw, 0.875rem)',
      fontFamily: 'Monaco, "Lucida Console", monospace',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      color: isActive ? '#ffffff' : '#94a3b8',
      background: isActive 
        ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.2))'
        : 'transparent',
      border: isActive 
        ? '1px solid rgba(6, 182, 212, 0.5)' 
        : '1px solid transparent',
      borderRadius: '8px',
      cursor: 'pointer',
      padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 20px)',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      transform: isActive ? 'translateY(-2px) scale(1.05)' : 'translateY(0) scale(1)',
      boxShadow: isActive 
        ? '0 8px 25px rgba(6, 182, 212, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        : 'none',
      textShadow: isActive ? '0 0 10px rgba(6, 182, 212, 0.8)' : 'none',
    };
  };

  return (
    <>
      <nav style={navStyles.nav}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, #06b6d4 20%, #8b5cf6 50%, #06b6d4 80%, transparent 100%)',
          animation: 'shimmer 3s ease-in-out infinite',
        }} />

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 clamp(15px, 3vw, 20px)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Logo */}
          <div 
            style={{
              fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
              fontWeight: 'bold',
              fontFamily: 'Monaco, "Lucida Console", monospace',
              background: 'linear-gradient(45deg, #06b6d4, #8b5cf6, #06b6d4)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'holographic 4s ease-in-out infinite',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              flexShrink: 0,
              textShadow: '0 0 20px rgba(6, 182, 212, 0.3)'
            }}
            onClick={() => handleSectionClick('hero')}
          >
            {'<OKG />'}
          </div>

          {/* Desktop Navigation */}
          <div style={{
            display: isMobile ? 'none' : 'flex',
            gap: 'clamp(8px, 2vw, 16px)',
            alignItems: 'center'
          }}>
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => handleSectionClick(section)}
                style={getLinkStyle(section)}
                onMouseEnter={(e) => {
                  if (activeSection !== section) {
                    e.target.style.color = '#06b6d4';
                    e.target.style.background = 'rgba(6, 182, 212, 0.1)';
                    e.target.style.transform = 'translateY(-2px) scale(1.02)';
                    e.target.style.boxShadow = '0 5px 15px rgba(6, 182, 212, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== section) {
                    e.target.style.color = '#94a3b8';
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                {activeSection === section && (
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
            ))}
            
            {/* Theme Toggle */}
            <ThemeToggle />
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={toggleMobileMenu}
            style={{
              display: isMobile ? 'flex' : 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              background: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              color: '#06b6d4'
            }}
          >
             {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 'clamp(65px, 8vh, 80px)',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 40,
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(15px)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => handleSectionClick(section)}
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                color: activeSection === section ? '#06b6d4' : '#94a3b8',
                transition: 'color 0.3s ease, transform 0.3s ease',
                transform: activeSection === section ? 'scale(1.1)' : 'scale(1)',
                cursor: 'pointer'
              }}
            >
              {section.toUpperCase()}
            </button>
          ))}
          <ThemeToggle />
        </div>
      )}

      {/* CSS Keyframes */}
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