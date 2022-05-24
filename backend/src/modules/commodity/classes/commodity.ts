import { IsNotEmpty, IsEnum, IsNumber, IsOptional, IsDateString, Max } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { BaseResDTO, BasePageDTO, BasePageDataDTO } from 'src/common/utils/base.dto'
import { DelFlagEnum } from 'src/common/enums/common.enums'
import { $enum } from 'ts-enum-util'

class CommodityBaseDTO {
  @ApiProperty({ example: '鲁滨逊漂流记', description: '商品名称' })
  @IsNotEmpty({ message: '商品名称不能为空' })
  name?: string

  @ApiProperty({ example: 1, description: '分类id' })
  @IsNotEmpty({ message: '分类不能为空' })
  categoryId?: number

  @ApiProperty({ example: 22.02, description: '价格' })
  @IsNotEmpty({ message: '价格不能为空' })
  price?: number

  @ApiProperty({ example: '丹尼尔·笛福', description: '作者', required: false })
  @IsNotEmpty({ message: '作者名不能为空' })
  author?: string

  @ApiProperty({ example: '上海交通大学出版社', description: '出版社', required: false })
  press?: string

  @ApiProperty({ example: '2022-03-03', description: '出版时间', required: false })
  @IsOptional()
  @IsDateString()
  publicationTime?: string

  @ApiProperty({ example: 1200000, description: '字数', required: false })
  @IsOptional()
  @Max(100000000)
  words?: number

  @ApiProperty({ example: '该作讲述了···', description: '介绍', required: false })
  introduce?: string

  @ApiProperty({ example: 'https://source.aring.cc/upload/LBXPLJ.png', description: '商品图片' })
  @IsNotEmpty()
  imgUrl?: string
}
export class CommodityDTO extends CommodityBaseDTO {
  @ApiProperty({ example: 1, description: 'id' })
  id?: number

  @ApiProperty({ enum: $enum(DelFlagEnum).getValues(), description: '失效标识', required: false })
  @IsEnum({ Common: 0, Deleted: 1 })
  delFlag?: number
  
  @ApiProperty({ example: '名著', description: '分类名', required: false })
  categoryName?: string
}

export class CommodityResDTO extends BaseResDTO {
  @ApiProperty({ type: CommodityDTO, description: '商品信息' })
  data?: CommodityDTO
}
class CommodityHotSaleDTO extends CommodityDTO {
  @ApiProperty({ example: 1, description: '下单数量', required: false })
  commodityNum: number
}

export class CommodityPageData extends BasePageDataDTO {
  @ApiProperty({ type: [CommodityDTO] })
  records: CommodityDTO[]
}
export class CommodityPageResDTO extends BaseResDTO {
  @ApiProperty({ type: CommodityPageData, description: '分页数据' })
  data?: CommodityPageData
}
export class CommodityHotSalePageData extends BasePageDataDTO {
  @ApiProperty({ type: [CommodityHotSaleDTO] })
  records: CommodityHotSaleDTO[]
}
export class CommodityHotSalePageResDTO extends BaseResDTO {
  @ApiProperty({ type: CommodityHotSalePageData, description: '分页数据' })
  data?: CommodityHotSalePageData
}

export class CommodityAddDTO extends CommodityBaseDTO {}
export class CommodityListDTO extends BasePageDTO {
  @ApiProperty({ example: 1, description: '商品id', required: false })
  id: number

  @ApiProperty({ example: '鲁滨逊漂流记', description: '商品名称', required: false })
  name: string

  @ApiProperty({ example: 1, description: '分类id', required: false })
  categoryId: number

  @ApiProperty({ example: '丹尼尔·笛福', description: '作者', required: false })
  author: string

  @ApiProperty({ example: '1970-01-01', description: '出版日期开始时间', required: false })
  @IsOptional()
  @IsDateString()
  publicationTimeStart: string

  @ApiProperty({ example: '2022-12-31', description: '出版日期结束时间', required: false })
  @IsOptional()
  @IsDateString()
  publicationTimeEnd: string
}
export class CommodityUpdateDTO extends CommodityBaseDTO {
  @ApiProperty({ example: 1, description: 'id' })
  @IsNumber()
  id: number
}