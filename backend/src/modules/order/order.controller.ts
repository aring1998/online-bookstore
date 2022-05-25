import * as moment from 'moment'
import { Controller, Post, Body, ValidationPipe, Get, Param, Headers, Query } from '@nestjs/common'
import { ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger'
import { suc, fail } from 'src/common/utils/response'
import { OrderService } from './order.service'
import { UserService } from 'src/modules/user/user.service'
import { OrderResDTO, OrderPageResDTO, OrderAddDTO, OrderListDTO, OrderUpdateDTO } from './classes/order'
import { BasePageDTO } from 'src/common/utils/base.dto'
import { getPayload } from 'src/common/utils'
import { OrderDetailService } from 'src/modules/order-detail/order-detail.service'
import { OrderDetailPageResDTO } from 'src/modules/order-detail/classes/order-detail.'

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
  async mine(@Headers('token') token: string, @Query(ValidationPipe) query: BasePageDTO): Promise<OrderPageResDTO> {
    const userInfo = await this.userService.findOne({ token })
    if (!userInfo) return fail('请先登录')
    const { page, pageSize } = query
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
  async list(@Headers('token') token: string, @Query(ValidationPipe) query: OrderListDTO): Promise<OrderPageResDTO> {
    if ((await this.userService.vaildAuth({ token })) !== 1) return fail('您没有权限')
    const payload = getPayload(query, [
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
  async update(@Headers('token') token: string, @Body(ValidationPipe) body: OrderUpdateDTO): Promise<OrderResDTO> {
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
  async detail(@Headers('token') token: string, @Param('id') id: number, @Query(ValidationPipe) query: BasePageDTO): Promise<OrderDetailPageResDTO> {
    const userInfo = await this.userService.findOne({ token })
    if (!userInfo) return fail('请先登录')
    const payload = getPayload(query, ['page', 'pageSize'])
    const data = await this.OrderDetailService.findByPage({
      ...payload,
      orderId: id,
      userId: userInfo.auth !== 1 ? userInfo.id : null
    })
    return suc(data, '')
  }

  @Post('cancel/:id')
  @ApiOperation({ summary: '取消订单' })
  @ApiResponse({ status: 0, type: OrderResDTO })
  async cancel(@Headers('token') token: string, @Param('id') id: number): Promise<OrderResDTO> {
    const userInfo = await this.userService.findOne({ token })
    if (!userInfo) return fail('请先登录')
    const res = await this.orderService.findOne({ id, userId: userInfo.id })
    if (!res) return fail('未查询到数据')
    if (res.orderType !== 0) return fail('无法取消已发货/完成的订单')
    const data = await this.orderService.save(res)
    return suc(data, '取消订单成功')
  }
}
