// src/services/contactService.js
import { apiService } from './api.js';

export const contactService = {
  async submitContactForm(formData) {
    try {
      const response = await apiService.sendContactMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject || 'Portfolio Contact',
        message: formData.message
      });

      return response;
    } catch (error) {
      console.error('Contact form submission failed:', error);
      return {
        success: false,
        message: 'Failed to send message. Please try again later.'
      };
    }
  }
};

export default contactService;
