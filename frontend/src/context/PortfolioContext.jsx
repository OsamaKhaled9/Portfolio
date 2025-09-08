import React, { createContext, useContext, useReducer } from 'react';

const PortfolioContext = createContext();

const initialState = {
  currentSection: 'hero',
  isLoading: true, // Add loading state
  contactForm: {
    name: '',
    email: '',
    message: ''
  },
  projects: [],
  filteredProjects: []
};

const portfolioReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CURRENT_SECTION':
      return { ...state, currentSection: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'FILTER_PROJECTS':
      return { 
        ...state, 
        filteredProjects: state.projects.filter(project => 
          project.category === action.payload || action.payload === 'all'
        )
      };
    case 'UPDATE_CONTACT_FORM':
      return {
        ...state,
        contactForm: { ...state.contactForm, ...action.payload }
      };
    default:
      return state;
  }
};

export const PortfolioProvider = ({ children }) => {
  const [state, dispatch] = useReducer(portfolioReducer, initialState);

  return (
    <PortfolioContext.Provider value={{ state, dispatch }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
