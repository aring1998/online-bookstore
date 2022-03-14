import { Body, Controller, Post, ValidationPipe, Headers } from '@nestjs/common'
import { UserService } from './user.service'
import { suc, fail } from '../utils/response'
import { ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger'
import { UserResDTO, UserRegisterDTO, UserLoginDTO } from './classes/user'

@ApiTags('用户')
@Controller('user')
export class UserController {
  constructor(private readonly userSrvice: UserService) {}

  @Post('register')
  @ApiOperation({ summary: '注册' })
  @ApiResponse({ status: 0, type: UserResDTO })
  async register(@Body(ValidationPipe) body: UserRegisterDTO): Promise<UserResDTO> {
    const { username, password, email } = body

    const userInfo = await this.userSrvice.findOne({ username })
    if (userInfo) return fail('该用户名已被注册')

    const emailInfo = await this.userSrvice.findOne({ email })
    if (emailInfo && email) return fail('该邮箱已被使用')

    const res = await this.userSrvice.save({
      username,
      password,
      email
    })
    const { ...data } = res
    return suc(data, '注册成功')
  }

  @Post('login')
  @ApiOperation({ summary: '登录(支持邮箱登录)' })
  @ApiResponse({ status: 0, type: UserResDTO })
  async login(@Body(ValidationPipe) body: UserLoginDTO): Promise<UserResDTO> {
    const { username, password } = body

    const userInfo = await this.userSrvice.findUser({ username }, true)
    if (!userInfo) return fail('用户名不存在')
    if (userInfo.password !== password) return fail('密码错误')
    await this.userSrvice.updateToken({ id: userInfo.id })
    return suc(userInfo, '登录成功')
  }

  @Post('token')
  @ApiOperation({ summary: '验证token' })
  @ApiResponse({ status: 0, type: UserResDTO })
  async token(@Headers('token') token: string): Promise<UserResDTO> {
    const data = await this.userSrvice.findOne({ token })
    if (!data) return fail('token已过期，请重新登录')
    return suc(data, `欢迎回来，${data.username}`)
  }
}
