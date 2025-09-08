import React from 'react';
import { PortfolioProvider } from './context/PortfolioContext';
import Portfolio from './Portfolio';
import { ThemeProvider } from './context/ThemeContext';
import './styles/animations.css';

function App() {
  return (
    <ThemeProvider>
      <PortfolioProvider>
        <Portfolio />
      </PortfolioProvider>
    </ThemeProvider>
  );
}

export default App;