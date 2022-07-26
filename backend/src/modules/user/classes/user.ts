import { IsNotEmpty, IsOptional, IsEnum, Length, IsEmail } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { BaseResDTO } from 'src/common/utils/base.dto'
import { DelFlagEnum } from 'src/common/enums/common.enums'
import { $enum } from 'ts-enum-util'

export class UserDTO {
  @ApiProperty({ example: 1, description: 'id' })
  id?: number

  @ApiProperty({ example: 'aring', description: '用户名' })
  username?: string

  @ApiProperty({ example: 'afa3b86e-dce0-4dbd-ad05-4422db248764', description: '令牌' })
  token?: string

  @ApiProperty({ example: '1303340995@qq.com', description: '邮箱' })
  email?: string

  @ApiProperty({ enum: $enum(DelFlagEnum).getValues(), description: '权限' })
  @IsEnum({ User: 0, Admin: 1 })
  auth?: number

  @ApiProperty({ example: 'https://source.aring.cc/upload/1646726623796-图片名.png', description: '头像地址' })
  profilePhotoUrl?: string

  @ApiProperty({ example: 30, description: '每日可上传次数' })
  uploadCount?: number
}

export class UserWholeDTO extends UserDTO {
  @ApiProperty({ example: 1, description: 'id' })
  password?: string
}

export class UserResDTO extends BaseResDTO {
  @ApiProperty({ type: UserDTO, description: '用户信息' })
  data?: UserDTO
}

export class UserLoginDTO {
  @ApiProperty({ example: 'aring', description: '用户名/邮箱' })
  @IsNotEmpty()
  @Length(4, 32)
  username: string

  @ApiProperty({ example: '02acc3bd456a37cdef2319c8cd9491a2', description: '密码(明文转换为md5传输)' })
  @IsNotEmpty()
  @Length(6, 32)
  password: string
}

export class UserRegisterDTO extends UserLoginDTO {
  @ApiProperty({ example: '1303340995@qq.com', description: '邮箱', required: false })
  email?: string
}

export class UserUpdateDTO {
  @ApiProperty({ example: '1303340995@qq.com', description: '邮箱', required: false })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiProperty({ example: 'https://source.aring.cc/upload/1646726623796-图片名.png', description: '头像地址' })
  profilePhotoUrl?: string
}
