
import React from 'react'
import { defineComponent } from 'reactivue'
import { useMainStore } from './store'

export const Pinia = defineComponent(
  () => {
    const main = useMainStore()
    return main
  },
  ({ patch, state }) => {
    return (
      <div>
        <p></p>
        <button onClick={() => patch({
          counter: state.counter + 1,
        })}>Inc</button>
        <button onClick={() => patch({
          counter: state.counter - 1,
        })}>Dec</button>
        <code> </code>
        <table>
          <tbody>
            <tr><td>Pinia 1</td><td>{state.counter}</td></tr>
          </tbody>
        </table>
      </div>
    )
  },
)
