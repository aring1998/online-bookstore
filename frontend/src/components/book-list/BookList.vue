<script setup lang="ts">
import { useRouter } from 'vue-router'
import { CommodityDTO } from '@/views/workbench/pages/commodity/types/commodity'
const props = defineProps<{ bookList: CommodityDTO[] }>()
const router = useRouter()
</script>

<template>
  <div class="book-item" v-for="item of props.bookList" :key="item.id" @click="router.push(`/commodity-detail/${item.id}`)">
    <div class="img-wrap">
      <img :src="item.imgUrl" alt="" height="200" />
    </div>
    <span class="item-title">{{ item.name }}</span>
    <span class="item-price">￥{{ item.price }}</span>
  </div>
</template>

<style lang="scss" scoped>
.book-item {
  display: flex;
  flex-flow: column nowrap;
  cursor: pointer;
  &:hover {
    span {
      text-decoration: underline;
    }
  }
  span {
    text-align: center;
  }
  .img-wrap {
    width: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
  }
  img {
    margin-bottom: 6px;
    max-width: 200px;
  }
  .item-title {
    color: gray;
    font-size: 14px;
    margin-bottom: 4px;
  }
  .item-price {
    color: red;
  }
}
</style>
