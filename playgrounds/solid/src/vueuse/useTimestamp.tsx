import { defineComponent } from 'reactivue/solid'
import { useFps } from '@vueuse/core'

export const Timestamp = defineComponent(
  () => {
    return useFps()
  },
  (fps) => {
    return (
      <div className="card">
        <p>useFps </p>
        <div className="p-1">{fps}</div>
      </div>
    )
  },
)
