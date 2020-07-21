
import React from 'react'
import { defineComponent } from 'reactivue'
import { useMainStore } from './store'

export const Pinia = defineComponent(
  () => useMainStore(),
  ({ state, patch, doubleCount }) => {
    return (
      <div className="card">
        <p>Pinia B</p>
        <button onClick={() => patch({
          counter: state.counter + 1,
        })}>inc +</button>
        <table>
          <tbody>
            <tr><td>Counter</td><td>{state.counter}</td></tr>
            <tr><td>Doubled</td><td>{doubleCount}</td></tr>
          </tbody>
        </table>
      </div>
    )
  },
)
