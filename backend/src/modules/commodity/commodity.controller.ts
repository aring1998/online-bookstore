import { Controller, Post, Body, ValidationPipe, Param, Headers, Get, Query } from '@nestjs/common'
import { ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger'
import { suc, fail } from 'src/common/utils/response'
import { CommodityService } from './commodity.service'
import { getPayload } from 'src/common/utils'
import { UserService } from 'src/modules/user/user.service'
import {
  CommodityResDTO,
  CommodityPageResDTO,
  CommodityAddDTO,
  CommodityListDTO,
  CommodityUpdateDTO,
  CommodityHotSalePageResDTO
} from './classes/commodity'
import { BasePageDTO } from 'src/common/utils/base.dto'

@ApiTags('商品')
@Controller('commodity')
export class CommodityController {
  constructor(private readonly commodityService: CommodityService, private readonly userService: UserService) {}

  @Post('add')
  @ApiOperation({ summary: '新增商品' })
  @ApiResponse({ status: 0, type: CommodityResDTO })
  async add(@Headers('token') token: string, @Body(ValidationPipe) body: CommodityAddDTO): Promise<CommodityResDTO> {
    if ((await this.userService.vaildAuth({ token })) !== 1) return fail('您没有权限')
    const payload = getPayload(body, ['name', 'price', 'author', 'categoryId', 'words', 'press', 'publicationTime', 'imgUrl', 'introduce'])
    const data = await this.commodityService.save({ ...payload })
    return suc(data, '添加商品成功')
  }

  @Get('list')
  @ApiOperation({ summary: '商品列表' })
  @ApiResponse({ status: 0, type: CommodityPageResDTO })
  async list(@Query(ValidationPipe) query: CommodityListDTO): Promise<CommodityPageResDTO> {
    const payload = getPayload(query, ['id', 'name', 'categoryId', 'author', 'page', 'pageSize', 'publicationTimeStart', 'publicationTimeEnd'])
    const data = await this.commodityService.findByPage({ ...payload })
    return suc(data, '')
  }

  @Post('del/:id')
  @ApiOperation({ summary: '删除商品' })
  @ApiResponse({ status: 0, type: CommodityResDTO })
  async del(@Headers('token') token: string, @Param('id') id: number): Promise<CommodityResDTO> {
    if ((await this.userService.vaildAuth({ token })) !== 1) return fail('您没有权限')
    const data = await this.commodityService.deleteById(id)
    if (!data) return fail('未查询到对应数据')
    return suc(data, '删除成功')
  }

  @Post('update')
  @ApiOperation({ summary: '修改商品' })
  @ApiResponse({ status: 0, type: CommodityResDTO })
  async update(@Headers('token') token: string, @Body(ValidationPipe) body: CommodityUpdateDTO): Promise<CommodityResDTO> {
    if ((await this.userService.vaildAuth({ token })) !== 1) return fail('您没有权限')
    const payload = getPayload(body, ['id', 'name', 'categoryId', 'price', 'author', 'press', 'publicationTime', 'words', 'introduce', 'imgUrl'])
    if (!payload.id) return fail('id不可为空')
    const data = await this.commodityService.update<CommodityUpdateDTO>(payload.id, payload)
    return suc(data, '修改成功')
  }

  @Get('hotSale')
  @ApiOperation({ summary: '热销商品列表' })
  @ApiResponse({ status: 0, type: CommodityHotSalePageResDTO })
  async hotSale(@Query(ValidationPipe) query: BasePageDTO): Promise<CommodityHotSalePageResDTO> {
    const payload = getPayload(query, ['page', 'pageSize'])
    const data = await this.commodityService.findHotSale({ ...payload })
    return suc(data, '')
  }
}
