import { ReactiveEffect, Ref } from '@vue/reactivity'

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
  isActive: boolean
  isUnmounted: boolean
  isUnmounting: boolean
  effects?: ReactiveEffect[]
  hooks: Record<string, Function[]>
  initialState: Record<any, any>
  provides: Record<string, unknown>
}

export type InstanceStateMap = Record<number, InternalInstanceState>

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

interface ImportMetaEnv {
  [key: string]: string | boolean | undefined
  BASE_URL: string
  MODE: string
  DEV: boolean
  PROD: boolean
}
