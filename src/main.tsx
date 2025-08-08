import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './utils/AuthContext.tsx';
import { ToastProvider } from './utils/ToastContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <GoogleOAuthProvider clientId="47689209652-r609mqgsp5a22pi32doct1l1udd5s2en.apps.googleusercontent.com">
    <BrowserRouter>
     <AuthProvider>
      <ToastProvider>
          <App />
          </ToastProvider>
        </AuthProvider>
    </BrowserRouter>
  </GoogleOAuthProvider>
  </StrictMode>
);