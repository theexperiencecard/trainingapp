export type OfflineStatus = 'ready' | 'unavailable';

export function registerOffline(onStatus: (status: OfflineStatus) => void): void {
  const supportedProtocol = location.protocol === 'https:' || location.protocol === 'http:';
  if (!import.meta.env.PROD || !supportedProtocol || !('serviceWorker' in navigator)) {
    onStatus('unavailable');
    return;
  }

  const scope = import.meta.env.BASE_URL;
  void navigator.serviceWorker.register(scope + 'sw.js', { scope, updateViaCache: 'none' })
    .then(registration => {
      function observeWorker(): void {
        const worker = registration.active ?? registration.waiting ?? registration.installing;
        if (!worker) {
          onStatus('unavailable');
          return;
        }
        const report = (): void => {
          if (worker.state === 'activated') onStatus('ready');
          if (worker.state === 'redundant' && !registration.active) onStatus('unavailable');
        };
        worker.addEventListener('statechange', report);
        report();
      }

      registration.addEventListener('updatefound', observeWorker);
      observeWorker();
    })
    .catch((error: unknown) => {
      console.warn('Offline shell registration failed.', error);
      onStatus('unavailable');
    });
}
