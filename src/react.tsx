import type { EffectScope, UnwrapNestedRefs } from '@vue/runtime-core'
// @ts-expect-error setCurrentInstance not exposed
import { effectScope, isProxy, isRef, nextTick, provide, reactive, readonly, setCurrentInstance, unref, watch } from '@vue/runtime-core'
import { Fragment, createElement, useEffect, useRef, useState } from 'react'

import type { ReactivueInternalInstance } from './shared'
import { LifecycleHooks, getCurrentInstance, getEffects } from './shared'

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const getState = <T extends any>(setup: T): T extends Readonly<Array<any>> ? T : UnwrapNestedRefs<T> => isRef(setup) || isProxy(setup) || Array.isArray(setup) ? unref(setup) : typeof setup === 'object' ? readonly(reactive(setup as Object)) : setup as any

type ReturnedSetup<T> = T extends Readonly<Array<any>> ? T : UnwrapNestedRefs<T>
export function useSetup<State, Props = {}>(
  fn: (props: Props) => State,
  ReactProps: Props = {} as any,
): ReturnedSetup<State> {
  const scope = useRef<EffectScope | null>(null)
  const context = useRef<{ fn: string; setup: ReturnedSetup<State> | null } | null>(null)
  const instance = useRef<ReactivueInternalInstance | null>(null)
  const isInputsChanged = context.current?.fn !== fn.toString()

  if (context.current === null || isInputsChanged) {
    context.current = {
      fn: fn.toString(),
      setup: null,
    }
    if (isInputsChanged) {
      scope.current?.stop()
      scope.current = null
      instance.current = null
    }
  }

  if (scope.current === null)
    scope.current = effectScope()

  if (instance.current === null) {
    instance.current = {
      active: false,
      scope: scope.current,
      provides: getCurrentInstance()?.parent?.provides || {},
      parent: getCurrentInstance(),
      isMounted: false,
      isUnmounted: false,
    }
  }

  const setMountState = (state: boolean) => {
    instance.current!.isMounted = state
    instance.current!.isUnmounted = !state
  }

  const invokeLifecycle = (hook: LifecycleHooks) => {
    instance.current?.[hook]?.forEach(fn => fn())
  }

  const [tick, setTick] = useState(0)

  useEffect(() => {
    invokeLifecycle(LifecycleHooks.BEFORE_UPDATE)
    nextTick(() => {
      invokeLifecycle(LifecycleHooks.UPDATED)
    })
  }, [tick])

  setCurrentInstance(instance.current)
  context.current.setup = context.current.setup ?? scope.current.run(() => {
    instance.current!.active = true
    const setup = fn(ReactProps)
    if (setup === null)
      return null
    const effects = getEffects(setup)
    if (effects?.length) {
      watch(effects, () => {
        setTick(tick => tick + 1)
      }, { deep: true })
    }
    return getState(setup)
  }) as ReturnedSetup<State>

  invokeLifecycle(LifecycleHooks.BEFORE_CREATE)
  invokeLifecycle(LifecycleHooks.CREATED)
  useEffect(() => {
    invokeLifecycle(LifecycleHooks.BEFORE_MOUNT)
    setMountState(true)
    invokeLifecycle(LifecycleHooks.MOUNTED)
    return () => {
      invokeLifecycle(LifecycleHooks.BEFORE_UNMOUNT)
      invokeLifecycle(LifecycleHooks.UNMOUNTED)
      setMountState(false)
      process.env.NODE_ENV !== 'development' && scope.current?.stop()
    }
  }, [])

  return context.current.setup
}

export function defineComponent<PropsType, State>(
  setupFunction: (props: PropsType) => State,
  renderFunction?: (state: ReturnedSetup<State>) => JSX.Element,
): (props: PropsType) => JSX.Element | ReturnedSetup<State> {
  return (props: PropsType) => {
    const state = useSetup(setupFunction, props)
    return renderFunction?.(state) ?? state
  }
}

export function createSetup<PropsType, State>(
  setupFunction: (props: PropsType) => State,
): (props: PropsType) => ReturnedSetup<State> {
  return (props: PropsType) => {
    return useSetup(setupFunction, props)
  }
}

export function ReactivueProvider({ plugins, children }: { plugins?: any[]; children?: JSX.Element | JSX.Element[] }) {
  const scope = useRef<EffectScope | null>(null)
  if (scope.current === null)
    scope.current = effectScope()

  const instance = useRef<ReactivueInternalInstance | null>(null)
  if (instance.current === null) {
    instance.current = {
      active: false,
      scope: scope.current,
      provides: {},
      parent: null,
      isMounted: false,
      isUnmounted: false,
    }
  }

  const app = useRef<any | null>(null)
  if (app.current === null) {
    app.current = {
      provide,
      config: {
        globalProperties: {},
      },
    }
  }

  setCurrentInstance(instance.current)

  if (!instance.current?.active && plugins)
    plugins.forEach(plugin => plugin.install(app.current))

  instance.current!.parent = {
    provides: instance.current!.provides,
  }

  return createElement(Fragment, null, children)
}
