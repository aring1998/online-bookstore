export const suc = <T>(data: T, message: string = 'success') => ({
  code: 0,
  data,
  message
})

export const fail = (message: string = 'fail')=> ({
  code: -1,
  message
})
