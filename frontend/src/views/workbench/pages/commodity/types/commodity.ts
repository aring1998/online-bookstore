import { BasePageRes } from "@/utils/types"

export interface CommodityDTO {
  id?: number
  name?: string
  categoryId?: number
  price?: number
  author?: string
  press?: string
  publicationTime?: string
  words?: number
  introduce?: string
  imgUrl?: string
}

export interface CommodityApiRes extends BasePageRes {
  records: CommodityDTO[]
}
