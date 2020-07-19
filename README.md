<p align="center">
<img src="./screenshots/logo.svg" height="180"/></p>

<p align="center"><b>{WIP}</b> React components with Vue Composition API</p>

<br/>

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

> TODO: add detailed docs

- `ref`, `computed`, `reactive`, etc.
  - `reactivue` shipped `@vue/reactivity` as its dependency, and re-exporting all the APIs from it 

- `defineComponent`, `watch`, `onMounted`, etc.
  - Lifecycle APIs are provided by `reactivue` with slight different implementation to `@vue/runtime-dom` in order to make them specific for React lifecycles


### Example

Check [packages/example](./packages)

### License

MIT - Anthony Fu 2020
