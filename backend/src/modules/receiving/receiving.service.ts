import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Receiving } from 'src/entities/receiving.entity'
import { ReceivingDTO, ReceivingPageData } from './classes/receiving'
import { BaseSevice } from 'src/common/utils/base.service'

@Injectable()
export class ReceivingService extends BaseSevice<ReceivingDTO> {
  constructor(
    @InjectRepository(Receiving)
    private readonly ReceivingRepository: Repository<ReceivingDTO>
  ) {
    super(ReceivingRepository)
  }

  async findByPage(option: { page: number; pageSize: number; [propName: string]: any }): Promise<ReceivingPageData> {
    const { page = 1, pageSize = 200, ...where } = option
    const res = await this.ReceivingRepository.createQueryBuilder()
      .where({ ...where })
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount()
    return {
      records: res[0],
      total: res[1],
      page: Number(page),
      pageSize: Number(pageSize)
    }
  }
}
