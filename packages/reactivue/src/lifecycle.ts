import { useInstanceScope } from './component'
import { ComponentInternalInstance } from './types'

export {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
} from '@vue/runtime-core'

export const LifecycleHooks = {
  BEFORE_CREATE: 'bc',
  CREATED: 'c',
  BEFORE_MOUNT: 'bm',
  MOUNTED: 'm',
  BEFORE_UPDATE: 'bu',
  UPDATED: 'u',
  BEFORE_UNMOUNT: 'bum',
  UNMOUNTED: 'um',
  DEACTIVATED: 'da',
  ACTIVATED: 'a',
  RENDER_TRIGGERED: 'rtg',
  RENDER_TRACKED: 'rtc',
  ERROR_CAPTURED: 'ec',
  SERVER_PREFETCH: 'sp',
} as const

export type CompInstance = ComponentInternalInstance

export const invokeLifeCycle = (
  type: typeof LifecycleHooks[keyof typeof LifecycleHooks],
  target: CompInstance,
) => {
  if (target) {
    const hooks: Function[] = target[type] || []
    useInstanceScope(target, () => {
      for (const hook of hooks)
        hook()
    })
  }
}
