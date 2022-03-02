import { BaseEntity, Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn() // 自动生成id
  id: number

  @Column({ unique: true })
  name: string

  @Column({ default: 0 })
  delFlag: number
}
