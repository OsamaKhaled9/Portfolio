import React from 'react';
import { Github, Linkedin, Mail, Phone } from 'lucide-react';
import { contactStyles } from './Contact.styles';
import { personalInfo } from '../../data/personal';

const Contact = () => {
  const socialLinks = [
    { icon: <Github size={32} />, label: "GitHub", href: `https://github.com/${personalInfo.github}` },
    { icon: <Linkedin size={32} />, label: "LinkedIn", href: personalInfo.linkedin },
    { icon: <Mail size={32} />, label: "Email", href: `mailto:${personalInfo.email}` },
    { icon: <Phone size={32} />, label: "Phone", href: `tel:${personalInfo.phone}` }
  ];

  const handleDownloadResume = () => {
    // Implement resume download
    console.log('Download resume');
    if (personalInfo.resumeUrl) {
      window.open(personalInfo.resumeUrl, '_blank');
    }
  };

  return (
    <section id="contact" style={contactStyles.section}>
      <div style={contactStyles.container}>
        <h2 style={contactStyles.title}>Let's Connect</h2>
        <p style={contactStyles.description}>
          I'm actively seeking opportunities in backend development, cloud engineering, and AI systems. 
          Let's discuss how we can work together on innovative projects.
        </p>
        
        <div style={contactStyles.socialLinks}>
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.href}
              style={contactStyles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div style={contactStyles.socialIcon}>
                {social.icon}
              </div>
              <span style={contactStyles.socialLabel}>{social.label}</span>
            </a>
          ))}
        </div>
        
        <div style={contactStyles.resumeButton}>
          <button 
            onClick={handleDownloadResume}
            style={contactStyles.downloadButton}
          >
            Download Resume
          </button>
        </div>
      </div>
    </section>
  );
};

export default Contact;
