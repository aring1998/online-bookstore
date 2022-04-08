import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Commodity } from 'src/entities/commodity.entity'
import { CommodityDTO, CommodityListDTO, CommodityPageData } from './classes/commodity'
import { Category } from 'src/entities/category.entity'
import { BaseSevice } from 'src/common/utils/base.service'

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
      page,
      pageSize
    }
  }

  async findHotSale(option: { page: number; pageSize: number }): Promise<CommodityDTO> {
    const { page = 1, pageSize = 200 } = option
    return await this.CommodityRepository.query(`
      SELECT a.*, b.commodityNum FROM commodity a
      LEFT JOIN (
        SELECT commodityId, SUM( commodityNum ) commodityNum FROM \`order_detail\` GROUP BY commodityId 
      ) b ON a.id = b.commodityId 
      ORDER BY commodityNum DESC
      LIMIT ${pageSize}
      OFFSET ${page - 1}
    `)
  }
}
