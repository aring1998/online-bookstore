<script setup lang="ts">
import { onMounted, reactive, Ref, ref } from 'vue'
import useStore from '@/store'
import { FormInstance } from 'element-plus'
import api from '@/utils/api'
import { BasePageParams } from '@/utils/types'
import { ReceivingApiRes, ReceivingDTO, ReceivingApiParams, ReceivingForm } from '@/types/receiving'
import { cityCodeToText } from '@/utils/area'
import areaData from '@/assets/json/china-area.json'
import { getArrayLastElm } from '@/utils/index'

const visiable = ref(false)
const dialogName = ref('')
const currentRow: Ref<Partial<ReceivingDTO>> = ref({})
function showDialog(val: string, row?: ReceivingDTO) {
  dialogName.value = val
  visiable.value = true
  if (row) {
    currentRow.value = row
    form.value = row
  }
}
const tableData: Ref<ReceivingDTO[]> = ref([])
const pagination = reactive({
  page: 1,
  pageSize: 30,
  total: 0
})
async function search() {
  const res = await api.get<BasePageParams, ReceivingApiRes>('receiving/mine', {
    ...pagination
  })
  tableData.value = res.data.records
  pagination.total = res.data.total
}

const formRef = ref()
const form: Ref<ReceivingForm> = ref({
  consignee: '',
  tel: '',
  receiveAddressCode: [],
  receiveDetailAddress: ''
})
const formRules = reactive({
  consignee: [{ required: true, message: '请输入' }],
  tel: [
    { required: true, message: '请输入' },
    { pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/, message: '格式不正确' }
  ],
  receiveAddressCode: [{ required: true, message: '请选择' }],
  receiveDetailAddress: [{ required: true, message: '请输入' }]
})
async function submit(formEl: FormInstance) {
  formEl.validate(async vaild => {
    if (vaild) {
      if (dialogName.value === '新增') {
        await api.post<ReceivingApiParams, ReceivingDTO>('receiving/add', {
          ...form.value,
          receiveAddressCode: getArrayLastElm(form.value.receiveAddressCode)
        })
      } else {
        await api.post<ReceivingApiParams, ReceivingDTO>('receiving/update', {
          ...form.value,
          receiveAddressCode: getArrayLastElm(form.value.receiveAddressCode)
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
  <div class="receiving">
    <div class="action-btn">
      <el-button type="primary" @click="showDialog('新增')">新增</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" height="calc(100vh - 290px)" max-height="calc(100vh - 260px)" v-loading="useStore().common().loading">
      <el-table-column label="序号" type="index" width="60" />
      <el-table-column prop="consignee" label="收货人" width="100" />
      <el-table-column prop="tel" label="联系电话" width="120" />
      <el-table-column
        prop="receiveAddressCode"
        label="收货地区"
        width="180"
        :formatter="val => (val.receiveAddressCode ? cityCodeToText(val.receiveAddressCode) : '')"
        show-overflow-tooltip
      />
      <el-table-column prop="receiveDetailAddress" label="详细地址" width="260" />
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
        }
      "
    ></el-pagination>
    <el-dialog v-model="visiable" :title="dialogName" :z-index="2000">
      <div class="actForm-wrap">
        <el-form :model="form" :rules="formRules" label-width="80px" ref="formRef" style="width: 100%" @submit.native.prevent>
          <el-form-item label="收货人" prop="consignee">
            <el-input v-model="form.consignee"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="tel">
            <el-input v-model="form.tel"></el-input>
          </el-form-item>
          <el-form-item label="收货地区" prop="receiveAddressCode">
            <el-cascader placeholder="请选择地区" :options="areaData" v-model="form.receiveAddressCode" clearable></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="receiveAddressCode">
            <el-input v-model="form.receiveDetailAddress"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit(formRef)">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped></style>
