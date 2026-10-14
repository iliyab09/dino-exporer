import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/theme.css';
import App from './App.tsx';
import { offlineUrls, registerServiceWorker } from './lib/pwa';
import { DINOS } from './lib/registry';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Precache every picture (dino art, UI art, icons) so the app works fully offline.
registerServiceWorker(offlineUrls(import.meta.env.BASE_URL, DINOS.map((d) => d.id)));
