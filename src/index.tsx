import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Performance optimizations
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Optimize for mobile and performance
const renderApp = () => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// Use requestIdleCallback for better performance on mobile
if ('requestIdleCallback' in window) {
  requestIdleCallback(renderApp);
} else {
  // Fallback for older browsers
  setTimeout(renderApp, 1);
}

// Disable SW in dev to avoid chunk caching and HMR conflicts