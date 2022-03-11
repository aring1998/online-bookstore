
import { BaseEntity, Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Receiving extends BaseEntity {
  @PrimaryGeneratedColumn() // 自动生成id
  id: number

  @Column()
  userId: number

  @Column()
  consignee: string

  @Column()
  tel: string

  @Column()
  receiveAddressCode: number

  @Column()
  receiveDetailAddress: string

  @Column({ default: 0 })
  delFlag: number
}
