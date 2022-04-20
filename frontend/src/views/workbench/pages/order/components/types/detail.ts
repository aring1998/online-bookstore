import { BasePageRes } from "@/utils/types"

export interface OrderDetailDTO {
  categoryId: number
  commodityId: number
  commodityNum: number
  commodityPrice: number
  id: number
  orderId: number
  delFlag: number
  categoryName: string
  username: string
  commodityName: string
}

export interface OrderDetailRes extends BasePageRes {
  records: OrderDetailDTO[]
}