import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App';
import { ToastProvider } from './components/ui/Toast';
import { ContactProvider } from './components/contact/ContactProvider';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ToastProvider>
        <ContactProvider>
          <App />
        </ContactProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
);
