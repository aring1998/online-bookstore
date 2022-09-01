import { ApiProperty } from '@nestjs/swagger'
import { BaseResDTO } from 'src/common/utils/base.dto'

class UploadDTO {
  @ApiProperty({ example: '1646726623796-图片名.png', description: '文件名' })
  fileName: string

  @ApiProperty({ example: 'https://source.aring.cc/upload//1646726623796-图片名.png', description: '文件地址' })
  fileUrl: string

  @ApiProperty({ example: 1200, description: '文件大小' })
  fileSize: number
}

export class UploadResDTO extends BaseResDTO {
  @ApiProperty({ type: UploadDTO, description: '文件信息' })
  data?: UploadDTO
}

export class UploadParamDTO {
  @ApiProperty({ type: 'file', format: 'binary' })
  file: Express.Multer.File
}
