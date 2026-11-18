import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { registerOffline, type OfflineStatus } from './registerOffline';
import './styles/global.css';

const element = document.getElementById('root');
if (!element) throw new Error('Application root element is missing.');
const root = createRoot(element);

function render(offlineStatus?: OfflineStatus) {
  root.render(<StrictMode><App offlineStatus={offlineStatus} /></StrictMode>);
}

render();
if (import.meta.env.PROD && ['http:', 'https:'].includes(location.protocol)) {
  registerOffline(render);
}
