import { Controller, Post, Body, ValidationPipe, Get, Query, Param } from '@nestjs/common'
import { ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger'
import { suc, fail } from 'src/utils/response'
import { CategoryService } from './category.service'
import { vaildParams } from 'src/utils'
import { CategoryDTO, CategoryResDTO, CategoryPageResDTO, CategoryAddDTO, CategoryListDTO, CategoryUpdateDTO } from './classes/category'
interface PageParams {
  page: number
  pageSize: number
  [propName: string]: any 
}

@ApiTags('分类')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('add')
  @ApiOperation({ summary: '新增分类' })
  @ApiResponse({ status: 0, type: CategoryDTO })
  async add(@Body(ValidationPipe) body: CategoryAddDTO): Promise<CategoryResDTO> {
    const { name } = body
    if (await this.categoryService.findOne({ name })) return fail('该分类已存在')
    const data = await this.categoryService.save({ name })
    return suc(data, '添加分类成功')
  }

  @Get('list')
  @ApiOperation({ summary: '分类列表' })
  @ApiResponse({ status: 0, type: CategoryPageResDTO })
  async list(@Query(ValidationPipe) query: CategoryListDTO): Promise<CategoryPageResDTO> {
    console.log(process.env.DB_USERNAME)
    const params = vaildParams(query)
    const data = await this.categoryService.findByPage({
      ...params as PageParams,
      delFlag: 0
    })
    return suc(data, '')
  }

  @Post('del/:id')
  @ApiOperation({ summary: '删除分类' })
  @ApiResponse({ status: 0, type: CategoryDTO })
  async del(@Param('id') id: string,): Promise<CategoryResDTO> {
    const res = await this.categoryService.findOne({ id })
    if (!res) fail('id不可为空')
    res.delFlag = 1
    const data = await this.categoryService.save(res)
    return suc(data, '删除成功')
  }

  @Post('update')
  @ApiOperation({ summary: '修改分类' })
  @ApiResponse({ status: 0, type: CategoryDTO })
  async update(@Body() body: CategoryUpdateDTO): Promise<CategoryResDTO> {
    const { id, name } = body
    const res = await this.categoryService.findOne({ id })
    if (!res) fail('id不可为空')
    res.name = name
    const data = await this.categoryService.save(res)
    return suc(data, '修改成功')
  }
}
