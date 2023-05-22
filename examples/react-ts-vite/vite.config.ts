import ReactRefresh from '@vitejs/plugin-react-refresh'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    ReactRefresh(),
  ],
  resolve: {
    alias: {
      'vue': 'reactivue',
      '@vue/composition-api': 'reactivue',
      '@vue/runtime-dom': 'reactivue',
    },
  },
  /**
   * Actually listing `reactivue` here is not required.
   * It's only required for our yarn workspaces setup.
   * For some reason Vite don't optimizes locally linked deps.
   */
  optimizeDeps: {
    include: ['reactivue'],
  },
})
