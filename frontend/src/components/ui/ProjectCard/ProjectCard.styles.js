export const projectCardStyles = {
  card: {
    backgroundColor: 'rgba(17, 24, 39, 0.6)',
    backdropFilter: 'blur(4px)',
    border: '1px solid rgba(6, 182, 212, 0.2)',
    borderRadius: 'clamp(8px, 2vw, 12px)',
    padding: 'clamp(16px, 3vw, 24px)',
    height: '100%',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'clamp(280px, 35vh, 350px)' // Ensure minimum height
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 'clamp(12px, 2vh, 16px)',
    gap: '12px'
  },
  title: {
    fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Monaco, "Lucida Console", monospace',
    transition: 'color 0.3s ease',
    lineHeight: 1.3,
    flex: 1
  },
  status: {
    padding: 'clamp(3px, 1vw, 4px) clamp(6px, 1.5vw, 8px)',
    fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)',
    borderRadius: 'clamp(8px, 2vw, 12px)',
    whiteSpace: 'nowrap',
    flexShrink: 0
  },
  grade: {
    color: '#10b981',
    fontSize: 'clamp(0.8rem, 2vw, 0.875rem)',
    fontWeight: 'bold',
    marginBottom: 'clamp(6px, 1vh, 8px)'
  },
  tech: {
    color: '#06b6d4',
    fontSize: 'clamp(0.8rem, 2vw, 0.875rem)',
    fontFamily: 'Monaco, "Lucida Console", monospace',
    marginBottom: 'clamp(8px, 1.5vh, 12px)',
    lineHeight: 1.4
  },
  description: {
    color: '#9ca3af',
    fontSize: 'clamp(0.8rem, 2vw, 0.875rem)',
    marginBottom: 'clamp(16px, 3vh, 24px)',
    lineHeight: 1.5,
    flex: 1, // This pushes buttons to bottom
    display: 'flex',
    alignItems: 'flex-start'
  },
  buttons: {
    display: 'flex',
    gap: 'clamp(8px, 2vw, 12px)',
    marginTop: 'auto' // This ensures buttons stay at bottom
  },
  primaryButton: {
    flex: 1,
    padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 3vw, 16px)',
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    fontFamily: 'Monaco, "Lucida Console", monospace',
    borderRadius: 'clamp(6px, 1.5vw, 8px)',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: 'rgba(6, 182, 212, 0.2)',
    color: '#06b6d4',
    whiteSpace: 'nowrap'
  },
  secondaryButton: {
    flex: 1,
    padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 3vw, 16px)',
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    fontFamily: 'Monaco, "Lucida Console", monospace',
    borderRadius: 'clamp(6px, 1.5vw, 8px)',
    border: '1px solid #4b5563',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    color: '#d1d5db',
    backgroundColor: 'transparent',
    whiteSpace: 'nowrap'
  }
};
