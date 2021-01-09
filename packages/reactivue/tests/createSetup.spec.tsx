import React from 'react'
import { render } from '@testing-library/react'
import { screen, waitFor } from '@testing-library/dom'
import { createSetup, ref } from '../src'

const useMsg = createSetup(() => {
  const msg = ref('Hello, world!')

  return {
    msg,
  }
})

const CreateSetupTest = () => {
  const { msg } = useMsg()
  return <p>{msg}</p>
}

it('should render basic createSetup return', async() => {
  render(<CreateSetupTest/>)

  await waitFor(() => {
    const el = screen.getByText('Hello, world!')
    expect(el).toBeInTheDocument()
  })
})
