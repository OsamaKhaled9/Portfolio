export const projectsStyles = {
  section: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    //backgroundColor: 'rgba(0, 0, 0, 0.8)',
    position: 'relative',
    zIndex: 1,
    padding: 'clamp(60px, 10vh, 80px) 0'
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 clamp(15px, 3vw, 24px)',
    width: '100%'
  },
  header: {
    textAlign: 'center',
    marginBottom: 'clamp(48px, 8vh, 64px)'
  },
  title: {
    fontSize: 'clamp(1.8rem, 5vw, 2.25rem)',
    fontWeight: 'bold',
    color: '#06b6d4',
    marginBottom: 'clamp(16px, 3vh, 24px)',
    fontFamily: 'Monaco, "Lucida Console", monospace'
  },
  description: {
    color: '#9ca3af',
    fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
    maxWidth: '512px',
    margin: '0 auto',
    lineHeight: 1.6
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(280px, 40vw, 350px), 1fr))',
    gap: 'clamp(20px, 4vw, 32px)',
    alignItems: 'stretch' // Ensures all cards have same height
  }
};
