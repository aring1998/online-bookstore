import { IsNotEmpty, IsEnum, IsNumber, IsOptional, IsDateString } from 'class-validator'
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
  publicationTime?: string

  @ApiProperty({ example: 1200000, description: '字数', required: false })
  words?: number

  @ApiProperty({ example: '该作讲述了···', description: '出版社', required: false })
  introduce?: string

  @ApiProperty({ example: 'https://source.aring.cc/upload/LBXPLJ.png', description: '商品图片', required: false })
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

export class CommodityPageData extends BasePageDataDTO {
  @ApiProperty({ type: [CommodityDTO] })
  records: CommodityDTO[]
}
export class CommodityPageResDTO extends BaseResDTO {
  @ApiProperty({ type: CommodityPageData, description: '分页数据' })
  data?: CommodityPageData
}

export class CommodityAddDTO extends CommodityBaseDTO {}
export class CommodityListDTO extends BasePageDTO {
  @ApiProperty({ example: '鲁滨逊漂流记', description: '商品名称' })
  name: string

  @ApiProperty({ example: 1, description: '分类id' })
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
