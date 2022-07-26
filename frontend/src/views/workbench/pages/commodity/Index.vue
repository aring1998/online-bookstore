<script setup lang="ts">
import api from '@/utils/api'
import { ElMessage, FormInstance } from 'element-plus'
import { onMounted, reactive, Ref, ref } from 'vue'
import { CategoryDTO, CategoryListApiRes } from '../category/types/category'
import { CommodityDTO, CommodityApiRes, CommodityListApiParams } from './types/commodity'
import { Plus } from '@element-plus/icons-vue'
import useStore from '@/store'
import { UploadApiRes } from '@/types/upload'
import moment from 'moment'

const actFormRef = ref()
const visiable = ref(false)
const dialogName = ref('新增')
const currentRow: Ref<CommodityDTO> = ref({})
const actForm: Ref<CommodityDTO> = ref({
  name: '',
  categoryId: '',
  price: 0,
  author: '',
  press: '',
  publicationTime: '',
  words: 0,
  introduce: '',
  imgUrl: ''
})
const formRules = reactive({
  name: [{ required: true, message: '请输入' }],
  categoryId: [{ required: true, message: '请选择' }],
  author: [{ required: true, message: '请输入' }],
  publicationTime: [{ required: true, message: '请输入' }],
  imgUrl: [{ required: true, message: '请上传' }],
})
const tableData: Ref<CommodityDTO[]> = ref([])
function showDialog(name: string, row?: CommodityDTO) {
  dialogName.value = name
  visiable.value = true
  if (row) {
    currentRow.value = row
    actForm.value = row
  }
}
const sechForm = reactive({
  name: '',
  categoryId: '',
  author: '',
  date: []
})
const pagination = reactive({
  page: 1,
  pageSize: 30,
  total: 0
})
async function search() {
  const { data } = await api.get<CommodityListApiParams, CommodityApiRes>('commodity/list', {
    ...sechForm,
    publicationTimeStart: sechForm.date.length ? moment(sechForm.date[0]).format('YYYY-MM-DD') : undefined,
    publicationTimeEnd: sechForm.date.length ? moment(sechForm.date[1]).format('YYYY-MM-DD') : undefined,
    ...pagination
  })
  tableData.value = data.records
  pagination.total = data.total
}
async function submit(formEl: FormInstance) {
  formEl.validate(async vaild => {
    if (vaild) {
      if (dialogName.value === '新增') {
        await api.post<CommodityDTO, CommodityDTO>('commodity/add', {
          ...actForm.value
        })
      } else {
        await api.post<CommodityDTO, CommodityDTO>('commodity/update', {
          ...actForm.value,
          id: currentRow.value?.id
        })
      }
      visiable.value = false
      search()
    }
  })
}

function uploadSuccess(res: UploadApiRes) {
  if (res.code === 0) {
    ElMessage.success(res.message)
    actForm.value.imgUrl = res.data.fileUrl
  } else ElMessage.error(res.message)
}

const categoryOptions: Ref<CategoryDTO[]> = ref([])
onMounted(async () => {
  const { data } = await api.get<any, CategoryListApiRes>('/category/list')
  categoryOptions.value = data.records
  search()
})
</script>

<template>
  <el-form :model="sechForm" label-width="70px" style="width: 100%" @submit.native.prevent :inline="true">
    <el-form-item label="商品名">
      <el-input v-model="sechForm.name"></el-input>
    </el-form-item>
    <el-form-item label="分类">
      <el-select v-model="sechForm.categoryId" clearable>
        <el-option v-for="item in categoryOptions" :key="item.id" :label="item.name" :value="item.id!" />
      </el-select>
    </el-form-item>
    <el-form-item label="作者">
      <el-input v-model="sechForm.author"></el-input>
    </el-form-item>
    <el-form-item label="出版日期">
      <el-date-picker v-model="sechForm.date" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="search">查询</el-button>
    </el-form-item>
  </el-form>
  <div class="action-btn">
    <el-button type="primary" @click="showDialog('新增')">新增</el-button>
  </div>
  <el-table :data="tableData" style="width: 100%" height="calc(100vh - 310px)" max-height="calc(100vh - 310px)" v-loading="useStore().common().loading">
    <el-table-column prop="id" label="id" width="40" />
    <el-table-column label="商品图片" width="150">
      <template #default="scope">
        <el-popover placement="top-start" :width="200" trigger="hover">
          <template #reference>
            <el-image style="width: 80px; height: 80px" :src="scope.row?.imgUrl" />
          </template>
          <img :src="scope.row?.imgUrl" width="200" height="200" />
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="商品名" width="200" />
    <el-table-column prop="categoryName" label="分类" width="80" />
    <el-table-column prop="price" label="价格" width="80" />
    <el-table-column prop="author" label="作者" width="140" />
    <el-table-column prop="press" label="出版社" width="200" />
    <el-table-column
      prop="publicationTime"
      label="出版时间"
      width="140"
      :formatter="val => (val.publicationTime ? moment(val.publicationTime).format('YYYY-MM-DD') : '')"
    />
    <el-table-column prop="words" label="字数" width="120" />
    <el-table-column prop="introduce" label="介绍" width="200" show-overflow-tooltip />
    <el-table-column label="操作" fixed="right">
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
      }
    "
  ></el-pagination>
  <el-dialog v-model="visiable" :title="dialogName" :z-index="2000">
    <div class="actForm-wrap" v-loading="useStore().common().loading">
      <el-form :model="actForm" :rules="formRules" label-width="80px" ref="actFormRef" style="width: 100%" @submit.native.prevent>
        <el-form-item label="商品名" prop="name">
          <el-input v-model="actForm.name"></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="categoryId">
          <el-select v-model="actForm.categoryId" clearable>
            <el-option v-for="item in categoryOptions" :key="item.id" :label="item.name" :value="item.id!" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="actForm.price" :precision="2" :step="0.1" />
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="actForm.author"></el-input>
        </el-form-item>
        <el-form-item label="出版社" prop="press">
          <el-input v-model="actForm.press"></el-input>
        </el-form-item>
        <el-form-item label="出版时间" prop="publicationTime">
          <el-date-picker v-model="actForm.publicationTime" type="date" />
        </el-form-item>
        <el-form-item label="字数" prop="words">
          <el-input-number v-model="actForm.words" :precision="0" :step="1000" />
        </el-form-item>
        <el-form-item label="介绍" prop="introduce">
          <el-input v-model="actForm.introduce" autosize type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="商品图片" prop="imgUrl">
          <el-upload
            class="avatar-uploader"
            action="https://online-bookstore.aring.cc/api/upload"
            :headers="{
              token: useStore().user().token
            }"
            :show-file-list="false"
            :on-success="uploadSuccess"
            accept=".jpg, .jpeg, .png, .gif"
          >
            <img v-if="actForm.imgUrl" :src="actForm.imgUrl" class="avatar" style="height: 178px; width: 178px" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit(actFormRef)">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
