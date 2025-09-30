import React, { useState, useEffect } from 'react';
import ProjectCarousel from '../../components/ui/ProjectCarousel/ProjectCarousel.jsx';
import { projects } from '../../data/projects';
import { apiService } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import './projects.css'; // Import the new CSS file

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
      <section id="projects" className="projects-section">
        {loading ? (
          <div className="projects-loading">
            <div className="projects-loading-spinner"></div>
          </div>
        ) : (
          <ProjectCarousel 
            projects={dynamicProjects}
            onProjectSelect={handleProjectSelect}
          />
        )}
      </section>

      {/* Modal */}
      {isModalOpen && selectedProject && (
        <div
          className={`project-modal-overlay ${isDarkMode ? 'dark' : 'light'}`}
          onClick={handleCloseModal}
        >
          <div
            className={`project-modal-content ${isDarkMode ? 'dark' : 'light'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className={`project-modal-close ${isDarkMode ? 'dark' : 'light'}`}
            >
              ✕
            </button>

            <h2 className={`project-modal-title ${isDarkMode ? 'dark' : 'light'}`}>
              {selectedProject.title}
            </h2>

            <div className={`project-modal-tech ${isDarkMode ? 'dark' : 'light'}`}>
              {Array.isArray(selectedProject.tech) ? selectedProject.tech.join(', ') : selectedProject.tech}
            </div>

            <p className={`project-modal-description ${isDarkMode ? 'dark' : 'light'}`}>
              {selectedProject.description}
            </p>

            <div className="project-modal-links">
              {selectedProject.links?.demo && (
                <a
                  href={selectedProject.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-modal-link demo"
                >
                  🚀 Live Demo
                </a>
              )}
              {selectedProject.links?.github && (
                <a
                  href={selectedProject.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-modal-link github"
                >
                  📂 GitHub
                </a>
              )}
              {!selectedProject.links?.demo && !selectedProject.links?.github && (
                <div className="project-modal-no-links">
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
