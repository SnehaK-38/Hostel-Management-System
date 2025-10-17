// src/index.js or src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 👈 Import it
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* 👈 Wrap your entire App with the Router */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);