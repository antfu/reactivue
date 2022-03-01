import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import { ref, toRef } from '@vue/runtime-core'
import { useSetup } from '../'

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
