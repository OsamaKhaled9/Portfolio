import React from 'react';
import { projectCardStyles } from './ProjectCard.styles';

const ProjectCard = ({ project, onViewDetails, onViewCode }) => {
  const { title, tech, description, status, grade } = project;
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Production': return { bg: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' };
      case 'Active': return { bg: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' };
      default: return { bg: 'rgba(249, 115, 22, 0.2)', color: '#f97316' };
    }
  };

  const handleCardClick = (e) => {
    // Don't open modal if clicking on GitHub button or any button/link
    if (e.target.closest('button') || e.target.closest('a')) {
      return;
    }
    onViewDetails(project);
  };

  const statusColor = getStatusColor(status);

  return (
    <div 
      className="project-card" 
      style={{
        ...projectCardStyles.card,
        cursor: 'pointer'  // ADD THIS - makes card show pointer cursor
      }}
      onClick={handleCardClick}  // ADD THIS - enables click to open modal
    >
      <div style={projectCardStyles.header}>
        <h3 className="project-title" style={projectCardStyles.title}>{title}</h3>
        <span style={{
          ...projectCardStyles.status,
          backgroundColor: statusColor.bg,
          color: statusColor.color
        }}>
          {status}
        </span>
      </div>
      
      {grade && (
        <div style={projectCardStyles.grade}>Grade: {grade}</div>
      )}
      
      <div style={projectCardStyles.tech}>
        {Array.isArray(tech) ? tech.join(', ') : tech}
      </div>
      
      <p style={projectCardStyles.description}>{description}</p>
      
      <div style={projectCardStyles.buttons}>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            console.log('Details button clicked for:', title); // Debug log
            onViewDetails(project);
          }}
          style={projectCardStyles.primaryButton}
        >
          Details
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onViewCode(project);
          }}
          style={projectCardStyles.secondaryButton}
        >
          GitHub
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
