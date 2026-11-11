import { defineConfig } from 'vite';

// Bundles the standalone seal verifier from the same modules the plugin uses
export default defineConfig({
  publicDir: false,
  build: {
    outDir: 'docs',
    emptyOutDir: false,
    lib: { entry: 'src/viewer.ts', formats: ['es'], fileName: () => 'viewer.js' },
    rolldownOptions: { output: { codeSplitting: false } },
  },
});
