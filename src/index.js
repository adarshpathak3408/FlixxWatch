import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { LikeProvider } from './contexts/LikeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

    <BrowserRouter>
      <LikeProvider>
        <App />
      </LikeProvider>
    </BrowserRouter>

  </React.StrictMode>
);