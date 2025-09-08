import React from 'react';
import { Monitor, Code, Database, Globe } from 'lucide-react';
import { techIconStyles } from './TechIcon.styles';

const iconMap = {
  Monitor,
  Code,
  Database,
  Globe
};

const TechIcon = ({ name, icon, color }) => {
  const IconComponent = iconMap[icon];

  return (
    <div className="tech-item" style={techIconStyles.container}>
      <div className="tech-icon" style={{ color }}>
        {IconComponent && <IconComponent style={techIconStyles.icon} />}
      </div>
      <div style={techIconStyles.label}>{name}</div>
    </div>
  );
};

export default TechIcon;
