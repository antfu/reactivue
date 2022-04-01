import { defineComponent } from 'reactivue'
import { ref } from '@vue/runtime-core'
import { useHead } from '@vueuse/head'

export const Head = defineComponent(
  () => {
    const title = ref(document.title)
    const setTitle = (val: string) => title.value = val

    useHead({ title })

    return { title, setTitle }
  },
  ({ title, setTitle }) => {
    return (
      <div className="card">
        <p>@vueuse/head - useHead</p>
        <div className="p-1">
          <input value={title} onChange={e => setTitle(e.target.value)} />
        </div>
      </div>
    )
  },
)
