import { IsDateString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UploadDTO {
  @ApiProperty({ example: 1, description: '用户id' })
  userId?: number

  @ApiProperty({ example: 'https://source.aring.cc/upload/1650338181462-c83d70cf3bc79f3d5245df72b3a1cd11738b29cf.jpg', description: '文件地址' })
  fileUrl?: string

  @ApiProperty({ example: 4580, description: '文件大小' })
  fileSize?: number

  @ApiProperty({ example: '2022-01-01 00:00:00', description: '创建日期' })
  @IsDateString()
  created?: string
}
