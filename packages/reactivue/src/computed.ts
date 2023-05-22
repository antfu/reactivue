import {
  computed as _computed,
  ComputedRef,
  WritableComputedOptions,
  WritableComputedRef,
  ComputedGetter,
} from '@vue/reactivity'
import { recordInstanceBoundEffect, usingEffectScope } from './component'

export function computed<T>(getter: ComputedGetter<T>): ComputedRef<T>
export function computed<T>(
  options: WritableComputedOptions<T>
): WritableComputedRef<T>
export function computed<T>(
  getterOrOptions: ComputedGetter<T> | WritableComputedOptions<T>,
) {
  const c = _computed(getterOrOptions as any)
  if (!usingEffectScope) recordInstanceBoundEffect(c.effect)
  return c
}
