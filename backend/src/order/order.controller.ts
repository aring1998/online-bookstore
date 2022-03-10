import { Controller, Post, Body, ValidationPipe, Get, Query, Param, Headers } from '@nestjs/common'
import { ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger'
import { suc, fail } from 'src/utils/response'
import { OrderService } from './order.service'
import { UserService } from 'src/user/user.service'
import { vaildParams } from 'src/utils'
import { OrderResDTO, OrderPageResDTO, OrderAddDTO, OrderListDTO, OrderUpdateDTO } from './classes/order'
import * as moment from 'moment'
interface PageParams {
  page: number
  pageSize: number
  [propName: string]: any
}

@ApiTags('订单')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService, private readonly userService: UserService) {}

  @Post('add')
  @ApiOperation({ summary: '下单' })
  @ApiResponse({ status: 0, type: OrderResDTO })
  async add(@Headers('token') token: string, @Body(ValidationPipe) body: OrderAddDTO): Promise<OrderResDTO> {
    const userInfo = await this.userService.findOne({ token })
    if (!userInfo) return fail('请先登录')
    const { categoryId, commodityId, consignee, tel, receiveAddressCode, receiveDetailAddress } = body
    const data = await this.orderService.save({
      userId: userInfo.id,
      categoryId,
      commodityId,
      consignee,
      tel,
      receiveAddressCode,
      receiveDetailAddress,
      orderTime: moment().format('YYYY-MM-DD HH:mm:ss')
    })
    return suc(data, '下单成功')
  }

  @Post('list')
  @ApiOperation({ summary: '订单列表' })
  @ApiResponse({ status: 0, type: OrderPageResDTO })
  async list(@Headers('token') token: string, @Body(ValidationPipe) body: OrderListDTO): Promise<OrderPageResDTO> {
    if ((await this.userService.vaildAuth({ token })) !== 1) return fail('您没有权限')
    const { username, consignee, categoryId, commodityName, receiveAddressCode, orderTimeStart, orderTimeEnd, orderType, page, pageSize } = body
    const data = await this.orderService.findByPage({
      username,
      consignee,
      categoryId,
      commodityName,
      receiveAddressCode,
      orderTimeStart,
      orderTimeEnd,
      orderType,
      page,
      pageSize,
      delFlag: 0
    })
    return suc(data, '')
  }

  @Post('update')
  @ApiOperation({ summary: '修改订单状态' })
  @ApiResponse({ status: 0, type: OrderResDTO })
  async update(@Headers('token') token: string, @Body() body: OrderUpdateDTO): Promise<OrderResDTO> {
    if ((await this.userService.vaildAuth({ token })) !== 1) return fail('您没有权限')
    const { id, orderType } = body
    const res = await this.orderService.findOne({ id })
    if (!res) return fail('未查询到数据')
    res.orderType = orderType
    const data = await this.orderService.save(res)
    let message = ''
    if (orderType === 1) message = '发货成功'
    else if (orderType === 2) message = '完成订单成功'
    else if (orderType === -1) message = '取消成功'
    return suc(data, message)
  }
}
