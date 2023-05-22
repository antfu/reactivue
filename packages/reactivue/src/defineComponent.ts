import type { UnwrapRef } from '@vue/reactivity'
import { useSetup } from './useSetup'

export function defineComponent<PropsType, State extends Record<any, any>>(
  setupFunction: (props: PropsType) => State,
  renderFunction: (state: UnwrapRef<State>) => JSX.Element,
): (props: PropsType) => JSX.Element {
  return (props: PropsType) => {
    const state = useSetup<State, PropsType>(setupFunction, props)
    return renderFunction(state)
  }
}
