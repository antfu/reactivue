// eslint-disable-next-line no-use-before-define
import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import { screen, waitFor } from '@testing-library/dom'
import {
  useSetup,
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
} from 'reactivue'

const onMountedJestFn = jest.fn()
const onBeforeMountJestFn = jest.fn()
const onUnmountedJestFn = jest.fn()
const onUpdatedJestFn = jest.fn()
const onBeforeUnmountJestFn = jest.fn()
const onBeforeUpdateJestFn = jest.fn()

beforeEach(() => {
  onMountedJestFn.mockClear()
  onBeforeMountJestFn.mockClear()
  onUnmountedJestFn.mockClear()
  onUpdatedJestFn.mockClear()
  onBeforeUnmountJestFn.mockClear()
  onBeforeUpdateJestFn.mockClear()
})

const LifecycleTest = () => {
  const { num, addOne } = useSetup(() => {
    const val = ref(0)

    const addToVal = () => val.value += 1

    onBeforeMount(() => onBeforeMountJestFn())
    onMounted(() => onMountedJestFn())
    onBeforeUpdate(() => onBeforeUpdateJestFn())
    onUpdated(() => onUpdatedJestFn())
    onBeforeUnmount(() => onBeforeUnmountJestFn())
    onUnmounted(() => onUnmountedJestFn())

    return {
      num: val,
      addOne: addToVal,
    }
  }, {})

  return <div>
    <p>{num}</p>
    <button onClick={addOne}>Add one</button>
  </div>
}

it('should handle mount lifecycles', async() => {
  render(<LifecycleTest/>)

  await waitFor(() => {
    expect(onBeforeMountJestFn).toBeCalled()
    expect(onMountedJestFn).toBeCalled()
  })
})

it('should handle update lifecycles', async() => {
  render(<LifecycleTest/>)

  fireEvent.click(screen.getByText('Add one'))

  await waitFor(() => {
    expect(onBeforeUpdateJestFn).toBeCalled()
    expect(onUpdatedJestFn).toBeCalled()
  })
})

it('should handle unmount lifecycles', async() => {
  const comp = render(<LifecycleTest/>)

  comp.unmount()

  await waitFor(() => {
    expect(onBeforeUnmountJestFn).toBeCalled()
    expect(onUnmountedJestFn).toBeCalled()
  })
})
