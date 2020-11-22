import { UnwrapRef, reactive, ref, readonly } from '@vue/reactivity'
import { useState, useEffect } from 'react'
import { getNewInstanceId, createNewInstanceWithId, useInstanceScope, unmountInstance } from './component'
import { watch } from './watch'
import { invokeLifeCycle } from './lifecycle'
import { LifecycleHooks } from './types'

export function useSetup<State, Props = {}>(
  setupFunction: (props: Props) => State,
  ReactProps?: Props,
): UnwrapRef<State> {
  const [id] = useState(getNewInstanceId)
  const setTick = useState(0)[1]

  // run setup function
  const [state] = useState(() => {
    const props = reactive({ ...(ReactProps || {}) }) as any
    const instance = createNewInstanceWithId(id, props)

    useInstanceScope(id, () => {
      const data = ref(setupFunction(readonly(props)))

      invokeLifeCycle(LifecycleHooks.BEFORE_MOUNT)

      instance.data = data
    })

    return instance.data.value
  })

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
    useInstanceScope(id, (instance) => {
      if (!instance)
        return

      invokeLifeCycle(LifecycleHooks.MOUNTED)

      const { data } = instance
      watch(
        data,
        () => {
          useInstanceScope(id, () => {
            invokeLifeCycle(LifecycleHooks.BEFORE_UPDATE)
            // trigger React update
            setTick(+new Date())
            invokeLifeCycle(LifecycleHooks.UPDATED)
          })
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
