import { ApiProperty } from '@nestjs/swagger'
export class BaseResDTO {
  @ApiProperty({ example: 0, description: '校验码' })
  code: number

  @ApiProperty({ example: '成功', description: '相应信息' })
  message: string

  [key: string]: any
}

export class BasePageDTO {
  @ApiProperty({ example: 1, description: '页码', required: false, default: 1 })
  page: number

  @ApiProperty({ example: 30, description: '每页数量', required: false, default: 200 })
  pageSize: number
}