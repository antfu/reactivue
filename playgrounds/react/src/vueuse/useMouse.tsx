import { defineComponent } from 'reactivue'
import { useMouse } from '@vueuse/core'

export const Mouse = defineComponent(
  () => {
    return useMouse()
  },
  ({ x, y }) => {
    return (
      <div className="card">
        <p>useMouse</p>
        <div className="p-1">{x} x {y}</div>
      </div>
    )
  },
)
