import React from 'react'
import { render } from '@testing-library/react'
import { waitFor } from '@testing-library/dom'
import { toRef, useSetup, watch, watchEffect } from '../src'

const watchJestFn = jest.fn()
const watchEffectJestFn = jest.fn()

beforeEach(() => {
  watchJestFn.mockClear()
  watchEffectJestFn.mockClear()
})

function WatchTest(Props: { hello: string }) {
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

it('should handle watch ref', async () => {
  const { rerender } = render(<WatchTest hello={'Hello, world'}/>)

  rerender(<WatchTest hello={'Adios, world'}/>)

  await waitFor(() => {
    expect(watchJestFn).toBeCalled()
  })
})

it('should handle watchEffect ref', async () => {
  const comp = render(<WatchTest hello={'Hello, world'}/>)

  comp.rerender(<WatchTest hello={'Adios, world'}/>)

  await waitFor(() => {
    expect(watchEffectJestFn).toBeCalled()
  })
})
