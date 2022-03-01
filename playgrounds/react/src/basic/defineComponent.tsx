import { defineComponent } from 'reactivue'
import { computed, onBeforeUpdate, onUnmounted, onUpdated, ref, watch } from '@vue/runtime-core'

export const Counter = defineComponent(
  (props: { value: number }) => {
    const counter = ref(props.value)

    const inc = () => (counter.value += 1)
    const dec = () => (counter.value -= 1)
    const doubled = computed(() => counter.value * 2)
    const isFive = ref(false)

    watch(counter, v => (isFive.value = v === 5), { immediate: true })

    onBeforeUpdate(() => {
      console.log('Counter 45.')
    })

    onUpdated(() => {
      console.log('Counter updated 2.')
    })

    onUnmounted(() => {
      console.log('Goodbye World.')
    })

    return { counter, inc, dec, doubled, isFive }
  },
  ({ counter, inc, doubled, dec, isFive }) => {
    return (
      <div className="card">
        <p>defineComponent()</p>
        <button onClick={dec}>dec -</button>
        <button onClick={inc}>inc +</button>
        <table>
          <tbody>
            <tr>
              <td>Counter</td>
              <td>{counter}</td>
            </tr>
            <tr>
              <td>isFive</td>
              <td>{JSON.stringify(isFive)}</td>
            </tr>
            <tr>
              <td>Doubled</td>
              <td>{doubled}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  })
