import { UnwrapRef, reactive, ref, readonly, unref } from '@vue/reactivity'
import { useState, useEffect, useRef } from 'react'
import { watch } from '@vue/runtime-core'
import { getNewInstanceId, createNewInstanceWithId, useInstanceScope, unmountInstance } from './component'
import { invokeLifeCycle } from './lifecycle'
import { LifecycleHooks } from './types'

export function useSetup<State extends Record<any, any>, Props = {}>(
  setupFunction: (props: Props) => State,
  ReactProps?: Props,
): UnwrapRef<State> {
  const id = useState(getNewInstanceId)[0]

  const setTick = useState(0)[1]

  const instanceRef = useRef<any>()
  const createState = () => {
    const props = reactive({ ...(ReactProps || {}) }) as any
    const instance = createNewInstanceWithId(id, props)

    instanceRef.current = instance

    useInstanceScope(instance, () => {
      const setupState = setupFunction(readonly(props)) ?? {}
      const data = ref(setupState)

      invokeLifeCycle(LifecycleHooks.BEFORE_MOUNT, instance)

      instance.data = data as never

      if (__DEV__) {
        for (const key of Object.keys(setupState))
          (instance as any).initialState[key] = unref(setupState[key])
      }
    })

    return instance.data.value
  }

  // run setup function
  const [state, setState] = useState(createState)

  // sync props changes
  useEffect(() => {
    if (!ReactProps) return

    useInstanceScope(instanceRef.current, (instance) => {
      if (!instance)
        return
      const { props } = instance
      for (const key of Object.keys(ReactProps))
        props[key] = (ReactProps as any)[key]
    })
  }, [ReactProps])

  // trigger React re-render on data changes
  useEffect(() => {
    /**
     * Invalidate setup after hmr updates
     */
    if (__DEV__) {
      let isChanged = false

      useInstanceScope(instanceRef.current, (instance) => {
        if (!instance)
          return

        instance.isActive = true

        if (!instance.isUnmounting)
          return

        const props = Object.assign({}, (ReactProps || {})) as any
        const setup = setupFunction(readonly(props))

        for (const key of Object.keys(setup)) {
          if (isChanged)
            break

          if (typeof (instance as any).initialState[key] === 'function')
            isChanged = (instance as any).initialState[key].toString() !== setup[key].toString()
          else
            isChanged = (instance as any).initialState[key] !== unref(setup[key])
        }

        instance.isUnmounting = false
      })

      if (isChanged)
        setState(createState())
    }

    useInstanceScope(instanceRef.current, (instance) => {
      if (!instance)
        return

      invokeLifeCycle(LifecycleHooks.MOUNTED, instance)

      const { data } = instance
      watch(
        data,
        () => {
          /**
           * Prevent triggering rerender when component
           * is about to unmount or really unmounted
           */
          if (instance.isUnmounting)
            return

          useInstanceScope(instanceRef.current, () => {
            invokeLifeCycle(LifecycleHooks.BEFORE_UPDATE, instance)
            // trigger React update
            setTick(+new Date())
            invokeLifeCycle(LifecycleHooks.UPDATED, instance)
          })
        },
        { deep: true, flush: 'post' },
      )
    })

    return () => {
      unmountInstance(id)
    }
  }, [])

  return state as never
}
