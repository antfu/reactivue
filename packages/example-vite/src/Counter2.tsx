
import React from 'react'
import { useSetup, ref, computed, watch } from 'reactivue'

export function Counter(Props: { value: number }) {
  const state = useSetup(
    (props) => {
      const counter = ref(props.value)

      const inc = () => (counter.value += 1)
      const dec = () => (counter.value -= 1)
      const doubled = computed(() => counter.value * 2)
      const isFive = ref(false)

      watch(() => props.value, v => (counter.value = v))
      watch(counter, v => (isFive.value = v === 5), { immediate: true })

      return { counter, inc, dec, doubled, isFive }
    },
    Props,
  )

  const { counter, inc, doubled, dec, isFive } = state
  return (
    <div>
      <p></p>
      <button onClick={inc}>Inc</button>
      <code> </code>
      <button onClick={dec}>Dec</button>
      <table>
        <tbody>
          <tr><td>Counter 2</td><td>{counter}</td></tr>
          <tr><td>isFive</td><td>{JSON.stringify(isFive)}</td></tr>
          <tr><td>Doubled</td><td>{doubled}</td></tr>
        </tbody>
      </table>
    </div>
  )
}
