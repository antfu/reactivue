import React, { useState } from 'react'
import { render } from 'react-dom'
import { Counter2 } from './Counter2'

function App(Props: { name: string }) {
  const [c, s] = useState(0)
  return (
    <div>
      This is <span style={{color:"#53c2df"}} onClick={()=>s(c+1)}>React</span>, <br></br>
      but with <b style={{color:'#40b983'}}>Vue Composition API</b>
      <Counter2 value={c}/>
    </div>
  )
}

render(<App name="Jane" />, document.getElementById('app'))
