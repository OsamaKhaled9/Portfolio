import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Phone, MessageSquare, X } from 'lucide-react';
import { contactStyles } from './Contact.styles';
import { personalInfo } from '../../data/personal';
import { apiService } from '../../services/api';
import { contactService } from '../../services/contactService';

const Contact = () => {
  // Combined state management
  const [contactData, setContactData] = useState({ ...personalInfo, loading: true });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Fetch contact data
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await apiService.getProfile();
        if (response?.data) {
          const { socialLinks = {} } = response.data;
          setContactData({
            ...response.data,
            linkedin: socialLinks.linkedin || personalInfo.linkedin,
            github: socialLinks.github?.replace('https://github.com/', '') || personalInfo.github,
            loading: false
          });
        }
      } catch (error) {
        console.error('Failed to fetch contact data:', error);
        setContactData({ ...personalInfo, loading: false });
      }
    };
    fetchContactData();
  }, []);

  // Drawer effects (escape key + body scroll)
  useEffect(() => {
    const handleEscape = (e) => e.key === 'Escape' && isDrawerOpen && setIsDrawerOpen(false);
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = isDrawerOpen ? 'hidden' : 'unset';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen]);

  // Create social links
  const socialLinks = [
    { icon: <Github size={32} />, label: "GitHub", href: contactData.github && `https://github.com/${contactData.github}` },
    { icon: <Linkedin size={32} />, label: "LinkedIn", href: contactData.linkedin },
    { icon: <Mail size={32} />, label: "Email", href: contactData.email && `mailto:${contactData.email}` },
    { icon: <Phone size={32} />, label: "Phone", href: contactData.phone && `tel:${contactData.phone}` }
  ].filter(link => link.href);

  // Form handlers
  const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await contactService.submitContactForm(formData);
      if (response.success) {
        setSubmitStatus({ type: 'success', message: response.message || 'Your message has been sent successfully!' });
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => { setIsDrawerOpen(false); setSubmitStatus(null); }, 2000);
      } else {
        setSubmitStatus({ type: 'error', message: response.message || 'Failed to send message. Please try again.' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'An error occurred. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reusable styles
  const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid var(--border-color, #374151)',
    backgroundColor: 'var(--input-bg, #111827)',
    color: 'var(--text-primary, #f3f4f6)',
    fontSize: '14px',
    fontFamily: 'Monaco, "Lucida Console", monospace',
    outline: 'none',
    transition: 'border-color 0.2s ease'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--text-primary, #f3f4f6)',
    fontFamily: 'Monaco, "Lucida Console", monospace'
  };

  const buttonHoverEffect = (e, isEnter) => {
    if (isEnter) {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 8px 25px rgba(6, 182, 212, 0.4)';
    } else {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 15px rgba(6, 182, 212, 0.3)';
    }
  };

  const focusEffect = (e, isFocus) => {
    if (isFocus) {
      e.currentTarget.style.borderColor = '#06b6d4';
      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(6, 182, 212, 0.1)';
    } else {
      e.currentTarget.style.borderColor = 'var(--border-color, #374151)';
      e.currentTarget.style.boxShadow = 'none';
    }
  };

  return (
    <>
      <section id="contact" style={contactStyles.section}>
        <div style={contactStyles.container}>
          <h2 style={contactStyles.title}>Let's Connect</h2>
          <p style={contactStyles.description}>
            I'm actively seeking opportunities in backend development, cloud engineering, and AI systems. 
            Let's discuss how we can work together on innovative projects.
          </p>
          
          <div style={contactStyles.socialLinks}>
            {socialLinks.map((social, index) => (
              <a key={index} href={social.href} style={contactStyles.socialLink} target="_blank" rel="noopener noreferrer">
                <div style={contactStyles.socialIcon}>{social.icon}</div>
                <span style={contactStyles.socialLabel}>{social.label}</span>
              </a>
            ))}
          </div>
          
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <button
              onClick={() => setIsDrawerOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '16px 32px',
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
              onMouseEnter={(e) => buttonHoverEffect(e, true)}
              onMouseLeave={(e) => buttonHoverEffect(e, false)}
            >
              <MessageSquare size={20} />
              Send Me a Message
            </button>
          </div>

          {contactData.resumeUrl && (
            <div style={contactStyles.resumeButton}>
              <button onClick={() => window.open(contactData.resumeUrl, '_blank')} style={contactStyles.downloadButton}>
                Download Resume
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 50,
            transition: 'opacity 0.3s ease'
          }}
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Contact Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          zIndex: 60,
          height: '100vh',
          width: '400px',
          maxWidth: '90vw',
          backgroundColor: 'var(--bg-primary, #1f2937)',
          transform: isDrawerOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          overflowY: 'auto',
          boxShadow: '-10px 0 25px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px',
          borderBottom: '1px solid var(--border-color, #374151)',
          backgroundColor: 'var(--bg-secondary, #111827)'
        }}>
          <h3 style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-primary, #06b6d4)',
            fontSize: '18px',
            fontFamily: 'Monaco, "Lucida Console", monospace',
            margin: 0,
            textTransform: 'uppercase',
            fontWeight: 'bold'
          }}>
            <Mail size={20} />
            Contact Me
          </h3>
          
          <button
            onClick={() => setIsDrawerOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary, #9ca3af)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--hover-bg, #374151)';
              e.currentTarget.style.color = 'var(--text-primary, #f3f4f6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary, #9ca3af)';
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Content */}
        <div style={{ flex: 1, padding: '24px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { name: 'name', label: 'Your Name *', type: 'text', placeholder: 'John Doe', required: true },
              { name: 'email', label: 'Your Email *', type: 'email', placeholder: 'john@example.com', required: true },
              { name: 'subject', label: 'Subject', type: 'text', placeholder: 'Let me know how I can help you', required: false }
            ].map((field) => (
              <div key={field.name}>
                <label style={labelStyle}>{field.label}</label>
                <input
                  required={field.required}
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  placeholder={field.placeholder}
                  style={inputStyle}
                  onFocus={(e) => focusEffect(e, true)}
                  onBlur={(e) => focusEffect(e, false)}
                />
              </div>
            ))}

            <div>
              <label style={labelStyle}>Your Message *</label>
              <textarea
                required
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Your message here..."
                rows={5}
                style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={(e) => focusEffect(e, true)}
                onBlur={(e) => focusEffect(e, false)}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '8px',
                border: 'none',
                background: isSubmitting ? 'var(--disabled-bg, #374151)' : 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontFamily: 'Monaco, "Lucida Console", monospace',
                transition: 'all 0.2s ease',
                marginTop: '8px'
              }}
              onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.transform = 'translateY(-1px)', e.currentTarget.style.boxShadow = '0 4px 12px rgba(6, 182, 212, 0.3)')}
              onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = 'none')}
            >
              {isSubmitting ? '✈️ Sending...' : '🚀 Send Message'}
            </button>
          </form>

          {submitStatus && (
            <div style={{
              marginTop: '16px',
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
                {submitStatus.type === 'success' ? '✅ ' : '❌ '}{submitStatus.message}
              </p>
            </div>
          )}

          <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid var(--border-color, #374151)' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary, #9ca3af)', fontFamily: 'Monaco, "Lucida Console", monospace', margin: '0 0 8px' }}>
              Or reach me directly:
            </p>
            {contactData.email && (
              <p style={{ margin: '4px 0', fontSize: '14px' }}>
                <a href={`mailto:${contactData.email}`} style={{ color: '#06b6d4', textDecoration: 'none', fontFamily: 'Monaco, "Lucida Console", monospace' }}>
                  📧 {contactData.email}
                </a>
              </p>
            )}
            {contactData.phone && (
              <p style={{ margin: '4px 0', fontSize: '14px' }}>
                <a href={`tel:${contactData.phone}`} style={{ color: '#06b6d4', textDecoration: 'none', fontFamily: 'Monaco, "Lucida Console", monospace' }}>
                  📞 {contactData.phone}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
