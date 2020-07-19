<p align="center">
<img src="./screenshots/logo.svg" height="180"/></p>

<p align="center">Use Vue Composition API in React components</p>

<pre align="center">{WIP}</pre>

<p align="center"><em>I love Vue's Composition API and reactivity system, but functional components in React are great are well with nice Typescript support. <br>So, why not to use them together?</em></p>


## Install

<pre>
npm i <b>reactivue</b> @vue/runtime-core react react-dom
</pre>

## Usage

> It's currently expiremental and might have some breaking changes in the future. No production yet but feel free to try it out.

### Factory

```tsx
import React from 'React'
import { ref, computed } from '@vue/runtime-core'
import { define } from 'reactivue'

interface Props {
  value: number
}

const MyCounter = define(
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

> The `define` factory is actually a sugar to make the following code simplier.


```tsx
import React from 'React'
import { ref, computed } from '@vue/runtime-core'
import { useVue } from 'reactivue'

interface Props {
  value: number
}

function MyCounter(Props: Props) {
  const state = useVue(
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

### Example

Check [packages/example](./packages)

### License

MIT - Anthony Fu 2020
