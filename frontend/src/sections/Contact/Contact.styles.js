export const contactStyles = {
  section: {
    position: 'relative',
    zIndex: 30,
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    /* ✨ REMOVED: backgroundColor - now uses global background */
    padding: '80px 20px'
  },
  container: {
    maxWidth: '1152px',
    width: '100%',
    margin: '0 auto',
    padding: '0 24px',
    boxSizing: 'border-box',
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: 'var(--accent-primary)',
    marginBottom: '24px',
    fontFamily: 'Monaco, "Lucida Console", monospace',
    textAlign: 'center'
  },
  description: {
    color: 'var(--text-secondary)',
    fontSize: '18px',
    marginBottom: '48px',
    maxWidth: '512px',
    margin: '0 auto 48px auto',
    lineHeight: 1.6
  },
  socialLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: '32px',
    marginBottom: '48px',
    flexWrap: 'wrap'
  },
  socialLink: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    transition: 'all 0.3s ease'
  },
  socialIcon: {
    padding: '16px',
    border: '1px solid var(--border-color)',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
    width: '64px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  socialLabel: {
    fontSize: '14px',
    fontFamily: 'Monaco, "Lucida Console", monospace'
  },
  resumeButton: {
    maxWidth: '384px',
    margin: '0 auto'
  },
  downloadButton: {
    width: '100%',
    padding: '16px 32px',
    background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))',
    color: 'white',
    fontFamily: 'Monaco, "Lucida Console", monospace',
    fontSize: '18px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  }
};
