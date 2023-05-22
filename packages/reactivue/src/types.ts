import { ReactiveEffect, Ref } from '@vue/reactivity'

// from https://unpkg.com/@vue/reactivity@3.2.47/dist/reactivity.d.ts#L75-L89
export declare class EffectScope {
  detached: boolean;
  /* Excluded from this release type: _active */
  /* Excluded from this release type: effects */
  /* Excluded from this release type: cleanups */
  /* Excluded from this release type: parent */
  /* Excluded from this release type: scopes */
  /* Excluded from this release type: index */
  constructor(detached?: boolean);
  get active(): boolean;
  run<T>(fn: () => T): T | undefined;
  /* Excluded from this release type: on */
  /* Excluded from this release type: off */
  stop(fromParent?: boolean): void;
}

export const enum LifecycleHooks {
  BEFORE_CREATE = 'BeforeMount',
  CREATED = 'Created',
  BEFORE_MOUNT = 'BeforeMount',
  MOUNTED = 'Mounted',
  BEFORE_UPDATE = 'BeforeUpdate',
  UPDATED = 'Updated',
  BEFORE_UNMOUNT = 'BeforeUnmount',
  UNMOUNTED = 'Unmounted',
}

export interface InternalInstanceState {
  _id: number
  props: any
  data: Ref<any>
  isUnmounted: boolean
  isUnmounting: boolean
  effects?: ReactiveEffect[]
  hooks: Record<string, Function[]>
  initialState: Record<any, any>
  provides: Record<string, unknown>
  scope: EffectScope | null
}

export type InstanceStateMap = Record<number, InternalInstanceState>
