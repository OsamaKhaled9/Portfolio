import React, { useState, useEffect } from 'react';
import { ChevronDown } from '../../components/ui/Icons';
import { apiService } from '../../services/api';
import './PreHero.css';

const PreHeroMobile = ({ onScrollToNext }) => {
  const [profile, setProfile] = useState({
    name: 'Osama Khaled',
    title: 'Full-Stack Developer'
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiService.get('/api/profile');
        if (response.success) {
          setProfile(response.data);
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleEnterPortfolio = () => {
    const heroSection = document.getElementById('about');
    if (heroSection) {
      heroSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    
    if (onScrollToNext) {
      onScrollToNext('about');
    }
  };

  return (
    <section id="prehero" className="prehero-section mobile">
      {/* Simple gradient background - no 3D */}
      <div className="mobile-hero-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="content-layer">
        <div className="welcome-text">
          <h1 className="main-title">
            {profile.name}
          </h1>
          <h2 className="subtitle">
            {profile.title} Portfolio
          </h2>
          <p className="instruction">
            Explore my work and projects
          </p>
        </div>

        <div className="enter-button-container">
          <button
            className="enter-button"
            onClick={handleEnterPortfolio}
          >
            <span>ENTER PORTFOLIO</span>
            <ChevronDown size={24} className="chevron-icon" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PreHeroMobile;
