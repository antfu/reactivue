<p align="center">
<img src="./screenshots/logo.svg" height="180"/></p>

<p align="center"><b>{WIP}</b> Use Vue Composition API in React components</p>

<p align="center">
<a href="https://www.npmjs.com/package/reactivue"><img src="https://badgen.net/npm/v/reactivue?color=53c2df&label"/></a>
<a href="https://bundlephobia.com/result?p=reactivue@latest"><img src="https://badgen.net/bundlephobia/minzip/reactivue?color=40b983&label"/></a>
</p>


<pre align="center">
npm i <b>reactivue</b>
</pre>

<br/>

<p align="center"><em>I love <a href="https://v3.vuejs.org/guide/composition-api-introduction.html" target="_blank">Vue Composition API</a> and its <a href="https://v3.vuejs.org/guide/reactivity.html" target="_blank">reactivity system</a>, <br>but <a href="https://reactjs.org/docs/components-and-props.html" target="_blank">functional components</a> in React are also sweet with Typescript. <br>Instead of making a choice, why not to use them together?</em></p>

<br/>


## Usage

> It's currently expiremental and might have some breaking changes in the future. No production yet but feel free to try it out.

### Component Factory

```tsx
import React from 'React'
import { defineComponent, ref, computed } from 'reactivue'

interface Props {
  value: number
}

const MyCounter = defineComponent(
  // setup function in Vue
  (props: Props) => {
    const counter = ref(props.value)
    const doubled = computed(() => counter.value * 2)
    const inc = () => counter.value += 1

    return { counter, doubled, inc }
  },
  // functional component in React
  ({ counter, doubled, inc }) => {
    // you can still use other React hooks
    return (
      <div>
        <div>{counter} x 2 = {doubled}</div>
        <button>Increase</button>
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
import { useSetup, ref, computed } from 'reactivue'

interface Props {
  value: number
}

function MyCounter(Props: Props) {
  const state = useSetup(
    (props: Props) => {
      const counter = ref(props.value)
      const doubled = computed(() => counter.value * 2)
      const inc = () => counter.value += 1

      return { counter, doubled, inc }
    },
    Props // pass React props to it
  )

  // state is a plain object just like React state
  const { counter, doubled, inc } = state

  return (
    <div>
      <div>{counter} x 2 = {doubled}</div>
      <button>Increase</button>
    </div>
  )
}
```


### APIs

Some tips and cavert compare to Vue's Composition API.

#### Reactivity

The reactivity system APIs are direct re-exported from `@vue/reactivity`, they should work the same as in Vue.

````ts
// the following two line are equivalent.
import { ref, reactive, computed } from 'reactivue'
import { ref, reactive, computed } from '@vue/reactivity'
````

#### Lifecycles

This library implemented the basic lifecycles to bound with React's lifecycles. For some lifecycles that don't have the React equivalent, they will be called somewhere near when it should be called (for example `onMounted` will be call right after `onCreated`).

For most of the time, you can use them like you would in Vue.

````ts
import { onMounted, onUnmounted, defineComponent } from 'reactivue'

export const HelloWorld = defineComponent(
  (props: {}) => {
    /* ... */
    
    onMounted(() => {
      console.log('Hello World.')
    })

    onUnmounted(() => {
      console.log('Goodbye World.')
    })

    return /* ... */
  },
  ({ /* ... */ }) => {
    return (
      <div>...</div>
    )
  })

````

#### Extra APIs

- `defineComponent()` - not the one you expected to see in Vue. Instead, it accepts a setup function and a render function that will return a React Functional Component.
- `useSetup()` - the hook for resolve Composition API's setup, refer to the section above.


#### Limitations

- No `getCurrentInstance()` - since we don't actually have a Vue instance here
- `emit()` is not available yet

### Example

Check [example-vite](./packages/example-vite)

### License

MIT - Anthony Fu 2020
