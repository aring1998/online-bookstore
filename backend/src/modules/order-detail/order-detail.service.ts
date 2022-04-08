import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { OrderDetail } from 'src/entities/order-detail.entity'
import { OrderDetailDTO, OrderDetailPageData } from './classes/order-detail.'
import { BaseSevice } from 'src/common/utils/base.service'
import { Category } from 'src/entities/category.entity'
import { Commodity } from 'src/entities/commodity.entity'
import { User } from 'src/entities/user.entity'
import { Order } from 'src/entities/order.entity'

@Injectable()
export class OrderDetailService extends BaseSevice<OrderDetailDTO> {
  constructor(
    @InjectRepository(OrderDetail)
    private readonly OrderDetailRepository: Repository<OrderDetailDTO>
  ) {
    super(OrderDetailRepository)
  }

  async findByPage(option: { page: number; pageSize: number; [propName: string]: any }): Promise<OrderDetailPageData> {
    const { page = 1, pageSize = 200, userId, ...where } = option
    let sql = this.OrderDetailRepository.createQueryBuilder('orderDetail')
      .leftJoin(Category, 'category', 'orderDetail.categoryId = category.id')
      .leftJoin(Commodity, 'commodity', 'orderDetail.commodityId = commodity.id')
      .where({ ...where })
    if (userId)
      sql = sql
        .leftJoin(Order, 'order', 'orderDetail.orderId = order.id')
        .leftJoin(User, 'user', 'order.userId = user.id')
        .andWhere(`order.userId = ${userId}`)
    const records = await sql
      .select(
        `
        orderDetail.*,
        category.name AS categoryName,
        commodity.name AS commodityName,
        commodity.imgUrl AS commodityImgUrl
      `
      )
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .getRawMany()
    const total = await sql.getCount()
    return {
      records,
      total,
      page: Number(page),
      pageSize: Number(pageSize)
    }
  }
}
