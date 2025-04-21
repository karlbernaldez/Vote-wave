// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';  // Use react-dom/client for React 18+
import './styles/index.css';  // Import your styles (make sure the file exists)
import App from './App';

const rootElement = document.getElementById('root'); // Get the root element
const root = ReactDOM.createRoot(rootElement); // Create a root with createRoot()

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
