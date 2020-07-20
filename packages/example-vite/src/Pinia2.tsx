
import React from 'react'
import { defineComponent } from 'reactivue'
import { useMainStore } from './store'

export const Pinia = defineComponent(
  () => useMainStore(),
  ({ state }) => {
    return (
      <div>
        <table>
          <tbody>
            <tr><td>Pinia 2</td><td>{state.counter}</td></tr>
          </tbody>
        </table>
      </div>
    )
  },
)
