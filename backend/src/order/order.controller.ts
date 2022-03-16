import * as moment from 'moment'
import { Controller, Post, Body, ValidationPipe, Get, Param, Headers } from '@nestjs/common'
import { ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger'
import { suc, fail } from 'src/utils/response'
import { OrderService } from './order.service'
import { UserService } from 'src/user/user.service'
import { OrderResDTO, OrderPageResDTO, OrderAddDTO, OrderListDTO, OrderUpdateDTO } from './classes/order'
import { BasePageDTO } from 'src/utils/base.dto'
import { getPayload } from 'src/utils'
import { OrderDetailService } from 'src/order-detail/order-detail.service'
import { OrderDetailPageResDTO } from 'src/order-detail/classes/order-detail.'

@ApiTags('订单')
@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly userService: UserService,
    private readonly OrderDetailService: OrderDetailService
  ) {}

  @Get('mine')
  @ApiOperation({ summary: '我的订单' })
  @ApiResponse({ status: 0, type: OrderPageResDTO })
  async mine(@Headers('token') token: string, @Param(ValidationPipe) params: BasePageDTO): Promise<OrderPageResDTO> {
    const userInfo = await this.userService.findOne({ token })
    if (!userInfo) return fail('请先登录')
    const { page, pageSize } = params
    const data = await this.orderService.findByPage({
      userId: userInfo.id,
      page,
      pageSize,
      delFlag: 0
    })
    return suc(data, '')
  }

  @Post('add')
  @ApiOperation({ summary: '下单' })
  @ApiResponse({ status: 0, type: OrderResDTO })
  async order(@Headers('token') token: string, @Body(ValidationPipe) body: OrderAddDTO): Promise<OrderResDTO> {
    const userInfo = await this.userService.findOne({ token })
    if (!userInfo) return fail('请先登录')
    const payload = getPayload(body, ['consignee', 'tel', 'receiveAddressCode', 'receiveDetailAddress', 'orderList'])
    if (payload.orderList?.length === 0) return fail('购物清单为空')
    const { orderList, ...newPayload } = payload
    const data = await this.orderService.save({
      ...newPayload,
      userId: userInfo.id,
      orderTime: moment().format('YYYY-MM-DD HH:mm:ss')
    })
    const orderDetailList = orderList.map(item => ({
      ...item,
      orderId: data.id
    }))
    const orderDetail = await this.OrderDetailService.saveMany(orderDetailList)
    if (!orderDetail) return fail('下单异常，请重试')
    return suc(data, '下单成功')
  }

  @Get('list')
  @ApiOperation({ summary: '订单列表' })
  @ApiResponse({ status: 0, type: OrderPageResDTO })
  async list(@Headers('token') token: string, @Param(ValidationPipe) params: OrderListDTO): Promise<OrderPageResDTO> {
    if ((await this.userService.vaildAuth({ token })) !== 1) return fail('您没有权限')
    const payload = getPayload(params, [
      'username',
      'consignee',
      'receiveAddressCode',
      'orderTimeStart',
      'orderTimeEnd',
      'orderType',
      'page',
      'pageSize'
    ])
    const data = await this.orderService.findByPage({
      ...payload,
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
    else if (orderType === -1) message = '取消订单成功'
    return suc(data, message)
  }

  @Get('detail/:id')
  @ApiOperation({ summary: '订单详情' })
  @ApiResponse({ status: 0, type: OrderDetailPageResDTO })
  async detail(@Headers('token') token: string, @Param('id') id: number, @Param(ValidationPipe) params: BasePageDTO): Promise<OrderDetailPageResDTO> {
    const userInfo = await this.userService.findOne({ token })
    if (!userInfo) return fail('请先登录')
    const payload = getPayload(params, ['page', 'pageSize'])
    const data = await this.OrderDetailService.findByPage({
      ...payload,
      orderId: id,
      userId: userInfo.auth !== 1 ? userInfo.id : null
    })
    return suc(data, '')
  }
}
