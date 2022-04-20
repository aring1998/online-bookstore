import { BasePageRes } from "@/utils/types"

export interface OrderDTO {
  id?: number
  userId?: number
  consignee?: string
  tel?: string
  receiveAddressCode?: number
  receiveDetailAddress?: string
  orderTime?: string
  orderType?: number
  delFlag?: number
  categoryName?: string
  username?: string
  commodityName?: string
}

export interface OrderApiRes extends BasePageRes {
  records: OrderDTO[]
}

export interface OrderListApiParams extends OrderDTO {
  publicationTimeStart?: string
  publicationTimeEnd?: string
}