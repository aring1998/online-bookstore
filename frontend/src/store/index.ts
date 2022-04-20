import { defineStore } from 'pinia'
import { useUserStore } from './modules/user'
const useStore = () => {
  return {
    user: useUserStore,
    loading: false
  }
}
export default useStore