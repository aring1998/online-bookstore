import { Body, Controller, Post, ValidationPipe, Headers } from '@nestjs/common'
import { UserService } from './user.service'
import { suc, fail } from 'src/common/utils/response'
import { ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger'
import { UserResDTO, UserRegisterDTO, UserLoginDTO, UserUpdateDTO } from './classes/user'
import { getPayload } from 'src/common/utils'

@ApiTags('用户')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: '注册' })
  @ApiResponse({ status: 0, type: UserResDTO })
  async register(@Body(ValidationPipe) body: UserRegisterDTO): Promise<UserResDTO> {
    const { username, password, email } = body

    const userInfo = await this.userService.findOne({ username })
    if (userInfo) return fail('该用户名已被注册')

    const emailInfo = await this.userService.findOne({ email })
    if (emailInfo && email) return fail('该邮箱已被使用')

    const res = await this.userService.save({
      username,
      password,
      email
    })
    const { ...data } = res
    return suc(data, '注册成功，已为您自动登录')
  }

  @Post('login')
  @ApiOperation({ summary: '登录(支持邮箱登录)' })
  @ApiResponse({ status: 0, type: UserResDTO })
  async login(@Body(ValidationPipe) body: UserLoginDTO): Promise<UserResDTO> {
    const { username, password } = body

    const userInfo = await this.userService.findUser({ username })
    if (!userInfo) return fail('用户名不存在')
    if (userInfo.password !== password) return fail('密码错误')
    const data = await this.userService.updateToken({ id: userInfo.id })
    return suc(data, '登录成功')
  }

  @Post('token')
  @ApiOperation({ summary: '验证token' })
  @ApiResponse({ status: 0, type: UserResDTO })
  async token(@Headers('token') token: string): Promise<UserResDTO> {
    const data = await this.userService.findOne({ token })
    if (!data) return fail('token已过期，请重新登录')
    return suc(data, `欢迎回来，${data.username}`)
  }

  @Post('update')
  @ApiOperation({ summary: '修改用户信息' })
  @ApiResponse({ status: 0, type: UserResDTO })
  async update(@Headers('token') token: string, @Body(ValidationPipe) body: UserUpdateDTO): Promise<UserResDTO> {
    const userInfo = await this.userService.findOne({ token })
    if (!userInfo) return fail('请先登录')
    const payload = getPayload(body, ['email', 'profilePhotoUrl'])
    const emailInfo = await this.userService.findOne({ email: payload.email })
    if (emailInfo && payload.email) return fail('该邮箱已被使用')
    if (payload.profilePhotoUrl && !payload.profilePhotoUrl.includes('source.aring.cc/upload')) return fail('请发送正确的头像链接')
    const data = await this.userService.update(userInfo.id, payload)
    return suc(data, '修改成功')
  }
}
