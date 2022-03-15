import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Order } from 'src/entities/order.entity'
import { OrderDTO, OrderPageData } from './classes/order'
import { Category } from 'src/entities/category.entity'
import { User } from 'src/entities/user.entity'
import { Commodity } from 'src/entities/commodity.entity'
import { Receiving } from 'src/entities/receiving.entity'
import { BaseSevice } from 'src/utils/base.service'

@Injectable()
export class OrderService extends BaseSevice<OrderDTO> {
  constructor(
    @InjectRepository(Order)
    private readonly OrderRepository: Repository<OrderDTO>
  ) {
    super(OrderRepository)
  }

  async findByPage(option: { page: number; pageSize: number; [propName: string]: any }): Promise<OrderPageData> {
    const { page = 1, pageSize = 200, orderTimeStart, orderTimeEnd, receiveAddressCode, commodityName, username, consignee, ...where } = option
    let sql = this.OrderRepository.createQueryBuilder('order')
      .leftJoin(Category, 'category', 'order.categoryId = category.id')
      .leftJoin(User, 'user', 'order.userId = user.id')
      .leftJoin(Commodity, 'commodity', 'order.commodityId = commodity.id')
      .leftJoin(Receiving, 'receiving', 'order.receivingId = receiving.id')
      .where({ ...where })
    if (orderTimeStart && orderTimeEnd) {
      sql = sql.andWhere('publicationTime BETWEEN :start AND :end', {
        start: orderTimeStart,
        end: orderTimeEnd
      })
    }
    if (username) sql = sql.andWhere(`user.username = '${username}'`)
    if (receiveAddressCode) sql = sql.andWhere(`receiving.receiveAddressCode = '${receiveAddressCode}'`)
    if (consignee) sql = sql.andWhere(`receiving.consignee = '${consignee}'`)
    if (commodityName) sql = sql.andWhere(`commodity.name LIKE ${commodityName}`)
    const records = await sql
      .select(
        `
        \`order\`.*,
        category.name AS categoryName,
        user.username AS username,
        commodity.name AS commodityName,
        receiving.consignee AS consignee,
        receiving.tel AS tel,
        receiving.receiveAddressCode AS receiveAddressCode
      `
      )
      .skip((page - 1) * pageSize)
      .take(page * pageSize)
      .getRawMany()
    const total = await sql.getCount()
    return {
      records,
      total,
      page,
      pageSize
    }
  }
}
