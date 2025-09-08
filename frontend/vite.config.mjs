import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.glb', '**/*.png'],
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei'],
    exclude: ['@react-three/rapier', 'chevrotain'] // Exclude problematic packages
  },
  resolve: {
    alias: {
      // Fix chevrotain import path
      'chevrotain': 'chevrotain/lib/chevrotain.js'
    }
  },
  define: {
    global: 'globalThis',
  }
});
