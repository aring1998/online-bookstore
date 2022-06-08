<script setup lang="ts">
import api from '@/utils/api'
import { FormInstance } from 'element-plus'
import { onMounted, reactive, Ref, ref } from 'vue'
import { CategoryDTO, CategoryListApiRes, CategoryAddApiParams } from './types/category'
import useStore from '@/store';

const actFormRef = ref()
const visiable = ref(false)
const dialogName = ref('新增')
const currentRow: Ref<CategoryDTO> = ref({})
const actForm = reactive({
  name: ''
})
const formRules = reactive({
  name: [{ required: true, message: '请输入' }]
})
const tableData: Ref<CategoryDTO[]> = ref([])
function showDialog(name: string, row?: CategoryDTO) {
  dialogName.value = name
  visiable.value = true
  currentRow.value = row!
}
const sechForm = reactive({
  name: ''
})
const pagination = reactive({
  page: 1,
  pageSize: 30,
  total: 0
})
async function search() {
  const { data } = await api.get<CategoryDTO, CategoryListApiRes>('category/list', {
    ...sechForm,
    ...pagination
  })
  tableData.value = data.records
  pagination.total = data.total
}
async function submit(formEl: FormInstance) {
  formEl.validate(async vaild => {
    if (vaild) {
      if (dialogName.value === '新增') {
        await api.post<CategoryAddApiParams, CategoryAddApiParams>('category/add', {
          ...actForm
        })
      } else {
        await api.post<CategoryDTO, CategoryAddApiParams>('category/update', {
          ...actForm,
          id: currentRow.value?.id
        })
      }
      visiable.value = false
      search()
    }
  })
}
onMounted(() => {
  search()
})
</script>

<template>
  <el-form :model="sechForm" label-width="70px" style="width: 100%" @submit.native.prevent :inline="true">
    <el-form-item label="分类名" prop="name">
      <el-input v-model="sechForm.name" @keydown.enter="search"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="search">查询</el-button>
    </el-form-item>
  </el-form>
  <div class="action-btn">
    <el-button type="primary" @click="showDialog('新增')">新增</el-button>
  </div>
  <el-table :data="tableData" style="width: 100%;" height="calc(100vh - 260px)" max-height="calc(100vh - 260px)" v-loading="useStore().common().loading">
    <el-table-column prop="id" label="id" />
    <el-table-column prop="name" label="分类名" />
    <el-table-column label="操作">
      <template #default="scope">
        <el-button size="small" @click="showDialog('编辑', scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    v-model:currentPage="pagination.page"
    :page-size="pagination.pageSize"
    layout="total, prev, pager, next, sizes"
    :total="pagination.total"
    @size-change="
      size => {
        pagination.pageSize = size
        search()
      }
    "
    @current-change="
      page => {
        pagination.page = page
        search()
      }"
  ></el-pagination>
  <el-dialog v-model="visiable" :title="dialogName" :z-index="2000">
    <div class="actForm-wrap">
      <el-form :model="actForm" :rules="formRules" label-width="70px" ref="actFormRef" style="width: 100%" @submit.native.prevent>
        <el-form-item label="分类名" prop="name">
          <el-input v-model="actForm.name" @keydown.enter="submit(actFormRef)"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit(actFormRef)">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
