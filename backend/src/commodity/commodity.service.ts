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
}
