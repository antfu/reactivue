import type { EffectScope, Ref, UnwrapNestedRefs, UnwrapRef } from '@vue/runtime-core'
// @ts-expect-error setCurrentInstance not exposed
import { createHook, effectScope, isProxy, isRef, nextTick, provide, reactive, readonly, ref, setCurrentInstance, unref, watch } from '@vue/runtime-core'
import { Fragment, createElement, useEffect, useRef, useState } from 'react'

import type { ReactivueInternalInstance } from './shared'
import { LifecycleHooks, getCurrentInstance, getEffects } from './shared'

type ReturnedSetup<T> = T extends Readonly<Array<any>> ? T : T extends Ref ? UnwrapRef<T> : UnwrapNestedRefs<T>

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const getState = <T extends any>(setup: T): ReturnedSetup<T> => isRef(setup) || isProxy(setup) || Array.isArray(setup) ? unref(setup) : typeof setup === 'object' ? readonly(reactive(setup as Object)) : setup as any

export function useSetup<State, Props = {}>(
  fn: (props: Props) => State,
  ReactProps: Props = {} as any,
): ReturnedSetup<State> {
  const scope = useRef<EffectScope | null>(null)
  const context = useRef<{ fn: string; setup: ReturnedSetup<State> | null; ReactProps: Props } | null>(null)
  const instance = useRef<ReactivueInternalInstance | null>(null)
  const isInputsChanged = context.current?.fn !== fn.toString()

  if (context.current === null || isInputsChanged) {
    context.current = {
      fn: fn.toString(),
      setup: null,
      ReactProps,
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

  const invokeLifecycle = (hook: Exclude<LifecycleHooks, LifecycleHooks.PROPS_UPDATED>) => {
    instance.current?.[hook]?.forEach(fn => fn())
  }

  const [tick, setTick] = useState(0)

  useEffect(() => {
    invokeLifecycle(LifecycleHooks.BEFORE_UPDATE)
    nextTick(() => {
      invokeLifecycle(LifecycleHooks.UPDATED)
    })
  }, [tick])

  useEffect(() => {
    instance.current?.[LifecycleHooks.PROPS_UPDATED]?.forEach(fn => fn(ReactProps))
  }, [ReactProps])

  setCurrentInstance(instance.current)
  context.current.setup = context.current.setup ?? scope.current.run(() => {
    instance.current!.active = true
    const setup = fn(ReactProps)
    if (setup === null)
      return null
    const effects = getEffects(setup)
    if (effects?.length) {
      watch(effects, () => {
        context.current!.setup = getState(setup)
        setTick(tick => tick + 1)
      }, { deep: true })
    }
    return getState(setup)
  }) as ReturnedSetup<State>

  invokeLifecycle(LifecycleHooks.BEFORE_MOUNT)
  useEffect(() => {
    setMountState(true)
    invokeLifecycle(LifecycleHooks.MOUNTED)
    return () => {
      invokeLifecycle(LifecycleHooks.BEFORE_UNMOUNT)
      process.env.NODE_ENV !== 'development'
        ? scope.current?.stop()
        : scope.current?.cleanups.forEach(fn => fn())
      invokeLifecycle(LifecycleHooks.UNMOUNTED)
      setMountState(false)
    }
  }, [])

  return context.current.setup
}

export function defineComponent<PropsType = {}, State = {}>(
  setupFunction: (props: PropsType) => State,
  renderFunction?: (state: ReturnedSetup<State>, props: PropsType) => JSX.Element,
): (props: PropsType) => JSX.Element {
  return (props: PropsType) => {
    const state = useSetup(setupFunction, props)
    return renderFunction?.(state, props) ?? state as JSX.Element
  }
}

export function createSetup<PropsType, State>(
  setupFunction: (props: PropsType) => State,
): (props: PropsType) => ReturnedSetup<State> {
  return (props: PropsType) => {
    return useSetup(setupFunction, props)
  }
}
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const onPropsUpdated = <Props extends Record<any, any>>(fn: (newProps: Props) => void) => {
  createHook(LifecycleHooks.PROPS_UPDATED)(fn)
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const useProps = <Props extends Record<any, any>>(props: Props) => {
  const reactiveProps = ref(props)
  onPropsUpdated<Props>(newProps => reactiveProps.value = newProps)
  return reactiveProps
}

export function ReactivueProvider({ plugins, children }: { plugins?: any[]; children?: JSX.Element | JSX.Element[] }): JSX.Element {
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
