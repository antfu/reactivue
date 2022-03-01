import { defineComponent } from 'reactivue/solid'
import { useMainStore } from './store'

export const Pinia = defineComponent(
  () => {
    const main = useMainStore()
    return main
  },
  ({ $patch, counter, doubleCount, doubleCountPlusOne, reset }) => {
    return (
      <div className="card">
        <p>Pinia</p>
        <div className="text-center">
          <button onClick={() => $patch({
            counter: counter() - 1,
          })}>Decrease -</button>
          <button onClick={() => $patch({
            counter: counter() + 1,
          })}>Increase +</button>
          <button onClick={reset}>Reset</button>
        </div>
        <code> </code>
        <table>
          <tbody>
            <tr><td>Counter</td><td>{counter}</td></tr>
            <tr><td>Doubled</td><td>{doubleCount}</td></tr>
            <tr><td>Doubled x2</td><td>{doubleCountPlusOne}</td></tr>
          </tbody>
        </table>
      </div>
    )
  },
)
