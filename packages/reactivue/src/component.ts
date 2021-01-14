/* eslint-disable import/no-mutable-exports */
import { Ref, ReactiveEffect, ref, stop } from '@vue/reactivity'
import { isDev } from './env'
import { invokeLifeCycle } from './lifecycle'
import { InternalInstanceState, LifecycleHooks } from './types'

type ReactiveEffects = Record<number, InternalInstanceState>

declare global {
  interface Window { _reactivueState: ReactiveEffects }
}

const _vueState: ReactiveEffects = window && isDev ? window._reactivueState : {}

export let currentInstance: InternalInstanceState | null = null
export let currentInstanceId: number | null = null

export const getNewInstanceId = () => {
  // When React is in Strict mode, it runs state functions twice
  // Remove unmounted instances before creating new one
  if (isDev)
    Object.keys(_vueState).forEach(id => !_vueState[+id].isActive && unmount(+id))

  return Object.keys(_vueState).length
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
    isUnmounted: false,
    isUnmounting: false,
    hooks: {},
    initialState: {},
  }
  _vueState[id] = instance

  if (window && isDev)
    window._reactivueState = _vueState

  return instance
}

export const useInstanceScope = (id: number, cb: (instance: InternalInstanceState | null) => void) => {
  const prev = currentInstanceId
  const instance = setCurrentInstanceId(id)
  cb(instance)
  setCurrentInstanceId(prev)
}

const unmount = (id: number) => {
  invokeLifeCycle(LifecycleHooks.BEFORE_UNMOUNT, _vueState[id])

  // unregister all the computed/watch effects
  for (const effect of _vueState[id].effects || [])
    stop(effect)

  invokeLifeCycle(LifecycleHooks.UNMOUNTED, _vueState[id])

  _vueState[id].isUnmounted = true

  // release the ref
  delete _vueState[id]
  if (window && isDev)
    window._reactivueState = _vueState
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
  if (isDev) {
    setTimeout(async() => _vueState[id]?.isUnmounting && unmount(id))
    return
  }
  unmount(id)
}

// record effects created during a component's setup() so that they can be
// stopped when the component unmounts
export function recordInstanceBoundEffect(effect: ReactiveEffect) {
  if (currentInstance)
    (currentInstance.effects || (currentInstance.effects = [])).push(effect)
}
