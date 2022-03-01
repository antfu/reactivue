import { createSetup } from 'reactivue/solid'
import { computed, onUnmounted, ref } from '@vue/runtime-core'

interface Props {
  value: number
}

const useMySetup = createSetup(
  (props: Props) => {
    const counter = ref(props.value)
    const doubled = computed(() => counter.value * 2)
    const inc = () => counter.value += 1

    onUnmounted(() => console.log('Goodbye World'))

    return { counter, doubled, inc }
  },
)

export const Counter = (props: Props) => {
  const { counter, doubled, inc } = useMySetup(props)
  const { counter: counter2, doubled: doubled2, inc: inc2 } = useMySetup({ value: 10 })

  return (
    <div className="card">
      <p>createSetup()</p>
      <div className="p-1">{counter} x 2 = {doubled}</div>
      <button onClick={inc}>inc +</button>
      <div className="p-1 mt-2">{counter2} x 2 = {doubled2}</div>
      <button onClick={inc2}>inc+</button>
      <br/>
    </div>
  )
}
