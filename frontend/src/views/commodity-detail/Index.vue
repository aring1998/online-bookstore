<script setup lang="ts">
import api from '@/utils/api'
import { onBeforeMount, reactive, Ref, ref } from 'vue'
import { useRoute } from 'vue-router'
import { CommodityApiRes, CommodityDTO, CommodityListApiParams } from '../workbench/pages/commodity/types/commodity'
import { EditPen, Postcard, Timer, Management, User } from '@element-plus/icons-vue'
import moment from 'moment'
import useStore from '@/store'
import { ElMessage, FormInstance } from 'element-plus'

const route = useRoute()
const { common, user, shop } = useStore()

const commodityInfo: Ref<CommodityDTO> = ref({})
onBeforeMount(async () => {
  const { data } = await api.get<CommodityListApiParams, CommodityApiRes>('commodity/list', {
    id: Number(route.params.id)
  })
  commodityInfo.value = data.records[0]
})

const form = reactive({
  num: 1
})

const formRules = reactive({
  num: [{ required: true, message: '请输入' }]
})

const formRef = ref<FormInstance>()
function addCommodity() {
  formRef.value?.validate(vaild => {
    if (!vaild) return
    for (let i of shop().shopCartList) {
      if (i.id === commodityInfo.value.id) return ElMessage.error('该商品已在购物车内')
    }
    shop().shopCartList.push({
      ...commodityInfo.value,
      num: form.num
    })
  })
}
</script>

<template>
  <div class="commodity-detail" v-loading="common().loading">
    <div class="commodity-info">
      <div class="img-wrap">
        <img :src="commodityInfo.imgUrl" alt="" />
      </div>
      <div class="info">
        <h3 style="font-size: 25px">{{ commodityInfo.name }}</h3>
        <div class="price">
          <p>售价：</p>
          <span>￥{{ commodityInfo.price }}</span>
        </div>
        <el-form :model="form" :rules="formRules" ref="formRef" :disabled="!user().userInfo?.id">
          <el-form-item label="购买数量" prop="num">
            <el-input-number v-model="form.num" :min="1" :max="99"></el-input-number>
          </el-form-item>
        </el-form>
        <p v-show="!user().userInfo?.id">你尚未登录，立即<a @click="common().accountShow = true">登录</a></p>
        <el-button type="success" size="large" :disabled="!user().userInfo?.id" @click="addCommodity">添加到购物车</el-button>
      </div>
    </div>
    <div class="other-info">
      <div class="title">
        <div></div>
        <span>其它信息</span>
      </div>
      <el-descriptions :column="3" border>
        <el-descriptions-item min-width="100px">
          <template #label>
            <div class="cell-item">
              <el-icon>
                <User />
              </el-icon>
              作者
            </div>
          </template>
          {{ commodityInfo.author }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <Management />
              </el-icon>
              出版社
            </div>
          </template>
          {{ commodityInfo.press }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <Timer />
              </el-icon>
              出版时间
            </div>
          </template>
          {{ moment(commodityInfo.publicationTime).format('YYYY-MM-DD') }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <EditPen />
              </el-icon>
              字数
            </div>
          </template>
          {{ commodityInfo.words }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <Postcard />
              </el-icon>
              简介
            </div>
          </template>
          {{ commodityInfo.introduce }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.commodity-detail {
  max-width: $max-width;
  margin: 0 auto;
  padding: 0 50px;
  min-height: 600px;
  .commodity-info {
    display: flex;
    .img-wrap {
      width: 350px;
      height: 350px;
      border: 2px #e8eaed solid;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 30px;
      img {
        height: 300px;
      }
    }
    .info {
      width: 100%;
      .price {
        background-color: lightgray;
        padding: 10px 20px;
        margin-bottom: 20px;
        p {
          margin: 0 0 10px 0;
        }
        span {
          color: red;
          font-size: 25px;
        }
      }
    }
  }
  .other-info {
    .title {
      display: flex;
      align-items: center;
      div {
        height: 20px;
        width: 4px;
        background-color: $main-color;
        margin: 30px 10px 30px 0;
      }
      span {
        font-size: 18px;
      }
    }
    .cell-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100px;
      .el-icon {
        margin-right: 6px;
      }
    }
  }
}
</style>
