export const contactStyles = {
   section: {
    position: 'relative',
  zIndex: 30,
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
      padding: '80px 20px' // Add horizontal padding here

  },
  container: {
     maxWidth: '1152px', // 896px in Hero if preferred
  width: '100%',
  margin: '0 auto',
  padding: '0 24px',
  boxSizing: 'border-box',
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#06b6d4',
    marginBottom: '24px',
    fontFamily: 'Monaco, "Lucida Console", monospace',
    textAlign: 'center' 

  },
  description: {
    color: '#9ca3af',
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
    color: '#9ca3af',
    textDecoration: 'none',
    transition: 'all 0.3s ease'
  },
  socialIcon: {
    padding: '16px',
    border: '1px solid #4b5563',
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
    background: 'linear-gradient(to right, #06b6d4, #8b5cf6)',
    color: 'white',
    fontFamily: 'Monaco, "Lucida Console", monospace',
    fontSize: '18px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  }
};
