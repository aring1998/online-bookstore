import { IsNotEmpty, IsEnum, IsNumber, IsPhoneNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { BaseResDTO, BasePageDTO } from 'src/utils/base.dto'

class OrderBaseDTO {
  @ApiProperty({ example: 1, description: '用户id' })
  @IsNumber()
  userId?: number

  @ApiProperty({ example: 4, description: '分类id' })
  @IsNumber()
  categoryId?: number

  @ApiProperty({ example: 5, description: '商品id' })
  @IsNumber()
  commodityId?: number

  @ApiProperty({ example: 'aring', description: '收货人' })
  @IsNotEmpty()
  consignee?: string

  @ApiProperty({ example: '13000000000', description: '联系方式' })
  @IsNotEmpty()
  tel?: string

  @ApiProperty({ example: 350000, description: '收货地址编码' })
  @IsNumber()
  receiveAddressCode?: number

  @ApiProperty({ example: 'xx小区6栋601', description: '收货详细地址' })
  @IsNotEmpty()
  receiveDetailAddress?: string

  @ApiProperty({ example: '2022-01-01', description: '下单时间' })
  orderTime?: string

  @ApiProperty({ enum: [-1, 0, 1, 2], description: '订单状态(-1: 已取消; 0: 已下单; 1: 已发货; 2: 已完成)' })
  orderType?: number
}

export class OrderDTO extends OrderBaseDTO {
  @ApiProperty({ example: 1, description: 'id' })
  id?: number

  @ApiProperty({ example: '名著', description: '分类名称' })
  name?: string

  @ApiProperty({ enum: [0, 1], description: '失效标识' })
  @IsEnum({ Common: 0, Deleted: 1 })
  delFlag?: number
}

export class OrderResDTO extends BaseResDTO {
  @ApiProperty({ type: OrderDTO, description: '分类信息' })
  data?: OrderDTO
}

export class OrderPageDTO extends OrderDTO {
  @ApiProperty({ example: '分类名', description: '名著' })
  categoryName: string

  @ApiProperty({ example: 'aring', description: '用户名' })
  username: string

  @ApiProperty({ example: '唐诗300首', description: '商品名' })
  commodityName: string
}

class OrderPageData {
  @ApiProperty({ type: [OrderPageDTO] })
  data: OrderPageDTO[]
  @ApiProperty({ example: 1, description: '数据总数' })
  count: number
}

export class OrderPageResDTO extends BaseResDTO {
  @ApiProperty({ type: OrderPageData, description: '分页数据' })
  data?: OrderPageData
}

export class OrderAddDTO extends OrderBaseDTO {}

export class OrderListDTO extends BasePageDTO {
  @ApiProperty({ example: 'aring', description: '下单用户名', required: false })
  username: string

  @ApiProperty({ example: 'aring', description: '收货人', required: false })
  consignee: string

  @ApiProperty({ example: 1, description: '分类id', required: false })
  categoryId: number
  
  @ApiProperty({ example: '唐诗', description: '商品名(模糊查询)', required: false })
  commodityName: string
  
  @ApiProperty({ example: 350000, description: '收货地区', required: false })
  receiveAddressCode: number

  @ApiProperty({ example: '1970-01-01', description: '下单开始时间', required: false })
  orderTimeStart: string

  @ApiProperty({ example: '2022-12-31', description: '下单开始时间', required: false })
  orderTimeEnd: string
  
  @ApiProperty({ enum: [-1, 0, 1, 2], description: '订单状态(-1: 已取消; 0: 已下单; 1: 已发货; 2: 已完成)' })
  orderType: number
}

export class OrderUpdateDTO {
  @ApiProperty({ example: 3, description: 'id' })
  @IsNotEmpty()
  id: number
  
  @ApiProperty({ enum: [-1, 0, 1, 2], description: '订单状态(-1: 已取消; 0: 已下单; 1: 已发货; 2: 已完成)' })
  @IsNotEmpty()
  orderType: number
}
