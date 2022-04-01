import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import { isRef, ref, toRef } from '@vue/runtime-core'
import { getState, useSetup } from '../'

const SetupTest = (Props: { hello?: string }) => {
  const { msg, other } = useSetup((props) => {
    const msg = ref('Hello, world!')
    const other = toRef(props, 'hello')

    return {
      msg,
      other,
    }
  }, Props)

  return (
    <div>
      <p>{msg}</p>
      <p>{other || ''}</p>
    </div>
  )
}

it('should render basic useSetup function return', async() => {
  render(<SetupTest />)

  await waitFor(() => {
    const el = screen.getByText('Hello, world!')
    expect(el).toBeInTheDocument()
  })
})

it('should render basic useSetup function return', async() => {
  render(<SetupTest hello={'Hello, Universe!'} />)

  await waitFor(() => {
    const el = screen.getByText('Hello, Universe!')
    expect(el).toBeInTheDocument()
  })
})

it('should return unwrapped values (object)', async() => {
  const msgRef = ref('Hello, world!')
  const { msg, deep } = getState({
    msg: msgRef,
    deep: {
      msg: msgRef,
    },
  })

  expect(isRef(msg)).toBe(false)
  expect(isRef(deep.msg)).toBe(false)
})

it('should return wrapped values (array)', async() => {
  const msgRef = ref('Hello, world!')
  const [msg, deep] = getState([msgRef, { msg: msgRef }] as const)

  expect(isRef(msg)).toBe(true)
  expect(isRef(deep.msg)).toBe(true)
})

it('should return unwrapped values (ref)', async() => {
  const msg = getState(ref('Hello, world!'))

  expect(isRef(msg)).toBe(false)
})
