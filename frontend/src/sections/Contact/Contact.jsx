import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Phone, MessageSquare, X } from '../../components/ui/Icons';
import './Contact.css'; // Import the new CSS file
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
    } catch (error_) {
      setSubmitStatus({ type: 'error', message: 'An error occurred. Please try again later.' ,error_ });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section id="contact" className="contact-section">
        <div className="contact-container">
          <div className="contact-header">
            <h2 className="contact-title">Let's Connect</h2>
            <p className="contact-description">
              I'm actively seeking opportunities in backend development, cloud engineering, and AI systems. 
              Let's discuss how we can work together on innovative projects.
            </p>
          </div>
          
          <div className="contact-social-links">
            {socialLinks.map((social, index) => (
              <a 
                key={index} 
                href={social.href} 
                className="contact-social-link" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <div className="contact-social-icon">{social.icon}</div>
                <span className="contact-social-label">{social.label}</span>
              </a>
            ))}
          </div>
          
          <div className="contact-message-button-wrapper">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="contact-message-button"
            >
              <MessageSquare size={20} />
              Send Me a Message
            </button>
          </div>

          {contactData.resumeUrl && (
            <div className="contact-resume">
              <button 
                onClick={() => window.open(contactData.resumeUrl, '_blank')} 
                className="contact-download-button"
              >
                Download Resume
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div
          className="contact-drawer-overlay"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Contact Drawer */}
      <div
        className={`contact-drawer ${isDrawerOpen ? 'open' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="contact-drawer-header">
          <h3 className="contact-drawer-title">
            <Mail size={20} />
            Contact Me
          </h3>
          
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="contact-drawer-close"
            aria-label="Close contact form"
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Content */}
        <div className="contact-drawer-content">
          <form 
            onSubmit={handleSubmit} 
            className={`contact-form ${isSubmitting ? 'loading' : ''}`}
          >
            <div className="contact-form-field">
              <label className="contact-form-label">Your Name *</label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="contact-input"
              />
            </div>

            <div className="contact-form-field">
              <label className="contact-form-label">Your Email *</label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                className="contact-input"
              />
            </div>

            <div className="contact-form-field">
              <label className="contact-form-label">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Let me know how I can help you"
                className="contact-input"
              />
            </div>

            <div className="contact-form-field">
              <label className="contact-form-label">Your Message *</label>
              <textarea
                required
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Your message here..."
                rows={5}
                className="contact-textarea"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="contact-submit-button"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>

          {submitStatus && (
            <div className={`contact-form-status ${submitStatus.type}`}>
              <p>
                {submitStatus.type === 'success' ? '✅ ' : '❌ '}{submitStatus.message}
              </p>
            </div>
          )}

          <div className="contact-drawer-direct">
            <p className="contact-drawer-direct-label">Or reach me directly:</p>
            {contactData.email && (
              <p className="contact-drawer-direct-item">
                <a href={`mailto:${contactData.email}`} className="contact-drawer-link">
                  📧 {contactData.email}
                </a>
              </p>
            )}
            {contactData.phone && (
              <p className="contact-drawer-direct-item">
                <a href={`tel:${contactData.phone}`} className="contact-drawer-link">
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
