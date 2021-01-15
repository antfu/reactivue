import ReactRefresh from '@vitejs/plugin-react-refresh'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    ReactRefresh(),
  ],
  alias: {
    vue: 'reactivue',
    '@vue/composition-api': 'reactivue',
    '@vue/runtime-dom': 'reactivue',
  },
})
