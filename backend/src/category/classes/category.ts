import { IsNotEmpty, IsOptional, IsEnum, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'
import { BaseResDTO, BasePageDTO } from 'src/utils/base.dto';

export class CategoryDTO {
  @ApiProperty({ example: 1, description: 'id' })
  id?: number

  @ApiProperty({ example: '名著', description: '分类名称' })
  name?: string

  @ApiProperty({ enum: [0, 1], description: '失效标识' })
  @IsEnum({ Common: 0, Deleted: 1 })
  delFlag?: number
}

export class CategoryResDTO extends BaseResDTO {
  @ApiProperty({ type: CategoryDTO, description: '分类信息' })
  data?: CategoryDTO
}

class CategoryPageData {
  @ApiProperty({ type: [CategoryDTO] })
  data: CategoryDTO[]
  @ApiProperty({ example: 1, description: '数据总数' })
  count: number
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
  @IsNotEmpty({ message: 'id不能为空' })
  id: number
}