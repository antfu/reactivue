import React from 'react'
import ReactDOM from 'react-dom'
import '@unocss/reset/tailwind.css'
import 'uno.css'
import './index.css'
import { ReactivueProvider } from 'reactivue'
import { createHead } from '@vueuse/head'
import { createClient } from 'villus'
import { createPinia } from 'pinia'
import App from './App'
ReactDOM.render(
  <ReactivueProvider plugins={[createHead(), createPinia(), createClient({ url: 'https://api.spacex.land/graphql' })]}>
    <App />
  </ReactivueProvider>,
  document.getElementById('root'),
)
