// ported from https://github.com/vuejs/vue-next/blob/master/packages/runtime-core/src/apiWatch.ts

/* eslint-disable array-callback-return */
import { effect, Ref, ComputedRef, ReactiveEffectOptions, isRef, isReactive, stop } from '@vue/reactivity'
import { isFunction, isArray, NOOP, isObject, remove, hasChanged } from '@vue/shared'
import { currentInstance, recordInstanceBoundEffect } from './component'
import { warn, callWithErrorHandling, callWithAsyncErrorHandling } from './errorHandling'

export type WatchEffect = (onInvalidate: InvalidateCbRegistrator) => void

export type WatchSource<T = any> = Ref<T> | ComputedRef<T> | (() => T)

export type WatchCallback<V = any, OV = any> = (
  value: V,
  oldValue: OV,
  onInvalidate: InvalidateCbRegistrator
) => any

export type WatchStopHandle = () => void

type MapSources<T> = {
  [K in keyof T]: T[K] extends WatchSource<infer V>
    ? V
    : T[K] extends object ? T[K] : never
}

type MapOldSources<T, Immediate> = {
  [K in keyof T]: T[K] extends WatchSource<infer V>
    ? Immediate extends true ? (V | undefined) : V
    : T[K] extends object
      ? Immediate extends true ? (T[K] | undefined) : T[K]
      : never
}

type InvalidateCbRegistrator = (cb: () => void) => void
const INITIAL_WATCHER_VALUE = {}

export interface WatchOptionsBase {
  flush?: 'pre' | 'post' | 'sync'
  onTrack?: ReactiveEffectOptions['onTrack']
  onTrigger?: ReactiveEffectOptions['onTrigger']
}

export interface WatchOptions<Immediate = boolean> extends WatchOptionsBase {
  immediate?: Immediate
  deep?: boolean
}

// Simple effect.
export function watchEffect(
  effect: WatchEffect,
  options?: WatchOptionsBase,
): WatchStopHandle {
  return doWatch(effect, null, options)
}

// overload #1: array of multiple sources + cb
// Readonly constraint helps the callback to correctly infer value types based
// on position in the source array. Otherwise the values will get a union type
// of all possible value types.
export function watch<
  T extends Readonly<Array<WatchSource<unknown> | object>>,
  Immediate extends Readonly<boolean> = false
>(
  sources: T,
  cb: WatchCallback<MapSources<T>, MapOldSources<T, Immediate>>,
  options?: WatchOptions<Immediate>
): WatchStopHandle

// overload #2: single source + cb
export function watch<T, Immediate extends Readonly<boolean> = false>(
  source: WatchSource<T>,
  cb: WatchCallback<T, Immediate extends true ? (T | undefined) : T>,
  options?: WatchOptions<Immediate>
): WatchStopHandle

// overload #3: watching reactive object w/ cb
export function watch<
  T extends object,
  Immediate extends Readonly<boolean> = false
>(
  source: T,
  cb: WatchCallback<T, Immediate extends true ? (T | undefined) : T>,
  options?: WatchOptions<Immediate>
): WatchStopHandle

// implementation
export function watch<T = any>(
  source: WatchSource<T> | WatchSource<T>[],
  cb: WatchCallback<T>,
  options?: WatchOptions,
): WatchStopHandle {
  return doWatch(source, cb, options)
}

function doWatch(
  source: WatchSource | WatchSource[] | WatchEffect,
  cb: WatchCallback | null,
  { immediate, deep, flush, onTrack, onTrigger }: WatchOptions = {},
): WatchStopHandle {
  const instance = currentInstance

  let getter: () => any
  if (isRef(source)) {
    getter = () => (source as Ref).value
  }
  else if (isReactive(source)) {
    getter = () => source
    deep = true
  }
  else if (isArray(source)) {
    getter = () =>
      source.map((s) => {
        if (isRef(s))
          return s.value
        else if (isReactive(s))
          return traverse(s)
        else if (isFunction(s))
          return callWithErrorHandling(s, instance, 'watch getter')
        else
          __DEV__ && warn('invalid source')
      })
  }
  else if (isFunction(source)) {
    if (cb) {
      // getter with cb
      getter = () =>
        callWithErrorHandling(source, instance, 'watch getter')
    }
    else {
      // no cb -> simple effect
      getter = () => {
        if (instance && instance.isUnmounted)
          return

        if (cleanup)
          cleanup()

        return callWithErrorHandling(
          source,
          instance,
          'watch callback',
          [onInvalidate],
        )
      }
    }
  }
  else {
    getter = NOOP
  }

  if (cb && deep) {
    const baseGetter = getter
    getter = () => traverse(baseGetter())
  }

  let cleanup: () => void
  const onInvalidate: InvalidateCbRegistrator = (fn: () => void) => {
    cleanup = runner.options.onStop = () => {
      callWithErrorHandling(fn, instance, 'watch cleanup')
    }
  }

  let oldValue = isArray(source) ? [] : INITIAL_WATCHER_VALUE
  const job = () => {
    if (!runner.active)
      return

    if (cb) {
      // watch(source, cb)
      const newValue = runner()
      if (deep || hasChanged(newValue, oldValue)) {
        // cleanup before running cb again
        if (cleanup)
          cleanup()

        callWithAsyncErrorHandling(cb, instance, 'watch callback', [
          newValue,
          // pass undefined as the old value when it's changed for the first time
          oldValue === INITIAL_WATCHER_VALUE ? undefined : oldValue,
          onInvalidate,
        ])
        oldValue = newValue
      }
    }
    else {
      // watchEffect
      runner()
    }
  }

  // important: mark the job as a watcher callback so that scheduler knows
  // it is allowed to self-trigger (#1727)
  job.allowRecurse = !!cb

  let scheduler: ReactiveEffectOptions['scheduler']
  if (flush === 'sync') {
    scheduler = job
  }
  else if (flush === 'post') {
    scheduler = () => job()
    // TODO: scheduler = () => queuePostRenderEffect(job, instance && instance.suspense)
  }
  else {
    // default: 'pre'
    scheduler = () => {
      if (!instance) {
        // TODO: queuePreFlushCb(job)
        job()
      }
      else {
        // with 'pre' option, the first call must happen before
        // the component is mounted so it is called synchronously.
        job()
      }
    }
  }

  const runner = effect(getter, {
    lazy: true,
    onTrack,
    onTrigger,
    scheduler,
  })

  recordInstanceBoundEffect(runner)

  // initial run
  if (cb) {
    if (immediate)
      job()
    else
      oldValue = runner()
  }
  else {
    runner()
  }

  return () => {
    stop(runner)
    if (instance)
      remove(instance.effects!, runner)
  }
}

function traverse(value: unknown, seen: Set<unknown> = new Set()) {
  if (!isObject(value) || seen.has(value))
    return value

  seen.add(value)
  if (isArray(value)) {
    for (let i = 0; i < value.length; i++)
      traverse(value[i], seen)
  }
  else if (value instanceof Map) {
    value.forEach((_, key) => {
      // to register mutation dep for existing keys
      traverse(value.get(key), seen)
    })
  }
  else if (value instanceof Set) {
    value.forEach((v) => {
      traverse(v, seen)
    })
  }
  else {
    for (const key of Object.keys(value))
      traverse(value[key], seen)
  }
  return value
}
