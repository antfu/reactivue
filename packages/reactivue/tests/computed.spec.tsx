// eslint-disable-next-line no-use-before-define
import React from 'react'
import { render } from '@testing-library/react'
import { screen, waitFor } from '@testing-library/dom'
import { useSetup, toRef, computed } from 'reactivue'

const ComputedTest = (Props: { hello: string }) => {
  const { comp } = useSetup((props) => {
    const other = toRef(props, 'hello')

    const comp = computed(() => `${other?.value?.substr(0, 5) || ''}, Universe!`)

    return {
      comp,
    }
  }, Props)

  return <p>{comp}</p>
}

it('should handle computed properties', async() => {
  const comp = render(<ComputedTest hello={'Hello, world'}/>)

  await waitFor(() => {
    const el = screen.getByText('Hello, Universe!')
    expect(el).toBeInTheDocument()
  })

  comp.rerender(<ComputedTest hello={'Adios, world'}/>)

  await waitFor(() => {
    const el = screen.getByText('Adios, Universe!')
    expect(el).toBeInTheDocument()
  })
})
