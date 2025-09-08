import React from 'react';
import { aboutStyles } from './About.styles';
import { skillCategories } from '../../data/skills';
import { experience, education } from '../../data/experience';

const About = () => {
  return (
    <section id="about" style={aboutStyles.section}>
      <div style={aboutStyles.container}>
        <div style={aboutStyles.grid}>
          <div>
            <h2 style={aboutStyles.title}>About Me</h2>
            
            <div style={aboutStyles.educationSection}>
              <h3 style={aboutStyles.sectionSubtitle}>Education</h3>
              {education.map((edu, index) => (
                <div key={index} style={aboutStyles.item}>
                  <div style={aboutStyles.itemTitle}>{edu.degree}</div>
                  <div style={aboutStyles.itemDetails}>{edu.school}</div>
                  <div style={aboutStyles.itemDetails}>{edu.period}</div>
                </div>
              ))}
            </div>

            <div style={aboutStyles.experienceSection}>
              <h3 style={aboutStyles.sectionSubtitle}>Experience</h3>
              {experience.map((exp, index) => (
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
            
            {Object.entries(skillCategories).map(([key, category]) => (
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
