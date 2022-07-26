import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Upload } from 'src/entities/upload.entity'
import { UploadDTO } from './classes/upload'
import { BaseSevice } from 'src/common/utils/base.service'

@Injectable()
export class UploadService extends BaseSevice<UploadDTO> {
  constructor(
    @InjectRepository(Upload)
    private readonly UploadRepository: Repository<UploadDTO>
  ) {
    super(UploadRepository)
  }

  async findByDate(startDate: string, endDate: string) {
    const res = await this.UploadRepository.createQueryBuilder('upload')
      .where('created BETWEEN :startDate AND :endDate', {
        startDate,
        endDate
      })
      .getManyAndCount()
    return {
      records: res[0],
      total: res[1]
    }
  }
}
