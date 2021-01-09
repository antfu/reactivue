import React from 'react'
import { render } from '@testing-library/react'
import { screen, waitFor } from '@testing-library/dom'
import { useSetup, ref } from '../src'

const SetupTest = () => {
  const { msg } = useSetup(() => {
    const msg = ref('Hello, world!')

    return {
      msg,
    }
  })

  return <p>{msg}</p>
}

it('should render basic useSetup function return', async() => {
  render(<SetupTest/>)

  await waitFor(() => {
    const el = screen.getByText('Hello, world!')
    expect(el).toBeInTheDocument()
  })
})
