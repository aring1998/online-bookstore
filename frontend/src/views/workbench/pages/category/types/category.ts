import { BasePageRes } from '@/utils/types'

export interface CategoryDTO {
  id?: number
  name?: string
  page?: number
  pageSize?: number
}
export interface CategoryAddApiParams {
  name: string
}
export interface CategoryListApiRes extends BasePageRes {
  records: CategoryDTO[]
}
