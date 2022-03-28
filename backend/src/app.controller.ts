import { Controller, Post, UploadedFile, UseInterceptors, Headers, Get } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { createWriteStream } from 'fs'
import { join } from 'path'
import { UserService } from 'src/modules/user/user.service'
import { suc, fail } from 'src/common/utils/response'
import { ApiResponse, ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger'
import { UploadResDTO } from './common/utils/app.dto'

@ApiTags('公共')
@Controller()
export class AppController {
  constructor(private readonly userService: UserService) {}
  @Get()
  @ApiOperation({ summary: '服务端首页' })
  getHello() {
    return `Hellow! Welcome to Online Bookstore API <br> <a href="https://online-bookstore.aring.cc/api">Read Swagger</a>`
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: '上传文件' })
  @ApiParam({ name: 'file', example: '(文件)', description: '文件' })
  @ApiResponse({ status: 0, type: UploadResDTO })
  async upload(@Headers('token') token: string, @UploadedFile() file: Express.Multer.File) {
    if ((await this.userService.vaildAuth({ token })) !== 1) return fail('您没有权限')
    if (!file) return fail('未接收到文件')
    const fileName = `${Date.now()}-${file.originalname}`
    const writeFile = createWriteStream(join('/', 'home', 'aring', 'upload', fileName))
    writeFile.write(file.buffer)
    return suc(
      {
        fileName,
        fileUrl: `https://source.aring.cc/upload/${fileName}`,
        fileSize: file.size
      },
      '上传成功'
    )
  }
}
