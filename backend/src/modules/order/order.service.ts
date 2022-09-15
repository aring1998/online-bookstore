import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Order } from 'src/entities/order.entity'
import { OrderDTO, OrderPageData } from './classes/order'
import { User } from 'src/entities/user.entity'
import { BaseSevice } from 'src/common/utils/base.service'

@Injectable()
export class OrderService extends BaseSevice<OrderDTO> {
  constructor(
    @InjectRepository(Order)
    private readonly OrderRepository: Repository<OrderDTO>
  ) {
    super(OrderRepository)
  }

  async findByPage(option: { page: number; pageSize: number; [propName: string]: any }): Promise<OrderPageData> {
    const { page = 1, pageSize = 200, orderTimeStart, orderTimeEnd, username, ...where } = option
    let sql = this.OrderRepository.createQueryBuilder('order')
      .leftJoin(User, 'user', 'order.userId = user.id')
      .where({ ...where })
    if (orderTimeStart && orderTimeEnd) {
      sql = sql.andWhere('orderTime BETWEEN :start AND :end', {
        start: orderTimeStart,
        end: orderTimeEnd
      })
    }
    if (username) sql = sql.andWhere(`user.username = '${username}'`)
    const records = await sql
      .select(
        `
        \`order\`.*,
        user.username AS username
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
