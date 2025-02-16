import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';  // Import BrowserRouter
// import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';  // Corrected Bootstrap import
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>  {/* Wrap your App with BrowserRouter */}
      <App />
    </BrowserRouter>
  </StrictMode>
);
