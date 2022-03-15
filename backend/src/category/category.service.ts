import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Category } from 'src/entities/category.entity'
import { CategoryDTO } from './classes/category'

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly CategoryRepository: Repository<CategoryDTO>
  ) {}

  async save(data: Partial<CategoryDTO>): Promise<CategoryDTO> {
    return await this.CategoryRepository.save(data)
  }

  async find(option?: CategoryDTO): Promise<CategoryDTO[]> {
    return await this.CategoryRepository.find(option)
  }

  async findOne(option?: CategoryDTO): Promise<CategoryDTO> {
    return await this.CategoryRepository.findOne(option)
  }

  async findByPage(option: { page: number; pageSize: number; [propName: string]: any }): Promise<{ data: CategoryDTO[], count: number }> {
    const { page = 1, pageSize = 200, ...where } = option
    const res = await this.CategoryRepository.createQueryBuilder('category')
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
