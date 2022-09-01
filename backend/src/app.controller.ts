import { Controller, Post, UploadedFile, UseInterceptors, Headers, Get, Body } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { createWriteStream } from 'fs'
import { join } from 'path'
import { UserService } from 'src/modules/user/user.service'
import { suc, fail } from 'src/common/utils/response'
import { ApiResponse, ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger'
import { UploadParamDTO, UploadResDTO } from './common/utils/app.dto'
import { UploadService } from './modules/upload/upload.service'
import * as moment from 'moment'

@ApiTags('公共')
@Controller()
export class AppController {
  constructor(private readonly userService: UserService, private readonly uploadService: UploadService) {}
  @Get()
  @ApiOperation({ summary: '服务端首页' })
  getHello() {
    return `Hellow! Welcome to Online Bookstore API <br> <a href="https://online-bookstore.aring.cc/swagger/">Read Swagger</a>`
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: '上传文件' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 0, type: UploadResDTO })
  async upload(@Headers('token') token: string, @UploadedFile() file: Express.Multer.File, @Body() _: UploadParamDTO) {
    const userInfo = await this.userService.findOne({ token })
    if (userInfo.auth !== 1) return fail('您没有权限')
    if (!file) return fail('未接收到文件')
    if (file.size > 5120000) return fail('文件过大，请上传5MB以下的图片')

    const fileList = await this.uploadService.findByDate({
      userId: userInfo.id,
      startDate: moment().format('YYYY-MM-DD 00:00:00'),
      endDate: moment().format('YYYY-MM-DD 23:59:59')
    })
    if (fileList.total >= userInfo.uploadCount) return fail('该用户今日上传次数已达上限，如需独立上传空间请联系项目作者')

    const fileName = `${moment().format('YYYY-MM-DD HH:mm:ss.SSS')}-${file.originalname}`
    const writeFile = createWriteStream(join('/', 'home', 'aring', 'upload', fileName))
    writeFile.write(file.buffer)
    const fileUrl = `https://source.aring.cc/upload/${fileName}`
    await this.uploadService.save({
      userId: userInfo.id,
      fileUrl,
      fileSize: file.size,
      created: moment().format('YYYY-MM-DD HH:mm:ss')
    })
    return suc(
      {
        fileName,
        fileUrl,
        fileSize: file.size
      },
      '上传成功'
    )
  }
}
