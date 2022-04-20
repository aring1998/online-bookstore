<script setup lang="ts">
import api from '@/utils/api'
import { reactive, Ref, ref, watch } from 'vue'
import { OrderDetailDTO, OrderDetailRes } from './types/detail'

const currentId = ref(0)
const tableData: Ref<OrderDetailDTO[]> = ref([])
const pagination = reactive({
  page: 1,
  pageSize: 30,
  total: 0
})
async function search(id: number) {
  currentId.value = id
  const { data } = await api.get<undefined, OrderDetailRes>(`order/detail/${id}`)
  tableData.value = data.records
}
defineExpose({ search })
</script>

<template>
  <el-table :data="tableData" style="width: 100%" height="calc(100vh - 330px)" max-height="calc(100vh - 330px)">
    <el-table-column prop="id" label="id" width="40" />
    <el-table-column label="商品图片" width="150">
      <template #default="scope">
        <el-popover placement="top-start" :width="200" trigger="hover">
          <template #reference>
            <el-image style="width: 40px; height: 40px" :src="scope.row?.commodityImgUrl" />
          </template>
          <img :src="scope.row?.commodityImgUrl" width="200" height="200" />
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column prop="commodityName" label="商品名" width="200" />
    <el-table-column prop="categoryName" label="商品分类" width="80" />
    <el-table-column prop="commodityPrice" label="商品价格" width="80" />
    <el-table-column prop="commodityNum" label="下单数量" width="80" />
  </el-table>
  <el-pagination
    v-model:currentPage="pagination.page"
    :page-size="pagination.pageSize"
    layout="total, prev, pager, next, sizes"
    :total="pagination.total"
    @size-change="
      size => {
        pagination.pageSize = size
        search(currentId)
      }
    "
    @current-change="
      page => {
        pagination.page = page
        search(currentId)
      }
    "
  ></el-pagination>
</template>

<style lang="scss" scoped></style>
