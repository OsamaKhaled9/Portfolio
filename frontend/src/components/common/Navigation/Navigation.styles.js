export const navigationStyles = {
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(6, 182, 212, 0.2)',
    width: '100%'
  },
  container: {
    maxWidth: '100%', // MATCH the page-frame max-width
    margin: '0 auto',   // Center it
    padding: '16px 20px', // Match page-frame padding
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    boxSizing: 'border-box'
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#06b6d4',
    fontFamily: 'Monaco, "Lucida Console", monospace'
  },
  links: {
    display: 'flex',
    gap: '32px'
  },
  link: {
    fontSize: '14px',
    fontFamily: 'Monaco, "Lucida Console", monospace',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#d1d5db',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px 0',
    transition: 'all 0.3s ease',
    borderBottom: '2px solid transparent'
  },
  linkActive: {
    color: '#06b6d4',
    borderBottom: '2px solid #06b6d4'
  }
};
