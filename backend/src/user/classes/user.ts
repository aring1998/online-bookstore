import { IsNotEmpty, IsOptional, IsEnum, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'
import { BaseResDTO } from 'src/utils/base.dto';

export class UserDTO {
  @ApiProperty({ example: 1, description: 'id' })
  id: number

  @ApiProperty({ example: 'aring', description: '用户名' })
  @IsOptional()
  username: string

  @ApiProperty({ example: 'afa3b86e-dce0-4dbd-ad05-4422db248764', description: '令牌' })
  token: string

  @ApiProperty({ example: '1303340995@qq.com', description: '邮箱' })
  email: string

  @ApiProperty({ enum: [0, 1], description: '权限' })
  @IsEnum({ User: 0, Admin: 1 })
  auth: number
}

export class UserResDTO extends BaseResDTO {
  @ApiProperty({ type: UserDTO, description: '用户信息' })
  data?: UserDTO
}

export class UserLoginDTO{
  @ApiProperty({ example: 'aring', description: '用户名' })
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string

  @ApiProperty({ example: '123456', description: '密码' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string
}

export class UserRegisterDTO extends UserLoginDTO {
  @ApiProperty({ example: '1303340995@qq.com', description: '邮箱' })
  @IsEmail({}, { message: '邮箱格式错误' })
  email?: string
}