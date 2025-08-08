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
     <GoogleOAuthProvider clientId="48002840638-sg7si4r4chl68s3eg3r3uuh1lffm6oen.apps.googleusercontent.com">
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