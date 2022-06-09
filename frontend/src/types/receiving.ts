import { BasePageRes } from "@/utils/types"

export interface ReceivingDTO {
  id: number
  consignee: string
  receiveAddressCode: number
  receiveDetailAddress: string
  tel: string
  userId: number
}

export interface ReceivingApiRes extends BasePageRes {
  records: ReceivingDTO[]
}
