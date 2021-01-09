// eslint-disable-next-line no-use-before-define
import React from 'react'
import { render } from '@testing-library/react'
import { screen, waitFor } from '@testing-library/dom'
import { defineComponent, ref } from 'reactivue'

const DefineTest = defineComponent(() => {
  const msg = ref('Hello, world!')

  return {
    msg,
  }
}, ({ msg }) => {
  return <p>{msg}</p>
})

it('should render basic defineComponent component', async() => {
  render(<DefineTest/>)

  await waitFor(() => {
    const el = screen.getByText('Hello, world!')
    expect(el).toBeInTheDocument()
  })
})
