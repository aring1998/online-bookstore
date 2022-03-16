import { Repository } from 'typeorm'

export class BaseSevice<T> {
  constructor(private readonly repository: Repository<T>) {}

  save(data: T): Promise<T> {
    return this.repository.save(data)
  }

  saveMany(data: T[]): Promise<T[]> {
    return this.repository.save(data)
  }

  find(option: T): Promise<T[]> {
    return this.repository.find(option)
  }

  findOne(option: T): Promise<T> {
    return this.repository.findOne(option)
  }

  async deleteById(id: number): Promise<T> {
    await this.repository.update(id, { delFlag: 1 } as any)
    return this.repository.findOne(id)
  }

  async update<K>(id: number, params: K): Promise<T> {
    await this.repository.update(id, params)
    return this.repository.findOne(id)
  }
}
