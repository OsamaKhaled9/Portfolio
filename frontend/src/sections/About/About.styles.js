export const aboutStyles = {
  section: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    /* ✨ REMOVED: backgroundColor - now uses global background */
    position: 'relative',
    zIndex: 30,
    padding: '80px 20px'
  },
  container: {
    maxWidth: '1152px',
    margin: '0 auto',
    padding: '0 24px',
    boxSizing: 'border-box',
    width: '100%'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '48px',
    alignItems: 'start'
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: 'var(--accent-primary)',
    marginBottom: '24px',
    fontFamily: 'Monaco, "Lucida Console", monospace'
  },
  sectionSubtitle: {
    color: 'var(--accent-primary)',
    fontSize: '20px',
    marginBottom: '16px'
  },
  educationSection: {
    marginBottom: '32px'
  },
  experienceSection: {
    marginBottom: '32px'
  },
  item: {
    marginBottom: '16px',
    padding: '16px',
    border: '1px solid var(--border-color)',
    borderRadius: '8px'
  },
  itemTitle: {
    color: 'var(--accent-primary)',
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '4px'
  },
  itemDetails: {
    color: 'var(--text-secondary)',
    fontSize: '14px'
  },
  itemCompany: {
    color: 'var(--text-primary)',
    fontSize: '14px',
    marginBottom: '8px'
  },
  itemDescription: {
    color: 'var(--text-secondary)',
    fontSize: '14px',
    lineHeight: 1.5
  },
  skillsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  skillCategory: {
    marginBottom: '16px'
  },
  skillCategoryTitle: {
    color: 'var(--accent-primary)',
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '8px'
  },
  skillTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  skillTag: {
    padding: '4px 12px',
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    color: 'var(--accent-primary)',
    fontSize: '12px',
    fontFamily: 'Monaco, "Lucida Console", monospace'
  }
};
