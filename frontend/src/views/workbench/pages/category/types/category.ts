import { BasePageRes } from "@/utils/types"

export interface CategoryDTO {
  id?: number,
  name?: string
}
export interface CategoryAddApiParams {
  name: string
}
export interface CategoryListApiRes extends BasePageRes {
  records: CategoryDTO[]
}
