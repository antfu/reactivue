import { defineComponent } from 'reactivue/solid'
import { ref, watch } from '@vue/runtime-core'
import { useDraggable } from '@vueuse/core'

export const Draggable = defineComponent(
  () => {
    const el = ref<HTMLElement | null>(null)
    const setEl = (val: HTMLElement | null) => el.value = val
    // `style` will be a helper computed for `left: ?px; top: ?px;`
    const { x, y, style } = useDraggable(el, {
      initialValue: { x: 40, y: 40 },
    })
    watch([el, style], () => {
      if (el.value)
        el.value.setAttribute('style', `z-index:99;user-select: none;position: fixed;${style.value}`)
    })

    return { el, x, y, style, setEl }
  },
  ({ x, y, setEl }) => {
    return (
      <div className="card hidden lg:block">
        <p>useDraggable</p>
        <div ref={setEl} className="bg-dark-50 rounded p-4 whitespace-nowrap">
          Drag me! I am at { x }, { y }
        </div>
        <div className="text-gray-400">It&#39;s on top left corner 👀</div>
      </div>
    )
  },
)
