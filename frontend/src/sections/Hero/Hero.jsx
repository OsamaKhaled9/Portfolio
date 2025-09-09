import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import TechIcon from '../../components/ui/TechIcon';
import Button from '../../components/common/Button';
import { useTheme } from '../../context/ThemeContext';
import { apiService } from '../../services/api'; // ✅ Import API service
import { techStack } from '../../data/skills'; // Keep tech stack static for now
import './Hero.css';

const Hero = ({ onScrollToNext, onNavigateToSection }) => {
  const { isDarkMode } = useTheme();
  
  // ✅ State to hold profile data from API
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch profile data on component mount
  useEffect(() => {
const fetchProfile = async () => {
  console.log('🚀 Starting fetchProfile...');
  
  try {
    console.log('📡 Making API call to:', '/api/profile');
    
    // Check what apiService.get actually returns
    const response = await apiService.get('/api/profile');
    
    console.log('✅ Raw API response:', response);
    console.log('📊 Response type:', typeof response);
    console.log('🔍 Response.success:', response.success);
    console.log('📦 Response.data:', response.data);
    
    if (response.success) {
      console.log('✅ Success condition met, setting profile...');
      setProfile(response.data);
      console.log('✅ Profile set successfully');
    } else {
      console.log('❌ Success condition NOT met');
      console.log('❌ Response.success value:', response.success);
    }
    
  } catch (error) {
    console.error('💥 API call failed with error:', error);
    console.error('💥 Error message:', error.message);
    console.error('💥 Error stack:', error.stack);
    
    // Fallback data
    setProfile({
      name: 'Portfolio Owner',
      title: 'Developer',
      description: 'Welcome to my portfolio'
    });
  } finally {
    console.log('🏁 Finally block - setting loading to false');
    setLoading(false);
  }
};


    fetchProfile();
  }, []);

  // ✅ Show loading state
  if (loading) {
    return (
      <section className={`hero-section ${isDarkMode ? 'dark' : 'light'}`}>
        <div className="hero-content">
          <div className="hero-text-content">
            <div>Loading...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="hero" 
      className={`hero-section ${isDarkMode ? 'dark' : 'light'}`}
    >
      <div className="hero-content">
        <div className="hero-text-content">
          {/* ✅ Use dynamic data instead of static imports */}
          <h1 className="hero-title">Osama Khaled Gamal</h1>
          <div className={`hero-subtitle ${isDarkMode ? 'dark' : 'light'}`}>
            {profile?.title}
          </div>
          <div className="hero-description">
            {profile?.description}
          </div>
        </div>
        
        {/* Keep existing tech stack logic */}
        <div className="hero-tech-stack">
          {techStack.map((tech, index) => (
            <TechIcon key={index} {...tech} />
          ))}
        </div>

        {/* Keep existing button logic */}
        <div className="hero-buttons">
          <Button
            variant="primary"
            onClick={() => onNavigateToSection('projects')}
          >
            View Projects
          </Button>
          <Button
            variant="secondary"
            onClick={() => onNavigateToSection('contact')}
          >
            Get In Touch
          </Button>
        </div>

        {/* Keep existing scroll indicator */}
        <div
          className="hero-scroll-indicator"
          onClick={() => onScrollToNext('about')}
        >
          <ChevronDown size={32} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
