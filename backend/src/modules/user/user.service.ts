import { Injectable } from '@nestjs/common'
import { User } from 'src/entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'
import { BaseSevice } from 'src/common/utils/base.service'
import { UserDTO, UserWholeDTO } from './classes/user'

@Injectable()
export class UserService extends BaseSevice<UserWholeDTO> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<UserWholeDTO>
  ) {
    super(userRepository)
  }

  async save(data: Partial<UserWholeDTO>): Promise<UserDTO> {
    const res = await this.userRepository.save({
      ...data,
      token: uuidv4()
    })
    return this.findOne({ id: res.id })
  }

  async findOne(option: UserDTO, getPassword: Boolean = false): Promise<UserWholeDTO | UserDTO> {
    const res = await this.userRepository.findOne(option)
    if (res && !getPassword) {
      const { password: _, ...newRes } = res
      return newRes
    }
    return res
  }

  findUser(option: { username: string }): Promise<UserWholeDTO> {
    return this.userRepository.createQueryBuilder().where(`username = '${option.username}' OR email = '${option.username}'`).getOne()
  }

  async updateToken(option: { id: number }): Promise<UserDTO> {
    await this.userRepository.update(option, { token: uuidv4() })
    return this.userRepository.findOne(option)
  }

  async vaildAuth(option: { token: string }): Promise<number> {
    const data = await this.userRepository.findOne({ ...option })
    return data?.auth
  }
}
