import type { EffectScope, Ref } from '@vue/runtime-core'
import { getCurrentInstance as _getCurrentInstance, isProxy, isReactive, isRef, unref } from '@vue/runtime-core'

export const enum LifecycleHooks {
  BEFORE_CREATE = 'bc',
  CREATED = 'c',
  BEFORE_MOUNT = 'bm',
  MOUNTED = 'm',
  BEFORE_UPDATE = 'bu',
  UPDATED = 'u',
  BEFORE_UNMOUNT = 'bum',
  UNMOUNTED = 'um',
}

export interface ReactivueInternalInstance {
  scope: EffectScope
  provides: Record<string | symbol, any>
  parent: any
  isMounted?: boolean
  isUnmounted?: boolean
  active: boolean
  [LifecycleHooks.BEFORE_CREATE]?: (() => void)[]
  [LifecycleHooks.CREATED]?: (() => void)[]
  [LifecycleHooks.BEFORE_MOUNT]?: (() => void)[]
  [LifecycleHooks.MOUNTED]?: (() => void)[]
  [LifecycleHooks.BEFORE_UPDATE]?: (() => void)[]
  [LifecycleHooks.UPDATED]?: (() => void)[]
  [LifecycleHooks.BEFORE_UNMOUNT]?: (() => void)[]
  [LifecycleHooks.UNMOUNTED]?: (() => void)[]
}
export function getCurrentInstance() {
  return _getCurrentInstance() as unknown as ReactivueInternalInstance
}

export function getEffects(setup: Record<any, Ref<unknown> | {}> | Record<any, Ref<unknown> | {}>[]) {
  if (isRef(setup) || isProxy(setup))
    return [setup]
  if (Array.isArray(setup))
    return setup.filter(e => isRef(e) || isReactive(e))
  if (typeof setup === 'object')
    return Object.values(setup).filter(val => isRef(val) || isReactive(val))
}

export function rawValues(setup: Record<any, any>) {
  return Object.fromEntries(Object.entries(setup).map(([key, value]) => [key, unref(value)]))
}
