<script setup lang="ts">
import BookList from '@/components/book-list/BookList.vue'
import api from '@/utils/api'
import { onMounted, reactive, Ref, ref } from 'vue'
import { CommodityApiRes, CommodityDTO, CommodityListApiParams } from '../workbench/pages/commodity/types/commodity'
import useStore from '@/store'
import { CategoryDTO, CategoryListApiRes } from '../workbench/pages/category/types/category'
import { debounce } from '@/utils/index'

const categoryList: Ref<(CategoryDTO | undefined)[]> = ref([])
async function getCategory() {
  const res = await api.get<CategoryDTO, CategoryListApiRes>('category/list', {
    pageSize: 999
  })
  categoryList.value = [{ id: 0, name: '全部' }, ...res.data.records]
}

const commodityList: Ref<CommodityDTO[]> = ref([])
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})
async function getCommodity(categoryId?: number, push: Boolean = false) {
  const res = await api.get<CommodityListApiParams, CommodityApiRes>('commodity/list', {
    categoryId,
    ...pagination
  })
  if (push) commodityList.value.push(...res.data.records)
  else commodityList.value = res.data.records
  pagination.total = res.data.total
}
const categoryId = ref(0)
function choiceCategory(val: number) {
  categoryId.value = val
  if (val === 0) getCommodity()
  else {
    getCommodity(val)
  }
}

onMounted(() => {
  getCategory()
  getCommodity()

  // 滚动加载
  const commodityDOM = document.getElementsByClassName('commodity')[0]
  commodityDOM.addEventListener(
    'scroll',
    debounce(() => {
      if (pagination.pageSize * pagination.page > pagination.total) return
      if (commodityDOM.clientHeight - commodityDOM.scrollHeight + commodityDOM.scrollTop > -5) {
        pagination.page++
        getCommodity(categoryId.value)
      }
    }, 200)
  )
})
</script>

<template>
  <div class="commodity-page base-wrap">
    <div class="category">
      <h3>分类列表</h3>
      <div class="category-list">
        <div class="item" v-for="(item, index) of categoryList" :key="index" :class="{ active: item?.id === categoryId }" @click="choiceCategory(item?.id!)">
          <span>· {{ item?.name }}</span>
        </div>
      </div>
    </div>
    <div class="commodity" v-loading="useStore().common().loading">
      <BookList :book-list="commodityList"></BookList>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.commodity-page {
  display: flex;
  flex: 1;
  .category {
    min-width: 150px;
    min-height: 100px;
    max-height: 300px;
    overflow-y: auto;
    border-right: $main-color 2px solid;
    position: sticky;
    top: 0;
    .category-list {
      display: flex;
      flex-flow: column nowrap;
      .item {
        font-size: 16px;
        cursor: pointer;
        margin: 4px 0;
        &:hover,
        &.active {
          color: #409eff;
        }
        &.active {
          pointer-events: none;
          font-weight: bold;
        }
      }
    }
  }
  .commodity {
    flex-grow: 1;
    display: flex;
    flex-flow: row wrap;
    min-height: 100px;
    height: 540px;
    overflow: auto;
    position: relative;
  }
}
</style>
