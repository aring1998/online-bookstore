import { defineStore } from 'pinia'
import { useCommonStore } from './modules/common'
import { useUserStore } from './modules/user'
import { useShopStore } from './modules/shop'
const useStore = () => {
  return {
    user: useUserStore,
    common: useCommonStore,
    shop: useShopStore
  }
}
export default useStore
