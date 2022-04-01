import '@testing-library/jest-dom'
import { render, waitFor } from '@testing-library/react'
import { ref, watch, watchEffect } from '@vue/runtime-core'
import { useSetup } from '../'

const watchJestFn = vi.fn()
const watchEffectJestFn = vi.fn()

beforeEach(() => {
  watchJestFn.mockClear()
  watchEffectJestFn.mockClear()
})

const WatchTest = (Props: { hello: string }) => {
  const { other } = useSetup((props) => {
    const other = ref(props.hello)

    watch(other, () => watchJestFn())

    other.value = 'world'

    watchEffect(() => {
      watchEffectJestFn(other.value)
    })
    return {
      other,
    }
  }, Props)

  return <p>{other}</p>
}

it('should handle watch ref', async() => {
  render(<WatchTest hello={'Hello, world'}/>)

  await waitFor(() => {
    expect(watchJestFn).toBeCalled()
  })
})

it('shouldn\'t recreate setup on prop changes', async() => {
  const comp = render(<WatchTest hello={'Hello, world'}/>)

  comp.rerender(<WatchTest hello={'Adios, world'}/>)

  await waitFor(() => {
    expect(watchEffectJestFn).toBeCalledTimes(1)
  })
})
