import { CommodityDTO } from '@/views/workbench/pages/commodity/types/commodity'
import { defineStore } from 'pinia'
interface ShopCartListDTO extends CommodityDTO {
  num: number
}
export const useShopStore = defineStore('shop', {
  state: (): {
    shopCartList: ShopCartListDTO[]
  } => {
    return {
      shopCartList: []
    }
  }
})
