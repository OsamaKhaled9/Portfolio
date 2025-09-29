// src/sections/About/About.jsx - PERFORMANCE OPTIMIZED VERSION
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { User, Briefcase, Code, Award, Filter } from 'lucide-react';
import './About.css';
import { apiService } from '../../services/api';

// ✅ MOVED OUTSIDE - Prevents recreating on every render
const PORTFOLIO_COLORS = [
  '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6b7280'
];

const SOFT_SKILLS = [
  'Leadership', 'Team Collaboration', 'Problem Solving',
  'Communication', 'Mentoring', 'Strategic Thinking'
];

const TAB_DEFINITIONS = [
  { id: 'story', label: 'About Me', description: 'Personal story & approach', icon: User },
  { id: 'experience', label: 'Experience', description: 'Work, education & certifications', icon: Briefcase },
  { id: 'skills', label: 'Skills', description: 'Technical expertise', icon: Code }
];

const ERROR_MESSAGE_STYLE = {
  textAlign: 'center',
  color: '#f59e0b',
  marginBottom: '20px',
  padding: '12px',
  backgroundColor: 'rgba(245, 158, 11, 0.1)',
  borderRadius: '8px',
  border: '1px solid rgba(245, 158, 11, 0.3)'
};

const NO_SKILLS_MESSAGE_STYLE = {
  color: '#9ca3af',
  textAlign: 'center'
};

// ✅ STABLE FUNCTIONS - Created once, never change
const formatDateRange = (start, end, isCurrent) => {
  if (!start) return 'Date not available';
  try {
    const startDate = new Date(start).toLocaleDateString('en-US', {
      month: 'short', year: 'numeric'
    });
    const endDate = isCurrent ? 'Present' : (end ? new Date(end).toLocaleDateString('en-US', {
      month: 'short', year: 'numeric'
    }) : 'Present');
    return `${startDate} – ${endDate}`;
  } catch {
    return 'Date not available';
  }
};

const getSkillColor = (index) => PORTFOLIO_COLORS[index % PORTFOLIO_COLORS.length];

// ✅ STABLE ICON RENDERER
const renderIcon = (IconComponent, size = 20) => <IconComponent size={size} />;

const About = () => {
  const [activeTab, setActiveTab] = useState('story');
  const [timelineFilter, setTimelineFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [portfolioData, setPortfolioData] = useState({
    profile: null,
    workExperience: [],
    education: [],
    skills: {},
    certifications: []
  });

  // ✅ OPTIMIZED DATA FETCHING - Only runs once
  useEffect(() => {
    let isMounted = true;

    const fetchPortfolioData = async () => {
      try {
        const response = await apiService.getPortfolio();

        if (!isMounted) return;

        if (response?.success && response.data) {
          const { profile, experience, skills, certifications } = response.data;
          
          // ✅ OPTIMIZED PROCESSING - Batch operations
          const workExperience = [];
          const educationData = [];

          if (Array.isArray(experience)) {
            experience.forEach(exp => {
              if (!exp) return;
              
              const period = formatDateRange(exp.startDate, exp.endDate, exp.isCurrent);
              const processedExp = {
                id: exp.id || `${exp.company}-${exp.position}`,
                position: exp.position || 'Position',
                company: exp.company || 'Company',
                description: exp.description || '',
                type: exp.type || 'Work',
                period,
                technologies: Array.isArray(exp.technologies) ? exp.technologies : []
              };

              workExperience.push(processedExp);
              
              if (exp.type === 'Education') {
                educationData.push({
                  id: processedExp.id,
                  degree: processedExp.position,
                  school: processedExp.company,
                  period: processedExp.period,
                  description: processedExp.description
                });
              }
            });
          }

          // ✅ OPTIMIZED SKILLS PROCESSING
          let processedSkills = {};
          if (Array.isArray(skills)) {
            skills.forEach(skill => {
              const category = skill.category || 'Other';
              if (!processedSkills[category]) {
                processedSkills[category] = { title: category, skills: [] };
              }
              processedSkills[category].skills.push(skill.name || skill);
            });
          } else if (skills && typeof skills === 'object') {
            processedSkills = skills;
          }

          // Fallback skills if empty
          if (Object.keys(processedSkills).length === 0) {
            processedSkills = {
              programming: { title: 'Programming Languages', skills: ['JavaScript', 'Python', 'Java', 'TypeScript'] },
              frameworks: { title: 'Frameworks & Tools', skills: ['React', 'Node.js', 'Express', 'MongoDB'] },
              cloud: { title: 'Cloud & Databases', skills: ['AWS', 'PostgreSQL', 'Docker', 'Kubernetes'] }
            };
          }

          const processedCertifications = Array.isArray(certifications)
            ? certifications.filter(c => c?.name).map((cert, idx) => ({
                ...cert,
                id: cert.id || `cert-${idx}`
              }))
            : [];

          // ✅ SINGLE STATE UPDATE
          setPortfolioData({
            profile: profile || { aboutContent: "I'm a passionate backend developer and cloud engineer." },
            workExperience,
            education: educationData,
            skills: processedSkills,
            certifications: processedCertifications
          });
          setError(null);
        } else {
          throw new Error('Invalid API response');
        }
      } catch (e) {
        console.error('API Error:', e);
        if (isMounted) {
          setError('Failed to load some data');
          // Fallback data
          setPortfolioData({
            profile: { aboutContent: "I'm a passionate backend developer and cloud engineer." },
            workExperience: [{
              id: 'fallback-work-1',
              position: 'Backend Engineer Intern',
              company: 'INTcore',
              period: 'Sep 2024 – Present',
              description: 'Working on scalable backend solutions',
              type: 'Work',
              technologies: ['Node.js', 'PostgreSQL', 'Docker']
            }],
            education: [{
              id: 'fallback-edu-1',
              degree: 'Computer Engineering',
              school: 'University',
              period: '2020 – 2024',
              description: 'Computer Science fundamentals'
            }],
            skills: {
              programming: { title: 'Programming Languages', skills: ['JavaScript', 'Python', 'Java'] },
              frameworks: { title: 'Frameworks & Tools', skills: ['React', 'Node.js', 'Express'] },
              cloud: { title: 'Cloud & Databases', skills: ['AWS', 'MongoDB', 'PostgreSQL'] }
            },
            certifications: []
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPortfolioData();
    return () => { isMounted = false; };
  }, []); // ✅ EMPTY DEPENDENCIES - Only run once

  // ✅ OPTIMIZED FILTERED DATA - Stable dependencies
  const filteredExperience = useMemo(() => (
    portfolioData.workExperience.filter(exp => 
      timelineFilter === 'all' || (timelineFilter === 'work' && exp.type !== 'Education')
    )
  ), [portfolioData.workExperience, timelineFilter]);

  const filteredEducation = useMemo(() => (
    (timelineFilter === 'all' || timelineFilter === 'education') 
      ? portfolioData.education 
      : []
  ), [portfolioData.education, timelineFilter]);

  const skillEntries = useMemo(() => 
    Object.entries(portfolioData.skills || {}), 
    [portfolioData.skills]
  );

  // ✅ OPTIMIZED SPIRAL SKILLS - Only recalculate when skills change
  const spiralSkills = useMemo(() => {
    const skills = [];
    skillEntries.forEach(([category, data], catIdx) => {
      if (!data?.skills) return;
      data.skills.slice(0, 6).forEach((skill, i) => {
        const index = catIdx * 6 + i;
        skills.push({
          key: `${category}-${i}`, // ✅ SIMPLIFIED KEY
          skill,
          category,
          delay: index * 0.1,
          rotation: index * 60,
          color: PORTFOLIO_COLORS[index % PORTFOLIO_COLORS.length]
        });
      });
    });
    return skills;
  }, [skillEntries]);

  // ✅ OPTIMIZED SOFT SKILLS - Created once
  const softSkillsWithColors = useMemo(() => 
    SOFT_SKILLS.map((skill, idx) => ({
      skill,
      color: PORTFOLIO_COLORS[idx % PORTFOLIO_COLORS.length]
    })), []
  );

  // ✅ STABLE EVENT HANDLERS
  const handleTabChange = useCallback((tabId) => setActiveTab(tabId), []);
  const handleFilterChange = useCallback((filter) => setTimelineFilter(filter), []);

  // ✅ OPTIMIZED RENDER FUNCTIONS - Minimal dependencies
  const renderStoryContent = useCallback(() => (
    <div className="tab-content story-content">
      <div className="story-section">
        <h3>My Journey</h3>
        <p>{portfolioData.profile?.aboutContent || "I'm a passionate backend developer and cloud engineer."}</p>
      </div>

      <div className="values-section">
        <h3>My Approach</h3>
        <div className="values-grid">
          <div className="value-item">
            <h4>Innovation First</h4>
            <p>Exploring cutting-edge technologies to solve complex problems</p>
          </div>
          <div className="value-item">
            <h4>Quality Focus</h4>
            <p>Writing clean, maintainable code with robust architecture</p>
          </div>
          <div className="value-item">
            <h4>Continuous Learning</h4>
            <p>Staying updated with industry trends and best practices</p>
          </div>
        </div>
      </div>

      <div className="soft-skills-section">
        <h3>Beyond Code</h3>
        <div className="soft-skills-grid">
          {softSkillsWithColors.map(({ skill, color }) => (
            <span key={skill} className="soft-skill" style={{ borderColor: color }}>
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="skills-spiral-section">
        <h3>Technical Skills</h3>
        <div className="skills-spiral">
          {spiralSkills.length > 0 ? spiralSkills.map(({ key, skill, delay, rotation, color }) => (
            <div 
              key={key} 
              className="skill-spiral-item" 
              style={{ '--delay': `${delay}s`, '--rotation': `${rotation}deg` }}
            >
              <div 
                className="skill-circle" 
                style={{ backgroundColor: color }} 
                title={skill}
              >
                {skill[0]?.toUpperCase()}
              </div>
            </div>
          )) : (
            <p style={NO_SKILLS_MESSAGE_STYLE}>No skills data available</p>
          )}
        </div>
      </div>
    </div>
  ), [portfolioData.profile?.aboutContent, softSkillsWithColors, spiralSkills]);

  const renderSkillsContent = useCallback(() => (
    <div className="tab-content skills-content">
      <div className="skills-detailed-grid">
        {skillEntries.length === 0 && (
          <p style={NO_SKILLS_MESSAGE_STYLE}>No skills data available</p>
        )}
        {skillEntries.map(([category, data]) => {
          if (!data?.skills) return null;
          return (
            <div key={category} className="skill-category-detailed">
              <h3>{data.title || category}</h3>
              <div className="skills-list-detailed">
                {data.skills.map((skill, i) => (
                  <div key={`${category}-${i}`} className="skill-item-detailed">
                    <div 
                      className="skill-icon" 
                      style={{ backgroundColor: getSkillColor(i) }}
                    >
                      {skill[0]?.toUpperCase()}
                    </div>
                    <span className="skill-name">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  ), [skillEntries]);

  const renderExperienceContent = useCallback(() => (
    <div className="tab-content experience-content">
      <div className="timeline-filters">
        {['all', 'work', 'education'].map(filterKey => (
          <button
            key={filterKey}
            type="button"
            className={timelineFilter === filterKey ? 'active' : ''}
            onClick={() => handleFilterChange(filterKey)}
          >
            {filterKey === 'all' && renderIcon(Filter, 16)}
            {filterKey === 'work' && renderIcon(Briefcase, 16)}
            {filterKey === 'education' && renderIcon(User, 16)}
            {' '}
            {filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}
          </button>
        ))}
      </div>

      {(timelineFilter === 'all' || timelineFilter === 'work') && filteredExperience.length > 0 && (
        <div className="timeline-section">
          <h3>Professional Experience</h3>
          <div className="timeline">
            {filteredExperience.map((exp) => (
              <div key={exp.id} className="timeline-item">
                <div className="timeline-marker work-marker"></div>
                <div className="timeline-content">
                  <h4>{exp.position}</h4>
                  <div className="company-period">
                    <span className="company">{exp.company}</span>
                    <span className="period">{exp.period}</span>
                  </div>
                  {exp.description && <p className="description">{exp.description}</p>}
                  {exp.technologies?.length > 0 && (
                    <div className="technologies">
                      {exp.technologies.map((tech, i) => (
                        <span key={i} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredEducation.length > 0 && (
        <div className="education-section">
          <h3>Education</h3>
          <div className="education-grid">
            {filteredEducation.map((edu) => (
              <div key={edu.id} className="education-card">
                <h4>{edu.degree}</h4>
                <div className="school-period">
                  <span className="school">{edu.school}</span>
                  <span className="period">{edu.period}</span>
                </div>
                {edu.description && <p className="description">{edu.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {portfolioData.certifications.length > 0 && (
        <div className="certifications-section">
          <h3>Certifications</h3>
          <div className="certifications-grid">
            {portfolioData.certifications.map(cert => (
              <div key={cert.id} className="certification-card">
                <div className="cert-icon">{renderIcon(Award, 24)}</div>
                <div className="cert-info">
                  <h4>{cert.name}</h4>
                  {cert.issuer && <p className="cert-issuer">{cert.issuer}</p>}
                  {cert.completedDate && <p className="cert-date">{cert.completedDate}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  ), [timelineFilter, filteredExperience, filteredEducation, portfolioData.certifications, handleFilterChange]);

  if (loading) {
    return (
      <section id="about" className="about-section loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading portfolio data...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="about-section">
      <div className="about-container">
        {error && (
          <div className="error-message" style={ERROR_MESSAGE_STYLE}>
            <p>{error}</p>
          </div>
        )}

        <div className="section-header">
          <h2 className="section-title">About Me</h2>
          <p className="section-description">
            Explore my background, experience, and technical expertise
          </p>
        </div>

        <div className="tab-navigation">
          {TAB_DEFINITIONS.map(tab => (
            <button
              key={tab.id}
              type="button"
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
            >
              <div className="tab-icon">{renderIcon(tab.icon)}</div>
              <div className="tab-text">
                <span className="tab-label">{tab.label}</span>
                <span className="tab-description">{tab.description}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="tab-content-container">
          {activeTab === 'story' && renderStoryContent()}
          {activeTab === 'experience' && renderExperienceContent()}
          {activeTab === 'skills' && renderSkillsContent()}
        </div>
      </div>
    </section>
  );
};

export default About;
