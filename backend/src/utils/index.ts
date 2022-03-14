export const vaildParams = (obj: any) => {
  const res = {}
  for (let key in obj) {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') res[key] = obj[key]
  }
  return res
}

export const getPayload = <T extends object>(data: T, temp: string[]): T => {
  const res: T = Object()
  for (let key in data) {
    if (temp.includes(key) && data[key] !== undefined && data[key] !== null && (data[key] as unknown) !== '') res[key] = data[key]
  }
  return res
}
