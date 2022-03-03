import { UserService } from '../user/user.service'

export const vaildParams = (obj: any) => {
  const res = {}
  for (let key in obj) {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') res[key] = obj[key]
  }
  return res
}

export const vaildAuth = () => {
  
}