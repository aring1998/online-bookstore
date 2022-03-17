import { IsEnum, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { BaseResDTO, BasePageDataDTO } from 'src/common/utils/base.dto'
import { DelFlagEnum } from 'src/common/enums/common.enums'
import { $enum } from 'ts-enum-util'

class OrderDetailBaseDTO {
  @ApiProperty({ example: 4, description: '分类id' })
  @IsNumber()
  categoryId?: number

  @ApiProperty({ example: 5, description: '商品id' })
  @IsNumber()
  commodityId?: number

  @ApiProperty({ example: 2, description: '商品数量' })
  @IsNumber()
  commodityNum?: number

  @ApiProperty({ example: 16.5, description: '商品价格' })
  @IsNumber()
  commodityPrice?: number
}
export class OrderDetailDTO extends OrderDetailBaseDTO {
  @ApiProperty({ example: 1, description: 'id' })
  id?: number

  @ApiProperty({ example: 4, description: '分类id' })
  orderId?: number

  @ApiProperty({ enum: $enum(DelFlagEnum).getValues(), description: '失效标识' })
  @IsEnum({ Common: 0, Deleted: 1 })
  delFlag?: number
}

class OrderDetailPageDTO extends OrderDetailDTO {
  @ApiProperty({ example: '分类名', description: '名著' })
  categoryName: string

  @ApiProperty({ example: 'aring', description: '用户名' })
  username: string

  @ApiProperty({ example: '唐诗300首', description: '商品名' })
  commodityName: string
}
export class OrderDetailPageData extends BasePageDataDTO {
  @ApiProperty({ type: [OrderDetailPageDTO] })
  records: OrderDetailPageDTO[]
}
export class OrderDetailPageResDTO extends BaseResDTO {
  @ApiProperty({ type: OrderDetailPageData, description: '分页数据' })
  data?: OrderDetailPageData
}

export class OrderDetailAddDTO extends OrderDetailBaseDTO {}
export class OrderDetailListDTO extends OrderDetailBaseDTO {
  @ApiProperty({ example: 4, description: '分类id' })
  @IsNumber()
  orderId?: number
}