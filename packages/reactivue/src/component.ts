/* eslint-disable import/no-mutable-exports */
import { Ref, ReactiveEffect, ref, stop } from '@vue/reactivity'
import * as vueReactivity from '@vue/reactivity'
import { invokeLifeCycle } from './lifecycle'
import { InstanceStateMap, InternalInstanceState, LifecycleHooks } from './types'

/**
 * When `reactivue` dependency gets updated during development
 * your build tool re-executes it and `_vueState` becomes its
 * initial state. Storing our reactive effects in `window.__reactivue_state`
 * and filling our `_vueState` with it.
 */
declare global {
  interface Window {
    __reactivue_state: InstanceStateMap
    __reactivue_id: number
  }
}

let _id = (__DEV__ && __BROWSER__ && window.__reactivue_id) || 0
const _vueState: InstanceStateMap = (__DEV__ && __BROWSER__ && window.__reactivue_state) || {}
if (__DEV__ && __BROWSER__)
  window.__reactivue_state = _vueState

const effectScope = vueReactivity['effectScope']
export const usingEffectScope = typeof effectScope === 'function'

export let currentInstance: InternalInstanceState | null = null
export let currentInstanceId: number | null = null

export const getNewInstanceId = () => {
  _id++

  if (__DEV__ && __BROWSER__)
    window.__reactivue_id = _id

  return _id
}

export const getCurrentInstance = () => currentInstance
export const setCurrentInstance = (
  instance: InternalInstanceState | null,
) => {
  currentInstance = instance
}

export const setCurrentInstanceId = (id: number | null) => {
  currentInstanceId = id
  currentInstance = id != null ? (_vueState[id] || null) : null
  return currentInstance
}
export const createNewInstanceWithId = (id: number, props: any, data: Ref<any> = ref(null)) => {
  const instance: InternalInstanceState = {
    _id: id,
    props,
    data,
    isActive: false,
    isMounted: false,
    isUnmounted: false,
    isUnmounting: false,
    hooks: {},
    initialState: {},
    provides: __BROWSER__ ? { ...window.__reactivue_context?.provides } : {},
    scope: usingEffectScope ? effectScope() : null,
  }
  _vueState[id] = instance

  return instance
}

export const useInstanceScope = (id: number, cb: (instance: InternalInstanceState | null) => void) => {
  const prev = currentInstanceId
  const instance = setCurrentInstanceId(id)
  if (usingEffectScope) {
    if (!instance?.isUnmounted) instance?.scope?.run(() => cb(instance))
  }
  else cb(instance)
  setCurrentInstanceId(prev)
}

const unmount = (id: number) => {
  invokeLifeCycle(LifecycleHooks.BEFORE_UNMOUNT, _vueState[id])

  // unregister all the computed/watch effects
  for (const effect of _vueState[id].effects || [])
    stop(effect)

  invokeLifeCycle(LifecycleHooks.UNMOUNTED, _vueState[id])
  if (usingEffectScope) _vueState[id].scope!.stop()
  _vueState[id].isUnmounted = true

  // release the ref
  delete _vueState[id]
}

export const unmountInstance = (id: number) => {
  if (!_vueState[id])
    return

  _vueState[id].isUnmounting = true

  /**
   * Postpone unmounting on dev. So we can check setup values
   * in useSetup.ts after hmr updates. That will not be an issue
   * for really unmounting components. Because they are increasing
   * instance id unlike the hmr updated components.
   */
  if (__DEV__)
    setTimeout(() => _vueState[id]?.isUnmounting && unmount(id), 0)
  else
    unmount(id)
}

// record effects created during a component's setup() so that they can be
// stopped when the component unmounts
export function recordInstanceBoundEffect(effect: ReactiveEffect) {
  if (currentInstance) {
    if (!currentInstance.effects)
      currentInstance.effects = []
    currentInstance.effects.push(effect)
  }
}
