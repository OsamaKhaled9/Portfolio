import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { initViewportFix } from './utils/viewportFix';

// CRITICAL: Import order matters - foundation FIRST
import './styles/responsive-foundation.css'  // NEW - Add this
import './styles/theme-variables.css'        // NEW - Add this
import './styles/animations.css'             // Keep existing
import './index.css'                         // Keep existing

initViewportFix();

createRoot(document.getElementById('root')).render(
  <App />
)