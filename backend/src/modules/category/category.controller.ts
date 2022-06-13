import { Controller, Post, Body, ValidationPipe, Param, Headers, Get, Query } from '@nestjs/common'
import { ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger'
import { suc, fail } from 'src/common/utils/response'
import { CategoryService } from './category.service'
import { UserService } from 'src/modules/user/user.service'
import { CategoryResDTO, CategoryPageResDTO, CategoryAddDTO, CategoryListDTO, CategoryUpdateDTO } from './classes/category'
import { getPayload } from 'src/common/utils'

@ApiTags('分类')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService, private readonly userService: UserService) {}

  @Post('add')
  @ApiOperation({ summary: '新增分类' })
  @ApiResponse({ status: 0, type: CategoryResDTO })
  async add(@Headers('token') token: string, @Body(ValidationPipe) body: CategoryAddDTO): Promise<CategoryResDTO> {
    if ((await this.userService.vaildAuth({ token })) !== 1) return fail('您没有权限')
    const { name } = body
    if (await this.categoryService.findOne({ name })) return fail('该分类已存在')
    const data = await this.categoryService.save({ name })
    return suc(data, '添加分类成功')
  }

  @Get('list')
  @ApiOperation({ summary: '分类列表' })
  @ApiResponse({ status: 0, type: CategoryPageResDTO })
  async list(@Headers('token') token: string, @Query(ValidationPipe) query: CategoryListDTO): Promise<CategoryPageResDTO> {
    const payload = getPayload(query, ['name', 'page', 'pageSize'])
    const data = await this.categoryService.findByPage({
      ...payload,
      delFlag: 0
    })
    return suc(data, '')
  }

  @Post('del/:id')
  @ApiOperation({ summary: '删除分类' })
  @ApiResponse({ status: 0, type: CategoryResDTO })
  async del(@Headers('token') token: string, @Param('id') id: number): Promise<CategoryResDTO> {
    if ((await this.userService.vaildAuth({ token })) !== 1) return fail('您没有权限')
    const res = await this.categoryService.findOne({ id })
    if (!res) return fail('未查询到数据')
    res.delFlag = 1
    const data = await this.categoryService.save(res)
    return suc(data, '删除成功')
  }

  @Post('update')
  @ApiOperation({ summary: '修改分类' })
  @ApiResponse({ status: 0, type: CategoryResDTO })
  async update(@Headers('token') token: string, @Body(ValidationPipe) body: CategoryUpdateDTO): Promise<CategoryResDTO> {
    if ((await this.userService.vaildAuth({ token })) !== 1) return fail('您没有权限')
    const { id, name } = body
    const res = await this.categoryService.findOne({ id })
    if (!res) return fail('未查询到数据')
    res.name = name
    const data = await this.categoryService.save(res)
    return suc(data, '修改成功')
  }
}
