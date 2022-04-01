/* @refresh granular */
import { render } from 'solid-js/web'
import '@unocss/reset/tailwind.css'
import 'uno.css'
import './index.css'
import { createHead } from '@vueuse/head'
import { createClient } from 'villus'
import { createPinia } from 'pinia'
import { ReactivueProvider } from 'reactivue/solid'
import App from './App'

// Using this as wrapping component doesn't work for some reason.
ReactivueProvider({ plugins: [createHead(), createPinia(), createClient({ url: 'https://api.spacex.land/graphql' })] })

render(() => <App />, document.getElementById('root') as HTMLElement)
