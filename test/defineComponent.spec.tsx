import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import { ref } from '@vue/runtime-core'
import { defineComponent } from '../'

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
