export function getDictLabel(value: number | string, dict: { value: number | string; label: string }[]) {
  for (let i of dict) {
    if (i.value === value) return i.label
  }
  return ''
}

export const orderType = [
  {
    value: -1,
    label: '已取消'
  },
  {
    value: 0,
    label: '已下单'
  },
  {
    value: 1,
    label: '已发货'
  },
  {
    value: 2,
    label: '已完成'
  }
]