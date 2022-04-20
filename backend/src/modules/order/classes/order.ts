import { IsEnum, IsNumber, IsArray, ArrayNotEmpty, ValidateNested, IsMobilePhone, IsString, IsOptional, IsDateString } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { BaseResDTO, BasePageDTO, BasePageDataDTO } from 'src/common/utils/base.dto'
import { OrderDetailAddDTO } from 'src/modules/order-detail/classes/order-detail.'
import { $enum } from 'ts-enum-util'
import { DelFlagEnum, OrderTypeEnum } from 'src/common/enums/common.enums'

class OrderBaseDTO {
  @ApiProperty({ example: 1, description: '用户id' })
  userId?: number

  @ApiProperty({ example: 'aring', description: '收货人' })
  @IsString()
  consignee?: string

  @ApiProperty({ example: '13000000000', description: '联系方式' })
  @IsMobilePhone()
  tel?: string

  @ApiProperty({ example: 350000, description: '收货地址编码' })
  @IsNumber()
  receiveAddressCode?: number

  @ApiProperty({ example: 'xx小区6栋601', description: '收货详细地址' })
  @IsString()
  receiveDetailAddress?: string

  @ApiProperty({ example: '2022-01-01', description: '下单时间' })
  orderTime?: string

  @ApiProperty({ enum: $enum(OrderTypeEnum).getValues(), description: '订单状态(-1: 已取消; 0: 已下单; 1: 已发货; 2: 已完成)' })
  orderType?: number
}
export class OrderDTO extends OrderBaseDTO {
  @ApiProperty({ example: 1, description: 'id' })
  id?: number

  @ApiProperty({ enum: $enum(DelFlagEnum).getValues(), description: '失效标识' })
  @IsEnum({ Common: 0, Deleted: 1 })
  delFlag?: number
}

export class OrderResDTO extends BaseResDTO {
  @ApiProperty({ type: OrderDTO, description: '分类信息' })
  data?: OrderDTO
}

class OrderPageDTO extends OrderDTO {
  @ApiProperty({ example: '分类名', description: '名著' })
  categoryName: string

  @ApiProperty({ example: 'aring', description: '用户名' })
  username: string

  @ApiProperty({ example: '唐诗300首', description: '商品名' })
  commodityName: string
}
export class OrderPageData extends BasePageDataDTO {
  @ApiProperty({ type: [OrderPageDTO] })
  records: OrderPageDTO[]
}
export class OrderPageResDTO extends BaseResDTO {
  @ApiProperty({ type: OrderPageData, description: '分页数据' })
  data?: OrderPageData
}

export class OrderAddDTO extends OrderBaseDTO {
  @ApiProperty({ type: [OrderDetailAddDTO], description: '下单清单' })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderDetailAddDTO)
  orderList?: OrderDetailAddDTO[]
}

export class OrderListDTO extends BasePageDTO {
  @ApiProperty({ example: 'aring', description: '下单用户名', required: false })
  username: string

  @ApiProperty({ example: 'aring', description: '收货人', required: false })
  consignee: string

  @ApiProperty({ example: 350000, description: '收货地区', required: false })
  receiveAddressCode: number

  @ApiProperty({ example: '1970-01-01', description: '下单开始时间', required: false })
  @IsOptional()
  @IsDateString()
  orderTimeStart: string

  @ApiProperty({ example: '2022-12-31', description: '下单开始时间', required: false })
  @IsOptional()
  @IsDateString()
  orderTimeEnd: string

  @ApiProperty({ enum: $enum(OrderTypeEnum).getValues(), description: '订单状态(-1: 已取消; 0: 已下单; 1: 已发货; 2: 已完成)', required: false })
  orderType: number
}
export class OrderUpdateDTO {
  @ApiProperty({ example: 3, description: 'id' })
  @IsNumber()
  id: number

  @ApiProperty({ enum: $enum(OrderTypeEnum).getValues(), description: '订单状态(-1: 已取消; 0: 已下单; 1: 已发货; 2: 已完成)' })
  @IsNumber()
  orderType: number
}
