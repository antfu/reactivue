import React from 'react'
import { createSetup, ref, computed, onUnmounted } from 'reactivue'

interface Props {
  value: number
}

const useSetup = createSetup(
  (props: Props) => {
    const counter = ref(props.value)
    const doubled = computed(() => counter.value * 2)
    const inc = () => counter.value += 1

    onUnmounted(() => console.log('Goodbye World'))

    return { counter, doubled, inc }
  },
)

export const MyCounter = (props: Props) => {
  const { counter, doubled, inc } = useSetup(props)
  const { counter: counter2, doubled: doubled2, inc: inc2 } = useSetup(props)

  return (
    <div>
      <div>{counter} x 2 = {doubled}</div>
      <button onClick={inc}>Increase</button>
      <br/>

      <div>{counter2} x 2 = {doubled2}</div>
      <button onClick={inc2}>Increase</button>
    </div>
  )
}
