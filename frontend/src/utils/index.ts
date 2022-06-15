// 节流
export function debounce(fn: Function, delay: number) {
  let timer: any = null
  return function () {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(fn, delay)
  }
}

export function getArrayLastElm<T>(array: Array<T>) {
  if (!(array instanceof Array)) throw new Error('param must be Array')
  return array[array.length - 1]
}
