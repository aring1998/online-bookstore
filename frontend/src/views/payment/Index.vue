<script setup lang="ts">
import useStore from '@/store'
import api from '@/utils/api'
import { onMounted, Ref, ref } from 'vue'
import { CommodityDTO } from '../workbench/pages/commodity/types/commodity'
import { cityCodeToText } from '@/utils/area'
import { ReceivingDTO, ReceivingApiRes } from '@/types/receiving'

const visiable = ref(false)
function removeItem(index: number) {
  useStore().shop().shopCartList.splice(index, 1)
}
const selectionRows: Ref<CommodityDTO[]> = ref([])
function selectionChange(rows: CommodityDTO[]) {
  selectionRows.value = rows
}

const receiving = ref(0)
const receivingOptions: Ref<ReceivingDTO[]> = ref([])
async function getReceiving() {
  const res = await api.get<any, ReceivingApiRes>('/receiving/mine')
  receivingOptions.value = res.data.records
}

async function order() {
  await api.post('/order/add', {
    ...receivingOptions.value[receiving.value],
    orderList: selectionRows.value.map(item => ({
      categoryId: item.categoryId,
      commodityId: item.id,
      commodityNum: item.num,
      commodityPrice: item.price
    }))
  })
  useStore().shop().shopCartList = []
  visiable.value = false
}

const tableRef = ref()
onMounted(() => {
  useStore()
    .shop()
    .shopCartList.forEach(item => {
      tableRef.value.toggleRowSelection(item)
    })
  getReceiving()
})
</script>

<template>
  <div class="payment-page base-wrap">
    <el-table
      :data="useStore().shop().shopCartList"
      style="width: 100%"
      height="calc(100vh - 220px)"
      max-height="calc(100vh - 220px)"
      @selection-change="selectionChange"
      v-loading="useStore().common().loading"
      ref="tableRef"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="id" width="40" />
      <el-table-column label="商品图片" width="150">
        <template #default="scope">
          <el-popover placement="bottom-start" :width="200" trigger="hover">
            <template #reference>
              <el-image style="width: 80px; height: 80px" :src="scope.row?.imgUrl" />
            </template>
            <img :src="scope.row?.imgUrl" width="200" height="200" />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商品名" width="200" />
      <el-table-column prop="author" label="作者" width="140" />
      <el-table-column prop="price" label="价格" width="80" />
      <el-table-column label="数量" width="150">
        <template #default="scope">
          <el-input-number v-model="scope.row.num" size="small" :min="1" :max="99"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="sum" label="小计" width="90" :formatter="val => (val.price * val.num).toFixed(2)" />
      <el-table-column label="操作" fixed="right">
        <template #default="scope">
          <el-popconfirm title="确定移除？" @confirm="removeItem(scope.$index)">
            <template #reference>
              <el-button size="small" type="danger">移除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="summary">
      <p>合计：￥{{ selectionRows.reduce((pre, item) => pre += item.price! * item.num!, 0).toFixed(2) }}</p>
    </div>
    <div class="order">
      <el-button
        type="primary"
        size="large"
        @click="visiable = true"
        :disabled="!Boolean(useStore().shop().shopCartList.length) || !Boolean(useStore().user().userInfo?.id)"
        >选择发货地址并下单</el-button
      >
    </div>
    <el-dialog v-model="visiable" title="选择发货地址并下单">
      <div class="receiving-list">
        <el-radio-group v-model="receiving" size="large">
          <el-radio-button v-for="(item, index) of receivingOptions" :key="item.id" :label="index">
            <p>收货人：{{ item.consignee }}</p>
            <p>收货地址：{{ item.receiveAddressCode ? `${cityCodeToText(item.receiveAddressCode)}${item.receiveDetailAddress}` : '' }}</p>
            <p>联系电话：{{ item.tel }}</p>
          </el-radio-button>
        </el-radio-group>
        <div class="btn">
          <el-button type="success" @click="order">下单</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.payment-page {
  .summary {
    p {
      font-size: 18px;
      text-align: right;
    }
  }
  .order {
    text-align: center;
  }
  .el-radio-group {
    display: flex;
    flex-flow: column nowrap;
  }
  .receiving-list {
    .btn {
      margin-top: 20px;
      text-align: center;
    }
  }
}
</style>
