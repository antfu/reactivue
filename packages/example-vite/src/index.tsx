import React, { useState } from 'react'
import './main.css'
import { render } from 'react-dom'
import { Counter as Counter1 } from './basic/defineComponent'
import { Counter as Counter2 } from './basic/useSetup'
import { Counter as Counter3 } from './basic/createSetup'
import { Pinia as Pinia1 } from './pinia/PiniaA'
import { Pinia as Pinia2 } from './pinia/PiniaB'
import { Mouse } from './vueuse/useMouse'
import { Battery } from './vueuse/useBattery'

function App(Props: { name: string }) {
  const [c, s] = useState(0)
  const [show, setShow] = useState(true)
  return (
    <div>
      <div className="text-2xl font-thin text-gray-500 mb-5 mx-1">
        <span style={{ color: '#53c2df' }} onClick={() => s(c + 1)}>react</span>i<span style={{ color: '#40b983' }}>vue</span> demo
      </div>

      <button onClick={() => setShow(!show)} className="mb-4">Toggle Component</button>

      <h2>Basic</h2>
      <div className="flex">
        { show ? <Counter1 value={c}/> : null}
        <Counter2 value={c}/>
        <Counter3 value={c}/>
      </div>

      <h2>Pinia <a href="https://github.com/posva/pinia" rel="noreferrer" target="_blank">📎</a></h2>
      <div className="flex">
        <Pinia1/>
        <Pinia2/>
      </div>

      <h2>VueUse <a href="https://github.com/antfu/vueuse" rel="noreferrer" target="_blank">📎</a></h2>
      <div className="flex">
        <Mouse/>
        <Battery/>
      </div>
    </div>
  )
}

render(<App name="Jane" />, document.getElementById('app'))
