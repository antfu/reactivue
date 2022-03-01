<p align="center">
<img src="./screenshots/logo.svg" height="180"/></p>

<p align="center">Use Vue 3 Composition API in React and Solid components</p>

<p align="center">
<a href="https://www.npmjs.com/package/reactivue"><img src="https://img.shields.io/npm/v/reactivue?color=53c2df&label"/></a>
<a href="https://bundlephobia.com/result?p=reactivue@latest"><img src="https://img.shields.io/bundlephobia/minzip/reactivue?color=40b983&label"/></a>
</p>


<pre align="center">
npm i <b>reactivue</b>
</pre>

<br/>

<p align="center"><em>I love <a href="https://v3.vuejs.org/guide/composition-api-introduction.html" target="_blank">Vue Composition API</a> and its <a href="https://v3.vuejs.org/guide/reactivity.html" target="_blank">reactivity system</a>, <br>but <a href="https://reactjs.org/docs/components-and-props.html" target="_blank">functional components</a> in React are also sweet with Typescript. <br>Instead of making a choice, why not to use them together?</em></p>

<br/>


## Usage

### Component Factory

```tsx
import React from 'React'
import { defineComponent, ref, computed, onUnmounted } from 'reactivue'

interface Props {
  value: number
}

const MyCounter = defineComponent(
  // setup function in Vue
  (props: Props) => {
    const counter = ref(props.value)
    const doubled = computed(() => counter.value * 2)
    const inc = () => counter.value += 1

    onUnmounted(() => console.log('Goodbye World'))

    return { counter, doubled, inc }
  },
  // functional component in React
  ({ counter, doubled, inc }) => {
    // you can still use other React hooks
    return (
      <div>
        <div>{counter} x 2 = {doubled}</div>
        <button onClick={inc}>Increase</button>
      </div>
    )
  }
)

// use it as you normally would
render(<MyCounter value={10}>, el)
```

### Hooks

You can use it as a hook as well.

> The `defineComponent` factory is actually a sugar to and equivalent to the following code.


```tsx
import React from 'React'
import { useSetup, ref, computed, onUnmounted } from 'reactivue'

interface Props {
  value: number
}

function MyCounter(Props: Props) {
  const state = useSetup(
    (props: Props) => { // props is a reactive object in Vue
      const counter = ref(props.value)
      const doubled = computed(() => counter.value * 2)
      const inc = () => counter.value += 1

      onUnmounted(() => console.log('Goodbye World'))

      return { counter, doubled, inc }
    },
    Props // pass React props to it
  )

  // state is a plain object just like React state
  const { counter, doubled, inc } = state

  return (
    <div>
      <div>{counter} x 2 = {doubled}</div>
      <button onClick={inc}>Increase</button>
    </div>
  )
}
```

### Hook Factory

To reuse the composition logics, `createSetup` is provided as a factory to create your own hooks.

```ts
// mySetup.ts
import { createSetup, ref, computed, onUnmounted } from 'reactivue'

export interface Props {
  value: number
}

// create a custom hook that can be reused
export const useMySetup = createSetup(
  (props: Props) => {
    const counter = ref(props.value)
    const doubled = computed(() => counter.value * 2)
    const inc = () => counter.value += 1

    onUnmounted(() => console.log('Goodbye World'))

    return { counter, doubled, inc }
  },
)
```

```tsx
// Counter.tsx
import React from 'react'
import { useMySetup, Props } from './mySetup'

export const Counter = (props: Props) => {
  const { counter, doubled, inc } = useMySetup(props)
  const { counter: counter2, doubled: doubled2, inc: inc2 } = useMySetup({ value: 10 })

  return (
    <div>
      <div>{counter} x 2 = {doubled}</div>
      <button onClick={inc}>Increase</button>
      <br/>

      <div>{counter2} x 2 = {doubled2}</div>
      <button onClick={inc2}>Increase</button>
    </div>
  )
}
```

## Usage with Preact

To use reactivue in Preact apps, just replace `reactivue` import with `reactivue/preact`

```diff
import { h } from 'preact'
-import { defineComponent, ref, computed, onUnmounted } from 'reactivue'
+import { defineComponent, ref, computed, onUnmounted } from 'reactivue/preact'
```

## Using Vue's Libraries

*Yes, you can!* Before you start, you need set alias in your build tool in order to redirect some apis from `vue` to `reactivue` or `reactivue/preact` if you are using it with Preact.

#### Aliasing

<details>
<summary>Vite</summary><br>

Add following code to `vite.config.js` 

```js
{
  /* ... */
  alias: {
    'vue': 'reactivue',
    '@vue/runtime-dom': 'reactivue',
  }
}
```

If you are using it with Preact you have to add following code to `vite.config.js`

```ts
{
  /* ... */
  optimizeDeps: {
    include: ['reactivue/preact'],
    exclude: ['@vue/reactivity']
  }
}
```

</details>
<details>
<summary>Webpack</summary><br>

Add following code to your webpack config

```js
const config = { 
  /* ... */
  resolve: { 
    alias: { 
      'vue': 'reactivue',
      '@vue/runtime-dom': 'reactivue',
    },
  }
}
```

</details>

<details>
<summary>Parcel</summary><br>

Parcel uses the standard `package.json` file to read configuration options under an `alias` key.

```js
{
  "alias": {
    "vue": "reactivue",
    "@vue/runtime-dom": "reactivue",
  },
}
```

</details>


<details>
<summary>Rollup</summary><br>

To alias within Rollup, you'll need to install [@rollup/plugin-alias](https://github.com/rollup/plugins/tree/master/packages/alias). The plugin will need to be placed before your `@rollup/plugin-node-resolve`.

```js
import alias from '@rollup/plugin-alias';

module.exports = {
  plugins: [
    alias({
      entries: [
        { find: 'vue', replacement: 'reactivue' },
        { find: '@vue/runtime-dom', replacement: 'reactivue' }
      ]
    })
  ]
};
```

</details>


<details>
<summary>Jest</summary><br>

Jest allows the rewriting of module paths similar to bundlers. These rewrites are configured using regular expressions in your Jest configuration:

```js
{
  "moduleNameMapper": {
    "^vue$": "reactivue",
    "^@vue/runtime-dom$": "reactivue",
  }
}
```

</details>

#### Installing Vue Plugins

Installing Vue plugins are almost identical to Vue. Just simply create your root instance with `createApp` function and register your plugins as you do in Vue apps. **You don't need to call `app.mount`**. Your Vue plugins will be available in all your setup functions.

```ts
import { createApp } from 'reactivue'
import { createPinia } from 'pinia'

const app = createApp()

app.use(createPinia())
```

> Note: If you are trying to use a library that calls app.component, app.directive or app.mixin in its install function, reactivue will skip these calls without any action and warn you about it.

#### Compatible Libraries

> A list of libaries that have been tested to work with `reactivue`. Feel free to make PRs adding more.

- [pinia](https://github.com/posva/pinia) - 🍍 Automatically Typed, Modular and lightweight Store for Vue
- [VueUse](https://github.com/vueuse/vueuse) - 🧰 Collection of Composition API utils for Vue 2 and 3
- [Villus](https://github.com/logaretm/villus) - 🏎 A tiny and fast GraphQL client for Vue.js

## APIs

Some tips and cavert compare to Vue's Composition API.

#### Reactivity

The reactivity system APIs are direct re-exported from `@vue/reactivity`, they should work the same as in Vue.

````ts
// the following two line are equivalent.
import { ref, reactive, computed } from 'reactivue'
import { ref, reactive, computed } from '@vue/reactivity'
````

#### Lifecycles

This library implemented the basic lifecycles to bound with React's lifecycles. For some lifecycles that don't have the React equivalent, they will be called somewhere near when they should be called (for example `onMounted` will be call right after `onCreated`).

For most of the time, you can use them like you would in Vue.

#### Extra APIs

- `defineComponent()` - not the one you expected to see in Vue. Instead, it accepts a setup function and a render function that will return a React Functional Component.
- `useSetup()` - the hook for resolve Composition API's setup, refer to the section above.
- `createSetup()` - a factory to wrapper your logics into reusable custom hooks. 


#### Limitations

- `getCurrentInstance()` - returns the meta info for the internal states, NOT a Vue instance. It's exposed to allow you check if it's inside a instance scope.
- `emit()` is not available


### Examples

#### Real-world Examples/Showcases

- [Café CN](https://github.com/antfu/awesome-cn-cafe-web) - Web App for Awesome CN Café

- [Preact Browser Example](./examples/preact-htm-browser)

- [React Vite 2.0 Demo](./examples/react-ts-vite)

![image](https://user-images.githubusercontent.com/11247099/88056258-dd7f6980-cb92-11ea-9e89-e090e73b7235.png)

### License

[MIT License](https://github.com/antfu/rectivue/blob/master/LICENSE) © 2020 [Anthony Fu](https://github.com/antfu)
