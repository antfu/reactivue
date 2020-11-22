import { useSetup } from './useSetup'

export const createSetup = <Props, State>(setupFn: (props?: Props) => State) => (props?: Props) => useSetup(setupFn, props)
