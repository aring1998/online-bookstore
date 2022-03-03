import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Commodity } from 'src/entities/commodity.entity'
import { CommodityDTO } from './classes/commodity'

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

  async findByPage(option: { page: number; pageSize: number; [propName: string]: any }): Promise<{ data: CommodityDTO[], count: number }> {
    const { page = 1, pageSize = 200, ...where } = option
    const res = await this.CommodityRepository.createQueryBuilder('Commodity')
      .where({ ...where })
      .skip((page - 1) * pageSize)
      .take(page * pageSize)
      .getManyAndCount()
    return {
      data: res[0],
      count: res[1]
    }
  }
}
