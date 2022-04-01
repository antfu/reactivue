import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Unocss from 'unocss/vite'
import transformerDirective from '@unocss/transformer-directives'
import presetWind from '@unocss/preset-wind'

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
  },
  plugins: [
    react(),
    Unocss({
      presets: [
        presetWind(),
      ],
      transformers: [transformerDirective()],
    }),
  ],
})
