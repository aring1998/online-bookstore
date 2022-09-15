<script setup lang="ts">
import Detail from './components/Detail.vue'
import api from '@/utils/api'
import { FormInstance } from 'element-plus'
import { nextTick, onMounted, reactive, Ref, ref } from 'vue'
import { CategoryDTO, CategoryListApiRes } from '../category/types/category'
import { OrderDTO, OrderApiRes } from './types/order'
import { cityCodeToText } from '@/utils/area'
import areaData from '@/assets/json/china-area.json'
import { getDictLabel, orderType } from '@/assets/js/dict'
import useStore from '@/store'
import moment from 'moment'
import { getArrayLastElm } from '@/utils'

const actFormRef = ref()
const sendVisiable = ref(false)
const detailVisiable = ref(false)
const currentRow: Ref<OrderDTO> = ref({})
const actForm: Ref<OrderDTO> = ref({
  id: 0,
  username: '',
  orderType: 0,
  consignee: ''
})
const formRules = reactive({
  orderType: [{ required: true, message: '请选择' }]
})
const tableData: Ref<OrderDTO[]> = ref([])
function showSend(row: OrderDTO) {
  sendVisiable.value = true
  if (row) {
    currentRow.value = row
    actForm.value = row
  }
}
const detailRef = ref()
function showDetail(id: string) {
  detailVisiable.value = true
  nextTick(() => {
    detailRef.value.search(id)
  })
}
const sechForm = reactive({
  username: '',
  orderType: '',
  consignee: '',
  author: '',
  receiveAddressCode: [],
  date: undefined
})
const pagination = reactive({
  page: 1,
  pageSize: 30,
  total: 0
})
async function search() {
  const { data } = await api.get<any, OrderApiRes>('order/list', {
    ...sechForm,
    orderTimeStart: sechForm.date ? moment(sechForm.date[0]).format('YYYY-MM-DD') : undefined,
    orderTimeEnd: sechForm.date ? moment(sechForm.date[1]).format('YYYY-MM-DD') : undefined,
    receiveAddressCode: getArrayLastElm(sechForm.receiveAddressCode),
    ...pagination
  })
  tableData.value = data.records
  pagination.total = data.total
}
async function submit(formEl: FormInstance) {
  formEl.validate(async vaild => {
    if (vaild) {
      await api.post<OrderDTO, OrderDTO>('order/update', {
        ...actForm.value,
        id: currentRow.value?.id
      })
      sendVisiable.value = false
      search()
    }
  })
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
    <el-form-item label="下单用户">
      <el-input v-model="sechForm.username"></el-input>
    </el-form-item>
    <el-form-item label="收货人">
      <el-input v-model="sechForm.consignee"></el-input>
    </el-form-item>
    <el-form-item label="订单状态">
      <el-select v-model="sechForm.orderType" clearable>
        <el-option v-for="item in orderType" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="收货地区">
      <el-cascader placeholder="请选择地区" :options="areaData" v-model="sechForm.receiveAddressCode" clearable></el-cascader>
    </el-form-item>
    <el-form-item label="下单日期">
      <el-date-picker v-model="sechForm.date" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="search">查询</el-button>
    </el-form-item>
  </el-form>
  <el-table :data="tableData" style="width: 100%" height="calc(100vh - 280px)" max-height="calc(100vh - 280px)" v-loading="useStore().common().loading">
    <el-table-column prop="id" label="id" width="40" />
    <el-table-column prop="username" label="下单用户" width="80" />
    <el-table-column prop="consignee" label="收货人" width="80" />
    <el-table-column prop="tel" label="联系电话" width="140" />
    <el-table-column prop="receiveAddressCode" label="收货地区" width="180" :formatter="val => (val.receiveAddressCode ? cityCodeToText(val.receiveAddressCode) : '')" />
    <el-table-column prop="receiveDetailAddress" label="详细收货地址" width="200" show-overflow-tooltip />
    <el-table-column prop="orderTime" label="下单时间" width="120" :formatter="val => (val.orderTime ? moment(val.orderTime).format('YYYY-MM-DD') : '')" />
    <el-table-column prop="orderType" label="订单状态" width="100" show-overflow-tooltip>
      <template #default="scope">
        <el-tag :type="scope.row.orderType === 0 ? 'info' : scope.row.orderType === 1 ? '' : scope.row.orderType === 2 ? 'success' : 'danger'" disable-transitions>{{
          getDictLabel(scope.row.orderType, orderType)
        }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作" fixed="right" width="200">
      <template #default="scope">
        <el-button size="small" @click="showDetail(scope.row.id)">详情</el-button>
        <el-button size="small" @click="showSend(scope.row)">修改发货状态</el-button>
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
  <el-dialog v-model="detailVisiable" title="详情">
    <Detail ref="detailRef"></Detail>
  </el-dialog>
  <el-dialog v-model="sendVisiable" title="修改发货状态" width="400px" :z-index="2000">
    <el-form :model="actForm" :rules="formRules" label-width="90px" ref="actFormRef" style="width: 100%" @submit.native.prevent>
      <el-form-item label="id">
        <el-input v-model="actForm.id" disabled></el-input>
      </el-form-item>
      <el-form-item label="下单用户">
        <el-input v-model="actForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="收货人">
        <el-input v-model="actForm.consignee" disabled></el-input>
      </el-form-item>
      <el-form-item label="发货状态" prop="orderType">
        <el-select v-model="actForm.orderType" style="width: 100%">
          <el-option v-for="item in orderType" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit(actFormRef)">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style lang="scss" scoped></style>