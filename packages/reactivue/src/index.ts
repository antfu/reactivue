export { useSetup } from './useSetup'
export { defineComponent } from './defineComponent'
export { createSetup } from './createSetup'
export { getCurrentInstance } from './component'
export { nextTick } from './nextTick'
export * from './mock'
export {
  onMounted,
  onBeforeMount,
  onUnmounted,
  onUpdated,
  onBeforeUnmount,
  onBeforeUpdate,
} from './lifecycle'

export {
  watchEffect,
  watch,
  computed,
} from '@vue/runtime-core'

// redirect all APIs from @vue/reactivity
export {
  // computed,
  ComputedGetter,
  ComputedRef,
  ComputedSetter,
  customRef,
  DebuggerEvent,
  DeepReadonly,
  effect,
  enableTracking,
  isProxy,
  isReactive,
  isReadonly,
  isRef,
  ITERATE_KEY,
  markRaw,
  pauseTracking,
  reactive,
  ReactiveEffect,
  ReactiveEffectOptions,
  ReactiveFlags,
  readonly,
  ref,
  Ref,
  RefUnwrapBailTypes,
  resetTracking,
  shallowReactive,
  shallowReadonly,
  shallowRef,
  stop,
  toRaw,
  toRef,
  toRefs,
  ToRefs,
  track,
  TrackOpTypes,
  trigger,
  TriggerOpTypes,
  triggerRef,
  unref,
  UnwrapRef,
  WritableComputedOptions,
  WritableComputedRef,
} from '@vue/reactivity'
