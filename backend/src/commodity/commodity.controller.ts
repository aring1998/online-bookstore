import { Controller, Post, Body, ValidationPipe, Get, Query, Param, Headers } from '@nestjs/common'
import { ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger'
import { suc, fail } from 'src/utils/response'
import { CommodityService } from './commodity.service'
import { vaildParams } from 'src/utils'
import { UserService } from 'src/user/user.service'
import { CommodityResDTO, CommodityPageResDTO, CommodityAddDTO, CommodityListDTO, CommodityUpdateDTO } from './classes/commodity'
interface PageParams {
  page: number
  pageSize: number
  [propName: string]: any
}

@ApiTags('商品')
@Controller('commodity')
export class CommodityController {
  constructor(private readonly commodityService: CommodityService, private readonly userService: UserService) {}

  @Post('add')
  @ApiOperation({ summary: '新增商品' })
  @ApiResponse({ status: 0, type: CommodityResDTO })
  async add(@Headers('token') token: string, @Body(ValidationPipe) body: CommodityAddDTO): Promise<CommodityResDTO> {
    if (await this.userService.vaildAuth({ token }) !== 1) return fail('您没有权限')
    const { name, price, author } = body
    const data = await this.commodityService.save({ name, price, author })
    return suc(data, '添加商品成功')
  }

  @Post('list')
  @ApiOperation({ summary: '商品列表' })
  @ApiResponse({ status: 0, type: CommodityPageResDTO })
  async list(@Headers('token') token: string, @Body(ValidationPipe) body: CommodityListDTO): Promise<CommodityPageResDTO> {
    if (await this.userService.vaildAuth({ token }) !== 1) return fail('您没有权限')
    const params = vaildParams(body)
    const data = await this.commodityService.findByPage({
      ...(params as PageParams),
      delFlag: 0
    })
    return suc(data, '')
  }

  @Post('del/:id')
  @ApiOperation({ summary: '删除商品' })
  @ApiResponse({ status: 0, type: CommodityResDTO })
  async del(@Headers('token') token: string, @Param('id') id: number): Promise<CommodityResDTO> {
    if (await this.userService.vaildAuth({ token }) !== 1) return fail('您没有权限')
    if (!id) return fail('id不可为空')
    const res = await this.commodityService.findOne({ id })
    if (!res) return fail('未查询到对应数据')
    res.delFlag = 1
    const data = await this.commodityService.save(res)
    return suc(data, '删除成功')
  }

  @Post('update')
  @ApiOperation({ summary: '修改商品' })
  @ApiResponse({ status: 0, type: CommodityResDTO })
  async update(@Headers('token') token: string, @Body() body: CommodityUpdateDTO): Promise<CommodityResDTO> {
    if (await this.userService.vaildAuth({ token }) !== 1) return fail('您没有权限')
    const { id } = body
    if (!id) return fail('id不可为空')
    const res = await this.commodityService.findOne({ id })
    if (!res) return fail('未查询到对应数据')
    for (let key in body) {
      res[key] = body[key]
    }
    const data = await this.commodityService.save(res)
    return suc(data, '修改成功')
  }
}
