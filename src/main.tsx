import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/theme.css';
import App from './App.tsx';
import { registerServiceWorker } from './lib/pwa';
import { DINOS, PLACEHOLDER_ART, dinoArt } from './lib/registry';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Precache every dino picture so the gallery and games work offline.
registerServiceWorker([PLACEHOLDER_ART, ...DINOS.map((d) => dinoArt(d.id))]);
