import { useRef, useEffect } from 'react';

export const useAnimatedBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const createAnimatedBackground = () => {
      if (!mountRef.current) return;

      const container = mountRef.current;
      const elements = [];

      for (let i = 0; i < 20; i++) {
        const element = document.createElement('div');
        element.className = 'floating-cube';
        element.style.cssText = `
          position: absolute;
          width: ${20 + Math.random() * 30}px;
          height: ${20 + Math.random() * 30}px;
          background: linear-gradient(45deg, 
            hsl(${180 + Math.random() * 60}, 70%, 60%), 
            hsl(${240 + Math.random() * 60}, 70%, 60%)
          );
          border-radius: 4px;
          left: ${Math.random() * 100}vw;
          top: ${Math.random() * 100}vh;
          opacity: 0.6;
          animation: float ${3 + Math.random() * 4}s ease-in-out infinite alternate,
                     rotate ${5 + Math.random() * 10}s linear infinite;
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
        `;
        container.appendChild(element);
        elements.push(element);
      }

      return () => {
        elements.forEach(el => {
          if (el.parentNode) {
            el.parentNode.removeChild(el);
          }
        });
      };
    };

    const cleanup = createAnimatedBackground();
    return cleanup;
  }, []);

  return { mountRef };
};
