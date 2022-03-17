import { IsEnum, IsNumber, IsMobilePhone, IsString, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { BaseResDTO, BasePageDTO, BasePageDataDTO } from 'src/common/utils/base.dto'
import { $enum } from 'ts-enum-util'
import { DelFlagEnum, OrderTypeEnum } from 'src/common/enums/common.enums'

class ReceivingBaseDTO {
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
}
export class ReceivingDTO extends ReceivingBaseDTO {
  @ApiProperty({ example: 1, description: 'id' })
  id?: number

  @ApiProperty({ enum: $enum(DelFlagEnum).getValues(), description: '失效标识' })
  @IsEnum({ Common: 0, Deleted: 1 })
  delFlag?: number
}

export class ReceivingResDTO extends BaseResDTO {
  @ApiProperty({ type: ReceivingDTO, description: '分类信息' })
  data?: ReceivingDTO
}

export class ReceivingPageData extends BasePageDataDTO {
  @ApiProperty({ type: [ReceivingDTO] })
  records: ReceivingDTO[]
}
export class ReceivingPageResDTO extends BaseResDTO {
  @ApiProperty({ type: ReceivingPageData, description: '分页数据' })
  data?: ReceivingPageData
}

export class ReceivingAddDTO extends ReceivingBaseDTO {}
export class ReceivingListDTO extends BasePageDTO {
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
  receivingTimeStart: string

  @ApiProperty({ example: '2022-12-31', description: '下单开始时间', required: false })
  receivingTimeEnd: string

  @ApiProperty({ enum: $enum(OrderTypeEnum).getValues(), description: '订单状态(-1: 已取消; 0: 已下单; 1: 已发货; 2: 已完成)' })
  receivingType: number
}
export class ReceivingUpdateDTO {
  @ApiProperty({ example: 3, description: 'id' })
  @IsNumber()
  id: number

  @ApiProperty({ example: 'aring', description: '收货人' })
  @IsOptional()
  @IsString()
  consignee?: string

  @ApiProperty({ example: '13000000000', description: '联系方式' })
  @IsOptional()
  @IsMobilePhone()
  tel?: string

  @ApiProperty({ example: 350000, description: '收货地址编码' })
  @IsOptional()
  @IsNumber()
  receiveAddressCode?: number

  @ApiProperty({ example: 'xx小区6栋601', description: '收货详细地址' })
  @IsOptional()
  @IsString()
  receiveDetailAddress?: string
}
