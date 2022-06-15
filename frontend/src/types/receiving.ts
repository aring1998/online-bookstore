import { BasePageRes } from '@/utils/types'

export interface ReceivingDTO {
  id: number
  consignee: string
  receiveAddressCode: Array<number>
  receiveDetailAddress: string
  tel: string
  userId: number
}

interface ReceivingParams {
  id?: number
  consignee: string
  tel: string
  receiveDetailAddress: string
}

export interface ReceivingForm extends ReceivingParams {
  receiveAddressCode: Array<number>
}

export interface ReceivingApiParams extends ReceivingParams {
  receiveAddressCode: number
}

export interface ReceivingApiRes extends BasePageRes {
  records: ReceivingDTO[]
}
