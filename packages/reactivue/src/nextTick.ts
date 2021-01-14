export function nextTick(fn?: Function) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      fn && fn()
      resolve()
    }, 0)
  })
}
