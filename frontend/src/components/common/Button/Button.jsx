import React from 'react';
import { buttonStyles } from './Button.styles';

const Button = ({ children, variant = 'primary', onClick, ...props }) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return buttonStyles.secondary;
      case 'primary':
      default:
        return buttonStyles.primary;
    }
  };

  return (
    <button
      onClick={onClick}
      style={getButtonStyle()}
      className={`button-${variant}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
