import { createSignal } from 'solid-js'
import { Show } from 'solid-js/web'
import { Counter as Counter1 } from './basic/defineComponent'
import { Counter as Counter2 } from './basic/createSetup'
import { Counter as Counter3 } from './basic/useSetup'
import { Pinia } from './pinia/PiniaA'
import { Mouse } from './vueuse/useMouse'
import { Timestamp } from './vueuse/useTimestamp'
import { Draggable } from './vueuse/useDraggable'
import { Head } from './vueuse-head/head'
import { Query } from './villus/useQuery'

function App() {
  const c = createSignal(0)[0]
  const [show, setShow] = createSignal(true)
  return (
    <div>
      <div className="text-5xl font-thin text-gray-300 mt-10 mb-5 mx-1">
        <span style={{ color: '#66a6eb' }}>solid</span>i<span style={{ color: '#40b983' }}>vue</span> demo
      </div>

      <button onClick={() => setShow(!show())} className="mb-4">Toggle Component</button>

      <h2>Basic</h2>
      <div className="flex flex-wrap">
        <Show when={show()}>
          <Counter1 value={c()}/>
        </Show>
        <Counter2 value={c()}/>
        <Counter3 value={c()}/>
      </div>

      <h2>VueUse <a href="https://github.com/vueuse/vueuse" rel="noreferrer" target="_blank">📎</a></h2>
      <div className="flex flex-wrap">
        <Mouse/>
        <Timestamp/>
        <Head/>
        <Draggable/>
      </div>

      <div className="flex flex-wrap">
        <div className="w-full md:flex-1">
          <h2>Pinia <a href="https://github.com/posva/pinia" rel="noreferrer" target="_blank">📎</a></h2>
          <div className="flex">
            <Pinia/>
          </div>
        </div>
        <div className="w-full md:flex-1">
          <h2>Villus <a href="https://github.com/logaretm/villus" rel="noreferrer" target="_blank">📎</a></h2>
          <div className="flex">
            <Query/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
