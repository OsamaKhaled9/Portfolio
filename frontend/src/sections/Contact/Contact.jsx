import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Phone } from 'lucide-react';
import { contactStyles } from './Contact.styles';
import { personalInfo } from '../../data/personal';
import { apiService } from '../../services/api';
import { contactService } from '../../services/contactService';

const Contact = () => {
  // State for dynamic contact data (unchanged)
  const [contactData, setContactData] = useState({
    email: personalInfo.email,
    phone: personalInfo.phone,
    linkedin: personalInfo.linkedin,  
    github: personalInfo.github,
    resumeUrl: personalInfo.resumeUrl,
    socialLinks: personalInfo.socialLinks || {},
    loading: true
  });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Transform API profile data (unchanged)
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

  // Fetch contact data (unchanged)
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
        setContactData({
          ...personalInfo,
          loading: false
        });
      }
    };

    fetchContactData();
  }, []);

  // Social links array (unchanged)
  const socialLinks = [
    { 
      icon: <Github size={24} />, 
      label: "GitHub", 
      href: contactData.github ? `https://github.com/${contactData.github}` : null
    },
    { 
      icon: <Linkedin size={24} />, 
      label: "LinkedIn", 
      href: contactData.linkedin
    },
    { 
      icon: <Mail size={24} />, 
      label: "Email", 
      href: contactData.email ? `mailto:${contactData.email}` : null
    },
    { 
      icon: <Phone size={24} />, 
      label: "Phone", 
      href: contactData.phone ? `tel:${contactData.phone}` : null
    }
  ].filter(link => link.href);

  const handleDownloadResume = () => {
    console.log('Download resume');
    if (contactData.resumeUrl) {
      window.open(contactData.resumeUrl, '_blank');
    }
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await contactService.submitContactForm(formData);
      if (response.success) {
        setSubmitStatus({ type: 'success', message: response.message || 'Your message has been sent successfully!' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus({ type: 'error', message: response.message || 'Failed to send message. Please try again.' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'An error occurred. Please try again later.' });
    } finally {
      setIsSubmitting(false);
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
        
        {/* Creative Grid Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '48px',
          alignItems: 'start',
          marginBottom: '48px'
        }}>
          
          {/* Left Card - Social Links & Resume */}
          <div style={{
            background: 'linear-gradient(145deg, #1f2937, #111827)',
            borderRadius: '20px',
            padding: '40px',
            border: '1px solid #374151',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s ease',
            ':hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 20px 40px rgba(6, 182, 212, 0.1)'
            }
          }}>
            <h3 style={{
              color: '#06b6d4',
              fontSize: '24px',
              marginBottom: '24px',
              fontFamily: 'Monaco, "Lucida Console", monospace',
              textAlign: 'center'
            }}>Connect With Me</h3>
            
            {/* Social Links in 2x2 Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '32px'
            }}>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '20px',
                    backgroundColor: '#374151',
                    borderRadius: '12px',
                    color: '#9ca3af',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    border: '1px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#06b6d4';
                    e.currentTarget.style.color = '#000';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = '#06b6d4';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#374151';
                    e.currentTarget.style.color = '#9ca3af';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  {social.icon}
                  <span style={{
                    fontSize: '12px',
                    fontFamily: 'Monaco, "Lucida Console", monospace',
                    fontWeight: 'bold'
                  }}>{social.label}</span>
                </a>
              ))}
            </div>

            {/* Resume Button */}
            {contactData.resumeUrl && (
              <button 
                onClick={handleDownloadResume}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                  color: 'white',
                  fontFamily: 'Monaco, "Lucida Console", monospace',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(6, 182, 212, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(6, 182, 212, 0.3)';
                }}
              >
                📄 Download Resume
              </button>
            )}
          </div>

          {/* Right Card - Contact Form */}
          <div 
            style={{
              backgroundImage: 'linear-gradient(163deg, #06b6d4 0%, #8b5cf6 100%)',
              borderRadius: '22px',
              padding: '3px',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 30px rgba(6, 182, 212, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(6, 182, 212, 0.4)';
              e.currentTarget.style.transform = 'translateY(-5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(6, 182, 212, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div 
              style={{
                backgroundColor: '#1f2937',
                borderRadius: '20px',
                padding: '40px',
                transition: 'all 0.2s ease'
              }}
            >
              <h3 style={{
                textAlign: 'center',
                margin: '0 0 32px',
                color: '#06b6d4',
                fontSize: '24px',
                fontFamily: 'Monaco, "Lucida Console", monospace'
              }}>Send Message</h3>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Name & Email in one row */}
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{
                    flex: 1,
                    backgroundColor: '#111827',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid #374151',
                    transition: 'all 0.3s ease'
                  }}>
                    <input
                      required
                      placeholder="Your Name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      style={{
                        background: 'none',
                        border: 'none',
                        outline: 'none',
                        width: '100%',
                        color: '#f3f4f6',
                        fontSize: '14px',
                        fontFamily: 'Monaco, "Lucida Console", monospace'
                      }}
                    />
                  </div>
                  
                  <div style={{
                    flex: 1,
                    backgroundColor: '#111827',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid #374151',
                    transition: 'all 0.3s ease'
                  }}>
                    <input
                      required
                      placeholder="your@email.com"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      style={{
                        background: 'none',
                        border: 'none',
                        outline: 'none',
                        width: '100%',
                        color: '#f3f4f6',
                        fontSize: '14px',
                        fontFamily: 'Monaco, "Lucida Console", monospace'
                      }}
                    />
                  </div>
                </div>

                {/* Subject */}
                <div style={{
                  backgroundColor: '#111827',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid #374151'
                }}>
                  <input
                    placeholder="Subject (Optional)"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    style={{
                      background: 'none',
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      color: '#f3f4f6',
                      fontSize: '14px',
                      fontFamily: 'Monaco, "Lucida Console", monospace'
                    }}
                  />
                </div>

                {/* Message */}
                <div style={{
                  backgroundColor: '#111827',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid #374151'
                }}>
                  <textarea
                    required
                    placeholder="Your message here..."
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    style={{
                      background: 'none',
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      color: '#f3f4f6',
                      resize: 'none',
                      fontSize: '14px',
                      fontFamily: 'Monaco, "Lucida Console", monospace'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: 'none',
                    background: isSubmitting ? '#374151' : 'transparent',
                    color: isSubmitting ? '#9ca3af' : '#06b6d4',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    fontFamily: 'Monaco, "Lucida Console", monospace',
                    border: '2px solid #06b6d4',
                    marginTop: '8px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.backgroundColor = '#06b6d4';
                      e.currentTarget.style.color = '#000';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#06b6d4';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {isSubmitting ? '✈️ Sending...' : '🚀 Send Message'}
                </button>
              </form>

              {submitStatus && (
                <div style={{
                  marginTop: '20px',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: submitStatus.type === 'success' ? 'rgba(6, 182, 212, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  border: `1px solid ${submitStatus.type === 'success' ? '#06b6d4' : '#ef4444'}`,
                  textAlign: 'center'
                }}>
                  <p style={{
                    color: submitStatus.type === 'success' ? '#06b6d4' : '#ef4444',
                    fontFamily: 'Monaco, "Lucida Console", monospace',
                    fontSize: '14px',
                    margin: 0
                  }}>
                    {submitStatus.type === 'success' ? '✅ ' : '❌ '}
                    {submitStatus.message}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
