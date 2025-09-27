import React from 'react';
import { PortfolioProvider } from './context/PortfolioContext';
import { ThemeProvider } from './context/ThemeContext';
import './styles/animations.css';
import Portfolio from './Portfolio';
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
