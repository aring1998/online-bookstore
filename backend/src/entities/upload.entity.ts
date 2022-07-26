import { BaseEntity, Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Upload extends BaseEntity {
  @PrimaryGeneratedColumn() // 自动生成id
  id: number

  @Column()
  userId: number

  @Column()
  fileUrl: string

  @Column()
  fileSize: number

  @Column({ type: 'datetime' })
  created: string

  @Column({ default: 0 })
  delFlag: number
}
