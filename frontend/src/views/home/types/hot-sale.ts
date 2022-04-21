import { BasePageRes } from '@/utils/types'

export interface HotSaleDTO {
  id: number
  name: string
  categoryId: number
  price: number
  author: string
  press: string
  publicationTime: string
  words: number
  introduce: string
  imgUrl: string
  delFlag: number
  categoryName: string
  commodityNum: number
}

export interface HotSaleRes extends BasePageRes {
  records: HotSaleDTO[]
}
