import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import './ProjectCarousel.css';

const ProjectCarousel = ({ projects, onProjectSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { isDarkMode } = useTheme();
  const carouselRef = useRef(null);

  const updateCarousel = (newIndex) => {
    if (isAnimating || projects.length === 0) return;
    setIsAnimating(true);

    const validIndex = (newIndex + projects.length) % projects.length;
    setCurrentIndex(validIndex);

    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  };

  const handleCardClick = (index) => {
    if (index === currentIndex) {
      // ✨ SIMPLIFIED: Always open modal when center card is clicked
      onProjectSelect(projects[index]);
    } else {
      updateCarousel(index);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      updateCarousel(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      updateCarousel(currentIndex + 1);
    }
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    carouselRef.current.touchStartX = touch.clientX;
  };

  const handleTouchEnd = (e) => {
    const touch = e.changedTouches[0];
    const touchEndX = touch.clientX;
    const touchStartX = carouselRef.current.touchStartX;
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        updateCarousel(currentIndex + 1);
      } else {
        updateCarousel(currentIndex - 1);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  if (projects.length === 0) {
    return <div>No projects available</div>;
  }

  return (
    <div className={`project-carousel ${isDarkMode ? 'dark' : 'light'}`}>
      <h1 className="carousel-title">FEATURED PROJECTS</h1>

      <div 
        className="carousel-container"
        ref={carouselRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* ✨ FIXED: Better centered arrows */}
        <button 
          className="nav-arrow left"
          onClick={() => updateCarousel(currentIndex - 1)}
          aria-label="Previous project"
        >
          <span>‹</span>
        </button>

        <div className="carousel-track">
          {projects.map((project, index) => {
            const offset = (index - currentIndex + projects.length) % projects.length;
            let positionClass = 'hidden';

            if (offset === 0) positionClass = 'center';
            else if (offset === 1) positionClass = 'right-1';
            else if (offset === 2) positionClass = 'right-2';
            else if (offset === projects.length - 1) positionClass = 'left-1';
            else if (offset === projects.length - 2) positionClass = 'left-2';

            return (
              <div
                key={project.id}
                className={`project-card ${positionClass}`}
                onClick={() => handleCardClick(index)}
                data-index={index}
              >
                {/* ✨ IMPROVED: Better card preview with image/title + description */}
                <div className="card-content">
                  {project.image ? (
                    <>
                      {/* Show image with overlay */}
                      <div className="project-image">
                        <img src={project.image} alt={project.title} />
                      </div>
                      <div className="project-overlay">
                        <h3 className="project-card-title">{project.title}</h3>
                        <p className="project-card-description">
                          {project.description.length > 60 
                            ? `${project.description.substring(0, 60)}...`
                            : project.description
                          }
                        </p>
                        <div className="project-tech">
                          {Array.isArray(project.tech) 
                            ? project.tech.slice(0, 3).join(' • ')
                            : project.tech
                          }
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Show full project info when no image */}
                      <div className="project-info-card">
                        <h3 className="project-card-title">{project.title}</h3>
                        <p className="project-card-description">
                          {project.description}
                        </p>
                        <div className="project-tech">
                          {Array.isArray(project.tech) 
                            ? project.tech.slice(0, 4).join(' • ')
                            : project.tech
                          }
                        </div>
                        <div className="project-status">
                          {project.status || 'Completed'}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button 
          className="nav-arrow right"
          onClick={() => updateCarousel(currentIndex + 1)}
          aria-label="Next project"
        >
          <span>›</span>
        </button>
      </div>

      {/* ✨ REMOVED: Redundant project info section */}
      
      <div className="carousel-dots">
        {projects.map((_, index) => (
          <div
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => updateCarousel(index)}
            data-index={index}
          />
        ))}
      </div>

      {/* ✨ ADDED: Simple instruction */}
      <p className="carousel-instruction">
        Click on the center project to view details
      </p>
    </div>
  );
};

export default ProjectCarousel;
