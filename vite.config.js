import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  // the 3D world is one lazy-loaded chunk (three.js + R3F, ~290 kB gzip) that loads after first paint
  build: { chunkSizeWarningLimit: 1200 },
})
