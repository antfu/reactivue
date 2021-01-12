import { UnwrapRef, reactive, ref, readonly, unref } from '@vue/reactivity'
import { useState, useEffect } from 'react'
import { getNewInstanceId, createNewInstanceWithId, useInstanceScope, unmountInstance } from './component'
import { watch } from './watch'
import { invokeLifeCycle } from './lifecycle'
import { LifecycleHooks } from './types'

export function useSetup<State extends Record<any, any>, Props = {}>(
  setupFunction: (props: Props) => State,
  ReactProps?: Props,
): UnwrapRef<State> {
  const [id] = useState(getNewInstanceId)
  const setTick = useState(0)[1]

  const createState = () => {
    const props = reactive({ ...(ReactProps || {}) }) as any
    const instance = createNewInstanceWithId(id, props)

    useInstanceScope(id, () => {
      const setupState = setupFunction(readonly(props))
      const data = ref(setupState)

      invokeLifeCycle(LifecycleHooks.BEFORE_MOUNT)

      instance.data = data

      for (const key of Object.keys(setupState))
        instance.initialState[key] = unref(setupState[key])
    })

    return instance.data.value
  }

  // run setup function
  const [state, setState] = useState(createState)

  // sync props changes
  useEffect(() => {
    if (!ReactProps) return

    useInstanceScope(id, (instance) => {
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
    if (process.env.NODE_ENV === 'development') {
      let willCreateNewState = false

      useInstanceScope(id, (instance) => {
        if (!instance)
          return

        if (instance.willUnmount) {
          const props = Object.assign({}, (ReactProps || {})) as any
          const setup = setupFunction(readonly(props))

          for (const key of Object.keys(setup)) {
            if (willCreateNewState)
              break

            if (typeof instance.initialState[key] === 'function')
              willCreateNewState = instance.initialState[key].toString() !== setup[key].toString()
            else
              willCreateNewState = instance.initialState[key] !== unref(setup[key])
          }

          instance.willUnmount = false
        }
      })

      if (willCreateNewState)
        setState(createState())
    }

    useInstanceScope(id, (instance) => {
      if (!instance)
        return

      invokeLifeCycle(LifecycleHooks.MOUNTED)

      const { data } = instance
      watch(
        data,
        () => {
          /**
           * Prevent triggering rerender when component
           * is about to unmount or really unmounted
           */
          if (!instance.willUnmount) {
            useInstanceScope(id, () => {
              invokeLifeCycle(LifecycleHooks.BEFORE_UPDATE)
              // trigger React update
              setTick(+new Date())
              invokeLifeCycle(LifecycleHooks.UPDATED)
            })
          }
        },
        { deep: true, flush: 'post' },
      )
    })

    return () => {
      unmountInstance(id)
    }
  }, [])

  return state
}
