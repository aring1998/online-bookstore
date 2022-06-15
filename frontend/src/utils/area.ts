import areaCodeText from '@/assets/json/area-code-text.json'

export function cityCodeToText(val: number | string) {
  const codeData: any = areaCodeText
  const data = val.toString()
  if (data.includes('00')) return codeData[data]
  const province = `${data.slice(0, 2)}0000`
  const city = `${data.slice(0, 4)}00`
  return `${codeData[province]}-${codeData[city]}-${codeData[data]}`
}