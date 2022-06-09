import { BasePageRes } from "@/utils/types"

export interface CommodityDTO {
  id?: number
  name?: string
  categoryId?: number | string
  price?: number
  author?: string
  press?: string
  publicationTime?: string
  words?: number
  introduce?: string
  imgUrl?: string
  categoryName?: string
  num?: number
}

export interface CommodityApiRes extends BasePageRes {
  records: CommodityDTO[]
}

export interface CommodityListApiParams extends CommodityDTO {
  publicationTimeStart?: string
  publicationTimeEnd?: string
}