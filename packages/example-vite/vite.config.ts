import reactRefresh from '@vitejs/plugin-react-refresh'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [reactRefresh()],
  alias: {
    vue: 'reactivue',
    'vue-demi': 'reactivue',
    '@vue/composition-api': 'reactivue',
    '@vue/runtime-dom': 'reactivue',
  },
})
