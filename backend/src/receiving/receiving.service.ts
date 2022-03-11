import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Receiving } from 'src/entities/receiving.entity'
import { ReceivingDTO, ReceivingPageDTO } from './classes/receiving'
import { vaildParams } from 'src/utils'
import { Category } from 'src/entities/category.entity'
import { User } from 'src/entities/user.entity'
import { Commodity } from 'src/entities/commodity.entity'
import { BasePageDataDTO } from 'src/utils/base.dto'

@Injectable()
export class ReceivingService {
  constructor(
    @InjectRepository(Receiving)
    private readonly ReceivingRepository: Repository<ReceivingDTO>
  ) {}

  async save(data: Partial<ReceivingDTO>): Promise<ReceivingDTO> {
    return await this.ReceivingRepository.save(data)
  }

  async find(option?: ReceivingDTO): Promise<ReceivingDTO[]> {
    return await this.ReceivingRepository.find(option)
  }

  async findOne(option?: ReceivingDTO): Promise<ReceivingDTO> {
    return await this.ReceivingRepository.findOne(option)
  }
  
  async findByPage(option: { page: number; pageSize: number; [propName: string]: any }): Promise<{ data: ReceivingDTO[]} & BasePageDataDTO> {
    const { page = 1, pageSize = 200, ...where } = option
    const res = await this.ReceivingRepository.createQueryBuilder()
      .where({ ... vaildParams(where) })
      .skip((page - 1) * pageSize)
      .take(page * pageSize)
      .getManyAndCount()
    return {
      data: res[0],
      count: res[1],
      page,
      pageSize
    }
  }
}
