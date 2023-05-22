import { useSetup } from './useSetup'

export const createSetup = <Props, State extends Record<any, any>>(setupFn: (props: Props) => State) => (props?: Props) => useSetup(setupFn, props)
