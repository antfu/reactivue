import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import { ref } from '@vue/runtime-core'
import { createSetup } from '../'

const useMsg = createSetup(() => {
  const msg = ref('Hello, world!')

  return {
    msg,
  }
})

const CreateSetupTest = () => {
  const { msg } = useMsg({})
  return <p>{msg}</p>
}

it('should render basic createSetup return', async() => {
  render(<CreateSetupTest/>)

  await waitFor(() => {
    const el = screen.getByText('Hello, world!')
    expect(el).toBeInTheDocument()
  })
})
const useMsg2 = createSetup(() => {
  return ref('Hello, world!')
})

const CreateSetupTest2 = () => {
  const msg = useMsg2({})
  return <p>{msg}</p>
}

it('should render basic createSetup return', async() => {
  render(<CreateSetupTest2/>)

  await waitFor(() => {
    const el = screen.getByText('Hello, world!')
    expect(el).toBeInTheDocument()
  })
})
