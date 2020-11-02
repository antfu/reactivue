export function nextTick(fn?: Function) { 
  return new Promise((resolve) => { 
    setTimeout(() => { 
      fn && fn()
      resolve()
    }, 0)
  })
}
