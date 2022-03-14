import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Commodity } from 'src/entities/commodity.entity'
import { CommodityDTO, CommodityListDTO } from './classes/commodity'
import { Category } from 'src/entities/category.entity'
import { BaseSevice } from 'src/utils/base.service'

@Injectable()
export class CommodityService extends BaseSevice<CommodityDTO> {
  constructor(
    @InjectRepository(Commodity)
    private readonly CommodityRepository: Repository<CommodityDTO>
  ) {
    super(CommodityRepository)
  }

  async findByPage(option: CommodityListDTO): Promise<{ data: CommodityDTO[]; count: number }> {
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
    const data = await sql
      .select(
        `
        commodity.*,
        category.name AS categoryName
      `
      )
      .skip((page - 1) * pageSize)
      .take(page * pageSize)
      .getRawMany()
    const count = await sql.getCount()
    return {
      data,
      count
    }
  }
}
