import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Commodity } from 'src/entities/commodity.entity'
import { CommodityDTO } from './classes/commodity'
import { Category } from 'src/entities/category.entity'
import { vaildParams } from 'src/utils'

@Injectable()
export class CommodityService {
  constructor(
    @InjectRepository(Commodity)
    private readonly CommodityRepository: Repository<Commodity>
  ) {}

  async save(data: CommodityDTO): Promise<CommodityDTO> {
    return await this.CommodityRepository.save(data)
  }

  async find(option?: CommodityDTO): Promise<CommodityDTO[]> {
    return await this.CommodityRepository.find(option)
  }

  async findOne(option?: CommodityDTO): Promise<CommodityDTO> {
    return await this.CommodityRepository.findOne(option)
  }

  async findByPage(option: { page: number; pageSize: number; [propName: string]: any }): Promise<{ data: CommodityDTO[]; count: number }> {
    const { page = 1, pageSize = 200, publicationTimeStart, publicationTimeEnd, ...where } = option
    let sql = this.CommodityRepository.createQueryBuilder('commodity')
      // .leftJoinAndMapOne('commodity.category',Category, 'category', 'category.id = commodity.categoryId')
      .leftJoin(Category, 'category', 'category.id = commodity.categoryId')
      .where({ ...vaildParams(where) })
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
