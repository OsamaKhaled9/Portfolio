import React, { useState } from 'react';
import ProjectCard from '../../components/ui/ProjectCard/ProjectCard.jsx';
import { projectsStyles } from './Projects.styles';
import { projects } from '../../data/projects';

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (project) => {
    console.log('Opening modal for:', project.title); // Debug log
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const handleViewCode = (project) => {
    console.log('View code for:', project.title);
    if (project.links?.github) {
      window.open(project.links.github, '_blank');
    }
  };

  return (
    <>
      <section id="projects" style={projectsStyles.section}>
        <div style={projectsStyles.container}>
          <div style={projectsStyles.header}>
            <h2 style={projectsStyles.title}>Featured Projects</h2>
            <p style={projectsStyles.description}>
              A showcase of my academic and professional projects, featuring AI systems, cloud architecture, and full-stack applications
            </p>
          </div>
          
          <div style={projectsStyles.grid}>
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onViewDetails={handleViewDetails}
                onViewCode={handleViewCode}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Simple Modal */}
      {isModalOpen && selectedProject && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
              backgroundColor: '#1f2937',
              border: '1px solid #06b6d4',
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
                color: '#9ca3af',
                border: '1px solid #4b5563',
                borderRadius: '6px',
                padding: '6px 12px',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>

            <h2 style={{ color: '#06b6d4', fontSize: '24px', marginBottom: '16px', marginRight: '40px' }}>
              {selectedProject.title}
            </h2>

            {selectedProject.grade && (
              <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '12px' }}>
                Grade: {selectedProject.grade}
              </div>
            )}

            <div style={{ color: '#06b6d4', marginBottom: '16px', fontFamily: 'Monaco, "Lucida Console", monospace' }}>
              {Array.isArray(selectedProject.tech) ? selectedProject.tech.join(', ') : selectedProject.tech}
            </div>

            <p style={{ color: '#d1d5db', lineHeight: 1.6, marginBottom: '20px' }}>
              {selectedProject.description}
            </p>

            {selectedProject.links && (
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {selectedProject.links.demo && (
                  <a
                    href={selectedProject.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#06b6d4',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      fontFamily: 'Monaco, "Lucida Console", monospace'
                    }}
                  >
                    Live Demo
                  </a>
                )}
                {selectedProject.links.github && (
                  <a
                    href={selectedProject.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '10px 20px',
                      border: '1px solid #4b5563',
                      color: '#d1d5db',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      fontFamily: 'Monaco, "Lucida Console", monospace'
                    }}
                  >
                    GitHub
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Projects;
