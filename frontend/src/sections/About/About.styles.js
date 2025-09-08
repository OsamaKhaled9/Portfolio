export const aboutStyles = {
  section: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: 'rgba(0, 0, 0, 0.6)',
    position: 'relative',
    zIndex: 30,
    padding: '80px 20px' // Add horizontal padding here
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
    color: '#06b6d4',
    marginBottom: '24px',
    fontFamily: 'Monaco, "Lucida Console", monospace'
  },
  sectionSubtitle: {
    color: '#06b6d4',
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
    border: '1px solid rgba(6, 182, 212, 0.2)',
    borderRadius: '8px'
  },
  itemTitle: {
    color: '#06b6d4',
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '4px'
  },
  itemDetails: {
    color: '#9ca3af',
    fontSize: '14px'
  },
  itemCompany: {
    color: '#d1d5db',
    fontSize: '14px',
    marginBottom: '8px'
  },
  itemDescription: {
    color: '#9ca3af',
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
    color: '#06b6d4',
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
    border: '1px solid rgba(6, 182, 212, 0.3)',
    borderRadius: '16px',
    color: '#06b6d4',
    fontSize: '12px',
    fontFamily: 'Monaco, "Lucida Console", monospace'
  }
};
