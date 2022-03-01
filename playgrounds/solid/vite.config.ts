import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import Unocss from 'unocss/vite'
import transformerDirective from '@unocss/transformer-directives'
import presetWind from '@unocss/preset-wind'

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
  },
  plugins: [
    solid(),
    Unocss({
      presets: [
        presetWind(),
      ],
      transformers: [transformerDirective()],
    }),
  ],
})
