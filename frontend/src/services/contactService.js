import { apiService } from './api';

export const contactService = {
  async sendMessage(contactData) {
    // For now, simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Contact form submitted:', contactData);
        resolve({ success: true, message: 'Message sent successfully!' });
      }, 1000);
    });
    
    // Future implementation with NestJS backend:
    // return apiService.post('/contact', contactData);
  },

  async getContactInfo() {
    // Future implementation
    // return apiService.get('/contact/info');
    return {
      email: 'your-email@example.com',
      phone: '01005073385'
    };
  }
};
