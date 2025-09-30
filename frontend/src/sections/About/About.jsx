import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { User, Briefcase, Code, Award, Filter } from 'lucide-react';
import './About.css';
import { apiService } from '../../services/api';

// Static constants outside component
const PORTFOLIO_COLORS = [
  '#06b6d4', '#8b5cf6', '#10b981',
  '#f59e0b', '#ef4444', '#6b7280'
];
const SOFT_SKILLS = [
  'Leadership', 'Team Collaboration', 'Problem Solving',
  'Communication', 'Mentoring', 'Strategic Thinking'
];
const TAB_DEFINITIONS = [
  { id: 'story', label: 'About Me', description: 'Personal story & approach', iconType: 'User' },
  { id: 'experience', label: 'Experience', description: 'Work, education & certifications', iconType: 'Briefcase' },
  { id: 'skills', label: 'Skills', description: 'Technical expertise', iconType: 'Code' }
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

const About = () => {
  console.log('About component rendering...');

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

  // Logging state for debugging
  useEffect(() => {
    console.log('State update: activeTab=', activeTab, ', timelineFilter=', timelineFilter);
  }, [activeTab, timelineFilter]);

  // Stable formatDateRange
  const formatDateRange = useCallback((start, end, isCurrent) => {
    try {
      if (!start) return 'Date not available';
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
  }, []);

  // Memoized colors array
  const getSkillColor = useCallback((index) => {
    return PORTFOLIO_COLORS[index % PORTFOLIO_COLORS.length];
  }, []);

  // Log useEffect execution and dependencies
  useEffect(() => {
    console.log('useEffect for fetching portfolio data triggered.');

    let isMounted = true;

    const fetchPortfolioData = async () => {
      console.log('Fetching portfolio data...');
      try {
        const response = await apiService.getPortfolio();
        console.log('API Response:', response);

        if (!isMounted) return;

        if (response && response.success && response.data) {
          const { profile, experience, skills, certifications } = response.data;
          console.log('Processing experience and skills...');
          const workExperience = [];
          const educationData = [];

          if (Array.isArray(experience)) {
            experience.forEach(exp => {
              if (exp) {
                const period = formatDateRange(exp.startDate, exp.endDate, exp.isCurrent);
                workExperience.push({
                  id: exp.id || `${Date.now()}-${Math.random()}`,
                  position: exp.position || 'Position',
                  company: exp.company || 'Company',
                  description: exp.description || '',
                  type: exp.type || 'Work',
                  period,
                  technologies: Array.isArray(exp.technologies) ? exp.technologies : []
                });
                if (exp.type === 'Education') {
                  educationData.push({
                    id: exp.id || `${Date.now()}-${Math.random()}`,
                    degree: exp.position || 'Degree',
                    school: exp.company || 'Institution',
                    period,
                    description: exp.description || ''
                  });
                }
              }
            });
          }

          // Process skills
          let processedSkills = {};
          if (skills) {
            if (Array.isArray(skills)) {
              const grouped = {};
              skills.forEach(skill => {
                const category = skill.category || 'Other';
                if (!grouped[category]) grouped[category] = { title: category, skills: [] };
                grouped[category].skills.push(skill.name || skill);
              });
              processedSkills = grouped;
            } else if (typeof skills === 'object') {
              processedSkills = skills;
            }
          }
          if (Object.keys(processedSkills).length === 0) {
            processedSkills = {
              programming: { title: 'Programming Languages', skills: ['JavaScript', 'Python', 'Java', 'TypeScript'] },
              frameworks: { title: 'Frameworks & Tools', skills: ['React', 'Node.js', 'Express', 'MongoDB'] },
              cloud: { title: 'Cloud & Databases', skills: ['AWS', 'PostgreSQL', 'Docker', 'Kubernetes'] }
            };
          }
          console.log('Processed skills:', processedSkills);

          const processedCertifications = Array.isArray(certifications)
            ? certifications.filter(c => c && c.name).map((cert, idx) => ({ ...cert, id: cert.id || `cert-${idx}` }))
            : [];

          console.log('Setting portfolio data state.');
          setPortfolioData(() => ({
            profile: profile || null,
            workExperience,
            education: educationData,
            skills: processedSkills,
            certifications: processedCertifications
          }));
          setError(null);
        } else {
          throw new Error('Invalid API response');
        }
      }
      catch (e) {
        console.error('Error in API call', e);
        if (isMounted) {
          setError('Failed to load some data');
          setPortfolioData(() => ({
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
              description: 'Computer Science and Engineering fundamentals'
            }],
            skills: {
              programming: { title: 'Programming Languages', skills: ['JavaScript', 'Python', 'Java'] },
              frameworks: { title: 'Frameworks & Tools', skills: ['React', 'Node.js', 'Express'] },
              cloud: { title: 'Cloud & Databases', skills: ['AWS', 'MongoDB', 'PostgreSQL'] }
            },
            certifications: []
          }));
        }
      }
      finally {
        if (isMounted) {
          setLoading(false);
          console.log('Set loading to false');
        }
      }
    };

    fetchPortfolioData();

    return () => {
      console.log('Cleanup in useEffect');
      isMounted = false;
    };
  }, [formatDateRange]);

  // Memoize filtered data calculations
  const filteredExperience = useMemo(() => {
    console.log('Calculating filteredExperience');
    return portfolioData.workExperience.filter(exp => timelineFilter === 'all' || (timelineFilter === 'work' && exp.type !== 'Education'));
  }, [portfolioData.workExperience, timelineFilter]);

  const filteredEducation = useMemo(() => {
    console.log('Calculating filteredEducation');
    return (timelineFilter === 'all' || timelineFilter === 'education') ? portfolioData.education : [];
  }, [portfolioData.education, timelineFilter]);

  // Memoize skill entries
  const skillEntries = useMemo(() => {
    console.log('Calculating skillEntries');
    return Object.entries(portfolioData.skills || {});
  }, [portfolioData.skills]);

  // Pre-calc spiralSkills with stable keys and colors
  const spiralSkills = useMemo(() => {
    console.log('Calculating spiralSkills');
    const skills = [];
    skillEntries.forEach(([category, data], catIdx) => {
      if (!data || !Array.isArray(data.skills)) return;
      data.skills.slice(0, 6).forEach((skill, i) => {
        const index = catIdx * 6 + i;
        skills.push({
          key: `spiral-${category}-${i}-${skill}`,
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

  // Memoized softSkills with colors
  const softSkillsWithColors = useMemo(() => {
    return SOFT_SKILLS.map((skill, idx) => ({ skill, color: PORTFOLIO_COLORS[idx % PORTFOLIO_COLORS.length] }));
  }, []);

  // Icon render helper
  const renderIcon = useCallback(iconType => {
    switch (iconType) {
      case 'User': return <User size={20} />;
      case 'Briefcase': return <Briefcase size={20} />;
      case 'Code': return <Code size={20} />;
      case 'Filter': return <Filter size={16} />;
      case 'Award': return <Award size={24} />;
      default: return null;
    }
  }, []);

  // All render content functions wrapped in useCallback with minimal deps
  const renderStoryContent = useCallback(() => {
    console.log('Rendering story tab');
    return (
      <div className="tab-content story-content">
        <div className="story-section">
          <h3>My Journey</h3>
          <p>{portfolioData.profile?.aboutContent ?? "I'm a passionate backend developer and cloud engineer with expertise in AI systems."}</p>
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
              <div key={key} className="skill-spiral-item" style={{ '--delay': `${delay}s`, '--rotation': `${rotation}deg` }}>
                <div className="skill-circle" style={{ backgroundColor: color }} title={skill}>
                  {skill[0].toUpperCase()}
                </div>
              </div>
            )) : <p style={NO_SKILLS_MESSAGE_STYLE}>No skills data available</p>}
          </div>
        </div>
      </div>
    );
  }, [portfolioData.profile, softSkillsWithColors, spiralSkills]);

  const renderSkillsContent = useCallback(() => {
    console.log('Rendering skills tab');
    return (
      <div className="tab-content skills-content">
        <div className="skills-detailed-grid">
          {skillEntries.length === 0 && <p style={NO_SKILLS_MESSAGE_STYLE}>No skills data available</p>}
          {skillEntries.map(([category, data]) => {
            if (!data?.skills) return null;
            return (
              <div key={category} className="skill-category-detailed">
                <h3>{data.title ?? category}</h3>
                <div className="skills-list-detailed">
                  {data.skills.map((skill, i) => (
                    <div key={`${category}-${skill}-${i}`} className="skill-item-detailed">
                      <div className="skill-icon" style={{ backgroundColor: getSkillColor(i) }}>
                        {skill[0].toUpperCase()}
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
    );
  }, [skillEntries, getSkillColor]);

  const renderExperienceContent = useCallback(() => {
    console.log('Rendering experience tab');
    return (
      <div className="tab-content experience-content">
        <div className="timeline-filters">
          {['all', 'work', 'education'].map(filterKey => (
            <button
              key={filterKey}
              role="tab"
              type="button"
              className={timelineFilter === filterKey ? 'active' : ''}
              onClick={() => setTimelineFilter(filterKey)}
            >
              {renderIcon(filterKey === 'all' ? 'Filter' : filterKey === 'work' ? 'Briefcase' : 'User', 16)}
              {' '}{filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}
            </button>
          ))}
        </div>
        {(timelineFilter === 'all' || timelineFilter === 'work') && filteredExperience.length > 0 && (
          <div className="timeline-section">
            <h3>Professional Experience</h3>
            <div className="timeline">
              {filteredExperience.map((exp, idx) => (
                <div key={exp.id ?? idx} className="timeline-item">
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
                        {exp.technologies.map((tech, i) => <span key={i} className="tech-tag">{tech}</span>)}
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
              {filteredEducation.map((edu, idx) => (
                <div key={edu.id ?? idx} className="education-card">
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
                  <div className="cert-icon">{renderIcon('Award', 24)}</div>
                  <div className="cert-info">
                    <h4>{cert.name}</h4>
                    {cert.issuer && <p className="cert-issuer">{cert.issuer}</p>}
                    {cert.date && <p className="cert-date">{cert.date}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }, [timelineFilter, filteredExperience, filteredEducation, portfolioData.certifications, renderIcon]);

  if (loading) {
    console.log('Loading state...');
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

        <div className="tab-navigation" role="tablist" aria-label="About section tabs">
          {TAB_DEFINITIONS.map(tab => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className="tab-icon">{renderIcon(tab.iconType)}</div>
              <div className="tab-text">
                <span className="tab-label">{tab.label}</span>
                <span className="tab-description">{tab.description}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="tab-content-container" role="tabpanel" tabIndex={0}>
          {activeTab === 'story' && renderStoryContent()}
          {activeTab === 'experience' && renderExperienceContent()}
          {activeTab === 'skills' && renderSkillsContent()}
        </div>
      </div>
    </section>
  );
};

export default About;
