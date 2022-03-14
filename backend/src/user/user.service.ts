import { Injectable } from '@nestjs/common'
import { User } from '../entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'
import { BaseSevice } from 'src/utils/base.service'

@Injectable()
export class UserService extends BaseSevice<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {
    super(userRepository)
  }

  async save(data: Partial<User>): Promise<User> {
    return await this.userRepository.save({
      ...data,
      token: uuidv4()
    })
  }

  async findOne(option?: Object, getPassword: Boolean = false): Promise<User> {
    const res = await this.userRepository.findOne(option)
    if (res && !getPassword) {
      const { password: _, ...newRes } = res
      return newRes as any
    }
    return res
  }

  async findUser(option?: { username: string }, getPassword: Boolean = false): Promise<User> {
    const res = await this.userRepository.createQueryBuilder().where(`username = '${option.username}' OR email = '${option.username}'`).getOne()
    if (res && !getPassword) {
      const { password: _, ...newRes } = res
      return newRes as any
    }
    return res
  }

  async updateToken(option: any): Promise<any> {
    return await this.userRepository.update(option, { token: uuidv4() })
  }

  async vaildAuth(option: { token: string }): Promise<any> {
    const data = await this.userRepository.findOne({ ...option })
    return data?.auth
  }
}
