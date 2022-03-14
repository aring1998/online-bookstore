import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Receiving } from 'src/entities/receiving.entity'
import { ReceivingDTO } from './classes/receiving'
import { BasePageDataDTO } from 'src/utils/base.dto'
import { BaseSevice } from 'src/utils/base.service'

@Injectable()
export class ReceivingService extends BaseSevice<ReceivingDTO> {
  constructor(
    @InjectRepository(Receiving)
    private readonly ReceivingRepository: Repository<ReceivingDTO>
  ) {
    super(ReceivingRepository)
  }

  async findByPage(option: { page: number; pageSize: number; [propName: string]: any }): Promise<{ data: ReceivingDTO[] } & BasePageDataDTO> {
    const { page = 1, pageSize = 200, ...where } = option
    const res = await this.ReceivingRepository.createQueryBuilder()
      .where({ ...where })
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
