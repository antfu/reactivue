import React, { useState } from 'react'
import { render } from 'react-dom'
import { Counter as Counter1 } from './Counter1'
import { Counter as Counter2 } from './Counter2'
import { Pinia as Pinia1 } from './Pinia1'
import { Pinia as Pinia2 } from './Pinia2'

function App(Props: { name: string }) {
  const [c, s] = useState(0)
  const [show, setShow] = useState(true)
  return (
    <div>
      This is <span style={{ color: '#53c2df' }} onClick={() => s(c + 1)}>React</span>, <br></br>
      but with <b style={{ color: '#40b983' }}>Vue Composition API</b><br/>

      <button onClick={() => setShow(!show)}>Toggle Counter1</button>

      { show ? <Counter1 value={c}/> : null}
      <Counter2 value={c}/>

      <Pinia1/>
      <Pinia2/>
    </div>
  )
}

render(<App name="Jane" />, document.getElementById('app'))
