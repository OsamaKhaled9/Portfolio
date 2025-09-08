import React from 'react';
import './Loader.css';

const Loader = ({ isVisible = true, message = "Initializing..." }) => {
  if (!isVisible) return null;

  // Generate random binary digits
  const generateDigits = () => {
    const digits = [];
    for (let i = 0; i < 12; i++) {
      digits.push(Math.random() > 0.5 ? '1' : '0');
    }
    return digits;
  };

  const [digits, setDigits] = React.useState(generateDigits);

  // Update digits periodically for matrix effect
  React.useEffect(() => {
    const interval = setInterval(() => {
      setDigits(generateDigits());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loader-overlay">
      <div className="loader-content">
        <div className="ai-matrix-loader">
          {digits.map((digit, index) => (
            <div 
              key={index}
              className="digit"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {digit}
            </div>
          ))}
          <div className="glow"></div>
        </div>
        {message && (
          <p className="loader-message">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Loader;
