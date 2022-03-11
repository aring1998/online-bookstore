import { Controller, Post, Body, ValidationPipe, Get, Query, Param, Headers } from '@nestjs/common'
import { ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger'
import { suc, fail } from 'src/utils/response'
import { ReceivingService } from './receiving.service'
import { UserService } from 'src/user/user.service'
import { ReceivingResDTO, ReceivingPageResDTO, ReceivingAddDTO, ReceivingListDTO, ReceivingUpdateDTO, ReceivingDTO, ReceivingDelDTO } from './classes/receiving'
import { BasePageDTO } from 'src/utils/base.dto'

@ApiTags('收货地址')
@Controller('receiving')
export class ReceivingController {
  constructor(private readonly receivingService: ReceivingService, private readonly userService: UserService) {}

  @Get('mine')
  @ApiOperation({ summary: '我的收货地址' })
  @ApiResponse({ status: 0, type: ReceivingPageResDTO })
  async mine(@Headers('token') token: string, @Param(ValidationPipe) params: BasePageDTO): Promise<ReceivingPageResDTO> {
    const userInfo = await this.userService.findOne({ token })
    if (!userInfo) return fail('请先登录')
    const { page, pageSize } = params
    const data = await this.receivingService.findByPage({
      userId: userInfo.id,
      page,
      pageSize,
      delFlag: 0
    })
    return suc(data, '')
  }

  @Post('add')
  @ApiOperation({ summary: '添加收货地址' })
  @ApiResponse({ status: 0, type: ReceivingResDTO })
  async add(@Headers('token') token: string, @Body(ValidationPipe) body: ReceivingAddDTO): Promise<ReceivingResDTO> {
    const userInfo = await this.userService.findOne({ token })
    if (!userInfo) return fail('请先登录')
    const { consignee, tel, receiveAddressCode, receiveDetailAddress } = body
    const data = await this.receivingService.save({
      userId: userInfo.id,
      consignee,
      tel,
      receiveAddressCode,
      receiveDetailAddress,
    })
    return suc(data, '添加收货地址成功')
  }

  @Post('del/:id')
  @ApiOperation({ summary: '删除收货地址' })
  @ApiResponse({ status: 0, type: ReceivingResDTO })
  async del(@Headers('token') token: string, @Param('id') id: number): Promise<ReceivingResDTO> {
    const userInfo = await this.userService.findOne({ token })
    if (!userInfo) return fail('请先登录')
    const res = await this.receivingService.findOne({ id, userId: userInfo.id, delFlag: 0 })
    if (!res) return fail('未查询到数据')
    res.delFlag = 1
    const data = await this.receivingService.save(res)
    return suc(data, '删除收货地址成功')
  }

  @Post('update')
  @ApiOperation({ summary: '修改收货地址' })
  @ApiResponse({ status: 0, type: ReceivingResDTO })
  async update(@Headers('token') token: string, @Body(ValidationPipe) body: ReceivingUpdateDTO): Promise<ReceivingResDTO> {
    const userInfo = await this.userService.findOne({ token })
    if (!userInfo) return fail('请先登录')
    const { id, consignee, tel, receiveAddressCode, receiveDetailAddress } = body
    const res = await this.receivingService.findOne({ id, userId: userInfo.id, delFlag: 0 })
    if (!res) return fail('未查询到数据')
    const params = {consignee, tel, receiveAddressCode, receiveDetailAddress}
    for (let key in params) {
      res[key] = params[key]
    }
    const data = await this.receivingService.save(res)
    return suc(data, '修改收货地址成功')
  }
}
