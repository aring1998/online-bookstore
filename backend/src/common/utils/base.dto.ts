import { ApiProperty } from '@nestjs/swagger'
import { IsNumberString, IsOptional, IsPositive, MaxLength, MinLength, NotContains } from 'class-validator';
export class BaseResDTO {
  @ApiProperty({ example: 0, description: '校验码' })
  code: number

  @ApiProperty({ example: '成功', description: '相应信息' })
  message: string;

  [key: string]: any
}

export class BasePageDTO {
  @ApiProperty({ example: 1, description: '页码', required: false, default: 1 })
  @IsOptional()
  @IsNumberString()
  @NotContains('-')
  @MinLength(1)
  @MaxLength(3)
  page: number

  @ApiProperty({ example: 30, description: '每页数量', required: false, default: 200 })
  @IsOptional()
  @IsNumberString()
  @NotContains('-')
  @MinLength(1)
  @MaxLength(3)
  pageSize: number
}

export class BasePageDataDTO extends BasePageDTO {
  @ApiProperty({ example: 1, description: '数据总数' })
  total?: number
}
