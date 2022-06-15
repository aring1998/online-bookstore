import { AccountApiRes } from '@/components/top-bar/components/types/account'
import { defineStore } from 'pinia'
export const useUserStore = defineStore('user', {
  state: (): {
    token: string
    userInfo: Partial<AccountApiRes>
  } => {
    return {
      token: localStorage.getItem('token') || '',
      userInfo: {}
    }
  }
})
