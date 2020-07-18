import { useEffect, useState } from 'react'
import {
  reactive,
  ref,
  watch,
  Ref,
  UnwrapRef,
  readonly,
} from '@vue/runtime-dom'

let _id = 0
const _vueState: Record<
  number,
  {
    props: any
    data: Ref<any>
  }
> = {}

export function useVue<State, Props = {}>(
  setupFunction: (props: Props) => State,
  Props: Props
): UnwrapRef<State> {
  const [id] = useState(() => _id++)
  const setTick = useState(0)[1]

  const [state] = useState(() => {
    const props = reactive({ ...(Props || {}) }) as any

    // TODO: bind instance
    const data = ref(setupFunction(readonly(props)))

    _vueState[id] = {
      props,
      data,
    }

    return data.value
  })

  useEffect(() => {
    if (!Props) return

    // copy props from react to vue, could be better
    const { props } = _vueState[id]
    for (const key of Object.keys(Props)) {
      props[key] = (Props as any)[key]
    }
  }, [Props])

  useEffect(() => {
    const { data } = _vueState[id]
    watch(
      data,
      () => {
        // tell react to update
        setTick(+new Date())
      },
      { deep: true, flush: 'post' }
    )

    return () => {
      delete _vueState[id]
      // TODO: call onMounted
    }
  }, [])

  return state
}

export function define<PropsType, State>(
  setupFunction: (props: PropsType) => State,
  renderFunction: (state: UnwrapRef<State>) => JSX.Element
): (props: PropsType) => JSX.Element {
  return (props: PropsType) => {
    const state = useVue(setupFunction, props)
    return renderFunction(state)
  }
}
