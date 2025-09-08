import React from 'react';
import { animatedBackgroundStyles } from './AnimatedBackground.styles';

const AnimatedBackground = ({ mountRef }) => {
  return (
    <div 
      ref={mountRef} 
      style={animatedBackgroundStyles.container}
    />
  );
};

export default AnimatedBackground;
