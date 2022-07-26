import { BaseEntity, Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn() // 自动生成id
  id: number

  @Column({ unique: true })
  username: string

  @Column()
  password: string

  @Column({ default: null })
  email: string

  @Column({ default: null })
  profilePhotoUrl: string

  @Column({ default: null })
  token: string

  @Column({ default: 0 })
  auth: number

  @Column({ default: 0 })
  uploadCount: number
}
