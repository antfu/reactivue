import * as reactPlugin from 'vite-plugin-react'
import type { UserConfig } from 'vite'

const config: UserConfig = {
  jsx: 'react',
  plugins: [reactPlugin],
  alias: {
    vue: 'reactivue',
    'vue-demi': 'reactivue',
    '@vue/composition-api': 'reactivue',
    '@vue/runtime-dom': 'reactivue',
  },
}

export default config
