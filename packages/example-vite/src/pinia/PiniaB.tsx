
import React from 'react'
import { defineComponent } from 'reactivue'
import { useMainStore } from './store'

export const Pinia = defineComponent(
  () => useMainStore(),
  ({ $patch, counter, doubleCount }) => {
    return (
      <div className="card">
        <p>Pinia B</p>
        <button onClick={() => $patch({
          counter: counter + 1,
        })}>inc +</button>
        <table>
          <tbody>
            <tr><td>Counter</td><td>{counter}</td></tr>
            <tr><td>Doubled</td><td>{doubleCount}</td></tr>
          </tbody>
        </table>
      </div>
    )
  },
)
