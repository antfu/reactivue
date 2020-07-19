import { UnwrapRef } from '@vue/reactivity'
import { useSetup } from './useSetup'

export function defineComponent<PropsType, State>(
  setupFunction: (props: PropsType) => State,
  renderFunction: (state: UnwrapRef<State>) => JSX.Element,
): (props: PropsType) => JSX.Element {
  return (props: PropsType) => {
    const state = useSetup(setupFunction, props)
    return renderFunction(state)
  }
}
