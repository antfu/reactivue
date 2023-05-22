import { h, render } from '//cdn.skypack.dev/preact'
import { useState } from '//cdn.skypack.dev/preact/hooks'
import htm from '//cdn.skypack.dev/htm'
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
} from '//cdn.skypack.dev/reactivue/preact'

const html = htm.bind(h)

const MyCounter = defineComponent(
  // setup function in Vue
  (props) => {
    const counter = ref(props.value)
    const doubled = computed(() => counter.value * 2)
    const inc = () => (counter.value += 1)

    onMounted(() => console.log('Counter mounted'))
    onUnmounted(() => console.log('Counter unmounted'))

    return { counter, doubled, inc }
  },
  // functional component in preact
  ({ counter, doubled, inc }) => {
    // you can use preact hooks here
    return html`
      <div>
        <div>${counter} x 2 = ${doubled}</div>
        <button onClick=${inc}>Increase</button>
      </div>
    `
  },
)

function App() {
  const [show, setShow] = useState(true)

  return html`
    <button onClick=${() => setShow(!show)}>
      ${show ? 'Hide' : 'Show'} counter
    </button>
    ${show && html`<${MyCounter} value=${10} />`}
  `
}

render(html`<${App}/>`, document.body)
