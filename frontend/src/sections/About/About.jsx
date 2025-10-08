import React, { useState, useEffect, useMemo } from 'react';
import { User, Briefcase, Code, Award, Filter } from '../../components/ui/Icons';
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

// ✅ Helper function outside component (no memoization needed)
const formatDateRange = (start, end, isCurrent) => {
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
};

// ✅ Icon helper outside component

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

  // ✅ Data fetching effect (no unnecessary dependencies)
  useEffect(() => {
    let isMounted = true;

    const fetchPortfolioData = async () => {
      try {
        const response = await apiService.getPortfolio();

        if (!isMounted) return;

        if (response?.success && response.data) {
          const { profile, experience, skills, certifications } = response.data;
          const workExperience = [];
          const educationData = [];

          if (Array.isArray(experience)) {
            experience.forEach(exp => {
              if (exp) {
                const period = formatDateRange(exp.startDate, exp.endDate, exp.isCurrent);
                const processedExp = {
                  id: exp.id || `${Date.now()}-${Math.random()}`,
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

          const processedCertifications = Array.isArray(certifications)
            ? certifications.filter(c => c?.name).map((cert, idx) => ({ ...cert, id: cert.id || `cert-${idx}` }))
            : [];

          setPortfolioData({
            profile: profile || null,
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
        console.error('Error loading portfolio data:', e);
        if (isMounted) {
          setError('Failed to load some data');
          // Set fallback data
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
              description: 'Computer Science and Engineering fundamentals'
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
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPortfolioData();

    return () => {
      isMounted = false;
    };
  }, []); // ✅ Empty deps - fetch only once on mount

  // ✅ Only memoize EXPENSIVE calculations with STABLE dependencies
  const spiralSkills = useMemo(() => {
    const skills = [];
    const entries = Object.entries(portfolioData.skills || {});
    
    entries.forEach(([category, data], catIdx) => {
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
  }, [portfolioData.skills]);

  // ✅ Simple computed values - NO useMemo needed
  const filteredExperience = portfolioData.workExperience.filter(exp => 
    timelineFilter === 'all' || (timelineFilter === 'work' && exp.type !== 'Education')
  );

  const filteredEducation = (timelineFilter === 'all' || timelineFilter === 'education') 
    ? portfolioData.education 
    : [];

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

  // ✅ Direct render functions - NO useCallback wrapping
  const renderStoryContent = () => (
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
          {SOFT_SKILLS.map((skill, idx) => (
            <span 
              key={skill} 
              className="soft-skill" 
              style={{ borderColor: PORTFOLIO_COLORS[idx % PORTFOLIO_COLORS.length] }}
            >
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
              <div className="skill-circle" style={{ backgroundColor: color }} title={skill}>
                {skill[0].toUpperCase()}
              </div>
            </div>
          )) : <p style={{ color: '#9ca3af', textAlign: 'center' }}>No skills data available</p>}
        </div>
      </div>
    </div>
  );

  const renderSkillsContent = () => (
    <div className="tab-content skills-content">
      <div className="skills-detailed-grid">
        {Object.entries(portfolioData.skills || {}).map(([category, data]) => {
          if (!data?.skills) return null;
          return (
            <div key={category} className="skill-category-detailed">
              <h3>{data.title ?? category}</h3>
              <div className="skills-list-detailed">
                {data.skills.map((skill, i) => (
                  <div key={`${category}-${skill}-${i}`} className="skill-item-detailed">
                    <div 
                      className="skill-icon" 
                      style={{ backgroundColor: PORTFOLIO_COLORS[i % PORTFOLIO_COLORS.length] }}
                    >
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

  const renderExperienceContent = () => (
    <div className="tab-content experience-content">
      <div className="timeline-filters">
        <button
          role="tab"
          type="button"
          className={timelineFilter === 'all' ? 'active' : ''}
          onClick={() => setTimelineFilter('all')}
        >
          <Filter size={16} /> All
        </button>
        <button
          role="tab"
          type="button"
          className={timelineFilter === 'work' ? 'active' : ''}
          onClick={() => setTimelineFilter('work')}
        >
          <Briefcase size={16} /> Work
        </button>
        <button
          role="tab"
          type="button"
          className={timelineFilter === 'education' ? 'active' : ''}
          onClick={() => setTimelineFilter('education')}
        >
          <User size={16} /> Education
        </button>
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
                <div className="cert-icon"><Award size={24} /></div>
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
          {TAB_DEFINITIONS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <div className="tab-icon"><Icon size={20} /></div>
                <div className="tab-text">
                  <span className="tab-label">{tab.label}</span>
                  <span className="tab-description">{tab.description}</span>
                </div>
              </button>
            );
          })}
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
