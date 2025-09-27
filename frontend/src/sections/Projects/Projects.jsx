import React, { useState, useEffect } from 'react';
import ProjectCarousel from '../../components/ui/ProjectCarousel/ProjectCarousel.jsx';
import { projects } from '../../data/projects';
import { apiService } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dynamicProjects, setDynamicProjects] = useState(projects);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();

  const transformProjects = (apiProjects) => {
    return apiProjects.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      tech: project.techStack || [],
      image: project.imageUrl || null,
      links: {
        github: project.githubUrl,
        demo: project.liveUrl
      },
      featured: project.featured || false,
      status: project.status || 'Completed',
      grade: null
    }));
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiService.getProjects();
        const apiProjects = response.data;
        
        if (apiProjects && apiProjects.length > 0) {
          const transformed = transformProjects(apiProjects);
          setDynamicProjects(transformed);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <>
      <section id="projects" style={{ 
        height: '100vh', /* ✨ EXACT: height */
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
        padding: 0, /* ✨ REMOVED: all padding */
        margin: 0 /* ✨ REMOVED: all margin */
      }}>
        <ProjectCarousel 
          projects={dynamicProjects}
          onProjectSelect={handleProjectSelect}
        />
      </section>

      {/* ✨ SIMPLIFIED: Modal with guaranteed links */}
      {isModalOpen && selectedProject && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
              border: `1px solid ${isDarkMode ? '#06b6d4' : '#0891b2'}`,
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                backgroundColor: 'transparent',
                color: isDarkMode ? '#9ca3af' : '#6b7280',
                border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
                borderRadius: '6px',
                padding: '6px 12px',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>

            <h2 style={{ 
              color: isDarkMode ? '#06b6d4' : '#0891b2',
              fontSize: '24px', 
              marginBottom: '16px', 
              marginRight: '40px' 
            }}>
              {selectedProject.title}
            </h2>

            <div style={{ 
              color: isDarkMode ? '#06b6d4' : '#0891b2',
              marginBottom: '16px', 
              fontFamily: 'Monaco, "Lucida Console", monospace' 
            }}>
              {Array.isArray(selectedProject.tech) ? selectedProject.tech.join(', ') : selectedProject.tech}
            </div>

            <p style={{ 
              color: isDarkMode ? '#d1d5db' : '#374151',
              lineHeight: 1.6, 
              marginBottom: '20px' 
            }}>
              {selectedProject.description}
            </p>

            {/* ✨ GUARANTEED: Links section */}
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              flexWrap: 'wrap'
            }}>
              {selectedProject.links?.demo && (
                <a
                  href={selectedProject.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#06b6d4',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontFamily: 'Monaco, "Lucida Console", monospace',
                    fontWeight: 'bold'
                  }}
                >
                  🚀 Live Demo
                </a>
              )}
              {selectedProject.links?.github && (
                <a
                  href={selectedProject.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '12px 20px',
                    border: '2px solid #06b6d4',
                    backgroundColor: 'transparent',
                    color: '#06b6d4',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontFamily: 'Monaco, "Lucida Console", monospace',
                    fontWeight: 'bold'
                  }}
                >
                  📂 GitHub
                </a>
              )}
              {/* ✨ DEBUG: Show available links */}
              {!selectedProject.links?.demo && !selectedProject.links?.github && (
                <div style={{ color: '#999', fontStyle: 'italic' }}>
                  No links available for this project
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Projects;
