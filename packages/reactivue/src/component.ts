import { Ref, ref, stop, EffectScope } from '@vue/reactivity'
import { getCurrentInstance, setCurrentInstance } from '@vue/runtime-core'
import { CompInstance, invokeLifeCycle } from './lifecycle'
import { InstanceStateMap, LifecycleHooks, ComponentInternalInstance } from './types'

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

export const getNewInstanceId = () => {
  if (__DEV__) {
    // When React is in Strict mode, it runs state functions twice
    // Remove unmounted instances before creating new one
    Object.keys(_vueState).forEach((id) => {
      setTimeout(() => {
        if (_vueState[+id]?.isActive === false)
          unmount(+id)
      }, 0)
    })
  }

  _id++

  if (__DEV__ && __BROWSER__)
    window.__reactivue_id = _id

  return _id
}

export const createNewInstanceWithId = (id: number, props: any, data: Ref<any> = ref(null)): ComponentInternalInstance => {
  const final = {
    uid: id,
    scope: new EffectScope(true /* detached */),
    props,
    data: data as any,
    isActive: false,
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    isUnmounting: false,
    hooks: {},
    initialState: {},
    provides: __BROWSER__ ? { ...window.__reactivue_context?.provides } : {},
  } as Partial<ComponentInternalInstance> as never as ComponentInternalInstance

  _vueState[id] = final

  return final
}

export const useInstanceScope = (
  instance: CompInstance,
  cb: (instance: CompInstance) => void,
) => {
  const prev = getCurrentInstance()
  setCurrentInstance(instance)
  cb(instance)
  prev && setCurrentInstance(prev)
}

const unmount = (id: number) => {
  invokeLifeCycle(LifecycleHooks.BEFORE_UNMOUNT, _vueState[id])

  // unregister all the computed/watch effects
  for (const effect of _vueState[id].effects || [])
    stop(effect as never)

  invokeLifeCycle(LifecycleHooks.UNMOUNTED, _vueState[id])

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
