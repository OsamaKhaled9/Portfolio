import React, { useState, useEffect } from 'react';
import { aboutStyles } from './About.styles';
import { skillCategories } from '../../data/skills';
import { experience, education } from '../../data/experience';
import { apiService } from '../../services/api';

const About = () => {
  // State management
  const [dynamicData, setDynamicData] = useState({
    skills: skillCategories,
    experience: experience,
    education: education,
    loading: true,
    error: null
  });

  // Transform API skills data to match your skillCategories structure
  const transformSkills = (apiSkills) => {
    const transformed = {};
    
    // Group skills by category
    apiSkills.forEach(skill => {
      const categoryKey = skill.category.toLowerCase().replace(/\s+/g, '');
      
      if (!transformed[categoryKey]) {
        transformed[categoryKey] = {
          title: skill.category,
          skills: []
        };
      }
      
      transformed[categoryKey].skills.push(skill.name);
    });
    
    return transformed;
  };

  // Transform API experience data to match your current format
  const transformExperience = (apiExperience) => {
    const workExperience = [];
    const educationData = [];
    
    apiExperience.forEach(exp => {
      // Format period string
      const startDate = new Date(exp.startDate).toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      });
      const endDate = exp.isCurrent ? 'Present' : 
        new Date(exp.endDate).toLocaleDateString('en-US', { 
          month: 'short', 
          year: 'numeric' 
        });
      const period = `${startDate} – ${endDate}`;
      
      if (exp.type === 'Education' || exp.type === 'education') {
        educationData.push({
          degree: exp.position,
          school: exp.company,
          period: period,
          details: exp.description || ""
        });
      } else {
        workExperience.push({
          position: exp.position,
          company: exp.company,
          period: period,
          description: exp.description
        });
      }
    });
    
    return { workExperience, educationData };
  };

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Option 1: Get everything in one call (more efficient)
        // const portfolioData = await apiService.getPortfolio();
        // const { skills: apiSkills, experience: apiExperience } = portfolioData.data;
        
        // Option 2: Separate calls (use this if you prefer)
        const [skillsResponse, experienceResponse] = await Promise.all([
          apiService.getSkills(),
          apiService.getExperience()
        ]);
        
        const apiSkills = skillsResponse.data;
        const apiExperience = experienceResponse.data;
        
        // Transform data to match your current structure
        const transformedSkills = apiSkills.length > 0 ? 
          transformSkills(apiSkills) : skillCategories;
          
        const { workExperience, educationData } = apiExperience.length > 0 ? 
          transformExperience(apiExperience) : 
          { workExperience: experience, educationData: education };
        
        setDynamicData({
          skills: transformedSkills,
          experience: workExperience,
          education: educationData,
          loading: false,
          error: null
        });
        
      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Fallback to static data
        setDynamicData({
          skills: skillCategories,
          experience: experience,
          education: education,
          loading: false,
          error: error.message
        });
      }
    };

    fetchData();
  }, []);

  // Your exact same JSX structure - no changes!
  return (
    <section id="about" style={aboutStyles.section}>
      <div style={aboutStyles.container}>
        <div style={aboutStyles.grid}>
          <div>
            <h2 style={aboutStyles.title}>About Me</h2>
            
            <div style={aboutStyles.educationSection}>
              <h3 style={aboutStyles.sectionSubtitle}>Education</h3>
              {dynamicData.education.map((edu, index) => (
                <div key={index} style={aboutStyles.item}>
                  <div style={aboutStyles.itemTitle}>{edu.degree}</div>
                  <div style={aboutStyles.itemDetails}>{edu.school}</div>
                  <div style={aboutStyles.itemDetails}>{edu.period}</div>
                </div>
              ))}
            </div>

            <div style={aboutStyles.experienceSection}>
              <h3 style={aboutStyles.sectionSubtitle}>Experience</h3>
              {dynamicData.experience.map((exp, index) => (
                <div key={index} style={aboutStyles.item}>
                  <div style={aboutStyles.itemTitle}>{exp.position}</div>
                  <div style={aboutStyles.itemCompany}>{exp.company} | {exp.period}</div>
                  <div style={aboutStyles.itemDescription}>{exp.description}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div style={aboutStyles.skillsContainer}>
            <h3 style={aboutStyles.sectionSubtitle}>Technical Skills</h3>
            
            {Object.entries(dynamicData.skills).map(([key, category]) => (
              <div key={key} style={aboutStyles.skillCategory}>
                <div style={aboutStyles.skillCategoryTitle}>{category.title}</div>
                <div style={aboutStyles.skillTags}>
                  {category.skills.map((skill, index) => (
                    <span key={index} style={aboutStyles.skillTag}>{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
