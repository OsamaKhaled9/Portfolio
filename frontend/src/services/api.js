const API_BASE_URL = 'http://localhost:3000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // ===== PROFILE METHODS =====
  async getProfile() {
    return this.request('/api/profile');
  }

  async updateProfile(data) {
    return this.request('/api/admin/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async getPortfolio() {
    return this.request('/api/portfolio');
  }

  // ===== PROJECT METHODS =====
  async getProjects() {
    return this.request('/api/projects');
  }

  async getProject(id) {
    return this.request(`/api/projects/${id}`);
  }

  async createProject(data) {
    return this.request('/api/admin/projects', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateProject(id, data) {
    return this.request(`/api/admin/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteProject(id) {
    return this.request(`/api/admin/projects/${id}`, {
      method: 'DELETE'
    });
  }

  // ===== SKILL METHODS =====
  async getSkills() {
    return this.request('/api/skills');
  }

  async getSkillsGrouped() {
    return this.request('/api/skills/grouped-by-category');
  }

  async getSkill(id) {
    return this.request(`/api/skills/${id}`);
  }

  async createSkill(data) {
    return this.request('/api/admin/skills', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateSkill(id, data) {
    return this.request(`/api/admin/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteSkill(id) {
    return this.request(`/api/admin/skills/${id}`, {
      method: 'DELETE'
    });
  }

  // ===== EXPERIENCE METHODS =====
  async getExperience() {
    return this.request('/api/experience');
  }

  async getExperienceItem(id) {
    return this.request(`/api/experience/${id}`);
  }

  async createExperience(data) {
    return this.request('/api/admin/experience', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateExperience(id, data) {
    return this.request(`/api/admin/experience/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteExperience(id) {
    return this.request(`/api/admin/experience/${id}`, {
      method: 'DELETE'
    });
  }

  // ===== CONTACT METHODS =====
  async sendContactMessage(data) {
    return this.request('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // ===== CERTIFICATIONS METHODS =====
  async getCertifications() {
  return this.request('/api/certifications');
}

async getCertification(id) {
  return this.request(`/api/certifications/${id}`);
}
async createCertification(data) {
  return this.request('/api/admin/certifications', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      ...this.headers
    }
  });
}

async updateCertification(id, data) {
  return this.request(`/api/admin/certifications/${id}`, {
    method: 'PUT', 
    body: JSON.stringify(data),
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      ...this.headers
    }
  });
}

async deleteCertification(id) {
  return this.request(`/api/admin/certifications/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      ...this.headers
    }
  });
}

  // ===== AUTHENTICATION METHODS =====
  async login(email, password) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  // ===== UTILITY METHODS =====
  async get(endpoint) {
    return this.request(endpoint);
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }
}

// Create and export singleton instance
export const apiService = new ApiService();

// Also export the class for potential direct usage
export default apiService;
