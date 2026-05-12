import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter as Router } from 'react-router-dom';
import AlertMessage from './components/AlertMessage/AlertMessage.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <AlertMessage />
      <App />
    </Router>
  </StrictMode>,
)
