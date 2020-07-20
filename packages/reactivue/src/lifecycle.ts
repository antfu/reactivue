// ported from https://github.com/vuejs/vue-next/blob/master/packages/runtime-core/src/apiLifecycle.ts

import { pauseTracking, resetTracking } from '@vue/reactivity'
import { __DEV__ } from './env'
import { currentInstance, setCurrentInstance, useInstanceScope } from './component'
import { warn, callWithAsyncErrorHandling } from './errorHandling'
import { LifecycleHooks, InternalInstanceState } from './types'

export function injectHook(
  type: LifecycleHooks,
  hook: Function & { __weh?: Function },
  target: InternalInstanceState | null = currentInstance,
  prepend = false,
) {
  if (target) {
    const hooks = target.hooks[type] || (target.hooks[type] = [])
    // cache the error handling wrapper for injected hooks so the same hook
    // can be properly deduped by the scheduler. "__weh" stands for "with error
    // handling".
    const wrappedHook
      = hook.__weh
      || (hook.__weh = (...args: unknown[]) => {
        if (target.isUnmounted)
          return

        // disable tracking inside all lifecycle hooks
        // since they can potentially be called inside effects.
        pauseTracking()
        // Set currentInstance during hook invocation.
        // This assumes the hook does not synchronously trigger other hooks, which
        // can only be false when the user does something really funky.
        setCurrentInstance(target)
        const res = callWithAsyncErrorHandling(hook, target, type, args)
        setCurrentInstance(null)
        resetTracking()
        return res
      })
    if (prepend)
      hooks.unshift(wrappedHook)

    else
      hooks.push(wrappedHook)
  }
  else if (__DEV__) {
    warn(
      `on${type} is called when there is no active component instance to be `
        + 'associated with. '
        + 'Lifecycle injection APIs can only be used during execution of setup()',
    )
  }
}

export const createHook = <T extends Function = () => any>(
  lifecycle: LifecycleHooks,
) => (hook: T, target: InternalInstanceState | null = currentInstance) => injectHook(lifecycle, hook, target)

export const onBeforeMount = createHook(LifecycleHooks.BEFORE_MOUNT)
export const onMounted = createHook(LifecycleHooks.MOUNTED)
export const onBeforeUpdate = createHook(LifecycleHooks.BEFORE_UPDATE)
export const onUpdated = createHook(LifecycleHooks.UPDATED)
export const onBeforeUnmount = createHook(LifecycleHooks.BEFORE_UNMOUNT)
export const onUnmounted = createHook(LifecycleHooks.UNMOUNTED)

export const invokeLifeCycle = (
  type: LifecycleHooks,
  target: InternalInstanceState | null = currentInstance,
) => {
  if (target) {
    const hooks = target.hooks[type] || []
    useInstanceScope(target._id, () => {
      for (const hook of hooks)
        hook()
    })
  }
  else if (__DEV__) {
    warn(`on${type} is invoked without instance.`)
  }
}
