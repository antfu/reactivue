import React from 'react'
import { render } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import { inject, provide, useSetup } from '../src'

const ChildComp = (Props: { }) => {
  const { message } = useSetup(() => {
    const message = inject('key', 'Hello, world')

    return {
      message,
    }
  }, Props)

  return <p>{message}</p>
}

const ParentComp = (Props: { }) => {
  useSetup(() => {
    provide('key', 'Hello, world')

    return {}
  }, Props)

  return <ChildComp/>
}

it('should handle computed properties', async() => {
  render(<ParentComp/>)

  const el = screen.getByText('Hello, world')
  expect(el).toBeInTheDocument()
})
