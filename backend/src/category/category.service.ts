import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Category } from 'src/entities/category.entity'

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly CategoryRepository: Repository<Category>
  ) {}

  async save(data: Partial<Category>): Promise<Category> {
    return await this.CategoryRepository.save(data)
  }

  async find(option?: any): Promise<Category[]> {
    return await this.CategoryRepository.find(option)
  }

  async findOne(option?: Object): Promise<Category> {
    return await this.CategoryRepository.findOne(option)
  }

  async findByPage(option: { page: number; pageSize: number; [propName: string]: any }): Promise<{ data: Category[], count: number }> {
    const res = await this.CategoryRepository.createQueryBuilder('category')
      .where({ delFlag: option.delFlag })
      .skip(((option.page ?? 1) - 1) * option.pageSize ?? 200)
      .take((option.page ?? 1) * option.pageSize ?? 200)
      .getManyAndCount()
    return {
      data: res[0],
      count: res[1]
    }
  }
}
