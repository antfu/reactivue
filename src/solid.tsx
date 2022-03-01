import type { EffectScope, Ref, UnwrapNestedRefs, UnwrapRef } from '@vue/runtime-core'
// @ts-expect-error setCurrentInstance not exposed
import { effectScope, isProxy, isReactive, isRef, nextTick, provide, setCurrentInstance, unref, watch } from '@vue/runtime-core'
import type { Accessor, JSXElement } from 'solid-js'
import { createEffect, createSignal, onCleanup, onMount } from 'solid-js'

import type { ReactivueInternalInstance } from './shared'
import { LifecycleHooks, getCurrentInstance, getEffects } from './shared'
const isClient = process.env.NODE_ENV === 'development' && typeof window !== 'undefined'
type AccessorState<T> = {
  [K in keyof T]: T[K] extends Function
    ? T[K]
    : T[K] extends Ref<infer V>
      ? Accessor<UnwrapRef<V>>
      : T[K] extends UnwrapNestedRefs<infer A>
        ? Accessor<A>
        : T[K]
} & { setup: T }
declare global {
  interface Window { __solidivueRootInstance: ReactivueInternalInstance }
}
type ReturnedSetup<T> = T extends Ref<unknown> ? Accessor<UnwrapRef<T>> : AccessorState<T>
export function useSetup<State, Props = {}>(
  fn: (props: Props) => State,
  SolidProps: Props = {} as any,
): ReturnedSetup<State> {
  const scope: EffectScope = effectScope()

  const instance: ReactivueInternalInstance = {
    active: false,
    scope,
    provides: getCurrentInstance()?.parent?.provides ?? (isClient && window.__solidivueRootInstance?.provides),
    parent: getCurrentInstance() ?? (isClient ? window.__solidivueRootInstance : null),
    isMounted: false,
    isUnmounted: false,
  }

  const setMountState = (state: boolean) => {
    instance.isMounted = state
    instance.isUnmounted = !state
  }

  const invokeLifecycle = (hook: LifecycleHooks) => {
    instance?.[hook]?.forEach(fn => fn())
  }

  const [pendinegUpdate, setPendingUpdate] = createSignal<null | boolean>(null)

  createEffect(() => {
    if (pendinegUpdate())
      invokeLifecycle(LifecycleHooks.BEFORE_UPDATE)
    else if (pendinegUpdate() === false)
      invokeLifecycle(LifecycleHooks.UPDATED)
  })

  const state = scope.run((): ReturnedSetup<State> | Record<any, any> => {
    setCurrentInstance(instance)
    instance.active = true
    const setup = fn(SolidProps) ?? {}
    let state: Accessor<unknown> | { setup: Accessor<any> | {}} = { setup }
    const effects = getEffects(setup)
    if (effects?.length) {
      // invokeLifecycle(LifecycleHooks.BEFORE_UPDATE)
      /** Pinia specific behavior */
      // @ts-expect-error
      if (isProxy(setup) && setup._p) {
        if (state === null || typeof state !== 'object')
          state = { setup }
        const setState = {}
        for (const [key, value] of Object.entries(setup)) {
          const [signal, setSignal] = createSignal(unref(value), { equals: false })
          setState[key] = setSignal
          state[key] = typeof value === 'function'
            ? (...args: any[]) => {
              setPendingUpdate(true)
              setup[key](...args)
              nextTick(() => setPendingUpdate(false))
            }
            : signal
        }

        watch(effects, ([newVal]) => {
          setPendingUpdate(true)
          for (const [key, value] of Object.entries(newVal))
            typeof value !== 'function' && setState[key](unref(value))
          nextTick(() => setPendingUpdate(false))
        }, { deep: true })
      }
      else if (isRef(setup) || Array.isArray(setup)) {
        const [signal, setSignal] = createSignal(unref(setup), { equals: false })
        state = signal
        watch(effects, (newVal) => {
          setPendingUpdate(true)
          setSignal(newVal)
          nextTick(() => setPendingUpdate(false))
        }, { deep: true })
      }
      else {
        if (state === null || typeof state !== 'object')
          state = { setup }
        for (const [key, value] of Object.entries(setup)) {
          if (isRef(value) || isReactive(value)) {
            const [signal, setSignal] = createSignal(unref(value), { equals: false })
            state[key] = signal
            watch(value as Ref, (newVal) => {
              setPendingUpdate(true)
              setSignal(newVal)
              nextTick(() => setPendingUpdate(false))
            })
          }
          else {
            state[key] = setup[key]
          }
        }
        state.setup = setup
      }
    }
    return state
  })

  invokeLifecycle(LifecycleHooks.BEFORE_CREATE)
  invokeLifecycle(LifecycleHooks.CREATED)

  onMount(() => {
    invokeLifecycle(LifecycleHooks.BEFORE_MOUNT)
    setMountState(true)
    invokeLifecycle(LifecycleHooks.MOUNTED)
  })

  onCleanup(() => {
    invokeLifecycle(LifecycleHooks.BEFORE_UNMOUNT)
    invokeLifecycle(LifecycleHooks.UNMOUNTED)
    setMountState(false)
    scope.stop()
  })

  return state as ReturnedSetup<State>
}

/**
 * @description `defineComponent` can't preverse state across HMR updates in `@refresh granular` mode.
 */
export function defineComponent<PropsType, State>(
  setupFunction: (props: PropsType) => State,
  renderFunction: (state: ReturnedSetup<State>) => JSXElement,
): (props: PropsType) => JSXElement {
  return (props: PropsType) => {
    const state = useSetup(setupFunction, props)
    return renderFunction(state)
  }
}

/**
 * @description `createSetup` can't preverse state across HMR updates in `@refresh granular` mode.
 */
export function createSetup<PropsType, State>(
  setupFunction: (props: PropsType) => State,
): (props: PropsType) => ReturnedSetup<State> {
  return (props: PropsType) => {
    return useSetup(setupFunction, props)
  }
}

export function ReactivueProvider({ plugins, children }: { plugins?: any[]; children?: JSXElement | JSXElement[] }) {
  const scope = effectScope()

  const instance: ReactivueInternalInstance = {
    active: false,
    scope,
    provides: {},
    parent: null,
    isMounted: false,
    isUnmounted: false,
  }

  const app = {
    provide,
    config: {
      globalProperties: {},
    },
  }

  setCurrentInstance(instance)

  if (!instance.active && plugins)
    plugins.forEach(plugin => plugin.install(app))

  instance.parent = {
    provides: instance.provides,
  }

  // During Solid's HMR updates we are losing access to root instance somehow.
  // Storing root instance in `window` to recover it later.
  if (isClient)
    window.__solidivueRootInstance = instance

  if (children)
    return children
}
