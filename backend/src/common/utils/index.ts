export const getPayload = <T extends object>(data: T, temp: (keyof T)[]): T => {
  const res: T = Object()
  for (let key in data) {
    if (temp.includes(key) && (data[key] ?? '') !== '') res[key] = data[key]
  }
  return res
}
