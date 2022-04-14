import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Commodity } from 'src/entities/commodity.entity'
import { CommodityDTO, CommodityHotSalePageData, CommodityListDTO, CommodityPageData } from './classes/commodity'
import { Category } from 'src/entities/category.entity'
import { BaseSevice } from 'src/common/utils/base.service'
import { BasePageDTO } from 'src/common/utils/base.dto'

@Injectable()
export class CommodityService extends BaseSevice<CommodityDTO> {
  constructor(
    @InjectRepository(Commodity)
    private readonly CommodityRepository: Repository<CommodityDTO>
  ) {
    super(CommodityRepository)
  }

  async findByPage(option: CommodityListDTO): Promise<CommodityPageData> {
    const { page = 1, pageSize = 200, publicationTimeStart, publicationTimeEnd, ...where } = option
    let sql = this.CommodityRepository.createQueryBuilder('commodity')
      .leftJoin(Category, 'category', 'category.id = commodity.categoryId')
      .where({ ...where, delFlag: 0 })
    if (publicationTimeStart && publicationTimeEnd) {
      sql = sql.andWhere('publicationTime BETWEEN :start AND :end', {
        start: publicationTimeStart,
        end: publicationTimeEnd
      })
    }
    const records = await sql
      .select(
        `
        commodity.*,
        category.name AS categoryName
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

  async findHotSale(option: BasePageDTO): Promise<CommodityHotSalePageData> {
    const { page = 1, pageSize = 200 } = option
    const sql = `
      SELECT a.*, b.commodityNum FROM commodity a
      LEFT JOIN (
        SELECT commodityId, SUM( commodityNum ) commodityNum FROM \`order_detail\` GROUP BY commodityId 
      ) b ON a.id = b.commodityId 
      ORDER BY commodityNum DESC
    `
    const records = await this.CommodityRepository.query(`
      ${sql}
      LIMIT ${pageSize}
      OFFSET ${(page - 1) * pageSize}
    `)
    const total = await this.CommodityRepository.query(sql)
    return {
      records,
      total: total.length,
      page: Number(page),
      pageSize: Number(pageSize)
    }
  }
}
