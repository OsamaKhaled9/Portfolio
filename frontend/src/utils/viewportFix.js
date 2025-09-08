// Mobile viewport height fix
export const initViewportFix = () => {
  const setVhProperty = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  // Set initial value
  setVhProperty();

  // Update on resize, but debounced for performance
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setVhProperty, 100);
  });

  // Update on orientation change
  window.addEventListener('orientationchange', () => {
    setTimeout(setVhProperty, 100);
  });
};
