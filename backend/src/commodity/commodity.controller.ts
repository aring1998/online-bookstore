import { Controller, Post, Body, ValidationPipe, Param, Headers } from '@nestjs/common'
import { ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger'
import { suc, fail } from 'src/utils/response'
import { CommodityService } from './commodity.service'
import { getPayload } from 'src/utils'
import { UserService } from 'src/user/user.service'
import { CommodityResDTO, CommodityPageResDTO, CommodityAddDTO, CommodityListDTO, CommodityUpdateDTO } from './classes/commodity'

@ApiTags('商品')
@Controller('commodity')
export class CommodityController {
  constructor(private readonly commodityService: CommodityService, private readonly userService: UserService) {}

  @Post('add')
  @ApiOperation({ summary: '新增商品' })
  @ApiResponse({ status: 0, type: CommodityResDTO })
  async add(@Headers('token') token: string, @Body(ValidationPipe) body: CommodityAddDTO): Promise<CommodityResDTO> {
    if ((await this.userService.vaildAuth({ token })) !== 1) return fail('您没有权限')
    const payload = getPayload(body, ['name', 'price', 'author', 'categoryId'])
    const data = await this.commodityService.save({ ...payload })
    return suc(data, '添加商品成功')
  }

  @Post('list')
  @ApiOperation({ summary: '商品列表' })
  @ApiResponse({ status: 0, type: CommodityPageResDTO })
  async list(@Body(ValidationPipe) body: CommodityListDTO): Promise<CommodityPageResDTO> {
    const payload = getPayload<CommodityListDTO>(body, [
      'name',
      'categoryId',
      'author',
      'page',
      'pageSize',
      'publicationTimeStart',
      'publicationTimeEnd'
    ])
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
    const payload = getPayload<CommodityUpdateDTO>(body, [
      'id',
      'name',
      'categoryId',
      'price',
      'author',
      'press',
      'publicationTime',
      'words',
      'introduce',
      'imgUrl'
    ])
    if (!payload.id) return fail('id不可为空')
    const data = await this.commodityService.update<CommodityUpdateDTO>(payload.id, payload)
    return suc(data, '修改成功')
  }
}
