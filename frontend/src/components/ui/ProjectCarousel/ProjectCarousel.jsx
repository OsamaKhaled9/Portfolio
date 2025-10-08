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
      onProjectSelect(projects[index]);
    } else {
      updateCarousel(index);
    }
  };

  // ✅ FIXED: Use <a> tags instead of divs for better accessibility
  const handleLinkClick = (e) => {
    e.stopPropagation();
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
    return (
      <div className="project-carousel-empty">
        <p>No projects available</p>
      </div>
    );
  }

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <section 
      className={`project-carousel ${isDarkMode ? 'dark' : 'light'}`}
      aria-label="Featured projects carousel"
    >
      {/* ✅ FIXED: h1 → h2 (assuming page has h1 elsewhere) */}
      <h2 className="carousel-title">Featured Projects</h2>

      <div 
        className="carousel-container"
        ref={carouselRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        role="region"
        aria-label="Project carousel"
      >
        <button 
          className="nav-arrow left"
          onClick={() => updateCarousel(currentIndex - 1)}
          aria-label="Previous project"
          type="button"
        >
          <span aria-hidden="true">‹</span>
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
              <article
                key={project.id}
                className={`project-card ${positionClass}`}
                onClick={() => handleCardClick(index)}
                data-index={index}
                aria-label={`Project: ${project.title}`}
              >
                <div className="card-content">
                  {project.image ? (
                    <>
                      <div className="project-image">
                        <img 
                          src={project.image} 
                          alt={`${project.title} preview`}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="project-info">
                        {/* ✅ FIXED: h3 is correct here (under h2) */}
                        <h3 className="project-card-title">
                          {truncateText(project.title, 30)}
                        </h3>
                        <p className="project-card-description">
                          {truncateText(project.description, 60)}
                        </p>
                        <div className="project-tech" aria-label="Technologies used">
                          {Array.isArray(project.tech) 
                            ? project.tech.slice(0, 2).join(' • ')
                            : project.tech || 'N/A'
                          }
                        </div>
                        
                        {/* ✅ FIXED: Use <a> tags with proper attributes */}
                        <div className="project-links" role="group" aria-label="Project links">
                          {project.links?.github && (
                            <a
                              href={project.links.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="link-btn github"
                              onClick={(e) => handleLinkClick(e)}
                              aria-label={`View ${project.title} on GitHub`}
                            >
                              GitHub
                            </a>
                          )}
                          {project.links?.demo && (
                            <a
                              href={project.links.demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="link-btn demo"
                              onClick={(e) => handleLinkClick(e)}
                              aria-label={`View ${project.title} demo`}
                            >
                              Demo
                            </a>
                          )}
                          {!project.links?.github && !project.links?.demo && (
                            <span className="no-links" role="status">No Links</span>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="project-info-full">
                        <h3 className="project-card-title">
                          {truncateText(project.title, 35)}
                        </h3>
                        <p className="project-card-description">
                          {truncateText(project.description, 100)}
                        </p>
                        <div className="project-tech" aria-label="Technologies used">
                          {Array.isArray(project.tech) 
                            ? project.tech.slice(0, 3).join(' • ')
                            : project.tech || 'N/A'
                          }
                        </div>
                        <div className="project-status" role="status">
                          {project.status || 'Completed'}
                        </div>
                        
                        {/* ✅ FIXED: Use <a> tags */}
                        <div className="project-links" role="group" aria-label="Project links">
                          {project.links?.github && (
                            <a
                              href={project.links.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="link-btn github"
                              onClick={(e) => handleLinkClick(e)}
                              aria-label={`View ${project.title} on GitHub`}
                            >
                              GitHub
                            </a>
                          )}
                          {project.links?.demo && (
                            <a
                              href={project.links.demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="link-btn demo"
                              onClick={(e) => handleLinkClick(e)}
                              aria-label={`View ${project.title} demo`}
                            >
                              Demo
                            </a>
                          )}
                          {!project.links?.github && !project.links?.demo && (
                            <span className="no-links" role="status">No Links</span>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <button 
          className="nav-arrow right"
          onClick={() => updateCarousel(currentIndex + 1)}
          aria-label="Next project"
          type="button"
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>

      <div className="carousel-dots" role="tablist" aria-label="Project indicators">
        {projects.map((project, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => updateCarousel(index)}
            role="tab"
            aria-selected={index === currentIndex}
            aria-label={`Go to project ${index + 1}: ${project.title}`}
            type="button"
          />
        ))}
      </div>

      <p className="carousel-instruction">
        Click center card for details • Click links to open directly
      </p>
    </section>
  );
};

export default ProjectCarousel;
