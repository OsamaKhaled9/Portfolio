import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Phone } from 'lucide-react';
import { contactStyles } from './Contact.styles';
import { personalInfo } from '../../data/personal';
import { apiService } from '../../services/api';

const Contact = () => {
  // State for dynamic data
  const [contactData, setContactData] = useState({
    email: personalInfo.email,
    phone: personalInfo.phone,
    linkedin: personalInfo.linkedin,
    github: personalInfo.github,
    resumeUrl: personalInfo.resumeUrl,
    socialLinks: personalInfo.socialLinks || {},
    loading: true
  });

  // Transform API profile data to match your current structure
  const transformContactData = (profileData) => {
    const socialLinks = profileData.socialLinks || {};
    
    return {
      email: profileData.email,
      phone: profileData.phone,
      location: profileData.location,
      linkedin: socialLinks.linkedin || personalInfo.linkedin,
      github: socialLinks.github ? socialLinks.github.replace('https://github.com/', '') : personalInfo.github,
      resumeUrl: profileData.resumeUrl,
      socialLinks: socialLinks,
      loading: false
    };
  };

  // Fetch contact data from profile API
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await apiService.getProfile();
        const profileData = response.data;
        
        if (profileData) {
          const transformedData = transformContactData(profileData);
          setContactData(transformedData);
        }
        
      } catch (error) {
        console.error('Failed to fetch contact data:', error);
        // Keep static data as fallback
        setContactData({
          ...personalInfo,
          loading: false
        });
      }
    };

    fetchContactData();
  }, []);

  // Create social links array (same logic as before, but with dynamic data)
  const socialLinks = [
    { 
      icon: <Github size={32} />, 
      label: "GitHub", 
      href: contactData.github ? `https://github.com/${contactData.github}` : null
    },
    { 
      icon: <Linkedin size={32} />, 
      label: "LinkedIn", 
      href: contactData.linkedin
    },
    { 
      icon: <Mail size={32} />, 
      label: "Email", 
      href: contactData.email ? `mailto:${contactData.email}` : null
    },
    { 
      icon: <Phone size={32} />, 
      label: "Phone", 
      href: contactData.phone ? `tel:${contactData.phone}` : null
    }
  ].filter(link => link.href); // Only show links that have valid hrefs

  const handleDownloadResume = () => {
    // Implement resume download
    console.log('Download resume');
    if (contactData.resumeUrl) {
      window.open(contactData.resumeUrl, '_blank');
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
        
        {contactData.resumeUrl && (
          <div style={contactStyles.resumeButton}>
            <button 
              onClick={handleDownloadResume}
              style={contactStyles.downloadButton}
            >
              Download Resume
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Contact;
