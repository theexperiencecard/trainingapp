import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';

function offlineShell(): Plugin {
  return {
    name: 'trainingapp-offline-shell',
    apply: 'build',
    enforce: 'post',
    generateBundle: {
      order: 'post',
      handler(_, bundle) {
        const integrity = (source: string | Uint8Array) =>
          'sha256-' + createHash('sha256').update(source).digest('base64');
        const files = Object.values(bundle)
          .filter(file => file.fileName === 'index.html' ||
            /^assets\/.*\.(?:js|css|woff2?|png|svg|webp|jpe?g)$/i.test(file.fileName))
          .map(file => ({
            path: file.fileName,
            integrity: integrity(file.type === 'asset' ? file.source : file.code),
          }));
        if (!files.some(file => file.path === 'index.html')) {
          this.error('The offline shell requires a built index.html.');
        }

        for (const path of ['manifest.webmanifest', 'icons/allenamento-192.png',
          'icons/allenamento-512.png', 'icons/apple-touch-icon.png']) {
          const contents = readFileSync(new URL('./public/' + path, import.meta.url));
          files.push({ path, integrity: integrity(contents) });
        }
        files.sort((a, b) => a.path.localeCompare(b.path));
        const version = createHash('sha256').update(JSON.stringify(files)).digest('hex');
        this.emitFile({
          type: 'asset',
          fileName: 'shell-files.js',
          source: 'self.trainingShell = ' + JSON.stringify({ version, files }) + ';\n',
        });
      },
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), offlineShell()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
    passWithNoTests: false,
  },
});
