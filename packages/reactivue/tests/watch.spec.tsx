import React from 'react'
import { render } from '@testing-library/react'
import { waitFor } from '@testing-library/dom'
import { useSetup, toRef, watch, watchEffect } from '../src'

const watchJestFn = jest.fn()
const watchEffectJestFn = jest.fn()

beforeEach(() => {
  watchJestFn.mockClear()
  watchEffectJestFn.mockClear()
})

const WatchTest = (Props: { hello: string }) => {
  const { other } = useSetup((props) => {
    const other = toRef(props, 'hello')

    watch(other, () => watchJestFn())

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
  const comp = render(<WatchTest hello={'Hello, world'}/>)

  comp.rerender(<WatchTest hello={'Adios, world'}/>)

  await waitFor(() => {
    expect(watchJestFn).toBeCalled()
  })
})

// TODO: This test does not pass due to a bug in the library
// @see https://github.com/antfu/reactivue/issues/10
it.skip('should handle watchEffect ref', async() => {
  const comp = render(<WatchTest hello={'Hello, world'}/>)

  comp.rerender(<WatchTest hello={'Adios, world'}/>)

  await waitFor(() => {
    expect(watchEffectJestFn).toBeCalled()
  })
})
