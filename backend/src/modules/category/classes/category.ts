import { IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'
import { BaseResDTO, BasePageDTO, BasePageDataDTO } from 'src/common/utils/base.dto';
import { DelFlagEnum } from 'src/common/enums/common.enums';
import { $enum } from 'ts-enum-util';

export class CategoryDTO {
  @ApiProperty({ example: 1, description: 'id' })
  id?: number

  @ApiProperty({ example: '名著', description: '分类名称' })
  name?: string

  @ApiProperty({ enum: $enum(DelFlagEnum).getValues(), description: '失效标识' })
  @IsEnum({ Common: 0, Deleted: 1 })
  delFlag?: number
}

export class CategoryResDTO extends BaseResDTO {
  @ApiProperty({ type: CategoryDTO, description: '分类信息' })
  data?: CategoryDTO
}

export class CategoryPageData extends BasePageDataDTO {
  @ApiProperty({ type: [CategoryDTO] })
  records: CategoryDTO[]
}

export class CategoryPageResDTO extends BaseResDTO {
  @ApiProperty({ type: CategoryPageData, description: '分页数据' })
  data?: CategoryPageData
}

export class CategoryAddDTO {
  @ApiProperty({ example: '名著', description: '分类名' })
  @IsNotEmpty({ message: '分类名不能为空' })
  name: string
}

export class CategoryListDTO extends BasePageDTO {
  @ApiProperty({ example: '名著', description: '分类名', required: false })
  name: string
}

export class CategoryUpdateDTO extends CategoryAddDTO {
  @ApiProperty({ example: 3, description: 'id' })
  @IsNumber()
  id: number
}