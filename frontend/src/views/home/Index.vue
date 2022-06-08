<script setup lang="ts">
import api from '@/utils/api'
import { onMounted, reactive, Ref, ref } from 'vue'
import { BasePageParams } from '@/utils/types'
import { HotSaleDTO, HotSaleRes } from './types/hot-sale'
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import useStore from '@/store'
import { useRouter } from 'vue-router'
import BookList from '@/components/book-list/BookList.vue'

const router = useRouter()

const banner = reactive([
  {
    id: 0,
    src: 'https://source.aring.cc/upload/2022033111265180774.jpg'
  },
  {
    id: 1,
    src: 'https://source.aring.cc/upload/750x315_0331-1648711003.jpg'
  },
  {
    id: 2,
    src: 'https://source.aring.cc/upload/750-315-1648708335.jpg'
  }
])

const pagination = reactive({
  page: 1,
  pageSize: 3,
  total: 0
})
const hotSale: Ref<HotSaleDTO[]> = ref([])
async function getHotSale() {
  const { data } = await api.get<BasePageParams, HotSaleRes>('commodity/hotSale', {
    ...pagination
  })
  hotSale.value = data.records
  pagination.total = data.total
}
function prePage() {
  if (pagination.page > 1) {
    pagination.page--
    getHotSale()
  } else {
    ElMessage.warning('已经到头啦！')
  }
}
function nextPage() {
  if (pagination.page * pagination.pageSize < pagination.total) {
    pagination.page++
    getHotSale()
  } else {
    ElMessage.warning('已经到尾啦！')
  }
}
onMounted(() => {
  getHotSale()
})
</script>
<template>
  <div class="base-wrap">
    <div class="banner">
      <el-carousel :interval="5000" arrow="always">
        <el-carousel-item v-for="item of banner" :key="item.id">
          <img :src="item.src" alt="" style="width: 100%; height: 100%" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="hot-sale">
      <h2>热销书刊</h2>
      <div class="book-list" v-loading="useStore().common().loading">
        <el-icon @click="prePage"><arrow-left-bold /></el-icon>
        <el-icon @click="nextPage"><arrow-right-bold /></el-icon>
        <BookList :bookList="hotSale"></BookList>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.banner {
  margin: 20px 0;
}
.hot-sale {
  .book-list {
    position: relative;
    display: flex;
    justify-content: space-evenly;
    padding: 0 40px;
    min-height: 244px;
    i {
      background-color: #fff;
      position: absolute;
      font-size: 30px;
      top: calc(50% - 25px);
      background-color: #e8eaedcc;
      padding: 10px;
      border-radius: 50%;
      cursor: pointer;
      &:hover {
        background-color: #e8eaedee;
      }
      &:nth-child(1) {
        left: 0;
      }
      &:nth-child(2) {
        right: 0;
      }
    }
  }
}
</style>
